"use client";

import React, { useState, useMemo } from "react";
import { Search, Copy, Check, Sparkles, RefreshCw, Trash2, Replace, ListFilter } from "lucide-react";

const REGEX_PRESETS = [
  {
    name: "E-Posta (Email)",
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    flags: "gm",
    testText: "iletisim@heycoderz.com\ngecersiz-email\ndestek@heycoderz.org\nornek.kullanici+test@gmail.com",
    desc: "Standart e-posta adresi doğrulayıcı",
  },
  {
    name: "URL & Domain",
    pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
    flags: "gm",
    testText: "heycoderz web: https://heycoderz.com\nAPI: https://api.heycoderz.com/v1/users?page=1\nGeçersiz: htt://yanlis-link",
    desc: "HTTP/HTTPS web bağlantıları",
  },
  {
    name: "IPv4 Adresi",
    pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b",
    flags: "gm",
    testText: "Yerel host: 127.0.0.1\nGoogle DNS: 8.8.8.8\nGeçersiz IP: 999.300.1.2",
    desc: "0.0.0.0 ile 255.255.255.255 arası IP adresleri",
  },
  {
    name: "Hex Renk Kodu",
    pattern: "#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b",
    flags: "gm",
    testText: "Renkler: #8b5cf6, #FFF, #030303, #10b981\nGeçersiz: #12345, #ZZZ",
    desc: "#fff veya #ffffff formatındaki hex renkler",
  },
  {
    name: "Tarih (YYYY-MM-DD)",
    pattern: "\\b(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b",
    flags: "gm",
    testText: "Doğum: 2026-08-19\nEtkinlik: 2025-12-31\nHatalı: 2024-13-45",
    desc: "Yıl-Ay-Gün formatında tarih tespiti",
  },
  {
    name: "Kullanıcı Adı (Slug)",
    pattern: "^[a-zA-Z0-9_-]{3,16}$",
    flags: "gm",
    testText: "efe\nheycoderz_team\ndev-master\na*\ngecersiz!isim",
    desc: "3-16 karakter harf, sayı, alt çizgi ve tire",
  },
];

export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState(REGEX_PRESETS[0].pattern);
  const [flags, setFlags] = useState(REGEX_PRESETS[0].flags);
  const [testText, setTestText] = useState(REGEX_PRESETS[0].testText);
  const [activeTab, setActiveTab] = useState<"matches" | "replace">("matches");
  const [replaceStr, setReplaceStr] = useState("[DEĞİŞTİRİLDİ]");
  const [copied, setCopied] = useState(false);

  // Available Flag toggles
  const availableFlags = ["g", "i", "m", "s", "u"];

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags(flags + flag);
    }
  };

  const { regexError, matchDetails, replacedOutput } = useMemo(() => {
    if (!pattern) {
      return { regexError: null, matchDetails: [], replacedOutput: testText };
    }

    try {
      const reg = new RegExp(pattern, flags);
      const details: Array<{ match: string; index: number; groups: string[] }> = [];

      if (flags.includes("g")) {
        let m: RegExpExecArray | null;
        let iteration = 0;
        while ((m = reg.exec(testText)) !== null && iteration < 1000) {
          iteration++;
          details.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
          if (m.index === reg.lastIndex) {
            reg.lastIndex++;
          }
        }
      } else {
        const m = reg.exec(testText);
        if (m) {
          details.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
        }
      }

      let replaced = "";
      try {
        replaced = testText.replace(new RegExp(pattern, flags), replaceStr);
      } catch {
        replaced = testText;
      }

      return { regexError: null, matchDetails: details, replacedOutput: replaced };
    } catch (err: any) {
      return {
        regexError: err.message || "Geçersiz Regex Deseni",
        matchDetails: [],
        replacedOutput: testText,
      };
    }
  }, [pattern, flags, testText, replaceStr]);

  const handleCopy = () => {
    const textToCopy =
      activeTab === "matches"
        ? matchDetails.map((m, i) => `${i + 1}. [İndeks ${m.index}]: ${m.match}`).join("\n")
        : replacedOutput;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Regex Test Edici & Eşleşme İnceleyici</h2>
            <p className="text-xs text-gray-400">
              Düzenli ifadeleri (Regular Expressions) bayraklarla anında test edin, yakalama gruplarını inceleyin ve değiştirin.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {REGEX_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setPattern(preset.pattern);
                setFlags(preset.flags);
                setTestText(preset.testText);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern & Flags Inputs */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8 flex items-center bg-black/70 rounded-2xl border border-purple-500/30 focus-within:border-purple-500 px-4 py-2.5">
            <span className="font-mono text-purple-400 text-lg mr-2 font-bold">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Regex deseni yazın..."
              className="w-full bg-transparent font-mono text-xs text-purple-200 outline-none"
            />
            <span className="font-mono text-purple-400 text-lg ml-2 font-bold">/</span>
          </div>

          <div className="sm:col-span-4 flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-mono text-gray-500 pl-2">Bayraklar:</span>
            {availableFlags.map((f) => {
              const active = flags.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFlag(f)}
                  className={`w-7 h-7 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                      : "bg-white/[0.04] text-gray-400 hover:text-white"
                  }`}
                  title={`Flag: ${f}`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {regexError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300">
            ⚠️ Hata: {regexError}
          </div>
        )}
      </div>

      {/* Editor & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Test Text Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">Test Edilecek Metin</span>
            <button
              type="button"
              onClick={() => setTestText("")}
              className="text-xs text-gray-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Temizle</span>
            </button>
          </div>
          <textarea
            rows={14}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Buraya test edilecek metni yazın..."
            className="w-full font-mono text-xs p-4 rounded-2xl bg-black/70 border border-white/10 focus:border-purple-500 text-purple-200 outline-none resize-y leading-relaxed"
          />
        </div>

        {/* Right: Results / Replace Tabs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("matches")}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "matches" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Eşleşmeler ({matchDetails.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("replace")}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "replace" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Replace className="w-3.5 h-3.5" />
                <span>Değiştir (Replace)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Kopyalandı!" : "Sonucu Kopyala"}</span>
            </button>
          </div>

          {activeTab === "matches" ? (
            <div className="h-[340px] p-4 rounded-2xl bg-black/85 border border-purple-500/30 font-mono text-xs overflow-y-auto space-y-2 leading-relaxed">
              {matchDetails.length > 0 ? (
                matchDetails.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 space-y-1 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-gray-400 text-[11px]">
                      <span className="text-purple-300 font-bold">#{idx + 1} Eşleşme</span>
                      <span>İndeks: {m.index}</span>
                    </div>
                    <div className="text-emerald-300 font-bold break-all bg-black/50 p-2 rounded-lg border border-white/5">
                      {m.match}
                    </div>
                    {m.groups.length > 0 && (
                      <div className="pt-1 text-[11px] text-gray-400">
                        <span className="text-purple-400">Yakalama Grupları: </span>
                        {m.groups.map((g, gi) => (
                          <span key={gi} className="mr-2 text-sky-300 font-mono">
                            ${gi + 1}: &quot;{g}&quot;
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                  <Search className="w-8 h-8 opacity-40" />
                  <p>Hiçbir eşleşme bulunamadı.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">Yerine Konulacak Metin:</label>
                <input
                  type="text"
                  value={replaceStr}
                  onChange={(e) => setReplaceStr(e.target.value)}
                  placeholder="$1 veya yeni metin..."
                  className="w-full font-mono text-xs p-3 rounded-xl bg-black/70 border border-white/10 text-white outline-none focus:border-purple-500"
                />
              </div>

              <textarea
                readOnly
                rows={10}
                value={replacedOutput}
                className="w-full font-mono text-xs p-4 rounded-2xl bg-black/85 border border-purple-500/30 text-emerald-400 outline-none resize-none leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
