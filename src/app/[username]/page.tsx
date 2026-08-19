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
import { UserProfile, useAuth } from "@/context/AuthContext";
import { useCommunity } from "@/context/CommunityContext";

export default function PublicProfilePage() {
  const params = useParams();
  const rawUsername = params?.username as string;
  const username = rawUsername ? decodeURIComponent(rawUsername).replace(/^@/, "").toLowerCase() : "";
  
  const { user: currentUser } = useAuth();
  const { posts } = useCommunity();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    // 1. Check if it's the Admin user (@efe)
    if (username === "efe" || username === "efecan" || username === "admin") {
      let activeAdmin: UserProfile = {
        id: "admin-master",
        name: "Efe Taşkın",
        username: "efe",
        email: "efeabsteam@gmail.com",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=1787085332805",
        role: "admin",
        badge: "Kurucu & Admin",
        bio: "heycoderz kurucusu. Açık kaynak aşığı, Next.js, React ve Cloud mimarisi geliştiricisi.",
        website: "https://heycoderz.com",
        github: "https://github.com/heycoderz",
        twitter: "https://twitter.com/heycoderz",
        linkedin: "https://linkedin.com/company/heycoderz",
        skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Cloud Architecture"],
        xp: 5420,
        joinedAt: "Ocak 2026",
      };

      try {
        const customSaved = localStorage.getItem("heycoderz_admin_profile_custom");
        if (customSaved) {
          activeAdmin = { ...activeAdmin, ...JSON.parse(customSaved) };
        }
        const activeUserStr = localStorage.getItem("heycoderz_active_user");
        if (activeUserStr) {
          const parsed = JSON.parse(activeUserStr);
          if (parsed.username === "efe" || parsed.email === "efeabsteam@gmail.com") {
            activeAdmin = { ...activeAdmin, ...parsed };
          }
        }
      } catch (e) {}

      setProfile(activeAdmin);
      setLoading(false);
      return;
    }

    // 2. Check if it's Co-founder Öykü (@oyku)
    if (username === "oyku" || username === "öykü") {
      let activeOyku: UserProfile = {
        id: "admin-oyku",
        name: "Öykü",
        username: "oyku",
        email: "oyku@heycoderz.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        role: "admin",
        badge: "Kurucu Ortak & Admin",
        bio: "heycoderz kurucu ortağı. UI/UX mimarisi, modern tasarım sistemleri ve Frontend geliştiricisi.",
        website: "https://heycoderz.com",
        github: "https://github.com/heycoderz",
        twitter: "https://twitter.com/heycoderz",
        linkedin: "https://linkedin.com/company/heycoderz",
        skills: ["UI/UX Design", "Design Systems", "React", "Next.js", "Tailwind CSS", "Figma"],
        xp: 5420,
        joinedAt: "Ocak 2026",
      };

      try {
        const customSaved = localStorage.getItem("heycoderz_oyku_profile_custom");
        if (customSaved) {
          activeOyku = { ...activeOyku, ...JSON.parse(customSaved) };
        }
        const activeUserStr = localStorage.getItem("heycoderz_active_user");
        if (activeUserStr) {
          const parsed = JSON.parse(activeUserStr);
          if (parsed.username === "oyku" || parsed.email === "oyku@heycoderz.com") {
            activeOyku = { ...activeOyku, ...parsed };
          }
        }
      } catch (e) {}

      setProfile(activeOyku);
      setLoading(false);
      return;
    }

    // 3. Check registered users
    const registeredUsersStr = localStorage.getItem("heycoderz_registered_users");
    if (registeredUsersStr) {
      try {
        const registeredUsers = JSON.parse(registeredUsersStr);
        const found = registeredUsers.find(
          (u: any) => u.username.toLowerCase() === username
        );
        if (found) {
          setProfile(found);
          setLoading(false);
          return;
        }
      } catch (e) {}
    }

    // 4. If currently logged in user matches
    if (currentUser && currentUser.username.toLowerCase() === username) {
      setProfile(currentUser);
      setLoading(false);
      return;
    }

    setProfile(null);
    setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
        <BackgroundEffects />
        <Navbar />
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md p-8 rounded-3xl bg-[#09090F]/90 border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-gray-500">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Geliştirici Bulunamadı</h1>
            <p className="text-xs text-gray-400">
              <span className="font-mono text-purple-300">@{username}</span> adına sahip bir heycoderz profili mevcut değil.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anasayfaya Dön</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        
        {/* Top Back & Share Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/topluluk"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Topluluğa Dön</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-gray-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Kopyalandı!" : "Profili Paylaş"}</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#09090F]/95 border border-purple-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(139,92,246,0.18)] mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <div className="relative">
              <img
                src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={profile.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-purple-500 shadow-[0_0_25px_rgba(139,92,246,0.35)] bg-black/80"
              />
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-lg bg-purple-600 text-[10px] font-bold text-white shadow-lg">
                {profile.role === "admin" ? "ADMIN" : "GELİŞTİRİCİ"}
              </span>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profile.name}
                </h1>
                <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {profile.role === "admin" ? "Kurucu & Admin" : "Geliştirici"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-purple-400 font-mono font-semibold">
                <span>@{profile.username}</span>
              </div>

              {profile.bio && (
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1 max-w-2xl">
                  {profile.bio}
                </p>
              )}

              {/* Social Links & Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                <span className="flex items-center gap-1 text-purple-300 font-mono">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  {profile.role === "admin" ? "Kurucu" : `${profile.xp || 100} XP`}
                </span>

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-gray-400 hover:text-purple-300 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{profile.website.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}

                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {profile.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-pink-400/90 hover:text-pink-300 transition-colors"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="p-6 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] mb-8 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Uzmanlık Becerileri & Teknolojiler</span>
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Community Contributions by User */}
        <div className="p-6 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Topluluk Paylaşımları ({userPosts.length})</span>
          </h3>

          {userPosts.length === 0 ? (
            <p className="text-xs text-gray-500 font-mono py-4 text-center">
              Bu geliştirici henüz bir tartışma başlatmadı.
            </p>
          ) : (
            <div className="space-y-3">
              {userPosts.map((post) => (
                <Link
                  key={post.id}
                  href="/topluluk"
                  className="block p-4 rounded-2xl bg-black/50 border border-white/[0.05] hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white">{post.title}</span>
                    <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/20">
                      {post.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{post.body}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
