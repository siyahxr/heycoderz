"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
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
  ExternalLink
} from "lucide-react";
import { UserProfile, useAuth, BASE_MAIN_USER, BASE_OYKU } from "@/context/AuthContext";
import { useCommunity, formatTimeAgo } from "@/context/CommunityContext";
import { useRepo } from "@/context/RepoContext";
import { useLanguage } from "@/context/LanguageContext";
import { RepoCard } from "@/components/repo/RepoCard";
import { FolderGit2 } from "lucide-react";

export default function PublicProfilePage() {
  const params = useParams();
  const rawUsername = params?.username as string;
  const username = rawUsername ? decodeURIComponent(rawUsername).replace(/^@/, "").toLowerCase() : "";
  
  const { user: currentUser } = useAuth();
  const { posts } = useCommunity();
  const { repositories } = useRepo();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

    // Redirect legacy efe profile to new $ / siyah profile and clear old cache
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

  // User's repositories
  const userRepos = repositories.filter(
    (r) =>
      r.author.username.toLowerCase() === username ||
      (profile && r.author.id === profile.id) ||
      (username === "siyah" && (r.author.username === "siyah" || r.author.id === "admin-siyah")) ||
      (username === "$" && (r.author.username === "siyah" || r.author.id === "admin-siyah")) ||
      (username === "oyku" && (r.author.username === "oyku" || r.author.id === "user-oyku"))
  );

  // User's community posts
  const userPosts = posts.filter(
    (p) => p.authorUsername.toLowerCase() === username || (profile && p.authorId === profile.id)
  );

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col justify-between selection:bg-purple-500/30">
      <BackgroundEffects />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/topluluk"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Topluluğa Dön</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Kopyalandı!" : "Profili Paylaş"}</span>
          </button>
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
        ) : (
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

            {/* Repositories Section */}
            <div className="p-6 rounded-2xl bg-[#09090F]/80 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>Kod Depoları & Projeler ({userRepos.length})</span>
                </h3>
                <Link
                  href="/depolar"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 font-medium"
                >
                  <span>Tüm Depoları Gör</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {userRepos.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">
                  Henüz paylaşılan bir kod deposu bulunmuyor.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userRepos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              )}
            </div>

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

      <Footer />
    </main>
  );
}
