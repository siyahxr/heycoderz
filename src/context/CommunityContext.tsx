"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "./AuthContext";
import { sanitizeInput } from "@/lib/security";

export interface Comment {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorBadge: string;
  body: string;
  createdAt: number | string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorBadge: string;
  authorRole: "admin" | "developer" | "pro";
  title: string;
  body: string;
  codeSnippet?: string;
  tag: string;
  likes: number;
  likedByUserIds: string[];
  comments: Comment[];
  createdAt: number | string;
  timestamp?: number;
}

export function formatTimeAgo(dateInput: number | string | undefined): string {
  if (!dateInput) return "Az önce";
  
  if (typeof dateInput === "string") {
    if (dateInput === "Platform Açılışı") return "Platform Açılışı";
    const num = Number(dateInput);
    if (!isNaN(num)) {
      dateInput = num;
    } else {
      const parsed = Date.parse(dateInput);
      if (!isNaN(parsed)) {
        dateInput = parsed;
      } else {
        return dateInput;
      }
    }
  }

  const timestamp = typeof dateInput === "number" ? dateInput : new Date(dateInput).getTime();
  if (isNaN(timestamp)) return "Az önce";

  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return "Az önce";
  
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "Az önce";
  if (diffMin < 60) return `${diffMin} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays === 1) return "Dün";
  if (diffDays < 7) return `${diffDays} gün önce`;

  const d = new Date(timestamp);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

// Initial posts list
const INITIAL_POSTS: CommunityPost[] = [];

interface CommunityContextType {
  posts: CommunityPost[];
  createPost: (
    title: string,
    body: string,
    tag: string,
    codeSnippet?: string,
    user?: UserProfile | null
  ) => void;
  addComment: (postId: string, body: string, user?: UserProfile | null) => void;
  toggleLike: (postId: string, userId?: string) => void;
  deletePost: (postId: string) => void;
  clearAllDemoPosts: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);

  // Sync with server API, localStorage & BroadcastChannel
  useEffect(() => {
    const saved = localStorage.getItem("heycoderz_community_posts_v2");
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error("Community data parse error:", e);
      }
    }

    // Fetch latest from API
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
          localStorage.setItem("heycoderz_community_posts_v2", JSON.stringify(data.posts));
        }
      })
      .catch(() => {});

    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("heycoderz_community_channel_v2");
      channel.onmessage = (event) => {
        if (event.data?.type === "UPDATE_POSTS" && event.data?.posts) {
          setPosts(event.data.posts);
        }
      };
    }

    return () => {
      channel?.close();
    };
  }, []);

  const broadcastPosts = (updatedPosts: CommunityPost[]) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem("heycoderz_community_posts_v2", JSON.stringify(updatedPosts));
    } catch {}

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("heycoderz_community_channel_v2");
      channel.postMessage({ type: "UPDATE_POSTS", posts: updatedPosts });
      channel.close();
    }
  };

  const createPost = (
    title: string,
    body: string,
    tag: string,
    codeSnippet?: string,
    user?: UserProfile | null
  ) => {
    const now = Date.now();
    const newPost: CommunityPost = {
      id: "post-" + now,
      authorId: user?.id || "guest-" + now,
      authorName: user?.name ? sanitizeInput(user.name) : "Anonim Geliştirici",
      authorUsername: user?.username ? sanitizeInput(user.username) : "anonim",
      authorAvatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || "dev" + now}`,
      authorBadge: user?.role === "admin" ? (user.username === "oyku" ? "Kurucu Ortak & Admin" : "Kurucu & Admin") : (user?.badge || "Topluluk Üyesi"),
      authorRole: user?.role || "developer",
      title: sanitizeInput(title.trim()),
      body: sanitizeInput(body.trim()),
      codeSnippet: codeSnippet?.trim() || undefined,
      tag: tag || "Genel",
      likes: 0,
      likedByUserIds: [],
      comments: [],
      createdAt: now,
      timestamp: now,
    };

    const updated = [newPost, ...posts];
    broadcastPosts(updated);

    // Sync to server API
    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", post: newPost }),
    }).catch(() => {});
  };

  const addComment = (postId: string, body: string, user?: UserProfile | null) => {
    if (!body.trim()) return;
    const now = Date.now();

    const newComment: Comment = {
      id: "c-" + now,
      authorName: user?.name ? sanitizeInput(user.name) : "Geliştirici",
      authorUsername: user?.username ? sanitizeInput(user.username) : "dev",
      authorAvatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || "dev"}`,
      authorBadge: user?.badge || "Topluluk",
      body: sanitizeInput(body.trim()),
      createdAt: now,
    };

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      }
      return p;
    });

    broadcastPosts(updated);

    // Sync to server API
    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "comment", postId, comment: newComment }),
    }).catch(() => {});
  };

  const toggleLike = (postId: string, userId?: string) => {
    const currentUserId = userId || "guest-" + (typeof window !== "undefined" ? window.location.host : "user");

    const updated = posts.map((p) => {
      if (p.id === postId) {
        const isLiked = p.likedByUserIds.includes(currentUserId);
        const newLikedList = isLiked
          ? p.likedByUserIds.filter((id) => id !== currentUserId)
          : [...p.likedByUserIds, currentUserId];

        return {
          ...p,
          likes: newLikedList.length,
          likedByUserIds: newLikedList,
        };
      }
      return p;
    });

    broadcastPosts(updated);

    // Sync to server API
    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like", postId, userId: currentUserId }),
    }).catch(() => {});
  };

  const deletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    broadcastPosts(updated);

    // Sync to server API
    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", postId }),
    }).catch(() => {});
  };

  const clearAllDemoPosts = () => {
    broadcastPosts([]);
  };

  return (
    <CommunityContext.Provider
      value={{
        posts,
        createPost,
        addComment,
        toggleLike,
        deletePost,
        clearAllDemoPosts,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
};
