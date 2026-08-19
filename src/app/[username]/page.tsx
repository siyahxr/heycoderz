"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { DirectMessageDrawer } from "@/components/DirectMessageDrawer";
import { 
  User, 
  ShieldCheck, 
  Globe, 
  Trophy, 
  Flame, 
  ArrowLeft, 
  Share2, 
  Check, 
  MessageSquare, 
  Code2, 
  Sparkles, 
  ExternalLink,
  Laptop,
  Send,
  FolderGit2
} from "lucide-react";
import { UserProfile, useAuth, BASE_MAIN_USER, BASE_OYKU } from "@/context/AuthContext";
import { useCommunity, formatTimeAgo } from "@/context/CommunityContext";

export default function PublicProfilePage() {
  const params = useParams();
  const rawUsername = params?.username as string;
  const username = rawUsername ? decodeURIComponent(rawUsername).replace(/^@/, "").toLowerCase() : "";
  
  const { user: currentUser } = useAuth();
  const { posts } = useCommunity();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"standard" | "portfolio">("standard");
  const [isDmOpen, setIsDmOpen] = useState(false);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    // If username is a reserved route name
    if (username === "kesfet") {
      if (typeof window !== "undefined") {
        window.location.replace("/kesfet");
      }
      return;
    }

    // Redirect legacy efe profile to new $ / siyah profile
    if (username === "efe" || username === "efecan") {
      try {
        localStorage.removeItem("heycoderz_admin_profile_custom");
        localStorage.removeItem("heycoderz_admin_avatar");
        const active = localStorage.getItem("heycoderz_active_user");
        if (active && JSON.parse(active).username === "efe") {
          localStorage.removeItem("heycoderz_active_user");
        }
      } catch {}
      if (typeof window !== "undefined") {
        window.location.replace("/@siyah");
      }
      return;
    }

    // 1. Initial quick load from local cache or current user
    let initialUser: UserProfile | null = null;

    if (username === "siyah" || username === "$" || username === "admin") {
      initialUser = BASE_MAIN_USER;
      try {
        const customSaved = localStorage.getItem("heycoderz_siyah_profile_custom");
        if (customSaved) {
          initialUser = { ...initialUser, ...JSON.parse(customSaved) };
        }
        const activeUserStr = localStorage.getItem("heycoderz_active_user");
        if (activeUserStr) {
          const parsed = JSON.parse(activeUserStr);
          if (parsed.username === "siyah" || parsed.email === "siyah@heycoderz.com") {
            initialUser = { ...initialUser, ...parsed };
          }
        }
      } catch {}
    } else if (username === "oyku" || username === "öykü") {
      initialUser = BASE_OYKU;
      try {
        const customSaved = localStorage.getItem("heycoderz_oyku_profile_custom");
        if (customSaved) {
          initialUser = { ...initialUser, ...JSON.parse(customSaved) };
        }
        const activeUserStr = localStorage.getItem("heycoderz_active_user");
        if (activeUserStr) {
          const parsed = JSON.parse(activeUserStr);
          if (parsed.username === "oyku" || parsed.email === "oyku@heycoderz.com") {
            initialUser = { ...initialUser, ...parsed };
          }
        }
      } catch {}
    } else if (currentUser && currentUser.username.toLowerCase() === username) {
      initialUser = currentUser;
    } else {
      try {
        const registeredUsersStr = localStorage.getItem("heycoderz_registered_users");
        if (registeredUsersStr) {
          const registeredUsers = JSON.parse(registeredUsersStr);
          const found = registeredUsers.find((u: any) => u.username.toLowerCase() === username);
          if (found) initialUser = found;
        }
      } catch {}
    }

    if (initialUser) {
      setProfile(initialUser);
    }

    // 2. Fetch fresh profile directly from cloud database API
    fetch("/api/sync")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.users)) {
          const cloudUser = data.users.find(
            (u: any) =>
              u.username?.toLowerCase() === username ||
              (username === "siyah" && (u.username === "siyah" || u.email === "siyah@heycoderz.com")) ||
              (username === "$" && (u.username === "siyah" || u.name === "$")) ||
              (username === "oyku" && (u.username === "oyku" || u.email === "oyku@heycoderz.com"))
          );
          if (cloudUser) {
            setProfile((prev) => ({ ...(prev || BASE_MAIN_USER), ...cloudUser }));
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [username, currentUser]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // User's community posts
  const userPosts = posts.filter(
    (p) => p.authorUsername.toLowerCase() === username || (profile && p.authorId === profile.id)
  );

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col justify-between selection:bg-purple-500/30">
      <BackgroundEffects />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Back Link & View Switcher */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/topluluk"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Topluluğa Dön</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode("standard")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "standard"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Standart Profil
              </button>
              <button
                type="button"
                onClick={() => setViewMode("portfolio")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === "portfolio"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                Portfolyo / Bio Modu
              </button>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Kopyalandı!" : "Paylaş"}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center rounded-3xl bg-[#09090F]/60 border border-white/10">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-400">Profil yükleniyor...</p>
          </div>
        ) : !profile ? (
          <div className="p-12 text-center rounded-3xl bg-[#09090F]/60 border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold">Kullanıcı Bulunamadı</h2>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              @{username} adında bir heycoderz geliştiricisi henüz mevcut değil veya kullanıcı adı değişti.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-medium text-white transition-all"
            >
              Anasayfaya Dön
            </Link>
          </div>
        ) : viewMode === "portfolio" ? (
          /* PORTFOLIO / LINK-IN-BIO BENTO VIEW */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Bento Card */}
            <div className="p-8 rounded-3xl bg-[#09090F] border border-indigo-500/40 shadow-2xl space-y-6 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500" />
              
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-2xl shadow-indigo-950/80"
                  />
                  {profile.role === "admin" && (
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-indigo-600 text-[10px] font-black uppercase text-white shadow-lg border border-indigo-400">
                      ADMIN
                    </span>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-black text-white">{profile.name}</h1>
                  <p className="text-xs text-indigo-400 font-mono">@{profile.username}</p>
                </div>

                {profile.bio && (
                  <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDmOpen(true)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Direkt Mesaj Gönder
                  </button>
                </div>
              </div>

              {/* Bio Links Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>Web Sitesi</span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github.startsWith("http") ? profile.github : `https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <FolderGit2 className="w-4 h-4 text-purple-400" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter.startsWith("http") ? profile.twitter : `https://twitter.com/${profile.twitter.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Share2 className="w-4 h-4 text-sky-400" />
                    <span>Twitter (X)</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

            {/* Skills & Badges Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-[#09090F] border border-white/10 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Teknoloji & Yetenekler</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-purple-950/40 border border-purple-500/20 text-purple-200 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#09090F] border border-white/10 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 font-mono">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Kazanılan Başarılar & XP</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-xs text-gray-300">Profil Seviyesi:</span>
                    <span className="text-xs font-bold text-purple-400">{profile.badge || "Geliştirici"}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-xs text-gray-300">Toplam XP:</span>
                    <span className="text-xs font-mono font-bold text-amber-400">{profile.xp || 5420} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD PROFILE VIEW */
          <div className="space-y-6">
            {/* Profile Main Card */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#09090F]/90 border border-purple-500/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.15)] overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
                {/* Avatar with Badges */}
                <div className="relative shrink-0">
                  <img
                    src={profile.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${profile.username}`}
                    alt={profile.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-purple-500/50 shadow-2xl shadow-purple-950/80"
                  />
                  {profile.role === "admin" && (
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-purple-600 text-[10px] font-black tracking-wider uppercase text-white shadow-lg border border-purple-400">
                      ADMIN
                    </span>
                  )}
                </div>

                {/* Profile Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {profile.name}
                    </h1>
                    {profile.badge && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                        <span>{profile.badge}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-mono text-purple-400">@{profile.username}</p>

                  {profile.bio && (
                    <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed pt-1">
                      {profile.bio}
                    </p>
                  )}

                  {/* Meta Stats & Links */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                      <Trophy className="w-4 h-4" />
                      <span>{profile.role === "admin" ? "Kurucu" : `${profile.xp || 100} XP`}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDmOpen(true)}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors font-semibold cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Mesaj Gönder</span>
                    </button>

                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-purple-300 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{profile.website.replace(/^https?:\/\//, "")}</span>
                      </a>
                    )}

                    {profile.github && (
                      <a
                        href={profile.github.startsWith("http") ? profile.github : `https://github.com/${profile.github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:text-purple-300 transition-colors"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3 text-gray-500" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Technologies */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#09090F]/80 border border-white/10 backdrop-blur-xl space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Uzmanlık Becerileri & Teknolojiler</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-purple-200 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Community Activity Section */}
            <div className="p-6 rounded-2xl bg-[#09090F]/80 border border-white/10 backdrop-blur-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Topluluk Paylaşımları ({userPosts.length})</span>
              </h3>

              {userPosts.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">
                  Henüz toplulukta bir gönderi paylaşılmamış.
                </p>
              ) : (
                <div className="space-y-3">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-white">{post.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300">
                          {post.tag}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{post.body}</p>
                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                        <span>{formatTimeAgo(post.createdAt)}</span>
                        <span>{post.likes} Beğeni • {post.comments?.length || 0} Yorum</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DM Drawer */}
      <DirectMessageDrawer
        isOpen={isDmOpen}
        onClose={() => setIsDmOpen(false)}
        targetUsername={profile?.username}
        targetUser={profile ? {
          id: profile.id,
          name: profile.name,
          username: profile.username,
          avatar: profile.avatar,
          role: profile.role === "admin" ? "Kurucu & Admin" : (profile.badge || "Geliştirici"),
        } : undefined}
      />

      <Footer />
    </main>
  );
}
