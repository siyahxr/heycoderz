"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Wrench, 
  Code2, 
  Search, 
  FileJson, 
  Binary, 
  Sparkles,
  Key,
  Sliders,
  Database,
  GitCompare,
  FileText,
  Image as ImageIcon,
  Palette
} from "lucide-react";

import { JsonToTsTool } from "@/components/tools/JsonToTsTool";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";
import { JwtDebuggerTool } from "@/components/tools/JwtDebuggerTool";
import { GlassmorphismTool } from "@/components/tools/GlassmorphismTool";
import { RegexTesterTool } from "@/components/tools/RegexTesterTool";
import { CryptoUuidTool } from "@/components/tools/CryptoUuidTool";
import { CodeDiffTool } from "@/components/tools/CodeDiffTool";
import { SqlFormatterTool } from "@/components/tools/SqlFormatterTool";
import { MarkdownLiveTool } from "@/components/tools/MarkdownLiveTool";
import { ImageBase64Tool } from "@/components/tools/ImageBase64Tool";
import { BoxShadowTool } from "@/components/tools/BoxShadowTool";
import { ColorContrastTool } from "@/components/tools/ColorContrastTool";
import { useLanguage } from "@/context/LanguageContext";

type ToolKey = 
  | "json-to-ts" 
  | "json-formatter" 
  | "jwt-debugger" 
  | "css-glass" 
  | "regex-tester" 
  | "crypto-uuid" 
  | "code-diff" 
  | "sql-formatter"
  | "markdown-live"
  | "image-to-base64"
  | "css-box-shadow"
  | "color-contrast";

export default function ToolsPage() {
  const { t } = useLanguage();
  const [activeTool, setActiveTool] = useState<ToolKey>("json-to-ts");
  const [searchFilter, setSearchFilter] = useState("");

  const toolsList = [
    { 
      id: "json-to-ts", 
      name: "JSON → TypeScript", 
      desc: "JSON verisinden anında tip ve Interface üretin", 
      icon: Code2, 
      badge: "En Çok Kullanılan" 
    },
    { 
      id: "json-formatter", 
      name: "JSON Biçimlendirici", 
      desc: "Beautify, Minify ve syntax hata yakalayıcı", 
      icon: FileJson, 
      badge: "Temel Araç" 
    },
    { 
      id: "jwt-debugger", 
      name: "JWT Token Çözücü", 
      desc: "Header & Payload Claims çözümleyici", 
      icon: Key, 
      badge: "Güvenlik" 
    },
    { 
      id: "css-glass", 
      name: "Glassmorphism Stüdyo", 
      desc: "Modern bulanıklık, kenarlık ve gradient üretici", 
      icon: Sliders, 
      badge: "Tasarım" 
    },
    { 
      id: "regex-tester", 
      name: "Regex Test Edici", 
      desc: "Düzenli ifadeleri bayraklarla anında test edin", 
      icon: Search, 
      badge: "Yardımcı" 
    },
    { 
      id: "crypto-uuid", 
      name: "UUID & SHA Hasher", 
      desc: "Rastgele UUID v4 ve SHA-256/512 hash üretici", 
      icon: Binary, 
      badge: "Kripto" 
    },
    { 
      id: "code-diff", 
      name: "Kod Diff Karşılaştırıcı", 
      desc: "İki kod bloğu arasındaki farkları karşılaştırın", 
      icon: GitCompare, 
      badge: "Diff" 
    },
    { 
      id: "sql-formatter", 
      name: "SQL Güzelleştirici", 
      desc: "Karmaşık SQL sorgularını düzenli biçimlendirin", 
      icon: Database, 
      badge: "Veritabanı" 
    },
    { 
      id: "markdown-live", 
      name: "Markdown Stüdyo", 
      desc: "Canlı GitHub Markdown editör & HTML dışa aktarıcı", 
      icon: FileText, 
      badge: "Doküman" 
    },
    { 
      id: "image-to-base64", 
      name: "Görsel → Base64", 
      desc: "PNG, JPG, SVG dosyalarını Data URI ve CSS'e çevirin", 
      icon: ImageIcon, 
      badge: "Görsel" 
    },
    { 
      id: "css-box-shadow", 
      name: "Gölge & Glow Stüdyo", 
      desc: "Neon parlama, yumuşak gölgeler ve Tailwind kodları", 
      icon: Sparkles, 
      badge: "CSS" 
    },
    { 
      id: "color-contrast", 
      name: "Renk & WCAG Kontrast", 
      desc: "Renk uyumu ve WCAG 2.1 erişilebilirlik denetleyici", 
      icon: Palette, 
      badge: "Erişilebilirlik" 
    },
  ];

  const filteredTools = toolsList.filter((t) => 
    t.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    t.desc.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Wrench className="w-3.5 h-3.5" />
            <span>{t("tools.badge")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t("tools.titlePrefix")}{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              {t("tools.titleHighlight")}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            {t("tools.subtitle")}
          </p>
        </div>

        {/* Tools Selection Horizontal Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{toolsList.length} Araç</span>
            </div>
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t("tools.searchPlaceholder")}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredTools.map((t) => {
              const Icon = t.icon;
              const isActive = activeTool === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTool(t.id as ToolKey)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? "bg-purple-950/40 border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-[1.01]"
                      : "bg-[#08080E]/90 border-white/[0.07] hover:border-purple-500/30 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "bg-white/[0.04] text-purple-400"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/5 text-gray-400">
                      {t.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-xs sm:text-sm font-bold tracking-tight ${isActive ? "text-white" : "text-gray-300"}`}>
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{t.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE TOOL WORKSPACE */}
        <div className="rounded-3xl bg-[#09090F]/95 border border-purple-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.15)]">
          {activeTool === "json-to-ts" && <JsonToTsTool />}
          {activeTool === "json-formatter" && <JsonFormatterTool />}
          {activeTool === "jwt-debugger" && <JwtDebuggerTool />}
          {activeTool === "css-glass" && <GlassmorphismTool />}
          {activeTool === "regex-tester" && <RegexTesterTool />}
          {activeTool === "crypto-uuid" && <CryptoUuidTool />}
          {activeTool === "code-diff" && <CodeDiffTool />}
          {activeTool === "sql-formatter" && <SqlFormatterTool />}
          {activeTool === "markdown-live" && <MarkdownLiveTool />}
          {activeTool === "image-to-base64" && <ImageBase64Tool />}
          {activeTool === "css-box-shadow" && <BoxShadowTool />}
          {activeTool === "color-contrast" && <ColorContrastTool />}
        </div>

      </main>

      <Footer />
    </div>
  );
}
