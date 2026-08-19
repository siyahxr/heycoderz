"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import {
  Compass,
  Search,
  Users,
  ShieldCheck,
  Sparkles,
  Trophy,
  Globe,
  ExternalLink,
  Code2,
  Share2,
  RefreshCw,
  Flame,
  UserPlus
} from "lucide-react";
import { UserProfile, BASE_MAIN_USER, BASE_OYKU } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function KesfetPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "admin" | "new" | "top_xp">("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/sync");
      const data = await res.json();
      if (data?.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        // Fallback to local default users
        setUsers([BASE_MAIN_USER, BASE_OYKU]);
      }
    } catch {
      setUsers([BASE_MAIN_USER, BASE_OYKU]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // Filter & Search Logic
  const filteredUsers = users
    .filter((u) => {
      // Exclude any legacy efe references
      if (u.username === "efe" || u.email === "efeabsteam@gmail.com") return false;

      // Filter tabs
      if (activeFilter === "admin") return u.role === "admin";
      if (activeFilter === "new") return u.joinedAt?.includes("Bugün") || u.joinedAt?.includes("Yeni") || u.id.startsWith("usr-");
      return true;
    })
    .filter((u) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const nameMatch = u.name?.toLowerCase().includes(q);
      const usernameMatch = u.username?.toLowerCase().includes(q);
      const bioMatch = u.bio?.toLowerCase().includes(q);
      const skillMatch = u.skills?.some((s) => s.toLowerCase().includes(q));
      return nameMatch || usernameMatch || bioMatch || skillMatch;
    })
    .sort((a, b) => {
      if (activeFilter === "top_xp") {
        return (b.xp || 0) - (a.xp || 0);
      }
      // Admins first, then by joined order (newest first)
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (b.role === "admin" && a.role !== "admin") return 1;
      return 0;
    });

  const totalMembers = users.filter((u) => u.username !== "efe").length;
  const adminCount = users.filter((u) => u.role === "admin" && u.username !== "efe").length;

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col justify-between selection:bg-purple-500/30">
      <BackgroundEffects />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-xl">
            <Compass className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            <span>{t("explore.badge")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {t("explore.titlePrefix")}{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              {t("explore.titleHighlight")}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            {t("explore.description")}
          </p>

          {/* Quick Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-gray-400">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
              <Users className="w-4 h-4 text-purple-400" />
              <span>{t("explore.totalMembers")}: <strong className="text-white font-mono">{totalMembers}</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t("explore.management")}: <strong className="text-white font-mono">{adminCount}</strong></span>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
              title={t("common.refresh")}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-purple-400" : ""}`} />
              <span>{t("common.refresh")}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("explore.searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto justify-start sm:justify-end">
            {[
              { id: "all", label: t("explore.filterAll") },
              { id: "admin", label: t("explore.filterAdmin") },
              { id: "new", label: t("explore.filterNew") },
              { id: "top_xp", label: t("explore.filterTopXp") },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40"
                    : "bg-white/[0.03] text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Developers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-[#09090F]/60 border border-white/10 animate-pulse p-6 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/10 rounded w-24" />
                    <div className="h-3 bg-white/5 rounded w-16" />
                  </div>
                </div>
                <div className="h-10 bg-white/5 rounded-xl" />
                <div className="h-6 bg-white/5 rounded-lg w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[#09090F]/60 border border-white/10 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold">Kullanıcı Bulunamadı</h3>
            <p className="text-xs text-gray-400">
              Arama kriterinize uygun bir geliştirici profili bulunamadı. Aramayı temizlemeyi deneyin.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-medium text-white transition-all cursor-pointer"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((dev) => {
              const profileUrl = `/@${dev.username}`;
              const isFounder = dev.role === "admin";

              return (
                <div
                  key={dev.id || dev.username}
                  className="group relative p-6 rounded-3xl bg-[#09090F]/80 hover:bg-[#09090F] border border-white/10 hover:border-purple-500/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.15)] flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Glow on Hover */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-600/10 group-hover:bg-purple-600/20 rounded-full blur-2xl transition-all pointer-events-none" />

                  <div className="space-y-4 relative z-10">
                    {/* Header: Avatar + Badges */}
                    <div className="flex items-start gap-4">
                      <Link href={profileUrl} className="relative shrink-0 cursor-pointer block">
                        <img
                          src={dev.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${dev.username}`}
                          alt={dev.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-purple-500/30 group-hover:border-purple-400/70 transition-all shadow-lg"
                        />
                        {isFounder && (
                          <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded bg-purple-600 text-[9px] font-extrabold uppercase text-white shadow-md border border-purple-400">
                            ADMIN
                          </span>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={profileUrl}
                            className="text-base font-bold text-white hover:text-purple-300 transition-colors truncate block"
                          >
                            {dev.name}
                          </Link>
                          {dev.badge && (
                            <span title={dev.badge}>
                              <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-mono text-purple-400/90 truncate">@{dev.username}</p>

                        <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1 text-amber-400 font-medium">
                            <Trophy className="w-3 h-3" />
                            <span>{isFounder ? "Kurucu" : `${dev.xp || 100} XP`}</span>
                          </span>
                          <span>•</span>
                          <span className="text-gray-500 truncate">{dev.joinedAt || "Topluluk"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed min-h-[32px]">
                      {dev.bio || "heycoderz geliştirici topluluğu üyesi."}
                    </p>

                    {/* Skills */}
                    {dev.skills && dev.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {dev.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-purple-200 text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {dev.skills.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded-lg bg-white/5 text-gray-400 text-[10px]">
                            +{dev.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-2">
                      {dev.github && (
                        <a
                          href={dev.github.startsWith("http") ? dev.github : `https://github.com/${dev.github}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="GitHub"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {dev.website && (
                        <a
                          href={dev.website}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Website"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {dev.twitter && (
                        <a
                          href={dev.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Twitter"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <Link
                      href={profileUrl}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 hover:border-purple-500 text-purple-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                    >
                      <span>{t("common.viewProfile")}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
