"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface BlogArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  tag: string;
  author: string;
  date: string;
  readTime: string;
  views?: number;
  likes?: number;
}

const DEFAULT_ARTICLES: BlogArticle[] = [
  {
    id: "nextjs-16-turbopack",
    title: "Next.js 16 ve Turbopack ile Ultra Hızlı Web Geliştirme",
    summary: "Yeni nesil mimari iyileştirmeleri, derleme sürelerinde %80'e varan hızlanma ve React Server Components en iyi pratikleri.",
    content: `# Next.js 16 ve Turbopack ile Ultra Hızlı Web Geliştirme

Next.js 16, modern web geliştirme süreçlerini kökten değiştirecek Turbopack kararlılığı ve optimize edilmiş SSR mimarisi ile geldi.

---

### 🚀 Önemli Yenilikler:
1. **Turbopack Dev Engine**: HMR (Hot Module Replacement) gecikmesi milisaniyeler seviyesine indirildi.
2. **Gelişmiş Caching & Streaming**: React Server Components artık çok daha akıcı bir şekilde veri akışı sağlıyor.
3. **TypeScript 5.x Tam Entegrasyonu**: Tip doğrulamaları arka planda paralel worker'lar ile çalıştırılıyor.

### 💡 Mimari Tavsiyeler:
Web uygulamalarınızı güncellerken paket bağımlılıklarını tek tek kontrol etmeyi ve \`use client\` direktiflerini yalnızca gerekli interaktif bileşenlerde kullanmayı unutmayın.

\`\`\`typescript
// Server Component Örneği
export default async function FeedPage() {
  const data = await fetch('https://api.heycoderz.com/v1/feed', {
    next: { revalidate: 60 }
  });
  const posts = await data.json();
  return <FeedList items={posts} />;
}
\`\`\`

> **Özet:** Turbopack ve Next.js 16 ile derleme sürelerinizi %80'e kadar optimize edebilirsiniz.`,
    tag: "Next.js",
    author: "Efe Taşkın (Kurucu)",
    date: "Ağustos 2026",
    readTime: "5 dk okuma",
    views: 1420,
    likes: 89,
  },
  {
    id: "tailwind-v4-deep-dive",
    title: "Tailwind CSS v4 ile Stil Yönetiminde Yeni Çağ",
    summary: "Yeni CSS değişkenleri motoru, sıfır yapılandırma kolaylığı ve lightningcss ile stil dosya boyutunu küçültme stratejileri.",
    content: `# Tailwind CSS v4 ile Stil Yönetiminde Yeni Çağ

Tailwind CSS v4, geleneksel konfigürasyon dosyalarını geride bırakarak tamamen CSS tabanlı bir tema mimarisine geçti.

---

### 🎨 Neler Değişti?
- Artık \`tailwind.config.js\` yerine doğrudan \`@theme\` direktiflerini CSS içinde tanımlayabiliyoruz.
- Build hızı LightningCSS motoru sayesinde 10 kat arttı.
- Dinamik renk paletleri ve glassmorphism efektleri çok daha kolay uygulanıyor.

\`\`\`css
@theme {
  --color-brand-primary: #8b5cf6;
  --color-brand-secondary: #06b6d4;
  --font-mono: "Fira Code", monospace;
}
\`\`\`

### ⚡ Performans Kazanımları:
CSS dosya boyutları %40 daha küçük ve sıfır ek yapılandırma ile projenizi anında başlatabilirsiniz.`,
    tag: "CSS",
    author: "Öykü (Admin)",
    date: "Ağustos 2026",
    readTime: "4 dk okuma",
    views: 980,
    likes: 64,
  },
  {
    id: "ai-coding-best-practices",
    title: "2026'da Yapay Zeka Destekli Kodlamada En İyi Pratikler",
    summary: "AI asistanlarıyla üretkenliği artırırken kod kalitesini ve mimari güvenliği korumanın kritik yöntemleri.",
    content: `# 2026'da Yapay Zeka Destekli Kodlamada En İyi Pratikler

Yapay zeka araçları artık sadece kod tamamlamıyor, tüm sistem mimarisini ve test süreçlerini uçtan uca yönetebiliyor.

---

### 🧠 Kritik Tavsiyeler:
1. **Prompt Context (Bağlam):** Modellerle konuşurken dosya yapılarını, tip tanımlarını ve kütüphane sürümlerini net belirtin.
2. **Doğrulama & Test:** Üretilen kodu her zaman birim testler ve derleme araçlarıyla (\`tsc --noEmit\`) doğrulayın.
3. **Güvenlik & Sırlar:** API anahtarlarını, veritabanı şifrelerini asla promptlara eklemeyin.

> Yapay zeka iyi bir eş programcıdır (pair programmer), ancak mimari kararlar her zaman geliştiricinin kontrolünde olmalıdır.`,
    tag: "AI",
    author: "heycoderz Ekibi",
    date: "Ağustos 2026",
    readTime: "6 dk okuma",
    views: 2150,
    likes: 142,
  },
  {
    id: "typescript-advanced-types",
    title: "TypeScript İleri Seviye Tip Taktikleri & Hata Önleme",
    summary: "Büyük ölçekli projelerde güvenli tip sistemleri kurmak için Generics, Inferred Types ve Template Literals.",
    content: `# TypeScript İleri Seviye Tip Taktikleri & Hata Önleme

TypeScript'in sunduğu güçlü tip sistemi sayesinde derleme anında hataları yakalamak runtime hatalarını %90 oranında engeller.

---

### 🛡️ Örnek Tip Örüntüleri:

\`\`\`typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type EventName = \`on\${'Click' | 'Hover' | 'Focus'}\`;
\`\`\`

Template Literal Types ve Conditional Types kullanarak tip güvenli kütüphaneler inşa edebilirsiniz.`,
    tag: "TypeScript",
    author: "heycoderz Ekibi",
    date: "Ağustos 2026",
    readTime: "7 dk okuma",
    views: 1870,
    likes: 110,
  },
];

interface BlogContextType {
  articles: BlogArticle[];
  addArticle: (article: Omit<BlogArticle, "id" | "date" | "views" | "likes">) => void;
  updateArticle: (id: string, updated: Partial<BlogArticle>) => void;
  deleteArticle: (id: string) => void;
  getArticleById: (id: string) => BlogArticle | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<BlogArticle[]>(DEFAULT_ARTICLES);

  useEffect(() => {
    const saved = localStorage.getItem("heycoderz_blog_articles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles(parsed);
        }
      } catch (e) { }
    }
  }, []);

  const saveArticlesToStorage = (list: BlogArticle[]) => {
    setArticles(list);
    localStorage.setItem("heycoderz_blog_articles", JSON.stringify(list));
  };

  const addArticle = (articleData: Omit<BlogArticle, "id" | "date" | "views" | "likes">) => {
    const id = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || `article-${Date.now()}`;

    const newArticle: BlogArticle = {
      ...articleData,
      id: `${id}-${Date.now().toString().slice(-4)}`,
      date: new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(new Date()),
      views: 1,
      likes: 0,
    };

    const updated = [newArticle, ...articles];
    saveArticlesToStorage(updated);
  };

  const updateArticle = (id: string, updatedFields: Partial<BlogArticle>) => {
    const updated = articles.map((art) => (art.id === id ? { ...art, ...updatedFields } : art));
    saveArticlesToStorage(updated);
  };

  const deleteArticle = (id: string) => {
    const updated = articles.filter((art) => art.id !== id);
    saveArticlesToStorage(updated);
  };

  const getArticleById = (id: string) => {
    return articles.find((art) => art.id === id);
  };

  return (
    <BlogContext.Provider
      value={{
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        getArticleById,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};
