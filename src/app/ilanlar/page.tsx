"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  Plus, 
  Search, 
  DollarSign, 
  ExternalLink, 
  Clock, 
  Sparkles,
  X,
  Send
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface JobListing {
  id: string;
  company: string;
  role: string;
  type: "Tam Zamanlı" | "Yarı Zamanlı" | "Freelance" | "Staj";
  location: "Uzaktan (Remote)" | "Hibrit" | "İstanbul" | "Ankara" | "İzmir";
  salary?: string;
  description: string;
  tags: string[];
  applyUrl: string;
  createdAt: string;
}

const INITIAL_JOBS: JobListing[] = [
  {
    id: "job-1",
    company: "heycoderz Labs",
    role: "Kıdemli Fullstack Next.js Geliştirici",
    type: "Tam Zamanlı",
    location: "Uzaktan (Remote)",
    salary: "$3,500 - $5,000 / ay",
    description: "Next.js 16, React 19, Tailwind CSS ve Cloudflare altyapımızda yeni nesil geliştirici araçları geliştirecek deneyimli mühendis arıyoruz.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js"],
    applyUrl: "mailto:kariyer@heycoderz.com",
    createdAt: "Yeni",
  },
  {
    id: "job-2",
    company: "Aura Tech",
    role: "Frontend & UI/UX Tasarımcı",
    type: "Freelance",
    location: "Uzaktan (Remote)",
    salary: "Proje Bazlı / $1,500+",
    description: "Modern SaaS dashboard ve landing page arayüzleri için Figma ve Tailwind CSS bilen yetenekli tasarımcı & geliştirici.",
    tags: ["Figma", "UI/UX", "Tailwind CSS", "React"],
    applyUrl: "mailto:oyku@heycoderz.com",
    createdAt: "1 gün önce",
  },
  {
    id: "job-3",
    company: "CloudScale Inc.",
    role: "Junior / Stajyer Backend Geliştirici",
    type: "Staj",
    location: "Uzaktan (Remote)",
    salary: "Staj Ücreti + Mentörlük",
    description: "Node.js, PostgreSQL ve REST API mimarilerini öğrenmek ve gerçek projelere katkı sağlamak isteyen yeni mezunlar ve öğrenciler için harika bir fırsat.",
    tags: ["Node.js", "PostgreSQL", "REST API", "Docker"],
    applyUrl: "mailto:staj@heycoderz.com",
    createdAt: "3 gün önce",
  },
];

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>(INITIAL_JOBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newType, setNewType] = useState<any>("Tam Zamanlı");
  const [newLocation, setNewLocation] = useState<any>("Uzaktan (Remote)");
  const [newSalary, setNewSalary] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTags, setNewTags] = useState("React, TypeScript");
  const [newApply, setNewApply] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("heycoderz_job_listings");
    if (saved) {
      try {
        setJobs(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveJobs = (updated: JobListing[]) => {
    setJobs(updated);
    localStorage.setItem("heycoderz_job_listings", JSON.stringify(updated));
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim() || !newApply.trim()) return;

    const tagsArray = newTags.split(",").map((t) => t.trim()).filter(Boolean);
    const item: JobListing = {
      id: "job-" + Date.now(),
      company: newCompany.trim(),
      role: newRole.trim(),
      type: newType,
      location: newLocation,
      salary: newSalary.trim() || undefined,
      description: newDesc.trim(),
      tags: tagsArray,
      applyUrl: newApply.trim(),
      createdAt: "Bugün",
    };

    const updated = [item, ...jobs];
    saveJobs(updated);
    setModalOpen(false);

    setNewCompany("");
    setNewRole("");
    setNewSalary("");
    setNewDesc("");
    setNewApply("");
  };

  const filtered = jobs.filter((j) => {
    const matchType = typeFilter === "all" || j.type === typeFilter;
    const matchQuery =
      j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchQuery;
  });

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Briefcase className="w-3.5 h-3.5" />
            <span>heycoderz Developer Jobs & Bounties</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Geliştirici İş &{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Freelance İlanları
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Yazılımcılar için uzaktan (remote), tam zamanlı veya freelance proje fırsatları.
          </p>
        </div>

        {/* Action & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {["all", "Tam Zamanlı", "Freelance", "Staj"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  typeFilter === t
                    ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                    : "bg-[#08080E]/90 text-gray-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                {t === "all" ? "Tüm İlanlar" : t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pozisyon veya teknoloji ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#08080E]/90 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>İlan Paylaş</span>
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {job.company}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[10px] font-mono">
                    {job.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-gray-400 text-[10px] font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {job.location}
                  </span>
                  {job.salary && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                      {job.salary}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white">{job.role}</h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-2xl line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/[0.05] text-[10px] font-mono text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Hemen Başvur</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Add New Job */}
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
                <Briefcase className="w-4 h-4" />
                <span>heycoderz İlan Panosu</span>
              </div>

              <h2 className="text-xl font-bold text-white">Yeni Geliştirici İlanı Oluştur</h2>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Şirket / Proje Adı</label>
                    <input
                      type="text"
                      required
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="Örn: heycoderz Labs"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Pozisyon / Rol</label>
                    <input
                      type="text"
                      required
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="Örn: Senior React Developer"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Çalışma Şekli</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 text-xs text-purple-300 rounded-xl px-4 py-2 outline-none cursor-pointer"
                    >
                      <option value="Tam Zamanlı">Tam Zamanlı</option>
                      <option value="Yarı Zamanlı">Yarı Zamanlı</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Staj">Staj</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Lokasyon</label>
                    <select
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 text-xs text-purple-300 rounded-xl px-4 py-2 outline-none cursor-pointer"
                    >
                      <option value="Uzaktan (Remote)">Uzaktan (Remote)</option>
                      <option value="Hibrit">Hibrit</option>
                      <option value="İstanbul">İstanbul</option>
                      <option value="Ankara">Ankara</option>
                      <option value="İzmir">İzmir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Maaş / Ücret Bilgisi (Opsiyonel)</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="Örn: 60.000 TL - 90.000 TL veya $2,500 / ay"
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Açıklama & Nitelikler</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Aradığınız deneyim, sorumluluklar..."
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl p-3 text-xs text-white outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Teknolojiler (Virgülle ayırın)</label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="React, Next.js, TypeScript"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2 text-xs font-mono text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Başvuru E-posta veya Linki</label>
                    <input
                      type="text"
                      required
                      value={newApply}
                      onChange={(e) => setNewApply(e.target.value)}
                      placeholder="mailto:kariyer@sirket.com veya https://..."
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2 text-xs font-mono text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-xs text-gray-300"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg"
                  >
                    İlanı Yayınla
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
