import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  sanitizeInput,
  generateVerificationToken,
  hashVerificationToken,
  getClientIp,
  verifyTurnstileToken,
  enforcePayloadLimit,
} from "@/lib/security";
import { fetchCloudDatabase, saveCloudDatabase } from "@/lib/serverDb";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. IP-level Rate Limiting (Max 5 resends per 5 minutes per IP)
    const ipRateLimit = await checkRateLimit(`resend_ip_${ip}`, 5, 5 * 60 * 1000);
    if (!ipRateLimit.allowed) {
      console.warn(`[RATE_LIMIT] Resend verification IP rate limit exceeded for ${ip}`);
      return NextResponse.json(
        {
          success: false,
          message: `Çok fazla deneme yapıldı. Lütfen ${Math.ceil((ipRateLimit.retryAfterSec || 60) / 60)} dakika sonra tekrar deneyin.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Payload size limit (10KB)
    if (!enforcePayloadLimit(body, 10 * 1024)) {
      return NextResponse.json(
        { success: false, message: "İstek boyutu çok büyük." },
        { status: 413 }
      );
    }

    const { emailOrUsername, turnstileToken } = body;

    // 3. Cloudflare Turnstile verification
    const turnstileResult = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileResult.success) {
      return NextResponse.json(
        { success: false, message: turnstileResult.error || "Güvenlik doğrulaması başarısız." },
        { status: 403 }
      );
    }

    if (!emailOrUsername || typeof emailOrUsername !== "string" || emailOrUsername.trim() === "") {
      return NextResponse.json(
        { success: false, message: "E-posta adresi veya kullanıcı adı zorunludur." },
        { status: 400 }
      );
    }

    // Input length limit
    if (String(emailOrUsername).length > 254) {
      return NextResponse.json(
        { success: false, message: "Geçersiz giriş." },
        { status: 400 }
      );
    }

    const cleanInput = sanitizeInput(emailOrUsername.trim().toLowerCase());

    // 4. Target-level Rate Limiting (Max 3 resends per 5 minutes to the same identifier)
    const targetRateLimit = await checkRateLimit(`resend_target_${cleanInput}`, 3, 5 * 60 * 1000);
    if (!targetRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Bu adrese kısa süre içinde çok fazla doğrulama e-postası gönderildi. Lütfen ${targetRateLimit.retryAfterSec} saniye bekleyin.`,
        },
        { status: 429 }
      );
    }

    const db = await fetchCloudDatabase();
    const userIndex = db.users.findIndex(
      (u) =>
        u.username.toLowerCase() === cleanInput ||
        (u.email && u.email.toLowerCase() === cleanInput)
    );

    // If user not found, return ambiguous message to prevent user enumeration
    if (userIndex === -1) {
      return NextResponse.json({
        success: true,
        message: "Eğer bu hesap sistemimizde mevcutsa ve henüz doğrulanmamışsa, doğrulama e-postası gönderildi.",
      });
    }

    const targetUser = db.users[userIndex];

    // If already verified
    if (targetUser.email_verified === true) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "E-posta adresiniz zaten doğrulanmış. Hesabınıza giriş yapabilirsiniz.",
      });
    }

    // If user has no email registered (old account without email)
    if (!targetUser.email || targetUser.email.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          noEmail: true,
          message: "Hesabınıza tanımlı bir e-posta adresi bulunmuyor. Lütfen ayarlardan e-posta adresinizi ekleyin.",
        },
        { status: 400 }
      );
    }

    // 5. Generate fresh verification token (15 minutes lifespan)
    const rawToken = generateVerificationToken();
    const tokenHash = hashVerificationToken(rawToken);
    const tokenExpires = Date.now() + 15 * 60 * 1000;

    const updatedUser = {
      ...targetUser,
      verificationTokenHash: tokenHash,
      verificationTokenExpires: tokenExpires,
    };

    const updatedUsers = [...db.users];
    updatedUsers[userIndex] = updatedUser;

    await saveCloudDatabase({ users: updatedUsers });

    // 6. Send email via Resend
    const emailResult = await sendVerificationEmail({
      email: targetUser.email,
      name: targetUser.name,
      username: targetUser.username,
      token: rawToken,
    });

    if (!emailResult.success) {
      console.error(`[HeyCoderz] Resend verification email failed for ${targetUser.email}`);
      return NextResponse.json(
        {
          success: false,
          message: "E-posta gönderim servisinde bir hata oluştu. Lütfen birkaç dakika sonra tekrar deneyin.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      email: targetUser.email,
      message: "Yeni doğrulama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.",
    });
  } catch (error: any) {
    console.error("Resend verification error:", error?.message);
    return NextResponse.json(
      { success: false, message: "Sunucu işlem hatası oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
