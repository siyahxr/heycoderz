import { NextRequest, NextResponse } from "next/server";
import { fetchCloudDatabase, saveCloudDatabase } from "@/lib/serverDb";
import {
  checkRateLimit,
  verifyPassword,
  sanitizeInput,
  getClientIp,
  verifySessionToken,
  enforcePayloadLimit,
} from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = await checkRateLimit(`acc_del_${ip}`, 5, 60 * 1000);
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

    // Payload size limit (10KB)
    if (!enforcePayloadLimit(body, 10 * 1024)) {
      return NextResponse.json(
        { success: false, message: "İstek boyutu çok büyük." },
        { status: 413 }
      );
    }

    const { usernameOrEmail, password } = body;

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı adı ve şifre zorunludur." },
        { status: 400 }
      );
    }

    // Input length limits
    if (String(usernameOrEmail).length > 254 || String(password).length > 128) {
      return NextResponse.json(
        { success: false, message: "Geçersiz giriş." },
        { status: 400 }
      );
    }

    // Session verification (IDOR prevention: user can only delete their own account)
    const sessionCookie = req.cookies.get("heycoderz_session")?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : { valid: false };

    const cleanInput = sanitizeInput(String(usernameOrEmail).trim().toLowerCase());
    const db = await fetchCloudDatabase();

    // Prevent deleting admin/founder accounts
    const adminUsernames = ["siyah", "oyku"];
    const foundUser = db.users.find(
      (u) =>
        u.username.toLowerCase() === cleanInput ||
        (u.email && u.email?.toLowerCase() === cleanInput)
    );

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    if (adminUsernames.includes(foundUser.username.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          message: "Kurucu hesapları silinemez.",
        },
        { status: 403 }
      );
    }

    // IDOR check: Session user must match the user being deleted
    if (session.valid && session.userId !== foundUser.id) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz işlem. Sadece kendi hesabınızı silebilirsiniz." },
        { status: 403 }
      );
    }

    // Verify password using passwordHash
    if (!foundUser.passwordHash || !verifyPassword(String(password), foundUser.passwordHash)) {
      return NextResponse.json(
        { success: false, message: "Hesap silme şifresi hatalı." },
        { status: 401 }
      );
    }

    // Filter out user from database
    const newUsers = db.users.filter((u) => u.id !== foundUser.id);
    const newPosts = db.posts.filter(
      (p) => p.authorId !== foundUser.id && p.authorUsername !== foundUser.username
    );

    await saveCloudDatabase({ users: newUsers, posts: newPosts });

    // Clear session cookie
    const response = NextResponse.json({
      success: true,
      message: "Hesabınız ve ilişkili verileriniz başarıyla silindi.",
    });
    response.cookies.set("heycoderz_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Account deletion error:", error?.message);
    return NextResponse.json(
      { success: false, message: "Hesap silinirken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
