"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Rocket, 
  Plus, 
  ExternalLink, 
  Flame, 
  Sparkles, 
  ThumbsUp, 
  Layers, 
  Search, 
  CheckCircle2, 
  X, 
  Globe, 
  FolderGit2, 
  Trophy, 
  Star,
  Award
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface ShowcaseProject {
  id: string;
  authorName: string;
  authorUsername: string;
  title: string;
  tagline: string;
  description: string;
  demoUrl: string;
  githubUrl: string;
  tags: string[];
  upvotes: number;
  upvotedByUserIds: string[];
  createdAt: string;
}

const INITIAL_PROJECTS: ShowcaseProject[] = [
  {
    id: "proj-1",
    authorName: "$",
    authorUsername: "siyah",
    title: "heycoderz Platform",
    tagline: "Geliştiriciler için hepsi bir arada açık kaynak ekosistem",
    description: "Next.js 16, React 19, TypeScript ve Tailwind CSS v4 ile inşa edilmiş ultra hızlı geliştirici üretkenlik platformu, 1v1 düellolar ve interaktif araç kiti.",
    demoUrl: "https://heycoderz.com",
    githubUrl: "https://github.com/heycoderz",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    upvotes: 64,
    upvotedByUserIds: ["admin-master", "user-1", "user-2"],
    createdAt: "Yeni",
  },
  {
    id: "proj-2",
    authorName: "Öykü",
    authorUsername: "oyku",
    title: "Aura UI Design Kit",
    tagline: "Fütüristik koyu tema React & Tailwind bileşen kütüphanesi",
    description: "Glassmorphism, gradient borderlar ve micro-interaction'lar ile donatılmış açık kaynak UI bileşenleri.",
    demoUrl: "https://heycoderz.com",
    githubUrl: "https://github.com/heycoderz",
    tags: ["UI/UX", "Tailwind CSS", "Figma", "React"],
    upvotes: 48,
    upvotedByUserIds: ["admin-oyku"],
    createdAt: "Yeni",
  },
  {
    id: "proj-3",
    authorName: "Caner",
    authorUsername: "caner_dev",
    title: "DevMetrics CLI",
    tagline: "Terminal tabanlı Docker ve API izleme aracı",
    description: "Go ve Rust tabanlı, anlık CPU, RAM ve mikroservis yanıt sürelerini terminalde görselleştiren açık kaynak CLI.",
    demoUrl: "https://github.com/heycoderz",
    githubUrl: "https://github.com/heycoderz",
    tags: ["Go", "Rust", "CLI", "Docker", "DevOps"],
    upvotes: 31,
    upvotedByUserIds: [],
    createdAt: "Bu Hafta",
  },
];

export default function ShowcasePage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ShowcaseProject[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"trending" | "top" | "new">("trending");
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDemo, setNewDemo] = useState("");
  const [newGithub, setNewGithub] = useState("");
  const [newTags, setNewTags] = useState("React, Next.js, TypeScript");

  useEffect(() => {
    const saved = localStorage.getItem("heycoderz_showcase_projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveProjects = (updated: ShowcaseProject[]) => {
    setProjects(updated);
    localStorage.setItem("heycoderz_showcase_projects", JSON.stringify(updated));
  };

  const handleUpvote = (id: string) => {
    const userId = user?.id || "guest-" + Date.now();
    const updated = projects.map((p) => {
      if (p.id === id) {
        const isUpvoted = p.upvotedByUserIds.includes(userId);
        const upvotedByUserIds = isUpvoted
          ? p.upvotedByUserIds.filter((u) => u !== userId)
          : [...p.upvotedByUserIds, userId];
        return {
          ...p,
          upvotes: upvotedByUserIds.length,
          upvotedByUserIds,
        };
      }
      return p;
    });
    saveProjects(updated);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTagline.trim()) return;

    const tagsArray = newTags.split(",").map((t) => t.trim()).filter(Boolean);
    const item: ShowcaseProject = {
      id: "proj-" + Date.now(),
      authorName: user?.name || "Geliştirici",
      authorUsername: user?.username || "dev",
      title: newTitle.trim(),
      tagline: newTagline.trim(),
      description: newDesc.trim(),
      demoUrl: newDemo.trim(),
      githubUrl: newGithub.trim(),
      tags: tagsArray,
      upvotes: 1,
      upvotedByUserIds: user ? [user.id] : [],
      createdAt: "Bugün",
    };

    const updated = [item, ...projects];
    saveProjects(updated);
    setModalOpen(false);

    setNewTitle("");
    setNewTagline("");
    setNewDesc("");
    setNewDemo("");
    setNewGithub("");
  };

  // Top project of the week (highest upvote)
  const spotlightProject = [...projects].sort((a, b) => b.upvotes - a.upvotes)[0];

  // Sorting
  const sortedProjects = [...projects].sort((a, b) => {
    if (activeTab === "trending" || activeTab === "top") {
      return b.upvotes - a.upvotes;
    }
    return 0; // "new" preserves insertion order
  });

  const filtered = sortedProjects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Rocket className="w-3.5 h-3.5" />
            <span>heycoderz Project Showcase & Upvotes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Geliştirici{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Proje Vitrini
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Açık kaynak projelerinizi ve SaaS ürünlerinizi sergileyin, Product Hunt tarzı upvote toplayarak haftanın projesi olun.
          </p>
        </div>

        {/* SPOTLIGHT: Haftanın 1.si Proje Kartı */}
        {spotlightProject && (
          <div className="relative rounded-3xl p-0.5 bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 shadow-[0_0_40px_rgba(245,158,11,0.25)]">
            <div className="p-6 sm:p-8 rounded-[23px] bg-[#09090F]/95 backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    👑 HAFTANIN 1. PROJESİ (SPOTLIGHT)
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    @{spotlightProject.authorUsername}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {spotlightProject.title}
                </h2>
                <p className="text-sm text-purple-300 font-medium">{spotlightProject.tagline}</p>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{spotlightProject.description}</p>
                
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {spotlightProject.tags.map((t) => (
                    <span key={t} className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-purple-200">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upvote & Action */}
              <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleUpvote(spotlightProject.id)}
                  className="w-full md:w-32 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer transition-all hover:scale-105"
                >
                  <ThumbsUp className="w-4 h-4 fill-white" />
                  <span>{spotlightProject.upvotes} Upvote</span>
                </button>

                {spotlightProject.demoUrl && (
                  <a
                    href={spotlightProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full md:w-32 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    Canlı Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Sorting Tabs */}
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("trending")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === "trending"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Haftanın Trendleri
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("top")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === "top"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              En Çok Oy Alanlar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === "new"
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              En Yeniler
            </button>
          </div>

          {/* Search & Add */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Projelerde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#08080E]/90 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Proje Ekle</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((proj) => {
            const isUpvoted = user && proj.upvotedByUserIds.includes(user.id);

            return (
              <div
                key={proj.id}
                className="p-6 sm:p-7 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{proj.title}</h3>
                      <p className="text-xs sm:text-sm text-purple-300 font-medium">{proj.tagline}</p>
                    </div>

                    {/* Upvote Button */}
                    <button
                      type="button"
                      onClick={() => handleUpvote(proj.id)}
                      className={`px-3.5 py-2 rounded-2xl border flex items-center gap-1.5 font-mono text-xs transition-all cursor-pointer ${
                        isUpvoted
                          ? "bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                          : "bg-white/[0.03] border-white/10 text-gray-300 hover:border-purple-500/40 hover:bg-white/5"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? "fill-white" : ""}`} />
                      <span className="font-bold">{proj.upvotes}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {proj.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-[11px] font-mono text-purple-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span>Geliştirici:</span>
                    <Link
                      href={`/${proj.authorUsername}`}
                      className="text-white hover:text-purple-400 font-medium transition-colors"
                    >
                      @{proj.authorUsername}
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors font-medium"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Canlı Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* New Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-3xl bg-[#09090F] border border-purple-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-purple-400" />
                Vitrinde Yeni Proje Yayınla
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Proje Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Aura UI"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Kısa Başlık / Slogan (Tagline)</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Fütüristik koyu tema React bileşen kütüphanesi"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Açıklama</label>
                <textarea
                  rows={3}
                  placeholder="Projeniz ne işe yarıyor, hangi teknolojileri kullandınız?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-mono">Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newDemo}
                    onChange={(e) => setNewDemo(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-mono">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Etiketler (Virgülle ayırın)</label>
                <input
                  type="text"
                  placeholder="React, Next.js, Tailwind, TypeScript"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Vitrinde Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
