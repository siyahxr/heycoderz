import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  sanitizeInput,
  verifyPassword,
  performDummyPasswordCheck,
  getClientIp,
  verifyTurnstileToken,
  createSessionToken,
  enforcePayloadLimit,
} from "@/lib/security";
import { fetchCloudDatabase, appendSecurityLog } from "@/lib/serverDb";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Rate Limiting Protection (IP-level: Max 10 attempts / minute)
    const ipRateLimit = await checkRateLimit(`login_ip_${ip}`, 10, 60 * 1000);
    if (!ipRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Çok fazla hatalı deneme yapıldı. Lütfen ${ipRateLimit.retryAfterSec} saniye sonra tekrar deneyin.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Payload size limit (20KB)
    if (!enforcePayloadLimit(body, 20 * 1024)) {
      return NextResponse.json(
        { success: false, message: "İstek boyutu çok büyük." },
        { status: 413 }
      );
    }

    const { emailOrUsername, password, turnstileToken } = body;

    // 3. Cloudflare Turnstile verification
    const turnstileResult = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileResult.success) {
      return NextResponse.json(
        { success: false, message: turnstileResult.error || "Güvenlik doğrulaması başarısız." },
        { status: 403 }
      );
    }

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı adı/e-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    // Input length limits
    if (String(emailOrUsername).length > 254 || String(password).length > 128) {
      return NextResponse.json(
        { success: false, message: "Geçersiz giriş bilgileri." },
        { status: 400 }
      );
    }

    const cleanInput = sanitizeInput(String(emailOrUsername).trim().toLowerCase());
    const pass = String(password);

    // 4. Identifier-level rate limiting (prevent brute force on specific accounts)
    const identifierRateLimit = await checkRateLimit(`login_id_${cleanInput}`, 5, 5 * 60 * 1000);
    if (!identifierRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Bu hesap için çok fazla hatalı deneme yapıldı. Lütfen ${identifierRateLimit.retryAfterSec} saniye sonra tekrar deneyin.`,
        },
        { status: 429 }
      );
    }

    const db = await fetchCloudDatabase();

    // 5. Find user in database (unified lookup for all users including admins)
    const registeredUser = db.users.find(
      (u) =>
        u.username.toLowerCase() === cleanInput ||
        (u.email && u.email.toLowerCase() === cleanInput)
    );

    // Also match admin aliases
    const isAdminAlias =
      cleanInput === "@siyah" || cleanInput === "$" || cleanInput === "admin" ||
      cleanInput === "@oyku" || cleanInput === "öykü";
    
    let targetUser = registeredUser;
    if (!targetUser && isAdminAlias) {
      if (cleanInput === "@siyah" || cleanInput === "$" || cleanInput === "admin") {
        targetUser = db.users.find((u) => u.username === "siyah");
      } else if (cleanInput === "@oyku" || cleanInput === "öykü") {
        targetUser = db.users.find((u) => u.username === "oyku");
      }
    }

    if (!targetUser) {
      // Timing equalization: run dummy password check to prevent user enumeration via response time
      performDummyPasswordCheck();
      return NextResponse.json(
        { success: false, message: "Geçersiz kimlik bilgileri." },
        { status: 401 }
      );
    }

    // 6. Verify password (uses passwordHash with PBKDF2-SHA512)
    const isPasswordValid = verifyPassword(pass, targetUser.passwordHash);

    if (!isPasswordValid) {
      await appendSecurityLog(targetUser.id, "LOGIN_FAILED", ip, "Hatalı şifre girişi.");
      return NextResponse.json(
        { success: false, message: "Geçersiz kimlik bilgileri." },
        { status: 401 }
      );
    }

    // 7. Ensure email_verified status is accurately reflected (defaults to false for unverified accounts)
    const isEmailVerified = targetUser.email_verified === true;

    // 8. Build safe user object (strip all sensitive fields)
    const {
      passwordHash: __,
      verificationTokenHash: ___,
      verificationTokenExpires: ____,
      pendingEmailTokenHash: _____,
      pendingEmailTokenExpires: ______,
      ...rawSafeUser
    } = targetUser as any;

    const safeUser = {
      ...rawSafeUser,
      email_verified: isEmailVerified,
    };

    // Record login success event
    await appendSecurityLog(targetUser.id, "LOGIN_SUCCESS", ip);

    // 9. Create HMAC-signed session token
    const sessionToken = createSessionToken(targetUser.id, targetUser.role);

    const response = NextResponse.json({
      success: true,
      user: safeUser,
    });

    // 10. Set secure session cookie
    response.cookies.set("heycoderz_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error?.message);
    return NextResponse.json(
      { success: false, message: "Sunucu güvenlik hatası oluştu." },
      { status: 500 }
    );
  }
}
