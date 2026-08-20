"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  GitBranch, 
  Star, 
  GitFork, 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  Globe2, 
  Lock, 
  Terminal, 
  FileCode2, 
  MessageSquare, 
  Tag, 
  Calendar, 
  ShieldCheck, 
  Share2, 
  Trash2,
  BookOpen,
  Send,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useRepo } from "@/context/RepoContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { FileExplorer } from "@/components/repo/FileExplorer";
import { ReadmeRenderer } from "@/components/repo/ReadmeRenderer";

export default function RepoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const repoId = params?.id as string;

  const { getRepoById, isLoaded, toggleStar, forkRepository, deleteRepository, downloadRepoZip, addRepoComment } = useRepo();
  const { user } = useAuth();
  const { t } = useLanguage();

  const repo = getRepoById(repoId);

  const [activeTab, setActiveTab] = useState<"code" | "discussions" | "releases">("code");
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [forking, setForking] = useState(false);

  if (!isLoaded) {
    return (
      <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans">
        <BackgroundEffects />
        <Navbar />
        <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 py-28 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-400 font-mono">Depo yükleniyor...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans">
        <BackgroundEffects />
        <Navbar />
        <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <FileCode2 className="w-16 h-16 text-gray-600 mx-auto" />
          <h1 className="text-2xl font-bold text-white">{t("repo.notFound")}</h1>
          <p className="text-sm text-gray-400 max-w-md mx-auto">{t("repo.notFoundDesc")}</p>
          <Link
            href="/depolar"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold hover:bg-purple-600/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tüm Depolara Dön</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwner = user ? user.id === repo.author.id || user.username === repo.author.username || user.role === "admin" : false;
  const isStarred = user ? repo.starredByUserIds.includes(user.id) : false;
  const readmeFile = repo.files.find((f) => f.name.toLowerCase() === "readme.md");

  const handleStar = () => {
    toggleStar(repo.id, user);
  };

  const handleFork = () => {
    setForking(true);
    setTimeout(() => {
      const forked = forkRepository(repo.id, user);
      setForking(false);
      if (forked) {
        alert(t("repo.forkSuccess"));
        router.push(`/depolar/${forked.id}`);
      }
    }, 400);
  };

  const handleCopyClone = () => {
    if (typeof window === "undefined") return;
    const url = `https://heycoderz.com/depolar/${repo.id}.git`;
    navigator.clipboard.writeText(`git clone ${url}`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(t("repo.deleteConfirm"))) {
      deleteRepository(repo.id);
      router.push("/depolar");
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addRepoComment(repo.id, commentText, user);
    setCommentText("");
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Back Link */}
        <Link
          href="/depolar"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("common.back")}</span>
        </Link>

        {/* Repository Header Card */}
        <div className="rounded-3xl bg-[#09090F]/90 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-5">
          
          {/* Top Line: Breadcrumb + Public badge + Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Title & Author */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Link
                  href={`/@${repo.author.username.replace(/^@/, "")}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={repo.author.avatar}
                    alt={repo.author.name}
                    className="w-8 h-8 rounded-lg object-cover border border-purple-500/40"
                  />
                  <span className="text-sm font-mono text-purple-300 font-medium hover:underline">
                    @{repo.author.username.replace(/^@/, "")}
                  </span>
                </Link>

                <span className="text-gray-600">/</span>

                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-purple-400" />
                  <span>{repo.name}</span>
                </h1>

                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-white/[0.05] text-gray-300 border border-white/10 font-mono">
                  {repo.isPublic ? (
                    <>
                      <Globe2 className="w-3 h-3 text-emerald-400" />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Private</span>
                    </>
                  )}
                </span>
              </div>

              {repo.forkedFrom && (
                <p className="text-xs text-gray-400 flex items-center gap-1.5 font-mono pt-1">
                  <GitFork className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t("repo.forkedFrom")}</span>
                  <Link
                    href={`/depolar/${repo.forkedFrom.repoId}`}
                    className="text-purple-400 hover:underline"
                  >
                    @{repo.forkedFrom.authorUsername}/{repo.forkedFrom.repoName}
                  </Link>
                </p>
              )}
            </div>

            {/* Top Action Buttons (Star, Fork, Clone, Share) */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Star Button */}
              <button
                type="button"
                onClick={handleStar}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isStarred
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : "bg-white/[0.03] border-white/10 text-gray-300 hover:text-white hover:border-purple-500/40 hover:bg-purple-950/20"
                }`}
              >
                <Star className={`w-4 h-4 ${isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                <span>{isStarred ? t("repo.unstar") : t("repo.star")}</span>
                <span className="px-1.5 py-0.5 rounded bg-black/40 text-[11px] font-mono font-bold">
                  {repo.stars}
                </span>
              </button>

              {/* Fork Button */}
              <button
                type="button"
                onClick={handleFork}
                disabled={forking}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-purple-950/20 text-gray-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                <GitFork className="w-4 h-4" />
                <span>{t("repo.fork")}</span>
                <span className="px-1.5 py-0.5 rounded bg-black/40 text-[11px] font-mono font-bold">
                  {repo.forks}
                </span>
              </button>

              {/* Direct Download ZIP / RAR Button */}
              <button
                type="button"
                onClick={() => downloadRepoZip(repo, "zip")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.03] border border-white/10 hover:border-purple-500/40 hover:bg-purple-950/20 text-gray-300 hover:text-white transition-all cursor-pointer"
                title="Tüm projeyi fotoğraflarla birlikte ZIP/RAR olarak indir"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">ZIP / RAR İndir</span>
              </button>

              {/* Clone Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCloneModalOpen(!cloneModalOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  <span>{t("repo.clone")}</span>
                </button>

                {cloneModalOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#09090F] border border-purple-500/30 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                      <span className="text-xs font-bold text-white">{t("repo.cloneHttps")}</span>
                      <button
                        type="button"
                        onClick={() => setCloneModalOpen(false)}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/70 border border-white/10 font-mono text-[11px]">
                      <span className="truncate text-gray-300 select-all">
                        git clone https://heycoderz.com/depolar/{repo.id}.git
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyClone}
                        className="p-1.5 hover:text-purple-300 transition-colors shrink-0"
                      >
                        {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="pt-1 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          downloadRepoZip(repo, "zip");
                          setCloneModalOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/40 text-xs font-semibold text-purple-200 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ZIP Olarak İndir (.zip)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          downloadRepoZip(repo, "rar");
                          setCloneModalOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>RAR Uyumlu Arşiv (.rar)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Share */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/30 text-gray-400 hover:text-white transition-all cursor-pointer"
                title="Depo linkini kopyala"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              {/* Owner Delete */}
              {isOwner && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                  title="Depoyu Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-4xl">
            {repo.description || "Açıklama belirtilmemiş."}
          </p>

          {/* Tags & Meta */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {/* Primary Language */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-200 font-medium">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: repo.languageColor || "#a855f7" }}
              />
              <span>{repo.primaryLanguage}</span>
            </span>

            {/* License */}
            <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-gray-300 font-mono text-[11px]">
              {repo.license} Lisansı
            </span>

            {/* Default Branch */}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-950/30 border border-purple-500/20 text-purple-300 font-mono text-[11px]">
              <GitBranch className="w-3 h-3" />
              <span>{repo.defaultBranch}</span>
            </span>

            {/* Tags */}
            {repo.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-gray-400 text-[11px] font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto custom-scrollbar">
          {[
            { id: "code", label: t("repo.tabCode"), icon: FileCode2, count: repo.files.length },
            { id: "discussions", label: t("repo.tabDiscussions"), icon: MessageSquare, count: repo.comments.length },
            { id: "releases", label: t("repo.tabReleases"), icon: Tag, count: repo.releases.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon className="w-4 h-4 text-purple-400" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-black/50 text-[10px] font-mono text-purple-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content: Code View (FileExplorer + Readme) */}
        {activeTab === "code" && (
          <div className="space-y-6">
            <FileExplorer repo={repo} isOwner={isOwner} />

            {/* Readme Section */}
            {readmeFile && (
              <ReadmeRenderer content={readmeFile.content} />
            )}
          </div>
        )}

        {/* Tab Content: Discussions */}
        {activeTab === "discussions" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Comment Box */}
            <form onSubmit={handleAddComment} className="p-5 rounded-2xl bg-[#09090F]/90 border border-purple-500/30 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={user?.name || "User"}
                  className="w-8 h-8 rounded-lg object-cover border border-purple-500/40"
                />
                <span className="text-xs font-medium text-gray-300">
                  {user ? user.name : "Misafir Kullanıcı"} olarak yorum yap:
                </span>
              </div>

              <textarea
                rows={3}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Bu kod deposu hakkında soru sorun, geri bildirimde bulunun veya fikir paylaşın..."
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-y"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-medium text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Yorumu Gönder</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            {repo.comments.length > 0 ? (
              <div className="space-y-3">
                {repo.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#09090F]/80 border border-white/[0.08] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-7 h-7 rounded-md object-cover border border-purple-500/30"
                        />
                        <div>
                          <span className="text-xs font-bold text-white mr-1.5">{comment.authorName}</span>
                          <span className="text-[11px] font-mono text-purple-400">@{comment.authorUsername}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-500">
                        {typeof comment.createdAt === "number" ? new Date(comment.createdAt).toLocaleDateString() : comment.createdAt}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-9">
                      {comment.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 p-6 rounded-2xl bg-[#09090F]/60 border border-white/[0.08] space-y-2">
                <MessageSquare className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-xs text-gray-400">Henüz bir tartışma veya yorum yok. İlk yorumu siz yazın!</p>
              </div>
            )}

          </div>
        )}

        {/* Tab Content: Releases & Stats */}
        {activeTab === "releases" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {repo.releases.length > 0 ? (
              repo.releases.map((rel, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#09090F]/90 border border-white/[0.08] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-bold text-white">{rel.version}</span>
                      <span className="text-xs text-purple-300 font-medium">— {rel.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">{rel.date}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{rel.notes}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 p-6 rounded-2xl bg-[#09090F]/60 border border-white/[0.08] space-y-2">
                <Tag className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-xs text-gray-400">Henüz yayınlanmış bir sürüm etiketi bulunmuyor.</p>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
