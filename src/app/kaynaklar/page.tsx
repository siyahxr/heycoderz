"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  GraduationCap, 
  Map, 
  FileText, 
  BookOpen, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Code2, 
  Layers, 
  Search,
  Check,
  Copy,
  FileCode,
  Globe
} from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  desc: string;
  tag: string;
  level: string;
  topics: string[];
  fullDocument: string;
}

interface CheatsheetItem {
  id: string;
  title: string;
  desc: string;
  filename: string;
  extension: string;
  code: string;
}

const ROADMAPS: RoadmapItem[] = [
  {
    id: "frontend-2026",
    title: "2026 Modern Frontend Yol Haritası",
    desc: "React 19, Next.js 16, TypeScript 5+, Tailwind CSS v4, Web Vitals ve Micro-frontends.",
    tag: "Önerilen",
    level: "Başlangıç → İleri",
    topics: ["React 19", "Next.js App Router", "Tailwind CSS v4", "TypeScript", "Zustand & TanStack Query", "Web Vitals"],
    fullDocument: `# 2026 Modern Frontend Geliştirici Yol Haritası (heycoderz)

## 📌 Giriş
Bu döküman, 2026 yılı itibarıyla modern bir Frontend geliştiricisinin bilmesi gereken temel ve ileri seviye konuları adım adım özetler.

---

### 🟢 Aşama 1: Temeller & Modern JavaScript (ES2024+)
- **HTML5 Semantiği:** Erişilebilirlik (ARIA), SEO meta etiketleri, Open Graph.
- **Modern CSS:** CSS Grid, Flexbox, CSS Subgrid, Container Queries, CSS Değişkenleri.
- **JavaScript Temelleri:** Async/Await, ES Modules, Destructuring, Closures, Event Loop, Proxy & Reflect.

---

### 🟣 Aşama 2: React 19 & Next.js 16 Ekosistemi
- **React 19 Yenilikleri:** React Compiler, use() hook, Server Actions, useOptimistic, useActionState.
- **Next.js 16:** App Router, Turbopack, Streaming SSR, Parallel & Intercepting Routes, Route Handlers.
- **Stil Yönetimi:** Tailwind CSS v4 (@theme direktifleri), Shadcn UI, Framer Motion.

---

### 🔵 Aşama 3: Tip Güvenliği & Durum Yönetimi (State)
- **TypeScript 5+:** Generics, Mapped Types, Discriminated Unions, Template Literal Types.
- **Client & Server State:** TanStack Query v5 (React Query), Zustand, Nuqs (URL state).
- **Form & Doğrulama:** React Hook Form + Zod şema doğrulama.

---

### 🟡 Aşama 4: Performans, Test & Dağıtım (DevOps)
- **Core Web Vitals:** LCP, INP, CLS optimizasyonu, Next.js Image/Font optimization.
- **Test:** Vitest, React Testing Library, Playwright (E2E testler).
- **CI/CD & Dağıtım:** GitHub Actions, Vercel, Docker multi-stage build.

---
*heycoderz Platformu tarafından hazırlanmıştır. https://heycoderz.com*`,
  },
  {
    id: "fullstack-cloud",
    title: "Fullstack & Cloud Mimarisi",
    desc: "Node.js, PostgreSQL, Docker, Redis, Serverless mimari ve CI/CD pipeline kurulumu.",
    tag: "Popüler",
    level: "Orta → İleri",
    topics: ["Node.js / Bun", "PostgreSQL & Prisma", "Docker & Compose", "Redis Caching", "AWS / Vercel", "CI/CD"],
    fullDocument: `# Fullstack & Cloud Mimarisi Yol Haritası (heycoderz)

## 📌 Genel Bakış
Backend mimarileri, veritabanı optimizasyonları ve bulut altyapılarında yetkinleşmek için adım adım rehber.

---

### 🟢 Aşama 1: Backend & API Geliştirme
- **Runtime:** Node.js (LTS), Bun veya Go temelleri.
- **Frameworkler:** Next.js Route Handlers, Express, NestJS veya Hono.
- **API Tasarımı:** RESTful standartları, GraphQL, WebSockets (Gerçek zamanlı veri akışı).

---

### 🟣 Aşama 2: Veritabanları & Veri Modelleme
- **İlişkisel Veritabanları:** PostgreSQL, İndeksleme stratejileri (B-Tree, GIN), Foreign Keys, Transactions (ACID).
- **ORM & Query Builders:** Prisma ORM, Drizzle ORM.
- **Önbellek & Kuyruk:** Redis (Pub/Sub, Session Caching), BullMQ.

---

### 🔵 Aşama 3: Konteynerleştirme & Güvenlik
- **Docker:** Dockerfile yazımı, Multi-stage builds, Docker Compose ile yerel mikroservis ortamı.
- **Güvenlik:** JWT Authentication, OAuth2, Rate Limiting (Upstash / Redis), CORS, SQL Injection & XSS korumaları.

---

### 🟡 Aşama 4: Cloud & CI/CD Pipeline
- **Cloud Sağlayıcıları:** AWS (S3, RDS, Lambda, CloudFront), Vercel, Supabase.
- **DevOps:** GitHub Actions ile otomatik test, lint ve canlıya alma (Deployment pipeline).

---
*heycoderz Platformu tarafından hazırlanmıştır. https://heycoderz.com*`,
  },
  {
    id: "ai-llm-roadmap",
    title: "Yapay Zeka & LLM Entegrasyonu",
    desc: "LangChain, Vercel AI SDK, OpenAI/Claude API entegrasyonları ve Vector Veritabanları.",
    tag: "Trend",
    level: "Orta Seviye",
    topics: ["Vercel AI SDK", "RAG Sistemleri", "Vector DB", "Embeddings", "Function Calling", "Prompt Engineering"],
    fullDocument: `# Yapay Zeka & LLM Entegrasyonu Yol Haritası (heycoderz)

## 📌 Giriş
Yapay zeka modellerini (LLM) modern web uygulamalarına ve backend servislerine entegre etme rehberi.

---

### 🟢 Aşama 1: Temel AI Kavramları & API Kullanımı
- **Modeller:** OpenAI GPT-4o, Claude 3.5 Sonnet, Gemini 2.0 Flash / Pro.
- **Temel Konseptler:** Tokens, Temperature, Context Window, System / User / Assistant Prompts.
- **SDK'lar:** Vercel AI SDK (\`ai\`), OpenAI SDK, Google GenAI SDK.

---

### 🟣 Aşama 2: Streaming & Function Calling (Tool Calling)
- **Streaming UI:** React Server Components ile AI yanıtlarını kelime kelime akıtma (\`useChat\`, \`useCompletion\`).
- **Function Calling:** Yapay zekaya veritabanı sorgulama, hava durumu çekme veya e-posta gönderme gibi fonksiyonları çalıştırma yetkisi verme.

---

### 🔵 Aşama 3: RAG (Retrieval-Augmented Generation) & Vektör Veritabanları
- **Embeddings:** Metinleri vektör sayı dizilerine dönüştürme (text-embedding-3-small vb.).
- **Vektör Veritabanları:** Pinecone, Qdrant, PostgreSQL + pgvector.
- **Semantik Arama:** Kosinüs benzerliği (Cosine similarity) ile kullanıcı sorusuna en yakın dökümanları bulma.

---

### 🟡 Aşama 4: Güvenlik, Maliyet & Değerlendirme
- **Güvenlik:** Prompt Injection saldırılarını engelleme, PII (Kişisel veri) maskeleme.
- **Maliyet Optimizasyonu:** Semantic Caching (Redis), küçük ve ucuz modellerin (Flash/Mini) orkestrasyonu.

---
*heycoderz Platformu tarafından hazırlanmıştır. https://heycoderz.com*`,
  },
];

const CHEATSHEETS: CheatsheetItem[] = [
  {
    id: "cs-ts",
    title: "TypeScript İleri Seviye Tip Hileleri",
    desc: "Generics, conditional types, mapped types ve type guards için pratik kod şablonları.",
    filename: "typescript-cheatsheet",
    extension: "ts",
    code: `// 1. Deep Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 2. Prettify Type Helper (İç içe tipleri düzleştiren IDE yardımcısı)
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// 3. Nullable ve Undefined alanları temizleme
type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// 4. Dinamik Event Adı Üretici (Template Literals)
type EventName = \`on\${'Click' | 'Hover' | 'Focus' | 'Blur'}\`;

// 5. Fonksiyon Parametre Tipini Çıkarma
type ExtractParams<T> = T extends (...args: infer P) => any ? P : never;`,
  },
  {
    id: "cs-git",
    title: "Git Süper Güçleri & Hızlı Komutlar",
    desc: "Rebase, cherry-pick, stash, kurtarma ve hızlı commit komutları.",
    filename: "git-cheatsheet",
    extension: "sh",
    code: `#!/bin/bash
# 1. Son commit mesajını değiştirmeden düzenle
git commit --amend --no-edit

# 2. Son 3 commiti interaktif birleştir (squash)
git rebase -i HEAD~3

# 3. Geçici değişiklikleri sakla ve geri yükle
git stash push -m "Gecici yedek"
git stash pop

# 4. Yanlışlıkla silinen commit veya dalı bul ve kurtar
git reflog
git checkout -b kurtarilan-dal HEAD@{2}

# 5. Uzak daldaki değişiklikleri temiz senkronize et
git fetch origin && git reset --hard origin/main`,
  },
  {
    id: "cs-docker",
    title: "Docker & Container Komut Rehberi",
    desc: "Geliştirme konteynerlerini optimize etme, temizleme ve multi-stage build komutları.",
    filename: "docker-cheatsheet",
    extension: "sh",
    code: `#!/bin/bash
# 1. Arka planda build alıp servisleri ayağa kaldır
docker compose up --build -d

# 2. Kullanılmayan tüm konteyner, image ve volumeları temizle
docker system prune -a --volumes -f

# 3. Çalışan konteynerin içine terminalle gir
docker exec -it <container_name_or_id> /bin/sh

# 4. Canlı logları takip et (Tail logs)
docker logs -f --tail 100 <container_name_or_id>

# 5. Konteyner kaynak kullanımını canlı izle
docker stats`,
  },
  {
    id: "cs-nextjs",
    title: "Next.js 16 & Server Actions Şablonu",
    desc: "Server action oluşturma, revalidateTag ve useActionState yönetimi.",
    filename: "nextjs-server-actions",
    extension: "ts",
    code: `"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function createPostAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || title.length < 3) {
    return { success: false, error: "Başlık en az 3 karakter olmalıdır." };
  }

  // Veritabanı işlemi
  // await db.post.create({ data: { title, content } });

  revalidatePath("/blog");
  revalidateTag("posts-feed", "layout");

  return { success: true, message: "Gönderi başarıyla oluşturuldu!" };
}`,
  },
];

const UI_LIBRARIES = [
  {
    id: "ui-1",
    name: "Lucide Icons",
    desc: "Modern ve tutarlı 1000+ SVG ikonu.",
    link: "https://lucide.dev",
  },
  {
    id: "ui-2",
    name: "Tailwind CSS v4",
    desc: "Hızlı, modern yardımcı sınıf tabanlı stil motoru.",
    link: "https://tailwindcss.com",
  },
  {
    id: "ui-3",
    name: "Shadcn UI",
    desc: "Kendi kod tabanınıza kopyalayabileceğiniz şık React bileşenleri.",
    link: "https://ui.shadcn.com",
  },
  {
    id: "ui-4",
    name: "Framer Motion",
    desc: "React için güçlü deklaratif animasyon kütüphanesi.",
    link: "https://motion.dev",
  },
  {
    id: "ui-5",
    name: "TanStack Query",
    desc: "Asenkron durum ve API veri senkronizasyon motoru.",
    link: "https://tanstack.com/query",
  },
  {
    id: "ui-6",
    name: "Zod Doğrulama",
    desc: "TypeScript odaklı şema bildirimi ve veri doğrulama.",
    link: "https://zod.dev",
  },
];

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "roadmap" | "cheatsheet" | "ui">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleDownloadRoadmap = (rm: RoadmapItem, format: "md" | "html" | "txt" = "md") => {
    let content = "";
    let mimeType = "";
    let fileName = `${rm.id}-yol-haritasi.${format}`;

    if (format === "md") {
      content = rm.fullDocument;
      mimeType = "text/markdown;charset=utf-8;";
    } else if (format === "html") {
      content = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>${rm.title} - heycoderz</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 850px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #1e1e1e; }
    h1 { color: #5b21b6; border-bottom: 2px solid #ddd; padding-bottom: 8px; }
    h2, h3 { color: #6d28d9; }
    pre { background: #18181b; color: #34d399; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { font-family: monospace; }
  </style>
</head>
<body>
  <h1>${rm.title}</h1>
  <p><strong>Seviye:</strong> ${rm.level} | <strong>Kategori:</strong> ${rm.tag}</p>
  <hr>
  <pre>${rm.fullDocument}</pre>
</body>
</html>`;
      mimeType = "text/html;charset=utf-8;";
    } else {
      content = `${rm.title}\nSeviye: ${rm.level}\n\n${rm.fullDocument}`;
      mimeType = "text/plain;charset=utf-8;";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadToast(`"${fileName}" başarıyla indirildi!`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleDownloadCheatsheet = (cs: CheatsheetItem) => {
    const fileName = `${cs.filename}.${cs.extension}`;
    const blob = new Blob([cs.code], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadToast(`"${fileName}" başarıyla indirildi!`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  // Filter roadmaps
  const filteredRoadmaps = ROADMAPS.filter((rm) =>
    rm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rm.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rm.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter cheatsheets
  const filteredCheatsheets = CHEATSHEETS.filter((cs) =>
    cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cs.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter UI libs
  const filteredUi = UI_LIBRARIES.filter((ui) =>
    ui.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ui.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      {/* Floating Download Toast */}
      {downloadToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#0E0E18] border border-purple-500/50 px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.4)] text-xs font-medium text-white flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>heycoderz Bilgi Merkezi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Geliştirici{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Kaynak Kütüphanesi
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Kariyerinizi ve projelerinizi ileri taşıyacak rehberler, yol haritaları, kod hile sayfaları ve araçlar.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-white/[0.08]">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Tüm Kaynaklar" },
              { id: "roadmap", label: "Yol Haritaları" },
              { id: "cheatsheet", label: "Hile Sayfaları (Cheatsheets)" },
              { id: "ui", label: "UI & Kütüphaneler" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                    : "bg-white/[0.03] text-gray-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Kaynak veya konu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* 1. Roadmaps Section */}
        {(selectedCategory === "all" || selectedCategory === "roadmap") && (
          <section className="mb-14">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Yol Haritaları & Belgeler</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">{filteredRoadmaps.length} Yol Haritası</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRoadmaps.map((rm) => (
                <div
                  key={rm.id}
                  className="p-6 sm:p-7 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(139,92,246,0.2)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
                        {rm.tag}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">{rm.level}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{rm.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{rm.desc}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {rm.topics.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-gray-300 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadRoadmap(rm, "md")}
                        className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>.md İndir</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadRoadmap(rm, "html")}
                        className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-purple-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>.html İndir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. Cheatsheets Section */}
        {(selectedCategory === "all" || selectedCategory === "cheatsheet") && (
          <section className="mb-14">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Kod Hile Sayfaları (Cheatsheets)</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">{filteredCheatsheets.length} Kod Şablonu</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCheatsheets.map((cs) => (
                <div
                  key={cs.id}
                  className="p-6 sm:p-7 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-white">{cs.title}</h3>
                      <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30">
                        .{cs.extension}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{cs.desc}</p>
                    
                    <div className="relative rounded-2xl bg-black/85 border border-purple-500/20 p-4 mb-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed shadow-inner">
                      <pre>{cs.code}</pre>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04]">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(cs.id, cs.code)}
                      className="py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedCodeId === cs.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Kopyalandı!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                          <span>Kodu Kopyala</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadCheatsheet(cs)}
                      className="py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-400" />
                      <span>Dosyayı İndir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. UI Libraries */}
        {(selectedCategory === "all" || selectedCategory === "ui") && (
          <section>
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Önerilen Geliştirici Kütüphaneleri</h2>
              </div>
              <span className="text-xs text-gray-500 font-mono">{filteredUi.length} Kütüphane</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {filteredUi.map((lib) => (
                <a
                  key={lib.id}
                  href={lib.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all hover:-translate-y-1 group flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {lib.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{lib.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-purple-400 shrink-0 ml-3" />
                </a>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
