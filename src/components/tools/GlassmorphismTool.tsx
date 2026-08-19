"use client";

import React, { useState } from "react";
import { Sliders, Copy, Check, Sparkles, Layers, Palette, Eye, Code2 } from "lucide-react";

const PRESETS = [
  {
    name: "Neon Mor Cam",
    blur: 20,
    bgOpacity: 0.12,
    borderOpacity: 0.25,
    borderRadius: 24,
    tint: "white",
  },
  {
    name: "Kuzey Işıkları (Frosty)",
    blur: 32,
    bgOpacity: 0.18,
    borderOpacity: 0.4,
    borderRadius: 20,
    tint: "cyan",
  },
  {
    name: "Siber Karanlık (Cyber)",
    blur: 16,
    bgOpacity: 0.45,
    borderOpacity: 0.15,
    borderRadius: 16,
    tint: "dark",
  },
  {
    name: "Zümrüt Yeşil",
    blur: 24,
    bgOpacity: 0.15,
    borderOpacity: 0.3,
    borderRadius: 24,
    tint: "emerald",
  },
];

const SCENES = [
  { id: "cyber", name: "Siber Mor", class: "from-purple-900 via-[#0a0518] to-indigo-950" },
  { id: "sunset", name: "Gün Batımı", class: "from-rose-900 via-purple-950 to-amber-900" },
  { id: "ocean", name: "Derin Okyanus", class: "from-cyan-950 via-slate-950 to-blue-900" },
  { id: "emerald", name: "Neon Orman", class: "from-emerald-950 via-teal-950 to-stone-950" },
];

export const GlassmorphismTool: React.FC = () => {
  const [blur, setBlur] = useState(20);
  const [bgOpacity, setBgOpacity] = useState(0.12);
  const [borderOpacity, setBorderOpacity] = useState(0.25);
  const [borderRadius, setBorderRadius] = useState(24);
  const [borderWidth, setBorderWidth] = useState(1);
  const [scene, setScene] = useState(SCENES[0]);
  const [tint, setTint] = useState<"white" | "dark" | "cyan" | "emerald" | "purple">("white");
  const [activeCodeTab, setActiveCodeTab] = useState<"css" | "tailwind" | "react">("css");
  const [copied, setCopied] = useState(false);

  const getRgbaValues = () => {
    switch (tint) {
      case "dark":
        return {
          bg: `rgba(0, 0, 0, ${bgOpacity})`,
          border: `rgba(255, 255, 255, ${borderOpacity})`,
        };
      case "cyan":
        return {
          bg: `rgba(6, 182, 212, ${bgOpacity})`,
          border: `rgba(34, 211, 238, ${borderOpacity})`,
        };
      case "emerald":
        return {
          bg: `rgba(16, 185, 129, ${bgOpacity})`,
          border: `rgba(52, 211, 153, ${borderOpacity})`,
        };
      case "purple":
        return {
          bg: `rgba(168, 85, 247, ${bgOpacity})`,
          border: `rgba(192, 132, 252, ${borderOpacity})`,
        };
      default:
        return {
          bg: `rgba(255, 255, 255, ${bgOpacity})`,
          border: `rgba(255, 255, 255, ${borderOpacity})`,
        };
    }
  };

  const { bg, border } = getRgbaValues();

  const generateCssCode = () => {
    return `/* Glassmorphism CSS */
background: ${bg};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: ${borderWidth}px solid ${border};
border-radius: ${borderRadius}px;
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;
  };

  const generateTailwindCode = () => {
    const blurClass = `backdrop-blur-[${blur}px]`;
    const roundedClass = `rounded-[${borderRadius}px]`;
    const borderClass = `border border-white/[${borderOpacity}]`;
    const bgClass = `bg-white/[${bgOpacity}]`;
    const shadowClass = "shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]";
    return `className="${bgClass} ${blurClass} ${borderClass} ${roundedClass} ${shadowClass}"`;
  };

  const generateReactCode = () => {
    return `const glassStyle: React.CSSProperties = {
  background: "${bg}",
  backdropFilter: "blur(${blur}px)",
  WebkitBackdropFilter: "blur(${blur}px)",
  border: "${borderWidth}px solid ${border}",
  borderRadius: "${borderRadius}px",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
};`;
  };

  const currentCode =
    activeCodeTab === "css"
      ? generateCssCode()
      : activeCodeTab === "tailwind"
      ? generateTailwindCode()
      : generateReactCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">CSS Glassmorphism & Bulanıklık Stüdyosu</h2>
            <p className="text-xs text-gray-400">
              Modern fütüristik cam efektleri tasarlayın, canlı önizleyin ve anında CSS / Tailwind kodlarını kopyalayın.
            </p>
          </div>
        </div>

        {/* Preset selector */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setBlur(p.blur);
                setBgOpacity(p.bgOpacity);
                setBorderOpacity(p.borderOpacity);
                setBorderRadius(p.borderRadius);
                setTint(p.tint as any);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Top: Interactive Live Preview Container */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Canlı Önizleme Sahnesi</span>
            </span>

            {/* Scene Selector */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {SCENES.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setScene(sc)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                    scene.id === sc.id ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {sc.name}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`relative min-h-[360px] rounded-3xl overflow-hidden bg-gradient-to-br ${scene.class} p-8 flex items-center justify-center border border-white/10 shadow-2xl transition-colors duration-500`}
          >
            {/* Animated Ambient Glowing Orbs behind glass */}
            <div className="absolute top-6 left-8 w-32 h-32 rounded-full bg-pink-500/70 blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-8 right-8 w-40 h-40 rounded-full bg-indigo-500/70 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-purple-600/40 blur-[80px] pointer-events-none" />

            {/* Rendered Glass Card */}
            <div
              style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                background: bg,
                borderColor: border,
                borderWidth: `${borderWidth}px`,
                borderStyle: "solid",
                borderRadius: `${borderRadius}px`,
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
              }}
              className="relative z-10 w-full max-w-sm p-6 space-y-4 transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-base shadow-inner">
                  &lt;/&gt;
                </div>
                <span className="px-2.5 py-1 rounded-full bg-black/40 border border-white/20 text-[10px] font-mono text-purple-200">
                  heycoderz UI
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Glassmorphism Element</h3>
                <p className="text-xs text-gray-200/90 leading-relaxed mt-1">
                  Bulanıklık: {blur}px • Opaklık: %{Math.round(bgOpacity * 100)} • Köşe: {borderRadius}px
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-white/30 hover:bg-white/40 text-white text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
                >
                  Örnek Buton
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-black/30 hover:bg-black/40 text-white/80 text-xs font-medium backdrop-blur-md transition-colors cursor-pointer"
                >
                  İkincil Eylem
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Bottom: Controls & Code Output */}
        <div className="lg:col-span-5 space-y-5">
          {/* Controls Panel */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Efekt Parametreleri</span>
            </h3>

            {/* Blur Slider */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1.5">
                <span>Bulanıklık (Backdrop Blur)</span>
                <span className="font-mono text-purple-300">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Background Opacity */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1.5">
                <span>Arka Plan Opaklığı (Bg Alpha)</span>
                <span className="font-mono text-purple-300">%{Math.round(bgOpacity * 100)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.01"
                value={bgOpacity}
                onChange={(e) => setBgOpacity(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Border Opacity */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1.5">
                <span>Kenarlık Opaklığı (Border Alpha)</span>
                <span className="font-mono text-purple-300">%{Math.round(borderOpacity * 100)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.9"
                step="0.02"
                value={borderOpacity}
                onChange={(e) => setBorderOpacity(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Border Radius */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1.5">
                <span>Köşe Yuvarlaklığı (Radius)</span>
                <span className="font-mono text-purple-300">{borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Tint Color Selector */}
            <div>
              <span className="block text-xs text-gray-300 mb-2">Cam Renk Tonu (Tint):</span>
              <div className="flex items-center gap-2">
                {[
                  { id: "white", label: "Beyaz", color: "bg-white" },
                  { id: "purple", label: "Mor", color: "bg-purple-500" },
                  { id: "cyan", label: "Camgöbeği", color: "bg-cyan-400" },
                  { id: "emerald", label: "Zümrüt", color: "bg-emerald-400" },
                  { id: "dark", label: "Siyah", color: "bg-black border border-white/20" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTint(t.id as any)}
                    className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                      tint === t.id
                        ? "border-purple-500 bg-purple-950/40 text-white font-bold"
                        : "border-white/10 bg-black/40 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Code Box with Tabs */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab("css")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                    activeCodeTab === "css" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  CSS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab("tailwind")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                    activeCodeTab === "tailwind" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tailwind
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab("react")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                    activeCodeTab === "react" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  React Style
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Kopyalandı!" : "Kodu Kopyala"}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={5}
              value={currentCode}
              className="w-full font-mono text-xs p-3.5 rounded-xl bg-black/80 border border-purple-500/20 text-emerald-400 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
