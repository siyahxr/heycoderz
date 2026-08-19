import { NextRequest, NextResponse } from "next/server";
import { fetchCloudDatabase, saveCloudDatabase } from "@/lib/serverDb";
import { sanitizeInput } from "@/lib/security";
import { CommunityPost } from "@/context/CommunityContext";

export async function GET() {
  try {
    const db = await fetchCloudDatabase();
    return NextResponse.json({
      success: true,
      posts: db.posts || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Gönderiler yüklenemedi" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, post, postId, comment, userId } = body;
    const db = await fetchCloudDatabase();
    let posts = [...(db.posts || [])];

    if (action === "create" && post) {
      const sanitizedPost: CommunityPost = {
        ...post,
        title: sanitizeInput(post.title || ""),
        body: sanitizeInput(post.body || ""),
        authorName: sanitizeInput(post.authorName || ""),
        authorUsername: sanitizeInput(post.authorUsername || ""),
        codeSnippet: post.codeSnippet ? post.codeSnippet.trim() : undefined,
      };
      posts = [sanitizedPost, ...posts];
    } else if (action === "comment" && postId && comment) {
      const cleanComment = {
        ...comment,
        authorName: sanitizeInput(comment.authorName || ""),
        authorUsername: sanitizeInput(comment.authorUsername || ""),
        body: sanitizeInput(comment.body || ""),
      };
      posts = posts.map((p) =>
        p.id === postId ? { ...p, comments: [...(p.comments || []), cleanComment] } : p
      );
    } else if (action === "like" && postId) {
      const currentUserId = userId || "guest";
      posts = posts.map((p) => {
        if (p.id === postId) {
          const liked = p.likedByUserIds || [];
          const isLiked = liked.includes(currentUserId);
          const newLiked = isLiked
            ? liked.filter((id) => id !== currentUserId)
            : [...liked, currentUserId];
          return {
            ...p,
            likes: newLiked.length,
            likedByUserIds: newLiked,
          };
        }
        return p;
      });
    } else if (action === "delete" && postId) {
      posts = posts.filter((p) => p.id !== postId);
    }

    const updatedDb = await saveCloudDatabase({ posts });

    return NextResponse.json({
      success: true,
      posts: updatedDb.posts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "İşlem gerçekleştirilemedi" },
      { status: 500 }
    );
  }
}
