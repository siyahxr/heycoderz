import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  hashPassword,
  hashVerificationToken,
  isValidTokenFormat,
  validatePasswordStrength,
  enforcePayloadLimit,
  verifyTurnstileToken,
} from "@/lib/security";
import {
  fetchCloudDatabase,
  saveCloudDatabase,
  consumeVerificationTokenAtomic,
  appendSecurityLog,
} from "@/lib/serverDb";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. IP-level Rate Limiting (10 attempts per 5 minutes)
    const ipRateLimit = await checkRateLimit(`reset_pwd_ip_${ip}`, 10, 5 * 60 * 1000);
    if (!ipRateLimit.allowed) {
      console.warn(`[RATE_LIMIT] Reset password rate limit reached for IP: ${ip}`);
      return NextResponse.json(
        {
          success: false,
          message: `Çok fazla deneme yapıldı. Lütfen ${ipRateLimit.retryAfterSec} saniye sonra tekrar deneyin.`,
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

    const { token, newPassword, turnstileToken } = body;

    // Optional turnstile check
    if (turnstileToken) {
      const turnstileResult = await verifyTurnstileToken(turnstileToken, ip);
      if (!turnstileResult.success) {
        return NextResponse.json(
          { success: false, message: turnstileResult.error || "Güvenlik doğrulaması başarısız." },
          { status: 403 }
        );
      }
    }

    // 3. Validate token presence & format
    if (!token || typeof token !== "string" || token.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Şifre sıfırlama bağlantısı eksik veya geçersiz." },
        { status: 400 }
      );
    }

    const cleanToken = token.trim();
    if (!isValidTokenFormat(cleanToken)) {
      return NextResponse.json(
        { success: false, message: "Geçersiz şifre sıfırlama bağlantı formatı." },
        { status: 400 }
      );
    }

    // 4. Validate password strength
    const passwordCheck = validatePasswordStrength(String(newPassword || ""));
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, message: passwordCheck.message },
        { status: 400 }
      );
    }

    const tokenHash = hashVerificationToken(cleanToken);

    // 5. Atomic lock to prevent single-use token replay attacks
    const lockAcquired = await consumeVerificationTokenAtomic(`reset_lock_${tokenHash}`);
    if (!lockAcquired) {
      return NextResponse.json(
        { success: false, message: "Bu bağlantı şu anda işleniyor veya daha önce kullanılmış." },
        { status: 400 }
      );
    }

    const db = await fetchCloudDatabase();
    const userIndex = db.users.findIndex(
      (u) => u.resetPasswordTokenHash && u.resetPasswordTokenHash === tokenHash
    );

    if (userIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Şifre sıfırlama bağlantısı geçersiz veya daha önce kullanılmış.",
        },
        { status: 400 }
      );
    }

    const targetUser = db.users[userIndex];

    // 6. Check expiry
    const now = Date.now();
    if (targetUser.resetPasswordTokenExpires && targetUser.resetPasswordTokenExpires < now) {
      return NextResponse.json(
        {
          success: false,
          expired: true,
          message: "Şifre sıfırlama bağlantısının 15 dakikalık süresi dolmuş. Lütfen yeni bir talep oluşturun.",
        },
        { status: 400 }
      );
    }

    // 7. Securely hash new password using PBKDF2-SHA512
    const newPasswordHash = hashPassword(String(newPassword));

    const updatedUser = {
      ...targetUser,
      passwordHash: newPasswordHash,
      resetPasswordTokenHash: undefined,
      resetPasswordTokenExpires: undefined,
      tokenVersion: (targetUser.tokenVersion || 1) + 1, // Invalidate all prior sessions
    };

    const updatedUsers = [...db.users];
    updatedUsers[userIndex] = updatedUser;

    await saveCloudDatabase({ users: updatedUsers });

    // 8. Record security log
    await appendSecurityLog(targetUser.id, "PASSWORD_RESET_COMPLETED", ip);

    console.log(`[AUTH] Password reset completed successfully for user ${targetUser.username}`);

    return NextResponse.json({
      success: true,
      message: "Şifreniz başarıyla sıfırlandı! Artık yeni şifrenizle giriş yapabilirsiniz.",
    });
  } catch (error: any) {
    console.error("[AUTH] Reset password error:", error?.message);
    return NextResponse.json(
      { success: false, message: "Şifre sıfırlanırken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
