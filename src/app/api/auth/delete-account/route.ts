import { NextRequest, NextResponse } from "next/server";
import { fetchCloudDatabase, saveCloudDatabase } from "@/lib/serverDb";
import { checkRateLimit, secureCompare, sanitizeInput } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-ip";
    const rateLimit = checkRateLimit(`acc_del_${ip}`, 5, 60 * 1000);
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
    const { usernameOrEmail, password } = body;

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı adı ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const cleanInput = sanitizeInput(usernameOrEmail.trim().toLowerCase());
    const db = await fetchCloudDatabase();

    // Prevent deleting master root account directly
    if (cleanInput === "efe" || cleanInput === "efeabsteam@gmail.com") {
      return NextResponse.json(
        {
          success: false,
          message: "Ana Kurucu hesabı silinemez. Verileri Ayarlar > Veri Sıfırla kısmından sıfırlayabilirsiniz.",
        },
        { status: 403 }
      );
    }

    const userIndex = db.users.findIndex(
      (u) =>
        u.username.toLowerCase() === cleanInput ||
        u.email?.toLowerCase() === cleanInput
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const userToDelete = db.users[userIndex];
    if (userToDelete.password && !secureCompare(password, userToDelete.password)) {
      return NextResponse.json(
        { success: false, message: "Hesap silme şifresi hatalı." },
        { status: 401 }
      );
    }

    // Filter out user from database
    const newUsers = db.users.filter((_, idx) => idx !== userIndex);
    const newPosts = db.posts.filter((p) => p.authorId !== userToDelete.id && p.authorUsername !== userToDelete.username);

    await saveCloudDatabase({ users: newUsers, posts: newPosts });

    return NextResponse.json({
      success: true,
      message: "Hesabınız ve ilişkili verileriniz başarıyla silindi.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Hesap silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
