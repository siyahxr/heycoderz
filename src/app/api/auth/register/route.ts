import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  sanitizeInput,
  validateEmail,
  validateUsername,
  validatePasswordStrength,
  generateVerificationToken,
  hashVerificationToken,
  hashPassword,
  getClientIp,
  verifyTurnstileToken,
  enforcePayloadLimit,
} from "@/lib/security";
import { fetchCloudDatabase, saveCloudDatabase, StoredUser } from "@/lib/serverDb";
import { sendVerificationEmail } from "@/lib/email";
import { DEFAULT_AVATAR } from "@/context/AuthContext";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Rate Limiting Protection (IP-level: Max 10 registrations per 5 minutes)
    const ipRateLimit = await checkRateLimit(`register_ip_${ip}`, 10, 5 * 60 * 1000);
    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Çok fazla deneme yapıldı. Lütfen ${ipRateLimit.retryAfterSec} saniye sonra tekrar deneyin.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Payload size limit (50KB)
    if (!enforcePayloadLimit(body, 50 * 1024)) {
      return NextResponse.json(
        { success: false, message: "İstek boyutu çok büyük." },
        { status: 413 }
      );
    }

    const { name, username, email, password, turnstileToken } = body;

    // 3. Cloudflare Turnstile verification
    const turnstileResult = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileResult.success) {
      return NextResponse.json(
        { success: false, message: turnstileResult.error || "Güvenlik doğrulaması başarısız." },
        { status: 403 }
      );
    }

    // 4. Validate input presence
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı adı, e-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const cleanName = sanitizeInput(String(name || "").trim()).slice(0, 100) || "Yeni Geliştirici";
    const cleanUsername = sanitizeInput(String(username).trim().toLowerCase().replace(/[^a-z0-9_]/g, ""));
    const cleanEmail = String(email).trim().toLowerCase();
    const pass = String(password);

    // 5. Format validations
    if (!validateEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Lütfen geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }

    if (!validateUsername(cleanUsername)) {
      return NextResponse.json(
        {
          success: false,
          message: "Kullanıcı adı 2-24 karakter uzunluğunda olmalı ve sadece harf, rakam ve alt çizgi içermelidir.",
        },
        { status: 400 }
      );
    }

    const passwordCheck = validatePasswordStrength(pass);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, message: passwordCheck.message },
        { status: 400 }
      );
    }

    // 6. Email-level rate limiting (prevent email enumeration via timing)
    const emailRateLimit = await checkRateLimit(`register_email_${cleanEmail}`, 3, 5 * 60 * 1000);
    if (!emailRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Bu adres ile çok fazla kayıt denemesi yapıldı. Lütfen ${emailRateLimit.retryAfterSec} saniye bekleyin.`,
        },
        { status: 429 }
      );
    }

    // 7. Check existing users
    const db = await fetchCloudDatabase();
    const existingUser = db.users.find(
      (u) =>
        u.username.toLowerCase() === cleanUsername ||
        (u.email && u.email.toLowerCase() === cleanEmail)
    );

    if (existingUser) {
      // If user exists but is not verified, allow re-registration (update token)
      if (existingUser.email_verified === false && existingUser.email.toLowerCase() === cleanEmail) {
        const rawToken = generateVerificationToken();
        const tokenHash = hashVerificationToken(rawToken);
        const tokenExpires = Date.now() + 15 * 60 * 1000;
        const pwdHash = hashPassword(pass);

        const updatedUsers = db.users.map((u) =>
          u.id === existingUser.id
            ? {
                ...u,
                name: cleanName,
                username: cleanUsername,
                passwordHash: pwdHash,
                verificationTokenHash: tokenHash,
                verificationTokenExpires: tokenExpires,
              }
            : u
        );

        await saveCloudDatabase({ users: updatedUsers });

        const emailResult = await sendVerificationEmail({
          email: cleanEmail,
          name: cleanName,
          username: cleanUsername,
          token: rawToken,
        });

        if (!emailResult.success) {
          console.warn(`[HeyCoderz] Re-register user (${cleanUsername}) email failed`);
        }

        return NextResponse.json({
          success: true,
          emailSent: emailResult.success,
          email: cleanEmail,
          message: "Yeni doğrulama e-postası gönderildi. Lütfen gelen kutunuzu kontrol edin.",
        });
      }

      return NextResponse.json(
        { success: false, message: "Bu kullanıcı adı veya e-posta adresi ile kayıtlı bir hesap zaten var." },
        { status: 400 }
      );
    }

    // 8. Generate secure verification token
    const rawToken = generateVerificationToken();
    const tokenHash = hashVerificationToken(rawToken);
    const tokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    const pwdHash = hashPassword(pass);

    const newUser: StoredUser = {
      id: "usr-" + Date.now(),
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      avatar: DEFAULT_AVATAR,
      role: "developer",
      badge: "Yeni Geliştirici 🚀",
      bio: "heycoderz ile kodlamaya başladım!",
      website: "",
      github: "",
      twitter: "",
      instagram: "https://instagram.com/heycoderz",
      linkedin: "",
      skills: ["HTML", "CSS", "JavaScript"],
      xp: 100,
      joinedAt: "Bugün",
      passwordHash: pwdHash,
      email_verified: false,
      verificationTokenHash: tokenHash,
      verificationTokenExpires: tokenExpires,
      securityLogs: [
        {
          id: `log-${Date.now()}-reg`,
          type: "LOGIN_SUCCESS",
          timestamp: Date.now(),
          details: "Hesap oluşturuldu.",
        },
      ],
    };

    // 9. Save user to database (no plaintext password!)
    const updatedUsers = [...db.users, newUser];
    await saveCloudDatabase({ users: updatedUsers });

    // 10. Dispatch verification email via Resend
    const emailResult = await sendVerificationEmail({
      email: cleanEmail,
      name: cleanName,
      username: cleanUsername,
      token: rawToken,
    });

    if (!emailResult.success) {
      console.warn(`[HeyCoderz] User created (${cleanUsername}) but email failed`);
      return NextResponse.json({
        success: true,
        emailSent: false,
        email: cleanEmail,
        message:
          "Hesabınız oluşturuldu, ancak doğrulama e-postası gönderilirken bir sorun yaşandı. Lütfen giriş sayfasından tekrar göndermeyi deneyin.",
      });
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      email: cleanEmail,
      message: "Kayıt başarılı! Lütfen gelen kutunuzdaki bağlantıya tıklayarak e-posta adresinizi doğrulayın.",
    });
  } catch (error: any) {
    console.error("Registration error:", error?.message);
    return NextResponse.json(
      { success: false, message: "Sunucu kayıt hatası oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
