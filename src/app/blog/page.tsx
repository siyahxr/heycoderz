"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import {
  BookOpen,
  Clock,
  ArrowRight,
  User,
  Search,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useBlog, BlogArticle } from "@/context/BlogContext";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogPage() {
  const { articles } = useBlog();
  const { t } = useLanguage();
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return articles.filter((art) => {
      const matchTag = selectedTag === "all" || art.tag.toLowerCase() === selectedTag.toLowerCase();
      const matchQuery =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTag && matchQuery;
    });
  }, [articles, selectedTag, searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t("blog.badge")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t("blog.titlePrefix")}{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              {t("blog.titleHighlight")}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            {t("blog.subtitle")}
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-white/[0.08]">
          <div className="flex flex-wrap gap-2">
            {["all", "Next.js", "CSS", "AI", "TypeScript"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedTag === tag
                    ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                    : "bg-white/[0.03] text-gray-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                {tag === "all" ? "Tüm Yazılar" : tag}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Yazılarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.id}`}
              className="p-6 sm:p-7 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(139,92,246,0.2)] cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300">
                    {article.tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-purple-300 transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1 text-purple-400 font-medium group-hover:translate-x-1 transition-transform">
                  <span>Belgeyi Oku & İndir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
