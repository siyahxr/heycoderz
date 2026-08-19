import { NextRequest, NextResponse } from "next/server";
import { fetchCloudDatabase, saveCloudDatabase } from "@/lib/serverDb";
import { checkRateLimit, secureCompare, sanitizeInput } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-ip";
    const rateLimit = checkRateLimit(`pwd_change_${ip}`, 5, 60 * 1000);
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
    const { usernameOrEmail, currentPassword, newPassword } = body;

    if (!usernameOrEmail || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Tüm alanların doldurulması zorunludur." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Yeni şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const cleanInput = sanitizeInput(usernameOrEmail.trim().toLowerCase());
    const db = await fetchCloudDatabase();
    const adminPasswords = { ...db.adminPasswords };
    let users = [...db.users];

    // 1. Admin: Efe
    if (
      cleanInput === "efe" ||
      cleanInput === "@efe" ||
      cleanInput === "admin@heycoderz.com" ||
      cleanInput === "efeabsteam@gmail.com"
    ) {
      const activeEfePass = adminPasswords.efe || "efe2008efeAxA!!3131";
      if (!secureCompare(currentPassword, activeEfePass)) {
        return NextResponse.json(
          { success: false, message: "Mevcut şifreniz hatalı." },
          { status: 401 }
        );
      }

      adminPasswords.efe = newPassword;
      users = users.map((u) =>
        u.username === "efe" ? { ...u, password: newPassword } : u
      );

      await saveCloudDatabase({ adminPasswords, users });
      return NextResponse.json({
        success: true,
        message: "Efe (Admin) şifresi başarıyla güncellendi.",
      });
    }

    // 2. Admin: Öykü
    if (
      cleanInput === "oyku" ||
      cleanInput === "@oyku" ||
      cleanInput === "öykü" ||
      cleanInput === "oyku@heycoderz.com"
    ) {
      const activeOykuPass = adminPasswords.oyku || "oyku2026heycoderz!";
      if (
        !secureCompare(currentPassword, activeOykuPass) &&
        !secureCompare(currentPassword, "oyku2026!")
      ) {
        return NextResponse.json(
          { success: false, message: "Mevcut şifreniz hatalı." },
          { status: 401 }
        );
      }

      adminPasswords.oyku = newPassword;
      users = users.map((u) =>
        u.username === "oyku" ? { ...u, password: newPassword } : u
      );

      await saveCloudDatabase({ adminPasswords, users });
      return NextResponse.json({
        success: true,
        message: "Öykü (Kurucu Ortak) şifresi başarıyla güncellendi.",
      });
    }

    // 3. Registered User
    const userIndex = users.findIndex(
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

    const storedUser = users[userIndex];
    if (storedUser.password && !secureCompare(currentPassword, storedUser.password)) {
      return NextResponse.json(
        { success: false, message: "Mevcut şifreniz hatalı." },
        { status: 401 }
      );
    }

    users[userIndex] = {
      ...storedUser,
      password: newPassword,
    };

    await saveCloudDatabase({ users });
    return NextResponse.json({
      success: true,
      message: "Şifreniz başarıyla değiştirildi.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
