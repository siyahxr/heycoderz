import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  validateEmail,
  generateVerificationToken,
  hashVerificationToken,
  verifySessionToken,
  enforcePayloadLimit,
  verifyTurnstileToken,
} from "@/lib/security";
import { fetchCloudDatabase, saveCloudDatabase, appendSecurityLog } from "@/lib/serverDb";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Session verification & authorization check
    const sessionCookie = req.cookies.get("heycoderz_session")?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : { valid: false };

    if (!session.valid || !session.userId) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz erişim. Lütfen giriş yapın." },
        { status: 401 }
      );
    }

    // 2. Rate limiting (IP & User level)
    const ipRateLimit = await checkRateLimit(`update_email_ip_${ip}`, 10, 5 * 60 * 1000);
    if (!ipRateLimit.allowed) {
      console.warn(`[RATE_LIMIT] Update email IP limit exceeded for ${ip}`);
      return NextResponse.json(
        {
          success: false,
          message: `Çok fazla deneme yapıldı. Lütfen ${ipRateLimit.retryAfterSec} saniye bekleyin.`,
        },
        { status: 429 }
      );
    }

    const userRateLimit = await checkRateLimit(`update_email_usr_${session.userId}`, 5, 5 * 60 * 1000);
    if (!userRateLimit.allowed) {
      console.warn(`[RATE_LIMIT] Update email user limit exceeded for ${session.userId}`);
      return NextResponse.json(
        {
          success: false,
          message: `Çok fazla e-posta güncelleme talebi gönderildi. Lütfen ${userRateLimit.retryAfterSec} saniye bekleyin.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 3. Payload size check
    if (!enforcePayloadLimit(body, 10 * 1024)) {
      return NextResponse.json(
        { success: false, message: "İstek boyutu çok büyük." },
        { status: 413 }
      );
    }

    const { newEmail, turnstileToken } = body;

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

    if (!newEmail || typeof newEmail !== "string") {
      return NextResponse.json(
        { success: false, message: "Geçerli bir e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    // 4. Normalize & Validate email format
    const cleanEmail = newEmail.trim().toLowerCase();
    if (!validateEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Lütfen geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }

    const db = await fetchCloudDatabase();

    // 5. Find current user
    const userIndex = db.users.findIndex((u) => u.id === session.userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı hesabı bulunamadı." },
        { status: 404 }
      );
    }

    const targetUser = db.users[userIndex];

    // 6. Check if email is already in use by another user (as primary or pending)
    const emailConflict = db.users.find(
      (u) =>
        u.id !== session.userId &&
        ((u.email && u.email.toLowerCase() === cleanEmail) ||
          (u.pendingEmail && u.pendingEmail.toLowerCase() === cleanEmail))
    );
    if (emailConflict) {
      return NextResponse.json(
        { success: false, message: "Bu e-posta adresi başka bir hesap tarafından kullanılıyor." },
        { status: 400 }
      );
    }

    // If identical to current verified email
    if (targetUser.email && targetUser.email.toLowerCase() === cleanEmail && targetUser.email_verified === true) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Bu e-posta adresi zaten hesabınıza tanımlı ve doğrulanmış durumdadır.",
      });
    }

    // 7. Generate fresh 15-minute verification token
    const rawToken = generateVerificationToken();
    const tokenHash = hashVerificationToken(rawToken);
    const tokenExpires = Date.now() + 15 * 60 * 1000;

    let updatedUser;
    const isFirstTimeEmail = !targetUser.email || targetUser.email.trim() === "";

    if (isFirstTimeEmail) {
      // First time adding email: set email directly as unverified
      updatedUser = {
        ...targetUser,
        email: cleanEmail,
        pendingEmail: undefined,
        pendingEmailTokenHash: undefined,
        pendingEmailTokenExpires: undefined,
        email_verified: false,
        verificationTokenHash: tokenHash,
        verificationTokenExpires: tokenExpires,
      };
      await appendSecurityLog(targetUser.id, "EMAIL_CHANGE_REQUESTED", ip, "İlk e-posta adresi eklendi.");
    } else {
      // Changing existing email: use pendingEmail flow to preserve current account ownership
      updatedUser = {
        ...targetUser,
        pendingEmail: cleanEmail,
        pendingEmailTokenHash: tokenHash,
        pendingEmailTokenExpires: tokenExpires,
      };
      await appendSecurityLog(targetUser.id, "EMAIL_CHANGE_REQUESTED", ip, "Yeni e-posta onayı talep edildi.");
    }

    const updatedUsers = [...db.users];
    updatedUsers[userIndex] = updatedUser;

    await saveCloudDatabase({ users: updatedUsers });

    // 8. Dispatch verification email to the new address via Resend
    const emailResult = await sendVerificationEmail({
      email: cleanEmail,
      name: targetUser.name,
      username: targetUser.username,
      token: rawToken,
    });

    const {
      passwordHash: _,
      verificationTokenHash: __,
      verificationTokenExpires: ___,
      pendingEmailTokenHash: ____,
      pendingEmailTokenExpires: _____,
      ...safeUser
    } = updatedUser;

    if (!emailResult.success) {
      console.warn(`[EMAIL] Verification email failed for ${cleanEmail}`);
      return NextResponse.json({
        success: true,
        emailSent: false,
        user: safeUser,
        message:
          "E-posta adresiniz kaydedildi fakat doğrulama e-postası gönderilirken bir sorun yaşandı. Lütfen birazdan tekrar deneyin.",
      });
    }

    const feedbackMsg = isFirstTimeEmail
      ? "Doğrulama e-postası gönderildi. Lütfen gelen kutunuzu kontrol edin."
      : "Yeni e-posta adresinize doğrulama bağlantısı gönderildi. Onaylanana kadar mevcut e-posta adresiniz geçerli kalacaktır.";

    return NextResponse.json({
      success: true,
      emailSent: true,
      user: safeUser,
      message: feedbackMsg,
    });
  } catch (error: any) {
    console.error("[AUTH] Update email error:", error?.message);
    return NextResponse.json(
      { success: false, message: "E-posta güncellenirken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
