"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import {
  BookOpen,
  Clock,
  ArrowLeft,
  ArrowRight,
  User,
  Download,
  Share2,
  Copy,
  Check,
  FileText,
  FileCode,
  Globe,
  Eye,
  Heart,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useBlog, BlogArticle } from "@/context/BlogContext";

export default function SingleArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { articles, getArticleById } = useBlog();

  const articleId = (params?.id as string) || "";
  const article = useMemo(() => {
    return articles.find((a) => a.id === articleId || a.id.toLowerCase() === articleId.toLowerCase());
  }, [articles, articleId]);

  const [shareToast, setShareToast] = useState<string | null>(null);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article?.likes || 42);

  // Render Markdown safely into HTML
  const parsedMarkdownHtml = useMemo(() => {
    if (!article) return "";
    let raw = article.content;

    // Headers
    raw = raw.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-purple-300 mt-6 mb-3">$1</h3>');
    raw = raw.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-8 mb-4 pb-2 border-b border-white/10">$1</h2>');
    raw = raw.replace(/^# (.*$)/gim, '<h1 class="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-6 tracking-tight">$1</h1>');

    // Blockquotes
    raw = raw.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-purple-500 pl-4 py-3 my-5 bg-purple-950/30 rounded-r-2xl text-purple-200 text-sm sm:text-base italic leading-relaxed">$1</blockquote>');

    // Horizontal Rules
    raw = raw.replace(/^---$/gim, '<hr class="my-8 border-white/10" />');

    // Bold & Italic
    raw = raw.replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-bold">$1</strong>');
    raw = raw.replace(/\*(.*?)\*/gim, '<em class="text-purple-200 italic">$1</em>');

    // Inline Code
    raw = raw.replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono text-xs">$1</code>');

    // Code blocks
    raw = raw.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/gim, (match, lang, code) => {
      return `<div class="my-6 rounded-2xl overflow-hidden border border-purple-500/30 bg-black/90 shadow-xl"><div class="px-4 py-2 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-xs font-mono text-gray-400"><span>${lang || "code"}</span><span class="text-[10px] text-purple-400 font-mono">heycoderz snippet</span></div><pre class="p-4 sm:p-5 text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto leading-relaxed"><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre></div>`;
    });

    // Unordered lists
    raw = raw.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-gray-300 text-sm sm:text-base my-1.5 leading-relaxed">$1</li>');

    // Numbered lists
    raw = raw.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li class="ml-4 list-decimal text-gray-300 text-sm sm:text-base my-1.5 leading-relaxed">$2</li>');

    raw = raw.replace(/\n\n/g, '<div class="my-4"></div>');

    return raw;
  }, [article]);

  const handleDownloadFile = (format: "md" | "txt" | "html") => {
    if (!article) return;

    let content = "";
    let mimeType = "";
    let fileName = `${article.id}.${format}`;

    if (format === "md") {
      content = `---
title: ${article.title}
author: ${article.author}
date: ${article.date}
tag: ${article.tag}
source: https://heycoderz.com/blog/${article.id}
---

${article.content}`;
      mimeType = "text/markdown;charset=utf-8;";
    } else if (format === "txt") {
      content = `BAŞLIK: ${article.title}\nYAZAR: ${article.author}\nTARİH: ${article.date}\nKATEGORİ: ${article.tag}\n\nÖZET:\n${article.summary}\n\nİÇERİK:\n${article.content}`;
      mimeType = "text/plain;charset=utf-8;";
    } else if (format === "html") {
      content = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>${article.title} - heycoderz Blog</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #1a1a1a; }
    h1, h2, h3 { color: #5b21b6; }
    pre { background: #1e1e1e; color: #10b981; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { font-family: monospace; }
  </style>
</head>
<body>
  <h1>${article.title}</h1>
  <p><em>Yazar: ${article.author} | Tarih: ${article.date} | Kategori: ${article.tag}</em></p>
  <hr>
  <div>${parsedMarkdownHtml}</div>
</body>
</html>`;
      mimeType = "text/html;charset=utf-8;";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadDropdownOpen(false);

    setShareToast(`"${fileName}" başarıyla indirildi!`);
    setTimeout(() => setShareToast(null), 3000);
  };

  const getShareUrl = () => {
    if (typeof window === "undefined" || !article) return "";
    return `${window.location.origin}/blog/${article.id}`;
  };

  const handleCopyShareLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setShareToast("Makale bağlantısı panoya kopyalandı!");
    setTimeout(() => setShareToast(null), 3000);
  };

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  if (!article) {
    return (
      <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans">
        <BackgroundEffects />
        <Navbar />
        <main className="relative z-10 flex-1 max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-purple-400 mx-auto opacity-50" />
          <h2 className="text-2xl font-bold text-white">Makale Bulunamadı</h2>
          <p className="text-sm text-gray-400">Aradığınız blog yazısı silinmiş veya taşınmış olabilir.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Blog Listesine Dön</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Related articles
  const otherArticles = articles.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      {/* Floating Share Toast */}
      {shareToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#0E0E18] border border-purple-500/50 px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.4)] text-xs font-medium text-white flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{shareToast}</span>
        </div>
      )}

      <main className="relative z-10 flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        
        {/* Back Link & Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/[0.08]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-purple-400" />
            <span>Tüm Makalelere Dön</span>
          </Link>

          {/* Action Buttons: Share & Download */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-purple-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Paylaş</span>
            </button>

            {/* Download Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-medium text-white transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Belgeyi İndir</span>
              </button>

              {downloadDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0E0E18] border border-purple-500/30 p-2 shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => handleDownloadFile("md")}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-gray-300 hover:text-white hover:bg-purple-950/50 transition-colors text-left cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>.md (Markdown)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadFile("html")}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-gray-300 hover:text-white hover:bg-purple-950/50 transition-colors text-left cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>.html (Web Sayfası)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadFile("txt")}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-gray-300 hover:text-white hover:bg-purple-950/50 transition-colors text-left cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>.txt (Düz Metin)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Article Meta Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 font-bold">
              {article.tag}
            </span>
            <span className="text-xs text-gray-500 font-mono">{article.date}</span>
            <span className="text-xs text-gray-500 font-mono">• {article.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between gap-4 pt-2 text-xs text-gray-400">
            <Link
              href={`/@${article.author.toLowerCase().includes("efe") ? "efe" : article.author.toLowerCase().includes("oyku") || article.author.toLowerCase().includes("öykü") ? "oyku" : "efe"}`}
              className="flex items-center gap-3 group/author cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover/author:ring-2 group-hover/author:ring-purple-400 transition-all">
                {article.author.charAt(0)}
              </div>
              <div>
                <div className="text-white font-medium group-hover/author:text-purple-300 transition-colors flex items-center gap-1.5">
                  <span>{article.author}</span>
                  <ExternalLink className="w-3 h-3 text-gray-500 group-hover/author:text-purple-400" />
                </div>
                <div className="text-gray-500 text-[11px]">heycoderz Yazarı • Profili Gör</div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-gray-500 font-mono">{article.views || 100} Görüntülenme</span>
              <button
                type="button"
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  liked
                    ? "bg-pink-950/40 border-pink-500/40 text-pink-400"
                    : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? "fill-pink-400 text-pink-400" : ""}`} />
                <span>{likeCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Callout Box */}
        <div className="p-6 rounded-3xl bg-purple-950/20 border border-purple-500/25 text-sm sm:text-base text-purple-200 leading-relaxed font-normal mb-10 shadow-lg">
          {article.summary}
        </div>

        {/* Main Article Body (Markdown Rendered) */}
        <article className="p-8 sm:p-12 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] shadow-2xl space-y-4">
          <div
            className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-3"
            dangerouslySetInnerHTML={{ __html: parsedMarkdownHtml }}
          />
        </article>

        {/* Sharing Toolbar Footer */}
        <div className="mt-10 p-6 rounded-3xl bg-[#09090F] border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">Bu belgeyi arkadaşlarınla paylaş:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-purple-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Bağlantıyı Kopyala</span>
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${getShareUrl()}`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-xs text-emerald-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(getShareUrl())}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-sky-950/40 hover:bg-sky-900/40 border border-sky-500/30 text-xs text-sky-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>X (Twitter)</span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/30 text-xs text-indigo-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Other Related Articles */}
        {otherArticles.length > 0 && (
          <div className="mt-14 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>İlginizi Çekebilecek Diğer Belgeler</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.id}`}
                  className="p-6 rounded-2xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all hover:-translate-y-1 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 mb-2 inline-block">
                      {item.tag}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.summary}</p>
                  </div>
                  <div className="pt-3 border-t border-white/[0.04] mt-4 flex items-center justify-between text-xs text-purple-400 font-medium">
                    <span>Devamını Oku</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
