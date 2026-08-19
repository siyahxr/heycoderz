"use client";

import React, { useState, useEffect } from "react";
import { FileJson, Copy, Check, Sparkles, Download, Trash2, ArrowUpDown, Minimize2, Maximize2, Wand2 } from "lucide-react";

const SAMPLE_JSONS = [
  {
    name: "API Yanıtı",
    raw: '{"status":"success","code":200,"data":{"users":[{"id":1,"name":"Efe","role":"admin"},{"id":2,"name":"Öykü","role":"admin"}],"meta":{"total":2,"page":1,"perPage":10}}}',
  },
  {
    name: "Karmaşık Konfigürasyon",
    raw: '{"app":{"name":"heycoderz","version":"2.6.0","features":{"auth":true,"realtime":true,"darkmode":true}},"database":{"host":"localhost","port":5432,"ssl":true,"pool":{"min":2,"max":10}},"cache":{"enabled":true,"ttl":3600}}',
  },
];

export const JsonFormatterTool: React.FC = () => {
  const [inputJson, setInputJson] = useState(SAMPLE_JSONS[0].raw);
  const [outputJson, setOutputJson] = useState("");
  const [indentOption, setIndentOption] = useState<"2" | "4" | "tab">("2");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ originalSize: number; outputSize: number; keyCount: number } | null>(null);

  const formatJson = (mode: "beautify" | "minify", sortKeys = false) => {
    if (!inputJson.trim()) {
      setOutputJson("");
      setErrorMsg(null);
      setStats(null);
      return;
    }

    try {
      let parsed = JSON.parse(inputJson);

      if (sortKeys) {
        parsed = sortObjectKeys(parsed);
      }

      let formatted = "";
      if (mode === "minify") {
        formatted = JSON.stringify(parsed);
      } else {
        const indent = indentOption === "tab" ? "\t" : Number(indentOption);
        formatted = JSON.stringify(parsed, null, indent);
      }

      setOutputJson(formatted);
      setErrorMsg(null);

      // Compute stats
      const originalSize = new Blob([inputJson]).size;
      const outputSize = new Blob([formatted]).size;
      const keyCount = countKeys(parsed);
      setStats({ originalSize, outputSize, keyCount });
    } catch (err: any) {
      setErrorMsg(err.message || "Geçersiz JSON yapısı");
      setOutputJson("");
      setStats(null);
    }
  };

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    }
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj)
        .sort()
        .reduce((acc: any, key) => {
          acc[key] = sortObjectKeys(obj[key]);
          return acc;
        }, {});
    }
    return obj;
  };

  const countKeys = (obj: any): number => {
    let count = 0;
    if (Array.isArray(obj)) {
      for (const item of obj) count += countKeys(item);
    } else if (obj !== null && typeof obj === "object") {
      count += Object.keys(obj).length;
      for (const key of Object.keys(obj)) {
        count += countKeys(obj[key]);
      }
    }
    return count;
  };

  const handleFixCommonIssues = () => {
    try {
      let fixed = inputJson
        // Replace single quotes with double quotes
        .replace(/'/g, '"')
        // Quote unquoted keys: foo: -> "foo":
        .replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":')
        // Remove trailing commas
        .replace(/,\s*([}\]])/g, "$1");

      setInputJson(fixed);
    } catch { }
  };

  useEffect(() => {
    formatJson("beautify");
  }, [inputJson, indentOption]);

  const handleCopy = () => {
    if (!outputJson) return;
    navigator.clipboard.writeText(outputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputJson) return;
    const blob = new Blob([outputJson], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">JSON Biçimlendirici, Doğrulayıcı & Sıkıştırıcı</h2>
            <p className="text-xs text-gray-400">
              Karmaşık veya minify edilmiş JSON verilerini güzelleştirin, sıralayın, syntax hatalarını yakalayın ve sıkıştırın.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {SAMPLE_JSONS.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => setInputJson(sample.raw)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Options Toolbar */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setIndentOption("2")}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                indentOption === "2" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              2 Boşluk
            </button>
            <button
              type="button"
              onClick={() => setIndentOption("4")}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                indentOption === "4" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              4 Boşluk
            </button>
            <button
              type="button"
              onClick={() => setIndentOption("tab")}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                indentOption === "tab" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Tab
            </button>
          </div>

          <button
            type="button"
            onClick={() => formatJson("beautify", true)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Anahtarları alfabetik A-Z sırala"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
            <span>Anahtarları Sırala (A-Z)</span>
          </button>

          <button
            type="button"
            onClick={() => formatJson("minify")}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sıkıştır (Minify)</span>
          </button>

          <button
            type="button"
            onClick={handleFixCommonIssues}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-purple-300 hover:text-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Tırnak ve virgül hatalarını otomatik düzeltmeyi dene"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Sözdizimi Onar</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInputJson("")}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-red-500/20 border border-white/10 text-xs text-gray-400 hover:text-red-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!outputJson}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.json İndir</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!outputJson}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-40 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Kopyalandı!" : "Kopyala"}</span>
          </button>
        </div>
      </div>

      {/* Editor Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">Ham / Düzenlenecek JSON</span>
            {stats && (
              <span className="text-[11px] font-mono text-gray-500">
                Girdi Boyutu: {stats.originalSize} bayt
              </span>
            )}
          </div>
          <textarea
            rows={16}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Buraya JSON yapıştırın veya yazın..."
            className="w-full font-mono text-xs p-4 rounded-2xl bg-black/70 border border-white/10 focus:border-purple-500 text-purple-200 outline-none resize-y leading-relaxed"
          />
        </div>

        {/* Right: Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">Biçimlendirilmiş Sonuç</span>
            {stats && !errorMsg && (
              <span className="text-[11px] font-mono text-emerald-400">
                {stats.outputSize} bayt • {stats.keyCount} anahtar
              </span>
            )}
          </div>

          {errorMsg ? (
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-red-300 font-mono text-xs h-[360px] overflow-auto">
              <p className="font-bold mb-2">❌ Geçersiz JSON Hatası:</p>
              <p className="text-red-400/90 leading-relaxed">{errorMsg}</p>
              <div className="mt-4 pt-3 border-t border-red-500/20 text-[11px] text-gray-400">
                İpucu: Tırnak işaretlerini ("...") kontrol edin veya &quot;Sözdizimi Onar&quot; butonunu deneyin.
              </div>
            </div>
          ) : (
            <textarea
              readOnly
              rows={16}
              value={outputJson || "// Biçimlendirilmiş çıktı..."}
              className="w-full font-mono text-xs p-4 rounded-2xl bg-black/85 border border-purple-500/30 text-emerald-400 outline-none resize-y leading-relaxed"
            />
          )}
        </div>
      </div>
    </div>
  );
};
