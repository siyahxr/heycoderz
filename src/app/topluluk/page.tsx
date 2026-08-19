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
  const { posts, createPost, addComment, toggleLike, deletePost, toggleAcceptSolution } = useCommunity();

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
              Topluluğu & Tartışmalar
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Sorular sorun, çözümleri sabitleyin, mimarileri tartışın ve kod parçacıkları paylaşın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Create Post Box */}
            <div className="p-6 rounded-3xl bg-[#08080E]/90 border border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] space-y-4 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                <Sparkles className="w-4 h-4" />
                <span>Yeni Tartışma veya Soru Başlat</span>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <input
                  type="text"
                  placeholder="Başlık (Örn: Next.js 16 Server Actions ile WebSocket bağlantısı nasıl yapılır?)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors"
                />

                <textarea
                  rows={4}
                  placeholder="Detaylı açıklama yazın... (Markdown veya soru detayları)"
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
                />

                {/* Optional Code Input */}
                {showCodeInput && (
                  <div className="space-y-1.5 animate-in fade-in">
                    <label className="text-[11px] font-mono text-purple-300 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      Kod Bloğu (Opsiyonel):
                    </label>
                    <textarea
                      rows={5}
                      placeholder="// Kod parçacığınızı buraya yapıştırın..."
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="w-full bg-black/70 border border-purple-500/30 rounded-2xl p-3.5 text-xs font-mono text-emerald-400 placeholder-gray-600 outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-purple-300 font-mono outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="Genel">Genel</option>
                      <option value="Soru & Cevap">Soru & Cevap</option>
                      <option value="Proje Paylaşımı">Proje Paylaşımı</option>
                      <option value="İpuçları">İpuçları</option>
                      <option value="Duyuru">Duyuru</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setShowCodeInput(!showCodeInput)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        showCodeInput
                          ? "bg-purple-950/60 border-purple-500/50 text-purple-300"
                          : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{showCodeInput ? "Kodu Kapat" : "Kod Ekle"}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isPosting || !newTitle.trim() || !newBody.trim()}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center gap-2 cursor-pointer transition-all"
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
                  const isAuthorOrAdmin = user && (user.id === post.authorId || user.role === "admin");

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
                          {post.isSolved && (
                            <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 text-[11px] font-mono font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.25)]">
                              ✓ Çözüldü
                            </span>
                          )}
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
                              {post.comments.map((c) => {
                                const isAccepted = post.acceptedCommentId === c.id;

                                return (
                                  <div
                                    key={c.id}
                                    className={`p-3.5 rounded-2xl space-y-2 transition-all ${
                                      isAccepted
                                        ? "bg-green-950/20 border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                                        : "bg-black/50 border border-white/[0.05]"
                                    }`}
                                  >
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

                                      <div className="flex items-center gap-2">
                                        {isAccepted && (
                                          <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-300 font-mono text-[10px] font-bold">
                                            👑 En İyi Çözüm
                                          </span>
                                        )}
                                        {isAuthorOrAdmin && (
                                          <button
                                            type="button"
                                            onClick={() => toggleAcceptSolution(post.id, c.id)}
                                            className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                                              isAccepted
                                                ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                                : "bg-green-500/10 hover:bg-green-500/20 text-green-300 border border-green-500/30"
                                            }`}
                                          >
                                            {isAccepted ? "Çözümü Kaldır" : "✓ Çözüm Olarak Seç"}
                                          </button>
                                        )}
                                        <span className="text-[10px] text-gray-500 font-mono">{formatTimeAgo(c.createdAt)}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-300 pl-8 leading-relaxed">{c.body}</p>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 font-mono text-center py-2">
                              Henüz yorum yapılmamış. İlk yanıtı sen yaz!
                            </p>
                          )}

                          {/* Add Comment Box */}
                          <div className="flex gap-2 pt-2">
                            <input
                              type="text"
                              placeholder="Yorumunu veya çözüm önerini yaz..."
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

          {/* Right Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Solved Q&A Guidelines */}
            <div className="p-6 rounded-3xl bg-[#08080E]/90 border border-purple-500/20 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Soru & Cevap Rehberi
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Sorunuz yanıtlandığında veya en iyi çözümü bulduğunuzda, ilgili yorumun yanındaki <strong>&quot;✓ Çözüm Olarak Seç&quot;</strong> butonuna tıklayarak diğer geliştiricilere rehberlik edin.
              </p>
            </div>

            {/* Quick Links */}
            <div className="p-6 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] space-y-3">
              <h3 className="text-sm font-bold text-white">Faydalı Alanlar</h3>
              <div className="space-y-2 text-xs">
                <Link href="/snippetler" className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-purple-500/10 text-gray-300 hover:text-purple-300 transition-colors">
                  <span>Hazır Kod & Snippet Deposu</span>
                  <span className="text-purple-400 font-mono">→</span>
                </Link>
                <Link href="/duello" className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-purple-500/10 text-gray-300 hover:text-purple-300 transition-colors">
                  <span>1v1 Kod Düelloları</span>
                  <span className="text-purple-400 font-mono">→</span>
                </Link>
                <Link href="/lounge" className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-purple-500/10 text-gray-300 hover:text-purple-300 transition-colors">
                  <span>Dev Lounge (Lo-Fi & Co-Working)</span>
                  <span className="text-purple-400 font-mono">→</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
