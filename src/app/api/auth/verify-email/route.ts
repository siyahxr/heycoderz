import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  hashVerificationToken,
  isValidTokenFormat,
  getClientIp,
  enforcePayloadLimit,
} from "@/lib/security";
import {
  fetchCloudDatabase,
  saveCloudDatabase,
  consumeVerificationTokenAtomic,
  appendSecurityLog,
} from "@/lib/serverDb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "";
  return handleVerification(req, token);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Payload size limit (10KB)
    if (!enforcePayloadLimit(body, 10 * 1024)) {
      return NextResponse.json(
        { success: false, code: "INVALID_REQUEST", message: "İstek boyutu çok büyük." },
        { status: 413 }
      );
    }

    const token = body?.token || "";
    return handleVerification(req, token);
  } catch {
    return NextResponse.json(
      { success: false, code: "INVALID_REQUEST", message: "Geçersiz istek formatı." },
      { status: 400 }
    );
  }
}

async function handleVerification(req: NextRequest, rawToken: string) {
  const ip = getClientIp(req);

  // 1. Rate limiting (20 attempts per minute per IP)
  const rateLimit = await checkRateLimit(`verify_email_${ip}`, 20, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        code: "RATE_LIMITED",
        message: `Çok fazla istek yapıldı. Lütfen ${rateLimit.retryAfterSec} saniye sonra tekrar deneyin.`,
      },
      { status: 429 }
    );
  }

  // 2. Validate token presence and format
  if (!rawToken || typeof rawToken !== "string" || rawToken.trim() === "") {
    return NextResponse.json(
      { success: false, code: "MISSING_TOKEN", message: "Doğrulama token'ı bulunamadı veya eksik." },
      { status: 400 }
    );
  }

  const cleanToken = rawToken.trim();

  // Strict format validation: must be 64-char hex
  if (!isValidTokenFormat(cleanToken)) {
    return NextResponse.json(
      {
        success: false,
        code: "INVALID_TOKEN",
        message: "Doğrulama bağlantısı geçersiz format. Lütfen yeni bir bağlantı talep edin.",
      },
      { status: 400 }
    );
  }

  const tokenHash = hashVerificationToken(cleanToken);

  // 3. Atomic token consumption (prevents race conditions)
  const lockAcquired = await consumeVerificationTokenAtomic(tokenHash);
  if (!lockAcquired) {
    return NextResponse.json(
      {
        success: false,
        code: "INVALID_TOKEN",
        message: "Bu doğrulama bağlantısı zaten işleniyor veya kullanılmış. Lütfen yeni bir bağlantı talep edin.",
      },
      { status: 400 }
    );
  }

  // 4. Look up user by verificationTokenHash or pendingEmailTokenHash
  const db = await fetchCloudDatabase();
  const userIndex = db.users.findIndex(
    (u) =>
      (u.verificationTokenHash && u.verificationTokenHash === tokenHash) ||
      (u.pendingEmailTokenHash && u.pendingEmailTokenHash === tokenHash)
  );

  if (userIndex === -1) {
    return NextResponse.json(
      {
        success: false,
        code: "INVALID_TOKEN",
        message: "Doğrulama bağlantısı geçersiz veya daha önce kullanılmış. Lütfen yeni bir bağlantı talep edin.",
      },
      { status: 400 }
    );
  }

  const targetUser = db.users[userIndex];
  const now = Date.now();
  const isPendingEmailConfirmation = targetUser.pendingEmailTokenHash === tokenHash;

  if (isPendingEmailConfirmation) {
    // 5A. Check pending email token expiration
    if (targetUser.pendingEmailTokenExpires && targetUser.pendingEmailTokenExpires < now) {
      return NextResponse.json(
        {
          success: false,
          code: "EXPIRED_TOKEN",
          email: targetUser.pendingEmail,
          message: "Yeni e-posta doğrulama bağlantısının 15 dakikalık süresi dolmuş. Lütfen ayarlardan tekrar talep edin.",
        },
        { status: 400 }
      );
    }

    const verifiedNewEmail = targetUser.pendingEmail || targetUser.email;

    // Atomically activate new email
    const updatedUser = {
      ...targetUser,
      email: verifiedNewEmail,
      pendingEmail: undefined,
      pendingEmailTokenHash: undefined,
      pendingEmailTokenExpires: undefined,
      email_verified: true,
    };

    const updatedUsers = [...db.users];
    updatedUsers[userIndex] = updatedUser;

    await saveCloudDatabase({ users: updatedUsers });
    await appendSecurityLog(targetUser.id, "EMAIL_CHANGED", ip, `E-posta güncellendi: ${verifiedNewEmail}`);

    console.log(`[AUTH] User ${targetUser.username} successfully confirmed new email: ${verifiedNewEmail}`);

    const {
      passwordHash: __,
      verificationTokenHash: ___,
      pendingEmailTokenHash: ____,
      pendingEmailTokenExpires: _____,
      ...safeUser
    } = updatedUser;

    return NextResponse.json({
      success: true,
      code: "VERIFIED_SUCCESS",
      user: safeUser,
      email: verifiedNewEmail,
      message: "Tebrikler! Yeni e-posta adresiniz başarıyla doğrulandı ve hesabınıza kaydedildi.",
    });
  }

  // 5B. Check primary registration token expiration
  if (targetUser.verificationTokenExpires && targetUser.verificationTokenExpires < now) {
    return NextResponse.json(
      {
        success: false,
        code: "EXPIRED_TOKEN",
        email: targetUser.email,
        message: "Doğrulama bağlantısının 15 dakikalık süresi dolmuş. Lütfen yeni bir doğrulama e-postası isteyin.",
      },
      { status: 400 }
    );
  }

  // 6. Check if already verified
  if (targetUser.email_verified === true) {
    return NextResponse.json({
      success: true,
      alreadyVerified: true,
      email: targetUser.email,
      username: targetUser.username,
      message: "E-posta adresiniz zaten doğrulanmış. Hesabınıza hemen giriş yapabilirsiniz.",
    });
  }

  // 7. Atomically update user: email_verified = true, invalidate token
  const updatedUser = {
    ...targetUser,
    email_verified: true,
    verificationTokenHash: undefined,
    verificationTokenExpires: undefined,
  };

  const updatedUsers = [...db.users];
  updatedUsers[userIndex] = updatedUser;

  await saveCloudDatabase({ users: updatedUsers });
  await appendSecurityLog(targetUser.id, "EMAIL_VERIFIED", ip);

  console.log(`[AUTH] User ${targetUser.username} (${targetUser.email}) verified successfully.`);

  const {
    passwordHash: __,
    verificationTokenHash: ___,
    ...safeUser
  } = updatedUser;

  return NextResponse.json({
    success: true,
    code: "VERIFIED_SUCCESS",
    user: safeUser,
    message: "Tebrikler! E-posta adresiniz başarıyla doğrulandı. Artık hesabınıza giriş yapabilirsiniz.",
  });
}
