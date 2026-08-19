"use client";

import React, { useState, useMemo } from "react";
import { GitCompare, Copy, Check, Sparkles, ArrowLeftRight, Trash2, Plus, Minus, FileCode } from "lucide-react";
import { computeLineDiff, DiffResult } from "@/lib/diffHelper";

const SAMPLE_DIFFS = [
  {
    name: "TypeScript Refactoring",
    original: `function calculateTotal(items: any[]) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.active) {
      total = total + item.price;
    }
  }
  return total;
}`,
    modified: `interface CartItem {
  id: string;
  price: number;
  active: boolean;
  taxRate?: number;
}

function calculateTotal(items: CartItem[]): number {
  return items
    .filter((item) => item.active)
    .reduce((acc, item) => acc + item.price * (item.taxRate ?? 1), 0);
}`,
  },
  {
    name: "React Component Güncellemesi",
    original: `export function UserCard(props) {
  return (
    <div className="card">
      <h3>{props.name}</h3>
      <p>{props.bio}</p>
    </div>
  );
}`,
    modified: `interface UserCardProps {
  name: string;
  bio?: string;
  avatarUrl?: string;
  onFollow?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ name, bio, avatarUrl, onFollow }) => {
  return (
    <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 flex items-center gap-3">
      {avatarUrl && <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full" />}
      <div className="flex-1">
        <h3 className="font-bold text-white text-sm">{name}</h3>
        <p className="text-xs text-gray-400">{bio || "Biyografi yok"}</p>
      </div>
      {onFollow && (
        <button onClick={onFollow} className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs">
          Takip Et
        </button>
      )}
    </div>
  );
};`,
  },
];

export const CodeDiffTool: React.FC = () => {
  const [originalCode, setOriginalCode] = useState(SAMPLE_DIFFS[0].original);
  const [modifiedCode, setModifiedCode] = useState(SAMPLE_DIFFS[0].modified);
  const [viewMode, setViewMode] = useState<"visual" | "raw">("visual");
  const [copied, setCopied] = useState(false);

  const diffResult: DiffResult = useMemo(() => {
    return computeLineDiff(originalCode, modifiedCode);
  }, [originalCode, modifiedCode]);

  const handleSwap = () => {
    const temp = originalCode;
    setOriginalCode(modifiedCode);
    setModifiedCode(temp);
  };

  const handleCopyUnified = () => {
    const unified = diffResult.lines
      .map((line) => {
        const prefix = line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ";
        return prefix + line.text;
      })
      .join("\n");
    navigator.clipboard.writeText(unified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Kod Diff & Fark Karşılaştırıcı</h2>
            <p className="text-xs text-gray-400">
              İki kod bloğu arasındaki satır bazlı eklemeleri, silmeleri ve düzenlemeleri görsel olarak inceleyin.
            </p>
          </div>
        </div>

        {/* Sample Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_DIFFS.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => {
                setOriginalCode(sample.original);
                setModifiedCode(sample.modified);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar & Diff Stats */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
        {/* Stats */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-400">
            <Plus className="w-3.5 h-3.5" />
            <span>+{diffResult.additions} Eklenen</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-400">
            <Minus className="w-3.5 h-3.5" />
            <span>-{diffResult.deletions} Silinen</span>
          </span>

          <span className="text-xs font-mono text-gray-500">
            {diffResult.unchanged} satır aynı
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("visual")}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                viewMode === "visual" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Görsel Diff
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                viewMode === "raw" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Metin Editörleri
            </button>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Orijinal ve Değiştirilmiş kodu yer değiştir"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-purple-400" />
            <span>Yer Değiştir</span>
          </button>

          <button
            type="button"
            onClick={handleCopyUnified}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Kopyalandı!" : "Diff Kopyala"}</span>
          </button>
        </div>
      </div>

      {/* Visual Diff View */}
      {viewMode === "visual" && (
        <div className="rounded-2xl border border-purple-500/30 bg-black/85 overflow-hidden font-mono text-xs shadow-2xl">
          <div className="p-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between text-gray-400 text-[11px]">
            <div className="flex items-center gap-4">
              <span className="w-12 text-center text-red-400">Eski</span>
              <span className="w-12 text-center text-emerald-400">Yeni</span>
              <span>Değişiklik Akışı</span>
            </div>
            <span>Unified Diff View</span>
          </div>

          <div className="max-h-[460px] overflow-y-auto divide-y divide-white/[0.03]">
            {diffResult.lines.map((line, idx) => {
              const isAdded = line.type === "added";
              const isRemoved = line.type === "removed";

              const rowBg = isAdded
                ? "bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/40"
                : isRemoved
                ? "bg-red-950/30 text-red-300 hover:bg-red-950/40"
                : "text-gray-300 hover:bg-white/[0.02]";

              const sign = isAdded ? "+" : isRemoved ? "-" : " ";

              return (
                <div key={idx} className={`flex items-stretch transition-colors ${rowBg}`}>
                  {/* Old line number */}
                  <div className="w-12 py-1 px-2 text-right text-[11px] text-gray-600 select-none border-r border-white/5 shrink-0">
                    {line.oldLineNumber || ""}
                  </div>

                  {/* New line number */}
                  <div className="w-12 py-1 px-2 text-right text-[11px] text-gray-600 select-none border-r border-white/5 shrink-0">
                    {line.newLineNumber || ""}
                  </div>

                  {/* Sign */}
                  <div className="w-6 py-1 text-center font-bold select-none shrink-0">
                    {sign}
                  </div>

                  {/* Line Content */}
                  <div className="py-1 px-3 flex-1 overflow-x-auto whitespace-pre">
                    {line.text || " "}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Raw Textareas View */}
      {viewMode === "raw" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-red-400 font-bold">Orijinal Kod (Eski):</label>
              <button
                type="button"
                onClick={() => setOriginalCode("")}
                className="text-xs text-gray-500 hover:text-red-400 cursor-pointer"
              >
                Temizle
              </button>
            </div>
            <textarea
              rows={16}
              value={originalCode}
              onChange={(e) => setOriginalCode(e.target.value)}
              placeholder="Orijinal kodunuz..."
              className="w-full font-mono text-xs p-4 rounded-2xl bg-black/70 border border-red-500/20 focus:border-red-500 text-red-200 outline-none resize-y leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-emerald-400 font-bold">Değiştirilmiş Kod (Yeni):</label>
              <button
                type="button"
                onClick={() => setModifiedCode("")}
                className="text-xs text-gray-500 hover:text-emerald-400 cursor-pointer"
              >
                Temizle
              </button>
            </div>
            <textarea
              rows={16}
              value={modifiedCode}
              onChange={(e) => setModifiedCode(e.target.value)}
              placeholder="Değiştirilmiş yeni kodunuz..."
              className="w-full font-mono text-xs p-4 rounded-2xl bg-black/70 border border-emerald-500/20 focus:border-emerald-500 text-emerald-200 outline-none resize-y leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};
