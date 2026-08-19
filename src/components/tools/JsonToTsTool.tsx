"use client";

import React, { useState, useEffect } from "react";
import { Code2, Copy, Check, Sparkles, Download, Trash2, ArrowRight } from "lucide-react";
import { generateTypeScriptFromJson, JsonToTsOptions } from "@/lib/jsonToTsGenerator";

const SAMPLE_JSONS = [
  {
    name: "Kullanıcı Profili",
    json: JSON.stringify(
      {
        id: 101,
        username: "efe",
        fullName: "Efe Taşkın",
        email: "efe@heycoderz.com",
        isActive: true,
        roles: ["admin", "developer"],
        profile: {
          bio: "Full-Stack Developer",
          avatarUrl: "https://heycoderz.com/avatar.jpg",
          social: {
            github: "https://github.com/heycoderz",
            instagram: "https://instagram.com/heycoderz",
          },
        },
        stats: {
          repos: 42,
          followers: 1250,
          starsReceived: 890,
        },
      },
      null,
      2
    ),
  },
  {
    name: "E-Ticaret Sipariş",
    json: JSON.stringify(
      {
        orderId: "ORD-99824",
        status: "processing",
        totalAmount: 1499.99,
        currency: "TRY",
        customer: {
          id: 450,
          name: "Ahmet Yılmaz",
          phone: "+90 555 123 4567",
        },
        items: [
          { sku: "KB-900", title: "Mekanik Klavye", price: 899.99, quantity: 1 },
          { sku: "MS-400", title: "Kablosuz Mouse", price: 600.0, quantity: 1 },
        ],
        shippingAddress: {
          city: "İstanbul",
          district: "Kadıköy",
          zipCode: "34710",
        },
      },
      null,
      2
    ),
  },
  {
    name: "GitHub API Repo",
    json: JSON.stringify(
      {
        id: 3049281,
        name: "heycoderz-core",
        full_name: "heycoderz/core",
        private: false,
        owner: {
          login: "heycoderz",
          id: 998,
          avatar_url: "https://avatars.githubusercontent.com/u/998",
          site_admin: false,
        },
        stargazers_count: 342,
        watchers_count: 50,
        language: "TypeScript",
        has_issues: true,
        license: {
          key: "mit",
          name: "MIT License",
          spdx_id: "MIT",
        },
      },
      null,
      2
    ),
  },
];

export const JsonToTsTool: React.FC = () => {
  const [inputJson, setInputJson] = useState(SAMPLE_JSONS[0].json);
  const [rootName, setRootName] = useState("UserResponse");
  const [kind, setKind] = useState<"interface" | "type">("interface");
  const [isReadonly, setIsReadonly] = useState(false);
  const [isOptional, setIsOptional] = useState(false);
  const [semicolons, setSemicolons] = useState(true);

  const [outputTs, setOutputTs] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputJson.trim()) {
      setOutputTs("");
      setErrorMessage(null);
      return;
    }
    const result = generateTypeScriptFromJson(inputJson, {
      rootName,
      kind,
      isReadonly,
      isOptional,
      semicolons,
    });

    if (result.error) {
      setErrorMessage(result.error);
      setOutputTs("");
    } else {
      setErrorMessage(null);
      setOutputTs(result.code);
    }
  }, [inputJson, rootName, kind, isReadonly, isOptional, semicolons]);

  const handleCopy = () => {
    if (!outputTs) return;
    navigator.clipboard.writeText(outputTs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputTs) return;
    const blob = new Blob([outputTs], { type: "text/typescript;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${rootName || "types"}.d.ts`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">JSON → TypeScript Dönüştürücü</h2>
              <p className="text-xs text-gray-400">
                JSON nesnelerinden ve dizilerinden anında tip güvenli Interface ve Type tanımları üretin.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_JSONS.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => {
                setInputJson(sample.json);
                if (sample.name.includes("Kullanıcı")) setRootName("UserResponse");
                else if (sample.name.includes("Sipariş")) setRootName("OrderResponse");
                else setRootName("GithubRepoResponse");
              }}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Options Bar */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">Ana Tip Adı:</span>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder="RootType"
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-purple-300 outline-none focus:border-purple-500 w-36"
            />
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setKind("interface")}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                kind === "interface" ? "bg-purple-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
              }`}
            >
              interface
            </button>
            <button
              type="button"
              onClick={() => setKind("type")}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                kind === "type" ? "bg-purple-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
              }`}
            >
              type
            </button>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isReadonly}
              onChange={(e) => setIsReadonly(e.target.checked)}
              className="rounded bg-black border-white/20 accent-purple-500 cursor-pointer"
            />
            <span>readonly</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isOptional}
              onChange={(e) => setIsOptional(e.target.checked)}
              className="rounded bg-black border-white/20 accent-purple-500 cursor-pointer"
            />
            <span>Opsiyonel (?)</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={semicolons}
              onChange={(e) => setSemicolons(e.target.checked)}
              className="rounded bg-black border-white/20 accent-purple-500 cursor-pointer"
            />
            <span>Noktalı Virgül (;)</span>
          </label>
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
            disabled={!outputTs}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.d.ts İndir</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!outputTs}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-40 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Kopyalandı!" : "TS Kopyala"}</span>
          </button>
        </div>
      </div>

      {/* Editor Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <span>Girdi JSON</span>
              <span className="text-[10px] text-gray-600">({inputJson.length} karakter)</span>
            </span>
          </div>
          <textarea
            rows={16}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Buraya JSON yapıştırın..."
            className="w-full font-mono text-xs p-4 rounded-2xl bg-black/70 border border-white/10 focus:border-purple-500 text-purple-200 outline-none resize-y leading-relaxed"
          />
        </div>

        {/* Right: Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <span>Üretilen TypeScript Kodları</span>
              {outputTs && <span className="text-[10px] text-emerald-400">✓ Başarılı</span>}
            </span>
          </div>
          {errorMessage ? (
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-red-300 font-mono text-xs h-[360px] overflow-auto">
              <p className="font-bold mb-2">❌ JSON Çözümleme Hatası:</p>
              <p className="text-red-400/90">{errorMessage}</p>
            </div>
          ) : (
            <textarea
              readOnly
              rows={16}
              value={outputTs || "// Sonuç burada üretilecek..."}
              className="w-full font-mono text-xs p-4 rounded-2xl bg-black/85 border border-purple-500/30 text-emerald-400 outline-none resize-y leading-relaxed"
            />
          )}
        </div>
      </div>
    </div>
  );
};
