"use client";

import React, { useState, useMemo } from "react";
import { Palette, Copy, Check, Sparkles, CheckCircle2, XCircle, ArrowLeftRight } from "lucide-react";

export const ColorContrastTool: React.FC = () => {
  const [textColor, setTextColor] = useState("#a855f7");
  const [bgColor, setBgColor] = useState("#0a0518");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Calculate Relative Luminance
  const getLuminance = (hex: string) => {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    const r = ((num >> 16) & 255) / 255;
    const g = ((num >> 8) & 255) / 255;
    const b = (num & 255) / 255;

    const sRGB = [r, g, b].map((val) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  // WCAG Contrast Ratio
  const contrastRatio = useMemo(() => {
    try {
      const lum1 = getLuminance(textColor);
      const lum2 = getLuminance(bgColor);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      const ratio = (brightest + 0.05) / (darkest + 0.05);
      return Number(ratio.toFixed(2));
    } catch {
      return 1;
    }
  }, [textColor, bgColor]);

  const passes = {
    aaNormal: contrastRatio >= 4.5,
    aaLarge: contrastRatio >= 3.0,
    aaaNormal: contrastRatio >= 7.0,
    aaaLarge: contrastRatio >= 4.5,
  };

  const handleSwap = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(key);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Renk & WCAG Kontrast Denetleyicisi</h2>
            <p className="text-xs text-gray-400">
              Metin ve arka plan renk uyumunu test edin, WCAG 2.1 erişilebilirlik skorunu (AA / AAA) hesaplayın.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSwap}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-purple-400" />
          <span>Renkleri Yer Değiştir</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls & Scores */}
        <div className="lg:col-span-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Text Color Input */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-xs font-mono text-gray-400">Metin Rengi (Ön Plan)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-purple-500 uppercase"
                />
              </div>
            </div>

            {/* Bg Color Input */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <span className="text-xs font-mono text-gray-400">Arka Plan Rengi</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-purple-500 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Contrast Score Box */}
          <div className="p-6 rounded-3xl bg-black/80 border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-gray-400">Kontrast Oranı:</span>
              <div className="text-4xl font-extrabold font-mono text-white tracking-tight mt-1">
                {contrastRatio}:1
              </div>
            </div>

            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  passes.aaNormal
                    ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                    : "bg-red-950/60 border border-red-500/40 text-red-300"
                }`}
              >
                {passes.aaNormal ? "✓ Erişilebilir" : "✕ Yetersiz Kontrast"}
              </span>
            </div>
          </div>

          {/* WCAG Compliance Matrix */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${passes.aaNormal ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300" : "bg-red-950/20 border-red-500/30 text-red-300"}`}>
              <span>WCAG AA Normal</span>
              {passes.aaNormal ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            </div>

            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${passes.aaLarge ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300" : "bg-red-950/20 border-red-500/30 text-red-300"}`}>
              <span>WCAG AA Büyük Başlık</span>
              {passes.aaLarge ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            </div>

            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${passes.aaaNormal ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300" : "bg-red-950/20 border-red-500/30 text-red-300"}`}>
              <span>WCAG AAA Normal</span>
              {passes.aaaNormal ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            </div>

            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${passes.aaaLarge ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300" : "bg-red-950/20 border-red-500/30 text-red-300"}`}>
              <span>WCAG AAA Büyük Başlık</span>
              {passes.aaaLarge ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-6 space-y-4">
          <div
            style={{
              backgroundColor: bgColor,
              color: textColor,
            }}
            className="min-h-[360px] rounded-3xl p-8 border border-white/10 flex flex-col justify-between shadow-2xl transition-colors duration-200"
          >
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest opacity-75">
                Canlı Tipografi Önizlemesi
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight">
                heycoderz Developer Platform
              </h3>
              <p className="text-sm leading-relaxed opacity-90">
                Geliştiricilerin üretkenliğini artıran modern araçlar, zengin kaynaklar ve açık geliştirici topluluğu.
              </p>
            </div>

            <div className="pt-4 border-t border-current/20 flex items-center justify-between text-xs font-mono">
              <span>Arka Plan: {bgColor}</span>
              <span>Yazı Rengi: {textColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
