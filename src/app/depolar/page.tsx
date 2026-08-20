"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  GitBranch, 
  Search, 
  Plus, 
  Sparkles, 
  Star, 
  GitFork, 
  FolderGit2, 
  SlidersHorizontal,
  Flame,
  Terminal,
  Code2,
  Cpu,
  Layers,
  Wrench,
  Gamepad2
} from "lucide-react";
import { useRepo } from "@/context/RepoContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { RepoCard } from "@/components/repo/RepoCard";
import { CreateRepoModal } from "@/components/repo/CreateRepoModal";

export default function DepolarPage() {
  const { repositories } = useRepo();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"stars" | "latest" | "forks">("stars");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categories = [
    { id: "all", label: t("repo.filterAll"), icon: FolderGit2 },
    { id: "web", label: t("repo.filterWeb"), icon: Code2 },
    { id: "backend", label: t("repo.filterBackend"), icon: Terminal },
    { id: "ai", label: t("repo.filterAi"), icon: Cpu },
    { id: "tools", label: t("repo.filterTools"), icon: Wrench },
    { id: "games", label: t("repo.filterGames"), icon: Gamepad2 },
  ];

  const languages = [
    "all",
    "TypeScript",
    "JavaScript",
    "Python",
    "Rust",
    "CSS",
    "HTML",
    "Go",
    "C++",
  ];

  // Filter & Sort logic
  const filteredRepos = repositories
    .filter((repo) => {
      // Category filter
      if (selectedCategory !== "all" && repo.category !== selectedCategory) {
        return false;
      }
      // Language filter
      if (selectedLanguage !== "all" && repo.primaryLanguage !== selectedLanguage) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = repo.name.toLowerCase().includes(q);
        const matchesDesc = repo.description.toLowerCase().includes(q);
        const matchesAuthor = repo.author.username.toLowerCase().includes(q) || repo.author.name.toLowerCase().includes(q);
        const matchesTag = repo.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchesLang = repo.primaryLanguage.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesAuthor || matchesTag || matchesLang;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "stars") return b.stars - a.stars;
      if (sortBy === "forks") return b.forks - a.forks;
      const dateA = typeof a.updatedAt === "number" ? a.updatedAt : Date.parse(a.updatedAt as string) || 0;
      const dateB = typeof b.updatedAt === "number" ? b.updatedAt : Date.parse(b.updatedAt as string) || 0;
      return dateB - dateA;
    });

  // Calculate Quick Stats
  const totalStars = repositories.reduce((acc, r) => acc + r.stars, 0);
  const totalFiles = repositories.reduce((acc, r) => acc + r.files.length, 0);

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_20px_rgba(139,92,246,0.25)]">
            <GitBranch className="w-3.5 h-3.5" />
            <span>{t("repo.badge")}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t("repo.titlePrefix")}{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              {t("repo.titleHighlight")}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {t("repo.subtitle")}
          </p>

          {/* Quick Platform Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <strong className="text-white font-mono">{repositories.length}</strong> Depo
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <strong className="text-white font-mono">{totalFiles}</strong> Dosya
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <strong className="text-white font-mono">{totalStars}</strong> Toplam Yıldız
            </div>
          </div>
        </div>

        {/* Action & Search Controls Bar */}
        <div className="space-y-4 mb-8">
          
          {/* Top Controls: Search + New Repo Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("repo.searchPlaceholder")}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#09090F]/90 border border-white/10 hover:border-purple-500/30 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-lg transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  Temizle
                </button>
              )}
            </div>

            {/* Sort Filter Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 rounded-2xl bg-[#09090F]/90 border border-white/10 text-gray-300 text-xs sm:text-sm focus:outline-none focus:border-purple-500 shadow-lg transition-all cursor-pointer"
              >
                <option value="stars">⭐ {t("repo.sortStarred")}</option>
                <option value="latest">⚡ {t("repo.sortLatest")}</option>
                <option value="forks">🔱 {t("repo.sortForked")}</option>
              </select>

              {/* Create New Repo CTA */}
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_35px_rgba(139,92,246,0.5)] transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{t("repo.newRepo")}</span>
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-[0_0_15px_rgba(139,92,246,0.25)] font-semibold"
                      : "bg-white/[0.03] text-gray-400 hover:text-white border border-white/10 hover:border-purple-500/30"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Languages Chips Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[11px] font-mono text-gray-500 mr-1 shrink-0">Dil:</span>
            {languages.map((lang) => {
              const isActive = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-purple-950/60 text-purple-300 border border-purple-500/40 font-bold"
                      : "bg-white/[0.02] text-gray-400 hover:text-gray-200 border border-white/[0.06]"
                  }`}
                >
                  {lang === "all" ? t("common.all") : lang}
                </button>
              );
            })}
          </div>

        </div>

        {/* Repositories Grid */}
        {filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-3xl bg-[#09090F]/60 border border-white/[0.08] space-y-4">
            <FolderGit2 className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">
              {t("repo.notFound")}
            </h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              {t("repo.notFoundDesc")}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedLanguage("all");
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium transition-all"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

      </main>

      {/* New Repository Modal */}
      <CreateRepoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
