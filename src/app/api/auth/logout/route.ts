import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, getClientIp } from "@/lib/security";
import { appendSecurityLog } from "@/lib/serverDb";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const sessionCookie = req.cookies.get("heycoderz_session")?.value;

    if (sessionCookie) {
      const session = verifySessionToken(sessionCookie);
      if (session.valid && session.userId) {
        await appendSecurityLog(session.userId, "LOGOUT", ip);
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Başarıyla çıkış yapıldı.",
    });

    // Invalidate and delete session cookie
    response.cookies.set("heycoderz_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[AUTH] Logout error:", error?.message);
    return NextResponse.json(
      { success: false, message: "Çıkış yapılırken bir sorun oluştu." },
      { status: 500 }
    );
  }
}
