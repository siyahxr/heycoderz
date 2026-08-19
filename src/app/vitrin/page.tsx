"use client";

import React, { useState, useEffect } from "react";
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
  FolderGit2
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
    authorName: "Efe Taşkın",
    authorUsername: "efe",
    title: "heycoderz Platform",
    tagline: "Geliştiriciler için hepsi bir arada açık kaynak ekosistem",
    description: "Next.js 16, React 19, TypeScript ve Tailwind CSS v4 ile inşa edilmiş ultra hızlı geliştirici üretkenlik platformu.",
    demoUrl: "https://heycoderz.com",
    githubUrl: "https://github.com/heycoderz",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    upvotes: 48,
    upvotedByUserIds: ["admin-master"],
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
    upvotes: 36,
    upvotedByUserIds: [],
    createdAt: "Yeni",
  },
];

export default function ShowcasePage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ShowcaseProject[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Rocket className="w-3.5 h-3.5" />
            <span>heycoderz Project Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Geliştirici{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Proje Vitrini
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Açık kaynak projelerinizi, SaaS ürünlerinizi ve araçlarınızı sergileyin, topluluktan oy ve geri bildirim toplayın.
          </p>
        </div>

        {/* Action & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Projelerde veya etiketlerde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#08080E]/90 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Kendi Projeni Ekle</span>
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((proj) => {
            const isUpvoted = user && proj.upvotedByUserIds.includes(user.id);

            return (
              <div
                key={proj.id}
                className="p-6 sm:p-7 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between"
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
                          : "bg-white/[0.03] border-white/10 text-gray-300 hover:border-purple-500/40"
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
                    <span className="font-bold text-white">@{proj.authorUsername}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-white flex items-center gap-1"
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
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                      >
                        <span>Canlı Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Add New Project */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-xl bg-[#09090F] border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-5">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono">
                <Rocket className="w-4 h-4" />
                <span>heycoderz Vitrinine Proje Ekle</span>
              </div>

              <h2 className="text-xl font-bold text-white">Projenizi Tanıtın</h2>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Proje Başlığı</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Örn: NextAuth Starter Kit"
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Kısa Slogan (Tagline)</label>
                  <input
                    type="text"
                    required
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    placeholder="Örn: Next.js 16 için hazır kimlik doğrulama şablonu"
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Detaylı Açıklama</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Projenin temel özellikleri ve ne işe yaradığı..."
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl p-4 text-xs sm:text-sm text-white outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Canlı Demo URL</label>
                    <input
                      type="url"
                      value={newDemo}
                      onChange={(e) => setNewDemo(e.target.value)}
                      placeholder="https://projeniz.com"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">GitHub Repo URL</label>
                    <input
                      type="url"
                      value={newGithub}
                      onChange={(e) => setNewGithub(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Teknolojiler (Virgülle ayırın)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Next.js, TypeScript, Tailwind, PostgreSQL"
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-xs text-gray-300"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg"
                  >
                    Vitrine Ekle & Yayınla
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
