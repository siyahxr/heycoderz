import { NextRequest, NextResponse } from "next/server";
import { fetchCloudDatabase, saveCloudDatabase } from "@/lib/serverDb";
import { verifySessionToken } from "@/lib/security";

export async function GET() {
  try {
    const db = await fetchCloudDatabase();
    // Return sanitized users (strip all sensitive fields)
    const sanitizedUsers = db.users.map(({ passwordHash, verificationTokenHash, verificationTokenExpires, ...rest }) => {
      // Also strip any legacy 'password' field
      const { password, ...safeRest } = rest as any;
      return safeRest;
    });
    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
      posts: db.posts || [],
      articles: db.articles || [],
      jobs: db.jobs || [],
      repositories: db.repositories || [],
      lastUpdated: db.lastUpdated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Veri senkronizasyon hatası oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Authorization: Require valid session cookie for write operations
    const sessionCookie = req.cookies.get("heycoderz_session")?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : { valid: false };
    
    if (!session.valid) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz erişim. Lütfen giriş yapın." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { posts, articles, jobs, userProfile } = body;

    const db = await fetchCloudDatabase();
    let updatedUsers = [...db.users];

    // If a user profile update is requested, only allow updating own profile (IDOR prevention)
    if (userProfile && userProfile.username) {
      const idx = updatedUsers.findIndex(
        (u) =>
          u.username.toLowerCase() === userProfile.username.toLowerCase() ||
          (u.email && u.email.toLowerCase() === userProfile.email?.toLowerCase())
      );
      
      if (idx !== -1) {
        // Verify the requesting user matches the profile being updated
        if (session.userId !== updatedUsers[idx].id && session.role !== "admin") {
          return NextResponse.json(
            { success: false, message: "Sadece kendi profilinizi güncelleyebilirsiniz." },
            { status: 403 }
          );
        }
        
        // Sanitize: never allow overwriting security fields via sync
        const { password, passwordHash, verificationTokenHash, verificationTokenExpires, role, id, ...safeUpdate } = userProfile;
        updatedUsers[idx] = { ...updatedUsers[idx], ...safeUpdate };
      }
      // Don't allow adding new users via sync endpoint
    }

    const updatePayload: any = { users: updatedUsers };
    
    // Only admins can update posts, articles, jobs
    if (session.role === "admin") {
      if (posts && Array.isArray(posts)) updatePayload.posts = posts;
      if (articles && Array.isArray(articles)) updatePayload.articles = articles;
      if (jobs && Array.isArray(jobs)) updatePayload.jobs = jobs;
    }

    const newDb = await saveCloudDatabase(updatePayload);

    const sanitizedUsers = newDb.users.map(({ passwordHash, verificationTokenHash, verificationTokenExpires, ...rest }) => {
      const { password, ...safeRest } = rest as any;
      return safeRest;
    });

    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
      posts: newDb.posts,
      articles: newDb.articles,
      jobs: newDb.jobs,
      lastUpdated: newDb.lastUpdated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Kaydetme hatası oluştu." },
      { status: 500 }
    );
  }
}
