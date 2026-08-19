"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Sliders, Layers, Eye, RefreshCw } from "lucide-react";

const SHADOW_PRESETS = [
  {
    name: "Neon Mor Parıltı",
    x: 0,
    y: 0,
    blur: 35,
    spread: 5,
    color: "#a855f7",
    opacity: 0.6,
    inset: false,
  },
  {
    name: "Derin Koyu Gölge",
    x: 0,
    y: 20,
    blur: 50,
    spread: -5,
    color: "#000000",
    opacity: 0.9,
    inset: false,
  },
  {
    name: "Siber Neon Cyan",
    x: 0,
    y: 4,
    blur: 40,
    spread: 2,
    color: "#06b6d4",
    opacity: 0.5,
    inset: false,
  },
  {
    name: "İç Göçük (Inset Glow)",
    x: 0,
    y: 0,
    blur: 25,
    spread: 2,
    color: "#ec4899",
    opacity: 0.4,
    inset: true,
  },
];

export const BoxShadowTool: React.FC = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(15);
  const [blur, setBlur] = useState(35);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#8b5cf6");
  const [opacity, setOpacity] = useState(0.4);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  // Convert Hex + Opacity to RGBA
  const getRgba = (hex: string, alpha: number) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const boxShadowValue = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${getRgba(color, opacity)}`;

  const cssSnippet = `box-shadow: ${boxShadowValue};\n-webkit-box-shadow: ${boxShadowValue};`;
  const tailwindSnippet = `shadow-[${inset ? "inset_" : ""}${x}px_${y}px_${blur}px_${spread}px_${getRgba(color, opacity).replace(/\s/g, "")}]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">CSS Box-Shadow & Neon Gölge Stüdyosu</h2>
            <p className="text-xs text-gray-400">
              Derinlik katan gölgeler ve fütüristik neon parlama efektleri oluşturup anında CSS / Tailwind olarak kopyalayın.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {SHADOW_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setX(p.x);
                setY(p.y);
                setBlur(p.blur);
                setSpread(p.spread);
                setColor(p.color);
                setOpacity(p.opacity);
                setInset(p.inset);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Live Preview Screen */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Canlı Gölge Önizlemesi</span>
            </span>
          </div>

          <div className="min-h-[340px] rounded-3xl bg-gradient-to-br from-[#0c0a1a] via-[#050508] to-[#120824] border border-white/10 p-8 flex items-center justify-center relative overflow-hidden">
            <div
              style={{
                boxShadow: boxShadowValue,
              }}
              className="w-64 h-44 rounded-2xl bg-[#11111d] border border-white/15 flex flex-col items-center justify-center p-6 text-center transition-all duration-150 relative z-10"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-white font-mono text-sm font-bold mb-2">
                CSS
              </div>
              <h4 className="text-sm font-bold text-white">Gölge Kartı</h4>
              <p className="text-[11px] text-gray-400 mt-1 font-mono">{boxShadowValue}</p>
            </div>
          </div>
        </div>

        {/* Controls & Code */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3.5">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Gölge Ayarları</span>
            </h3>

            {/* X Offset */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Yatay Konum (X):</span>
                <span className="font-mono text-purple-300">{x}px</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Y Offset */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Dikey Konum (Y):</span>
                <span className="font-mono text-purple-300">{y}px</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Blur */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Bulanıklık (Blur):</span>
                <span className="font-mono text-purple-300">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Spread */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Yayılma (Spread):</span>
                <span className="font-mono text-purple-300">{spread}px</span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                value={spread}
                onChange={(e) => setSpread(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Opacity */}
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Gölge Opaklığı:</span>
                <span className="font-mono text-purple-300">%{Math.round(opacity * 100)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Color & Inset */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300">Renk:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-7 h-7 rounded-lg bg-transparent border-0 cursor-pointer"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inset}
                  onChange={(e) => setInset(e.target.checked)}
                  className="rounded bg-black border-white/20 accent-purple-500 cursor-pointer"
                />
                <span>İç Gölge (Inset)</span>
              </label>
            </div>
          </div>

          {/* Code Box */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">Üretilen CSS Kodu</span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Kopyalandı!" : "Kopyala"}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={3}
              value={cssSnippet}
              className="w-full font-mono text-xs p-3 rounded-xl bg-black/85 border border-purple-500/20 text-emerald-400 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
