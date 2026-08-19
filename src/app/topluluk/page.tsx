"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Send, 
  Sparkles, 
  Code2, 
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Trash2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCommunity, formatTimeAgo } from "@/context/CommunityContext";

export default function CommunityPage() {
  const { user } = useAuth();
  const { posts, createPost, addComment, toggleLike, deletePost } = useCommunity();

  const [selectedTag, setSelectedTag] = useState("all");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newTag, setNewTag] = useState("Genel");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Active open comments per post ID
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    setIsPosting(true);
    createPost(newTitle, newBody, newTag, showCodeInput ? newCode : undefined, user);
    
    setTimeout(() => {
      setNewTitle("");
      setNewBody("");
      setNewCode("");
      setShowCodeInput(false);
      setIsPosting(false);
    }, 300);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    addComment(postId, text, user);
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedTag === "all") return true;
    return p.tag.toLowerCase() === selectedTag.toLowerCase();
  });

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Users className="w-3.5 h-3.5" />
            <span>heycoderz Topluluk Alanı</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Geliştirici{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Tartışma & Paylaşım
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Sorularınızı sorun, geliştirdiğiniz araçları tanıtın veya diğer yazılımcılarla fikir alışverişi yapın.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Create Post Card */}
            <div className="p-6 rounded-3xl bg-[#09090F]/95 border border-purple-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(139,92,246,0.15)]">
              <div className="flex items-center gap-3 mb-4">
                <Link
                  href={user ? `/@${user.username.replace(/^@/, "")}` : "/giris"}
                  className="flex items-center gap-3 group/create-author cursor-pointer"
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt={user?.name || "Dev"}
                    className="w-10 h-10 rounded-xl object-cover border border-purple-500/30 group-hover/create-author:border-purple-400 transition-colors"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover/create-author:text-purple-300 transition-colors flex items-center gap-2">
                      <span>{user ? user.name : "Toplulukta Paylaşım Yap"}</span>
                      {user?.role === "admin" && (
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      )}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {user ? `@${user.username}` : "Giriş yapmadan da hızlıca soru veya fikir paylaşabilirsiniz"}
                    </p>
                  </div>
                </Link>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Bir başlık yazın (Örn: Next.js 16 Server Actions hakkında düşünceleriniz?)"
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    required
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder="Detayları, sorunuzu veya açıklamanızı yazın..."
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition-all resize-none"
                  />
                </div>

                {/* Optional Code Input Box */}
                {showCodeInput && (
                  <div className="space-y-1.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                      <span>Kod Parçacığı (İsteğe bağlı):</span>
                      <button
                        type="button"
                        onClick={() => setShowCodeInput(false)}
                        className="text-red-400 hover:underline cursor-pointer"
                      >
                        Kaldır
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="// Kodunuzu buraya yapıştırın..."
                      className="w-full bg-black/80 border border-purple-500/30 focus:border-purple-500 rounded-xl p-3 font-mono text-xs text-emerald-400 outline-none resize-none"
                    />
                  </div>
                )}

                {/* Form Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCodeInput(!showCodeInput)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        showCodeInput
                          ? "bg-purple-950/60 border-purple-500/50 text-purple-300"
                          : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{showCodeInput ? "Kod Alanı Açık" : "Kod Ekle"}</span>
                    </button>

                    <select
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="bg-black/60 border border-white/10 text-xs text-purple-300 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="Genel">Genel</option>
                      <option value="Soru & Cevap">Soru & Cevap</option>
                      <option value="Proje Paylaşımı">Proje Paylaşımı</option>
                      <option value="İpuçları">İpuçları</option>
                      <option value="Duyuru">Duyuru</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isPosting || !newTitle.trim() || !newBody.trim()}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isPosting ? "Yayınlanıyor..." : "Anında Yayınla"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Tag Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {["all", "Duyuru", "Soru & Cevap", "Proje Paylaşımı", "İpuçları", "Genel"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedTag === tag
                      ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                      : "bg-[#08080E]/90 text-gray-400 hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {tag === "all" ? "Tüm Gönderiler" : tag}
                </button>
              ))}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="p-10 rounded-3xl bg-[#09090F]/90 border border-white/[0.08] text-center space-y-3">
                  <MessageSquare className="w-8 h-8 text-gray-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">Bu kategoride henüz gönderi yok</h4>
                  <p className="text-xs text-gray-400">İlk tartışmayı siz başlatın!</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isLiked = user && post.likedByUserIds.includes(user.id);
                  const isCommentsOpen = openCommentsPostId === post.id;

                  return (
                    <div
                      key={post.id}
                      className="p-6 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300"
                    >
                      {/* Post Author Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <Link
                          href={`/@${post.authorUsername.replace(/^@/, "")}`}
                          className="flex items-center gap-3 group/author cursor-pointer"
                        >
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            className="w-10 h-10 rounded-xl object-cover border border-purple-500/30 group-hover/author:border-purple-400 group-hover/author:shadow-[0_0_12px_rgba(139,92,246,0.4)] transition-all"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white group-hover/author:text-purple-300 transition-colors">
                                {post.authorName}
                              </h4>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                                {post.authorBadge}
                              </span>
                              {post.authorRole === "admin" && (
                                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                              <span className="group-hover/author:text-purple-400 transition-colors">@{post.authorUsername}</span>
                              <span>•</span>
                              <span>{formatTimeAgo(post.createdAt || post.timestamp)}</span>
                            </div>
                          </div>
                        </Link>

                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5 text-gray-400 font-mono">
                            {post.tag}
                          </span>
                          {user?.role === "admin" && (
                            <button
                              type="button"
                              onClick={() => deletePost(post.id)}
                              title="Gönderiyi Sil"
                              className="text-gray-500 hover:text-red-400 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Post Content */}
                      <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4 whitespace-pre-line">
                        {post.body}
                      </p>

                      {/* Optional Code Snippet */}
                      {post.codeSnippet && (
                        <div className="p-4 rounded-2xl bg-black/80 border border-purple-500/20 font-mono text-xs text-emerald-400 overflow-x-auto mb-4">
                          <pre>{post.codeSnippet}</pre>
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => toggleLike(post.id, user?.id)}
                            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isLiked ? "text-pink-500 font-semibold" : "hover:text-pink-400"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-pink-500" : ""}`} />
                            <span>{post.likes} Beğeni</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setOpenCommentsPostId(isCommentsOpen ? null : post.id)
                            }
                            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments.length} Yorum</span>
                            {isCommentsOpen ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              navigator.clipboard.writeText(window.location.href);
                              alert("Gönderi bağlantısı kopyalandı!");
                            }
                          }}
                          className="hover:text-white transition-colors cursor-pointer p-1"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Nested Comments Drawer */}
                      {isCommentsOpen && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-4 animate-in fade-in">
                          {post.comments.length > 0 ? (
                            <div className="space-y-3">
                              {post.comments.map((c) => (
                                <div key={c.id} className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.05] space-y-1.5">
                                  <div className="flex items-center justify-between text-xs">
                                    <Link
                                      href={`/@${c.authorUsername.replace(/^@/, "")}`}
                                      className="flex items-center gap-2 group/commenter cursor-pointer"
                                    >
                                      <img
                                        src={c.authorAvatar}
                                        alt={c.authorName}
                                        className="w-6 h-6 rounded-full object-cover border border-white/10 group-hover/commenter:border-purple-400 transition-colors"
                                      />
                                      <span className="font-bold text-white group-hover/commenter:text-purple-300 transition-colors">{c.authorName}</span>
                                      <span className="text-[10px] text-gray-500 font-mono group-hover/commenter:text-purple-400 transition-colors">@{c.authorUsername}</span>
                                    </Link>
                                    <span className="text-[10px] text-gray-500 font-mono">{formatTimeAgo(c.createdAt)}</span>
                                  </div>
                                  <p className="text-xs text-gray-300 pl-8">{c.body}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 font-mono text-center py-2">
                              Henüz yorum yapılmamış. İlk yanıtı sen yaz!
                            </p>
                          )}

                          {/* Add comment input */}
                          <div className="flex items-center gap-2 pt-2">
                            <input
                              type="text"
                              placeholder="Bir yanıt veya yorum yaz..."
                              value={commentInputs[post.id] || ""}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddComment(post.id);
                                }
                              }}
                              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.id)}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
                            >
                              Yanıtla
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          </div>

      </main>

      <Footer />
    </div>
  );
}
