"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, FileCode2 } from "lucide-react";

interface CodeSnippet {
  fileName: string;
  lang: string;
  codeLines: Array<{
    num: number;
    tokens: React.ReactNode;
  }>;
  rawText: string;
}

const snippets: Record<string, CodeSnippet> = {
  "index.js": {
    fileName: "index.js",
    lang: "JavaScript (ES2026)",
    rawText: `const heyCoderz = {
    mission: "Geliştiricileri güçlendirmek",
    araçlar: ["Code Tools", "Generators", "Converters"],
    topluluk: true,
    üretkenlik: "Yüksek 🚀"
};

function birles(tutku, kod) {
    return gelistir(tutku + kod);
}

birles("Tutku", "Kod");`,
    codeLines: [
      {
        num: 1,
        tokens: (
          <>
            <span className="text-pink-400 font-semibold">const</span>{" "}
            <span className="text-amber-300">heyCoderz</span>{" "}
            <span className="text-gray-400">=</span>{" "}
            <span className="text-purple-300">&#123;</span>
          </>
        ),
      },
      {
        num: 2,
        tokens: (
          <span className="pl-4 inline-block">
            <span className="text-sky-300">mission</span>
            <span className="text-gray-400">:</span>{" "}
            <span className="text-emerald-400">&quot;Geliştiricileri güçlendirmek&quot;</span>
            <span className="text-gray-400">,</span>
          </span>
        ),
      },
      {
        num: 3,
        tokens: (
          <span className="pl-4 inline-block">
            <span className="text-sky-300">araçlar</span>
            <span className="text-gray-400">:</span>{" "}
            <span className="text-purple-300">[</span>
            <span className="text-emerald-400">&quot;Code Tools&quot;</span>
            <span className="text-gray-400">, </span>
            <span className="text-emerald-400">&quot;Generators&quot;</span>
            <span className="text-gray-400">, </span>
            <span className="text-emerald-400">&quot;Converters&quot;</span>
            <span className="text-purple-300">]</span>
            <span className="text-gray-400">,</span>
          </span>
        ),
      },
      {
        num: 4,
        tokens: (
          <span className="pl-4 inline-block">
            <span className="text-sky-300">topluluk</span>
            <span className="text-gray-400">:</span>{" "}
            <span className="text-orange-400 font-medium">true</span>
            <span className="text-gray-400">,</span>
          </span>
        ),
      },
      {
        num: 5,
        tokens: (
          <span className="pl-4 inline-block">
            <span className="text-sky-300">üretkenlik</span>
            <span className="text-gray-400">:</span>{" "}
            <span className="text-emerald-400">&quot;Yüksek 🚀&quot;</span>
          </span>
        ),
      },
      {
        num: 6,
        tokens: (
          <>
            <span className="text-purple-300">&#125;</span>
            <span className="text-gray-400">;</span>
          </>
        ),
      },
      {
        num: 7,
        tokens: <>&nbsp;</>,
      },
      {
        num: 8,
        tokens: (
          <>
            <span className="text-pink-400 font-semibold">function</span>{" "}
            <span className="text-yellow-300">birles</span>
            <span className="text-gray-400">(</span>
            <span className="text-sky-300">tutku</span>
            <span className="text-gray-400">, </span>
            <span className="text-sky-300">kod</span>
            <span className="text-gray-400">) &#123;</span>
          </>
        ),
      },
      {
        num: 9,
        tokens: (
          <span className="pl-4 inline-block">
            <span className="text-pink-400 font-semibold">return</span>{" "}
            <span className="text-yellow-300">gelistir</span>
            <span className="text-gray-400">(</span>
            <span className="text-sky-300">tutku</span>{" "}
            <span className="text-pink-400">+</span>{" "}
            <span className="text-sky-300">kod</span>
            <span className="text-gray-400">);</span>
          </span>
        ),
      },
      {
        num: 10,
        tokens: (
          <span className="text-purple-300">&#125;</span>
        ),
      },
      {
        num: 11,
        tokens: <>&nbsp;</>,
      },
      {
        num: 12,
        tokens: (
          <>
            <span className="text-yellow-300">birles</span>
            <span className="text-gray-400">(</span>
            <span className="text-emerald-400">&quot;Tutku&quot;</span>
            <span className="text-gray-400">, </span>
            <span className="text-emerald-400">&quot;Kod&quot;</span>
            <span className="text-gray-400">);</span>
          </>
        ),
      },
    ],
  },
  "tools.config.ts": {
    fileName: "tools.config.ts",
    lang: "TypeScript",
    rawText: `export const devTools = {
    theme: "futuristic-dark",
    speed: "instant",
    modules: ["formatter", "regex", "apiMock", "encoder"],
    ready: true
};`,
    codeLines: [
      {
        num: 1,
        tokens: (
          <>
            <span className="text-pink-400 font-semibold">export const</span>{" "}
            <span className="text-amber-300">devTools</span>{" "}
            <span className="text-gray-400">=</span>{" "}
            <span className="text-purple-300">&#123;</span>
          </>
        ),
      },
      {
        num: 2,
        tokens: (
          <span className="pl-4 inline-block">
            <span className="text-sky-300">theme</span>
            <span className="text-gray-400">:</span>{" "}
            <span className="text-emerald-400">&quot;futuristic-dark&quot;</span>
            <span className="text-gray-400">,</span>
          </span>
        ),
      },
      {
        num: 3,
        tokens: (
          <span className="pl-4 inline-block">
            <span className="text-sky-300">speed</span>
            <span className="text-gray-400">:</span>{" "}
            <span className="text-emerald-400">&quot;instant&quot;</span>
            <span className="text-gray-400">,</span>
          </span>
        ),
      },
      {
        num: 4,
        tokens: (
          <span className="pl-4 inline-block">
            <span className="text-sky-300">modules</span>
            <span className="text-gray-400">:</span>{" "}
            <span className="text-purple-300">[</span>
            <span className="text-emerald-400">&quot;formatter&quot;</span>
            <span className="text-gray-400">, </span>
            <span className="text-emerald-400">&quot;regex&quot;</span>
            <span className="text-gray-400">, </span>
            <span className="text-emerald-400">&quot;apiMock&quot;</span>
            <span className="text-purple-300">]</span>
            <span className="text-gray-400">,</span>
          </span>
        ),
      },
      {
        num: 5,
        tokens: (
          <span className="pl-4 inline-block">
            <span className="text-sky-300">ready</span>
            <span className="text-gray-400">:</span>{" "}
            <span className="text-orange-400 font-medium">true</span>
          </span>
        ),
      },
      {
        num: 6,
        tokens: (
          <>
            <span className="text-purple-300">&#125;</span>
            <span className="text-gray-400">;</span>
          </>
        ),
      },
    ],
  },
};

export const CodeEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("index.js");
  const [copied, setCopied] = useState(false);
  const [windowState, setWindowState] = useState<"normal" | "collapsed">("normal");

  const currentSnippet = snippets[activeTab] || snippets["index.js"];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none group">
      {/* Ambient background glow layers */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/30 via-indigo-600/25 to-blue-600/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Code Editor Card */}
      <div className="relative rounded-2xl bg-[#09090F]/95 backdrop-blur-2xl border border-purple-500/25 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.15)] overflow-hidden transition-all duration-300 group-hover:border-purple-500/40">
        
        {/* Top Window Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-white/[0.03] border-b border-white/[0.07] select-none">
          {/* Window Dot Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert("heycoderz IDE: Pencereyi kapatamazsınız, kodlamaya devam! 🚀")}
              className="w-3 h-3 rounded-full bg-[#EF4444]/80 border border-[#DC2626] shadow-[0_0_6px_rgba(239,68,68,0.4)] hover:opacity-100 cursor-pointer"
              title="Kapat"
            />
            <button
              type="button"
              onClick={() => setWindowState(windowState === "normal" ? "collapsed" : "normal")}
              className="w-3 h-3 rounded-full bg-[#F59E0B]/80 border border-[#D97706] shadow-[0_0_6px_rgba(245,158,11,0.4)] hover:opacity-100 cursor-pointer"
              title={windowState === "normal" ? "Küçült" : "Genişlet"}
            />
            <button
              type="button"
              onClick={() => alert("heycoderz IDE: Tam ekran modundasınız!")}
              className="w-3 h-3 rounded-full bg-[#10B981]/80 border border-[#059669] shadow-[0_0_6px_rgba(16,185,129,0.4)] hover:opacity-100 cursor-pointer"
              title="Tam Ekran"
            />
          </div>

          {/* Centered Filename with Tabs & Status indicator */}
          <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-black/40 border border-white/[0.06]">
            {Object.keys(snippets).map((fileName) => (
              <button
                key={fileName}
                type="button"
                onClick={() => setActiveTab(fileName)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  activeTab === fileName
                    ? "bg-purple-950/60 text-white font-medium border border-purple-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {activeTab === fileName && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                )}
                <span>{fileName}</span>
              </button>
            ))}
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-lg text-xs font-mono text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all duration-200 cursor-pointer active:scale-95"
            title="Kodu kopyala"
            aria-label="Kodu kopyala"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Kopyala</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content Area */}
        {windowState === "normal" ? (
          <div className="p-5 sm:p-6 font-mono text-xs sm:text-[13.5px] leading-relaxed overflow-x-auto selection:bg-purple-500/30">
            <div className="table w-full border-collapse">
              {currentSnippet.codeLines.map((line) => (
                <div key={line.num} className="table-row">
                  <span className="table-cell pr-4 text-right text-gray-600 select-none text-xs w-6">
                    {line.num}
                  </span>
                  <span className="table-cell">{line.tokens}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-xs font-mono text-gray-500">
            Pencere küçültüldü. Genişletmek için sarı noktaya tıklayın.
          </div>
        )}

        {/* Editor Bottom Status Bar */}
        <div className="px-5 py-2.5 bg-black/40 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>{currentSnippet.lang}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>UTF-8</span>
            <span>Ln {currentSnippet.codeLines.length}, Col 1</span>
          </div>
        </div>

      </div>
    </div>
  );
};
