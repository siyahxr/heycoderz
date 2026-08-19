"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Code2, 
  Search, 
  Copy, 
  Check, 
  Plus, 
  ThumbsUp, 
  Bookmark, 
  Sparkles, 
  Layers, 
  Terminal, 
  Tag, 
  X, 
  Share2, 
  Flame 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface CodeSnippet {
  id: string;
  title: string;
  category: "React & Next.js" | "Tailwind & CSS" | "TypeScript & JS" | "Backend & Node" | "Docker & DevOps" | "Database & SQL";
  language: string;
  description: string;
  code: string;
  authorName: string;
  authorUsername: string;
  tags: string[];
  likes: number;
  likedByUserIds: string[];
  createdAt: string;
}

const INITIAL_SNIPPETS: CodeSnippet[] = [
  {
    id: "snip-1",
    title: "useDebounce Hook (TypeScript & React 19)",
    category: "React & Next.js",
    language: "typescript",
    description: "Arama kutuları ve API isteklerini geciktirerek gereksiz render'ları önleyen tip güvenli React hook'u.",
    code: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}`,
    authorName: "$",
    authorUsername: "siyah",
    tags: ["React", "Hooks", "TypeScript", "Performance"],
    likes: 42,
    likedByUserIds: ["admin-master"],
    createdAt: "Yeni",
  },
  {
    id: "snip-2",
    title: "Fütüristik Neon Glow & Gradient Border (Tailwind v4)",
    category: "Tailwind & CSS",
    language: "html",
    description: "Parlayan neon gradyan çerçeve ve cam efektli modern kart bileşeni.",
    code: `<div class="relative group p-0.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300">
  <div class="p-6 rounded-2xl bg-[#09090F]/90 backdrop-blur-xl border border-white/10 text-white">
    <h3 class="text-lg font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
      heycoderz Glow Card
    </h3>
    <p class="text-xs text-gray-400 mt-1">Ultra modern Tailwind CSS bileşeni.</p>
  </div>
</div>`,
    authorName: "Öykü",
    authorUsername: "oyku",
    tags: ["Tailwind", "CSS", "UI", "Glassmorphism"],
    likes: 38,
    likedByUserIds: [],
    createdAt: "Yeni",
  },
  {
    id: "snip-3",
    title: "Next.js 16 Server Action Güvenli İstek Sarıcı",
    category: "Backend & Node",
    language: "typescript",
    description: "Try/catch, yetkilendirme ve tip doğrulamasını standartlaştıran Action sarmalayıcısı.",
    code: `export type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: number };

export async function createSafeAction<TInput, TOutput>(
  schemaValidation: (input: TInput) => boolean,
  actionFn: (input: TInput) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionResponse<TOutput>> => {
    try {
      if (!schemaValidation(input)) {
        return { success: false, error: "Geçersiz giriş parametreleri." };
      }
      const data = await actionFn(input);
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || "Bilinmeyen sunucu hatası." };
    }
  };
}`,
    authorName: "$",
    authorUsername: "siyah",
    tags: ["Next.js", "Server Actions", "TypeScript", "Backend"],
    likes: 29,
    likedByUserIds: [],
    createdAt: "Yeni",
  },
  {
    id: "snip-4",
    title: "Next.js İçin Multi-stage Dockerfile",
    category: "Docker & DevOps",
    language: "dockerfile",
    description: "Production ortamı için optimize edilmiş, standalone çıktı üreten hafif Dockerfile.",
    code: `FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]`,
    authorName: "$",
    authorUsername: "siyah",
    tags: ["Docker", "DevOps", "Production", "Next.js"],
    likes: 34,
    likedByUserIds: [],
    createdAt: "Yeni",
  },
  {
    id: "snip-5",
    title: "PostgreSQL Hızlı İndeks ve Boyut Sorgusu",
    category: "Database & SQL",
    language: "sql",
    description: "Veritabanındaki tüm tabloların ve indekslerin disk kullanım boyutlarını listeleyen SQL sorgusu.",
    code: `SELECT
  relname AS table_name,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
  pg_size_pretty(pg_relation_size(relid)) AS table_size,
  pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS index_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 20;`,
    authorName: "Öykü",
    authorUsername: "oyku",
    tags: ["PostgreSQL", "SQL", "Database", "Performance"],
    likes: 21,
    likedByUserIds: [],
    createdAt: "Yeni",
  },
];

const CATEGORIES = [
  "Tümü",
  "React & Next.js",
  "Tailwind & CSS",
  "TypeScript & JS",
  "Backend & Node",
  "Docker & DevOps",
  "Database & SQL",
] as const;

export default function SnippetHubPage() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<CodeSnippet[]>(INITIAL_SNIPPETS);
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Snippet Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalCategory, setModalCategory] = useState<CodeSnippet["category"]>("React & Next.js");
  const [modalLanguage, setModalLanguage] = useState("typescript");
  const [modalDescription, setModalDescription] = useState("");
  const [modalCode, setModalCode] = useState("");
  const [modalTags, setModalTags] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("heycoderz_custom_snippets");
      if (saved) {
        setSnippets([...INITIAL_SNIPPETS, ...JSON.parse(saved)]);
      }
    } catch {}
  }, []);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleLike = (id: string) => {
    const userId = user?.id || "guest";
    setSnippets((prev) =>
      prev.map((snip) => {
        if (snip.id !== id) return snip;
        const alreadyLiked = snip.likedByUserIds.includes(userId);
        return {
          ...snip,
          likes: alreadyLiked ? snip.likes - 1 : snip.likes + 1,
          likedByUserIds: alreadyLiked
            ? snip.likedByUserIds.filter((uid) => uid !== userId)
            : [...snip.likedByUserIds, userId],
        };
      })
    );
  };

  const handleCreateSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim() || !modalCode.trim()) return;

    const newSnippet: CodeSnippet = {
      id: "snip-" + Date.now(),
      title: modalTitle.trim(),
      category: modalCategory,
      language: modalLanguage.trim().toLowerCase(),
      description: modalDescription.trim(),
      code: modalCode.trim(),
      authorName: user?.name || "Anonim Coder",
      authorUsername: user?.username || "coder",
      tags: modalTags
        ? modalTags.split(",").map((t) => t.trim()).filter(Boolean)
        : [modalCategory],
      likes: 1,
      likedByUserIds: user ? [user.id] : [],
      createdAt: "Az önce",
    };

    const updated = [newSnippet, ...snippets];
    setSnippets(updated);

    try {
      const customSaved = updated.filter((s) => !INITIAL_SNIPPETS.some((init) => init.id === s.id));
      localStorage.setItem("heycoderz_custom_snippets", JSON.stringify(customSaved));
    } catch {}

    // Reset
    setModalTitle("");
    setModalDescription("");
    setModalCode("");
    setModalTags("");
    setIsModalOpen(false);
  };

  const filteredSnippets = snippets.filter((snip) => {
    const matchesCat = activeCategory === "Tümü" || snip.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      snip.title.toLowerCase().includes(q) ||
      snip.description.toLowerCase().includes(q) ||
      snip.tags.some((t) => t.toLowerCase().includes(q)) ||
      snip.language.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Code2 className="w-3.5 h-3.5" />
              <span>heycoderz Snippet & Kod Kütüphanesi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Hazır Kod &{" "}
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                Snippet Deposu
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Modern frontend bileşenleri, kullanışlı hook&apos;lar, Docker şablonları ve backend yardımcı fonksiyonlarını tek tıkla kopyalayın veya kendi snippet&apos;ınızı paylaşın.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Snippet Paylaş
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Başlık, etiket veya dil ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <span className="text-xs font-mono text-gray-400">
              {filteredSnippets.length} kod parçacığı bulundu
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-500"
                    : "bg-[#09090F] text-gray-400 hover:text-white border border-white/5 hover:border-purple-500/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSnippets.map((snippet) => {
            const isLiked = user && snippet.likedByUserIds.includes(user.id);
            const isCopied = copiedId === snippet.id;

            return (
              <div
                key={snippet.id}
                className="rounded-2xl bg-[#09090F] border border-white/10 hover:border-purple-500/30 transition-all p-5 flex flex-col justify-between space-y-4 shadow-xl"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-300">
                        {snippet.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400 uppercase">
                        {snippet.language}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {snippet.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {snippet.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(snippet.id, snippet.code)}
                    className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 transition-all cursor-pointer shrink-0"
                    title="Kodu Kopyala"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Code Block Container */}
                <div className="relative rounded-xl overflow-hidden bg-black/80 border border-white/10">
                  <div className="flex items-center justify-between px-3.5 py-1.5 bg-white/[0.03] border-b border-white/5 text-[10px] text-gray-400 font-mono">
                    <span>{snippet.language}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(snippet.id, snippet.code)}
                      className="text-purple-400 hover:text-purple-300 cursor-pointer flex items-center gap-1"
                    >
                      {isCopied ? "Kopyalandı!" : "Kopyala"}
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-gray-200 overflow-x-auto max-h-[220px] leading-relaxed select-text">
                    {snippet.code}
                  </pre>
                </div>

                {/* Footer / Tags & Author */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    {snippet.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400 font-medium">
                      @{snippet.authorUsername}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleLike(snippet.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isLiked
                          ? "bg-purple-600 text-white"
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{snippet.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal: New Snippet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-3xl bg-[#09090F] border border-purple-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Yeni Kod Snippet&apos;ı Paylaş
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSnippet} className="space-y-3.5">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Başlık</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: useLocalStorage React Hook"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-mono">Kategori</label>
                  <select
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="React & Next.js">React & Next.js</option>
                    <option value="Tailwind & CSS">Tailwind & CSS</option>
                    <option value="TypeScript & JS">TypeScript & JS</option>
                    <option value="Backend & Node">Backend & Node</option>
                    <option value="Docker & DevOps">Docker & DevOps</option>
                    <option value="Database & SQL">Database & SQL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 font-mono">Yazılım Dili</label>
                  <input
                    type="text"
                    required
                    placeholder="typescript, css, sql..."
                    value={modalLanguage}
                    onChange={(e) => setModalLanguage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Açıklama</label>
                <input
                  type="text"
                  placeholder="Kod ne işe yarıyor, nerede kullanılır?"
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Kod İçeriği</label>
                <textarea
                  required
                  rows={6}
                  placeholder="// Kodunuzu buraya yapıştırın..."
                  value={modalCode}
                  onChange={(e) => setModalCode(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/70 border border-white/10 text-purple-200 text-xs font-mono focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Etiketler (Virgülle ayırın)</label>
                <input
                  type="text"
                  placeholder="react, hooks, cache, tailwind"
                  value={modalTags}
                  onChange={(e) => setModalTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Yayınla
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
