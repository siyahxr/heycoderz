"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  MessageSquare, 
  Search, 
  Eye, 
  Code2, 
  Image as ImageIcon,
  RotateCcw
} from "lucide-react";

interface MetaData {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  siteName: string;
  author: string;
  twitterHandle: string;
  themeColor: string;
}

const PRESET_EXAMPLES: Record<string, MetaData> = {
  heycoderz: {
    title: "heycoderz — Geliştiriciler İçin Fütüristik Ekosistem & Topluluk",
    description: "Modern kod araçları, 1v1 kod düelloları, canlı çalışma odaları ve açık kaynak vitrini ile geliştiricilerin yeni nesil buluşma noktası.",
    url: "https://heycoderz.com",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    siteName: "heycoderz",
    author: "siyah & Öykü",
    twitterHandle: "@heycoderz",
    themeColor: "#8b5cf6",
  },
  blog: {
    title: "Next.js 16 ve React 19 ile Ultra Hızlı Web Mimarisi",
    description: "Server Actions, React Compiler ve gelişmiş streaming mimarisi ile modern web uygulamaları geliştirme rehberi.",
    url: "https://heycoderz.com/blog/nextjs-16-mimari",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    siteName: "heycoderz Blog",
    author: "siyah",
    twitterHandle: "@heycoderz",
    themeColor: "#06b6d4",
  },
};

export const OgMetaPreviewTool: React.FC = () => {
  const [data, setData] = useState<MetaData>(PRESET_EXAMPLES.heycoderz);
  const [activeTab, setActiveTab] = useState<"twitter" | "linkedin" | "discord" | "google">("twitter");
  const [copied, setCopied] = useState(false);

  const generatedHtml = `<!-- Temel SEO & Meta Tag'leri -->
<title>${data.title}</title>
<meta name="title" content="${data.title}" />
<meta name="description" content="${data.description}" />
<meta name="author" content="${data.author}" />
<meta name="theme-color" content="${data.themeColor}" />

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${data.url}" />
<meta property="og:title" content="${data.title}" />
<meta property="og:description" content="${data.description}" />
<meta property="og:image" content="${data.imageUrl}" />
<meta property="og:site_name" content="${data.siteName}" />

<!-- Twitter / X Cards -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${data.url}" />
<meta property="twitter:title" content="${data.title}" />
<meta property="twitter:description" content="${data.description}" />
<meta property="twitter:image" content="${data.imageUrl}" />
<meta property="twitter:creator" content="${data.twitterHandle}" />`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDomain = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch {
      return "heycoderz.com";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            Meta Tag & Sosyal Medya Önizleyici (OG Previewer)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Web sitenizin Google, Twitter (X), LinkedIn ve Discord üzerinde nasıl görüneceğini gerçek zamanlı test edin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">Hazır Şablon:</span>
          {Object.keys(PRESET_EXAMPLES).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setData(PRESET_EXAMPLES[key])}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-all cursor-pointer capitalize"
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#09090F] border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Meta Bilgileri
            </h3>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-mono">Sayfa Başlığı (Title)</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Örn: heycoderz — Geliştirici Platformu"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block text-right font-mono">
                {data.title.length} / 60 karakter
              </span>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-mono">Açıklama (Description)</label>
              <textarea
                rows={3}
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Örn: Modern geliştirici araçları..."
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block text-right font-mono">
                {data.description.length} / 160 karakter
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">URL</label>
                <input
                  type="url"
                  value={data.url}
                  onChange={(e) => setData({ ...data, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Site İsmi</label>
                <input
                  type="text"
                  value={data.siteName}
                  onChange={(e) => setData({ ...data, siteName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-mono">OG Görsel URL (1200x630)</label>
              <input
                type="text"
                value={data.imageUrl}
                onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Twitter Kullanıcı Adı</label>
                <input
                  type="text"
                  value={data.twitterHandle}
                  onChange={(e) => setData({ ...data, twitterHandle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Tema Rengi</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.themeColor}
                    onChange={(e) => setData({ ...data, themeColor: e.target.value })}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.themeColor}
                    onChange={(e) => setData({ ...data, themeColor: e.target.value })}
                    className="w-full px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={copyToClipboard}
              className="w-full mt-3 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-300" />
                  Meta Tag HTML Kopyalandı!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  HTML Meta Tag Kodunu Kopyala
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Previews (Right) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tab Bar */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("twitter")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "twitter"
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-lg shadow-sky-500/10"
                  : "text-gray-400 hover:text-white bg-white/[0.02]"
              }`}
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              Twitter / X Card
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("linkedin")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "linkedin"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30 shadow-lg shadow-blue-600/10"
                  : "text-gray-400 hover:text-white bg-white/[0.02]"
              }`}
            >
              <Globe className="w-4 h-4 text-blue-400" />
              LinkedIn Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("discord")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "discord"
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 shadow-lg shadow-indigo-600/10"
                  : "text-gray-400 hover:text-white bg-white/[0.02]"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Discord Embed
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("google")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "google"
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 shadow-lg shadow-emerald-600/10"
                  : "text-gray-400 hover:text-white bg-white/[0.02]"
              }`}
            >
              <Search className="w-4 h-4" />
              Google SERP
            </button>
          </div>

          {/* Preview Container */}
          <div className="p-6 rounded-2xl bg-[#09090F] border border-white/10 flex flex-col items-center justify-center min-h-[380px]">
            {activeTab === "twitter" && (
              <div className="w-full max-w-[500px] rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl transition-all">
                <div className="relative aspect-[1.91/1] w-full bg-gray-900 overflow-hidden">
                  <img
                    src={data.imageUrl}
                    alt={data.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/80 backdrop-blur text-[10px] text-white font-mono">
                    {getDomain(data.url)}
                  </div>
                </div>
                <div className="p-4 space-y-1 bg-[#121216]">
                  <p className="text-[11px] text-gray-400 font-mono">{getDomain(data.url)}</p>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{data.title || "Başlık Girilmedi"}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2">{data.description || "Açıklama girilmedi."}</p>
                </div>
              </div>
            )}

            {activeTab === "linkedin" && (
              <div className="w-full max-w-[520px] rounded-xl overflow-hidden bg-[#1b1f23] border border-white/10 shadow-2xl">
                <div className="relative aspect-[1.91/1] w-full bg-gray-900 overflow-hidden">
                  <img
                    src={data.imageUrl}
                    alt={data.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3.5 space-y-1 bg-[#282d34]">
                  <h4 className="text-sm font-semibold text-white line-clamp-1">{data.title}</h4>
                  <p className="text-[11px] text-gray-400 font-mono">{getDomain(data.url)} • 2 dk okuma</p>
                </div>
              </div>
            )}

            {activeTab === "discord" && (
              <div className="w-full max-w-[480px] rounded-lg bg-[#2b2d31] p-4 shadow-2xl border-l-4" style={{ borderColor: data.themeColor || "#5865F2" }}>
                <div className="space-y-2">
                  <p className="text-[11px] text-gray-400 font-medium">{data.siteName}</p>
                  <h4 className="text-sm font-bold text-[#00a8fc] hover:underline cursor-pointer">{data.title}</h4>
                  <p className="text-xs text-gray-300 line-clamp-3">{data.description}</p>
                  <div className="pt-2 rounded-md overflow-hidden">
                    <img
                      src={data.imageUrl}
                      alt={data.title}
                      className="rounded-lg w-full max-h-[220px] object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "google" && (
              <div className="w-full max-w-[550px] rounded-2xl bg-[#202124] p-5 text-left border border-white/10 shadow-2xl space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-300 font-bold font-mono">
                    {data.siteName.slice(0, 1) || "H"}
                  </div>
                  <div>
                    <p className="text-xs text-gray-300 font-medium">{data.siteName}</p>
                    <p className="text-[11px] text-gray-400 font-mono truncate max-w-[400px]">{data.url}</p>
                  </div>
                </div>
                <h4 className="text-base text-[#99c3ff] hover:underline cursor-pointer font-medium line-clamp-1">
                  {data.title}
                </h4>
                <p className="text-xs text-[#bdc1c6] line-clamp-2">
                  {data.description}
                </p>
              </div>
            )}
          </div>

          {/* Generated Code View */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>HTML Meta Output:</span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                Kopyala
              </button>
            </div>
            <pre className="text-[11px] text-gray-300 font-mono overflow-x-auto p-3 rounded-xl bg-black/80 border border-white/5 max-h-[140px]">
              {generatedHtml}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
