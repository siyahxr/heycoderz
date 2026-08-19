import { NextRequest, NextResponse } from "next/server";
import { fetchCloudDatabase, saveCloudDatabase, appendSecurityLog } from "@/lib/serverDb";
import {
  checkRateLimit,
  verifyPassword,
  hashPassword,
  validatePasswordStrength,
  sanitizeInput,
  getClientIp,
  verifySessionToken,
  enforcePayloadLimit,
} from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = await checkRateLimit(`pwd_change_${ip}`, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Çok fazla deneme yapıldı. Lütfen ${rateLimit.retryAfterSec} saniye sonra tekrar deneyin.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Payload size limit (20KB)
    if (!enforcePayloadLimit(body, 20 * 1024)) {
      return NextResponse.json(
        { success: false, message: "İstek boyutu çok büyük." },
        { status: 413 }
      );
    }

    const { usernameOrEmail, currentPassword, newPassword } = body;

    if (!usernameOrEmail || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Tüm alanların doldurulması zorunludur." },
        { status: 400 }
      );
    }

    // Input length limits
    if (String(usernameOrEmail).length > 254 || String(currentPassword).length > 128 || String(newPassword).length > 128) {
      return NextResponse.json(
        { success: false, message: "Geçersiz giriş boyutu." },
        { status: 400 }
      );
    }

    // Validate new password strength
    const pwdCheck = validatePasswordStrength(String(newPassword));
    if (!pwdCheck.valid) {
      return NextResponse.json(
        { success: false, message: pwdCheck.message },
        { status: 400 }
      );
    }

    // Session verification (IDOR prevention)
    const sessionCookie = req.cookies.get("heycoderz_session")?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : { valid: false };

    const cleanInput = sanitizeInput(String(usernameOrEmail).trim().toLowerCase());
    const db = await fetchCloudDatabase();
    let users = [...db.users];

    // Find user
    const userIndex = users.findIndex(
      (u) =>
        u.username.toLowerCase() === cleanInput ||
        (u.email && u.email?.toLowerCase() === cleanInput)
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const storedUser = users[userIndex];

    // IDOR check: If session is active, verify it belongs to this user
    if (session.valid && session.userId !== storedUser.id) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz işlem." },
        { status: 403 }
      );
    }

    // Verify current password using passwordHash
    if (!storedUser.passwordHash || !verifyPassword(String(currentPassword), storedUser.passwordHash)) {
      return NextResponse.json(
        { success: false, message: "Mevcut şifreniz hatalı." },
        { status: 401 }
      );
    }

    // Hash and store new password (no plaintext!)
    const newPwdHash = hashPassword(String(newPassword));
    users[userIndex] = {
      ...storedUser,
      passwordHash: newPwdHash,
      tokenVersion: (storedUser.tokenVersion || 1) + 1,
    };

    await saveCloudDatabase({ users });
    await appendSecurityLog(storedUser.id, "PASSWORD_CHANGED", ip);

    return NextResponse.json({
      success: true,
      message: "Şifreniz başarıyla güncellendi.",
    });
  } catch (error: any) {
    console.error("Password change error:", error?.message);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
