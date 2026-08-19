import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  validateEmail,
  generateVerificationToken,
  hashVerificationToken,
  enforcePayloadLimit,
  verifyTurnstileToken,
} from "@/lib/security";
import { fetchCloudDatabase, saveCloudDatabase, appendSecurityLog } from "@/lib/serverDb";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. IP-level Rate Limiting (5 requests per 5 minutes)
    const ipRateLimit = await checkRateLimit(`forgot_pwd_ip_${ip}`, 5, 5 * 60 * 1000);
    if (!ipRateLimit.allowed) {
      console.warn(`[RATE_LIMIT] Forgot password IP limit exceeded for ${ip}`);
      return NextResponse.json(
        {
          success: false,
          message: `Çok fazla deneme yapıldı. Lütfen ${Math.ceil((ipRateLimit.retryAfterSec || 60) / 60)} dakika sonra tekrar deneyin.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Payload size check
    if (!enforcePayloadLimit(body, 10 * 1024)) {
      return NextResponse.json(
        { success: false, message: "İstek boyutu çok büyük." },
        { status: 413 }
      );
    }

    const { email, turnstileToken } = body;

    // 3. Turnstile Bot Verification
    const turnstileResult = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileResult.success) {
      console.warn(`[TURNSTILE] Forgot password verification failed from ${ip}`);
      return NextResponse.json(
        { success: false, message: turnstileResult.error || "Güvenlik doğrulaması başarısız." },
        { status: 403 }
      );
    }

    if (!email || typeof email !== "string" || email.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Lütfen geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!validateEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Lütfen geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }

    // 4. Target-level Rate Limiting (3 attempts per 10 minutes per email)
    const emailRateLimit = await checkRateLimit(`forgot_pwd_email_${cleanEmail}`, 3, 10 * 60 * 1000);
    if (!emailRateLimit.allowed) {
      console.warn(`[RATE_LIMIT] Forgot password email limit exceeded for ${cleanEmail}`);
      return NextResponse.json(
        {
          success: false,
          message: `Bu adrese kısa süre içinde çok fazla talep gönderildi. Lütfen ${emailRateLimit.retryAfterSec} saniye bekleyin.`,
        },
        { status: 429 }
      );
    }

    // Standard non-enumerating response
    const genericSuccessResponse = {
      success: true,
      message: "Eğer bu e-posta adresi sistemimizde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.",
    };

    const db = await fetchCloudDatabase();
    const userIndex = db.users.findIndex(
      (u) => u.email && u.email.toLowerCase() === cleanEmail
    );

    // If user not found, return generic success to prevent enumeration
    if (userIndex === -1) {
      console.log(`[AUTH] Forgot password request for non-existent email from ${ip}`);
      return NextResponse.json(genericSuccessResponse);
    }

    const targetUser = db.users[userIndex];

    // 5. Generate secure 256-bit entropy token
    const rawToken = generateVerificationToken();
    const tokenHash = hashVerificationToken(rawToken);
    const tokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    const updatedUser = {
      ...targetUser,
      resetPasswordTokenHash: tokenHash,
      resetPasswordTokenExpires: tokenExpires,
    };

    const updatedUsers = [...db.users];
    updatedUsers[userIndex] = updatedUser;

    await saveCloudDatabase({ users: updatedUsers });

    // 6. Send Password Reset Email via Resend
    const emailResult = await sendPasswordResetEmail({
      email: targetUser.email,
      name: targetUser.name,
      username: targetUser.username,
      token: rawToken,
    });

    if (!emailResult.success) {
      console.error(`[EMAIL] Password reset email failed for ${targetUser.email}`);
      return NextResponse.json(
        {
          success: false,
          message: "E-posta gönderim servisinde bir sorun oluştu. Lütfen birazdan tekrar deneyin.",
        },
        { status: 500 }
      );
    }

    // 7. Security Log
    await appendSecurityLog(targetUser.id, "PASSWORD_RESET_REQUESTED", ip);

    return NextResponse.json(genericSuccessResponse);
  } catch (error: any) {
    console.error("[AUTH] Forgot password error:", error?.message);
    return NextResponse.json(
      { success: false, message: "Sunucu güvenlik hatası oluştu." },
      { status: 500 }
    );
  }
}
