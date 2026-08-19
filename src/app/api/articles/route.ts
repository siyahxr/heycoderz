import { NextRequest, NextResponse } from "next/server";
import { fetchCloudDatabase, saveCloudDatabase } from "@/lib/serverDb";
import { BlogArticle } from "@/context/BlogContext";

export async function GET() {
  try {
    const db = await fetchCloudDatabase();
    return NextResponse.json({
      success: true,
      articles: db.articles || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Blog yazıları yüklenemedi" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, article, articleId, updatedFields } = body;
    const db = await fetchCloudDatabase();
    let articles = [...(db.articles || [])];

    if (action === "create" && article) {
      articles = [article as BlogArticle, ...articles];
    } else if (action === "update" && articleId && updatedFields) {
      articles = articles.map((a) =>
        a.id === articleId ? { ...a, ...updatedFields } : a
      );
    } else if (action === "delete" && articleId) {
      articles = articles.filter((a) => a.id !== articleId);
    }

    const updatedDb = await saveCloudDatabase({ articles });

    return NextResponse.json({
      success: true,
      articles: updatedDb.articles,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Blog işlemi gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
