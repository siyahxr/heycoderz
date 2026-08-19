import { NextRequest, NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/serverDb";

export async function GET() {
  try {
    const db = getDatabase();
    // Return sanitized users (hide passwords)
    const sanitizedUsers = db.users.map(({ password, ...rest }) => rest);
    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
      posts: db.posts || [],
      articles: db.articles || [],
      jobs: db.jobs || [],
      lastUpdated: db.lastUpdated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Veri senkronizasyon hatası" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { posts, articles, jobs, userProfile } = body;

    const db = getDatabase();
    let updatedUsers = [...db.users];

    // If a user profile update is requested
    if (userProfile && userProfile.username) {
      const idx = updatedUsers.findIndex(
        (u) =>
          u.username.toLowerCase() === userProfile.username.toLowerCase() ||
          (u.email && u.email.toLowerCase() === userProfile.email?.toLowerCase())
      );
      if (idx !== -1) {
        updatedUsers[idx] = { ...updatedUsers[idx], ...userProfile };
      } else {
        updatedUsers.push(userProfile);
      }
    }

    const newDb = saveDatabase({
      ...(posts && Array.isArray(posts) ? { posts } : {}),
      ...(articles && Array.isArray(articles) ? { articles } : {}),
      ...(jobs && Array.isArray(jobs) ? { jobs } : {}),
      users: updatedUsers,
    });

    const sanitizedUsers = newDb.users.map(({ password, ...rest }) => rest);

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
      { success: false, message: error.message || "Kaydetme hatası" },
      { status: 500 }
    );
  }
}
