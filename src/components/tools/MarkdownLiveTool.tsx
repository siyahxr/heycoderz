"use client";

import React, { useState, useMemo } from "react";
import { FileText, Copy, Check, Download, Trash2, Eye, Code, Sparkles, BookOpen } from "lucide-react";

const SAMPLE_MARKDOWN = `# heycoderz Geliştirici Platformu

Modern geliştiriciler için tasarlanmış **üretkenlik araçları** ve *topluluk ekosistemi*.

---

## 🚀 Öne Çıkan Özellikler
- **Hızlı & Güvenli**: Tüm işlemler %100 tarayıcı üzerinde yerel çalışır.
- **Tip Güvenliği**: JSON'dan TypeScript'e otomatik dönüşüm.
- **Zengin Araç Kiti**: 12+ aktif geliştirici aracı.

### 💻 Kod Örneği

\`\`\`typescript
interface Developer {
  name: string;
  skills: string[];
  isProductive: boolean;
}

const coder: Developer = {
  name: "Efe",
  skills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  isProductive: true,
};
\`\`\`

### 📊 Karşılaştırma Tablosu

| Özellik | Standart Araçlar | heycoderz |
| :--- | :---: | :---: |
| Gizlilik & Yerel Çalışma | ❌ Sunucuya Gider | ✅ %100 Yerel |
| Hız & Tepki Süresi | 🐢 Yavaş | ⚡ Anında |
| Tasarım | 📦 Basit | ✨ Modern & Dark |

> **İpucu:** Bu editörde yazdığınız tüm markdown anında canlı HTML olarak işlenir ve kopyalanabilir!
`;

export const MarkdownLiveTool: React.FC = () => {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  // Parse markdown to HTML (safe client-side converter)
  const htmlOutput = useMemo(() => {
    let raw = markdown;

    // Headers
    raw = raw.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-purple-300 mt-4 mb-2">$1</h3>');
    raw = raw.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-6 mb-3 pb-1 border-b border-white/10">$1</h2>');
    raw = raw.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-white mt-2 mb-4">$1</h1>');

    // Blockquotes
    raw = raw.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-950/20 rounded-r-xl text-purple-200 text-xs italic">$1</blockquote>');

    // Horizontal Rules
    raw = raw.replace(/^---$/gim, '<hr class="my-6 border-white/10" />');

    // Bold & Italic
    raw = raw.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    raw = raw.replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-bold">$1</strong>');
    raw = raw.replace(/\*(.*?)\*/gim, '<em class="text-purple-200 italic">$1</em>');

    // Inline Code
    raw = raw.replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono text-[11px]">$1</code>');

    // Code blocks
    raw = raw.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/gim, (match, lang, code) => {
      return `<div class="my-4 rounded-xl overflow-hidden border border-purple-500/20 bg-black/80"><div class="px-3 py-1 bg-white/[0.03] border-b border-white/10 text-[10px] font-mono text-gray-400">${lang || "code"}</div><pre class="p-3 text-xs font-mono text-emerald-400 overflow-x-auto"><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre></div>`;
    });

    // Unordered lists
    raw = raw.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-gray-300 text-xs my-1">$1</li>');

    // Tables simple parsing
    const lines = raw.split("\n");
    let inTable = false;
    let tableHtml = "";
    const parsedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("|") && line.endsWith("|")) {
        if (!inTable) {
          inTable = true;
          tableHtml = '<div class="my-4 overflow-x-auto rounded-xl border border-white/10"><table class="w-full text-xs text-left font-mono border-collapse">';
          const headers = line.split("|").slice(1, -1);
          tableHtml += '<thead class="bg-white/[0.04] text-purple-300 border-b border-white/10"><tr>' + headers.map(h => `<th class="p-2.5">${h.trim()}</th>`).join("") + '</tr></thead><tbody>';
        } else if (line.includes("---")) {
          // delimiter line, skip
          continue;
        } else {
          const cells = line.split("|").slice(1, -1);
          tableHtml += '<tr class="border-b border-white/5 hover:bg-white/[0.02]">' + cells.map(c => `<td class="p-2.5 text-gray-300">${c.trim()}</td>`).join("") + '</tr>';
        }
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += '</tbody></table></div>';
          parsedLines.push(tableHtml);
          tableHtml = "";
        }
        parsedLines.push(line);
      }
    }
    if (inTable) {
      tableHtml += '</tbody></table></div>';
      parsedLines.push(tableHtml);
    }

    raw = parsedLines.join("\n");

    // Paragraphs
    raw = raw.replace(/\n\n/g, '<div class="my-2"></div>');

    return raw;
  }, [markdown]);

  // Statistics
  const wordCount = useMemo(() => {
    return markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  }, [markdown]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlOutput);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyMd = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Markdown Canlı Stüdyo & HTML Dönüştürücü</h2>
            <p className="text-xs text-gray-400">
              Gerçek zamanlı GitHub biçimlendirmesiyle Markdown yazın, önizleyin ve HTML olarak dışa aktarın.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400 bg-white/[0.03] px-3 py-1 rounded-lg border border-white/5">
            {wordCount} Kelime • ~{readingTime} dk okuma
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMarkdown(SAMPLE_MARKDOWN)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            Örnek Doküman
          </button>
          <button
            type="button"
            onClick={() => setMarkdown("")}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-red-500/20 border border-white/10 text-xs text-gray-400 hover:text-red-300 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadMd}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.md İndir</span>
          </button>
          <button
            type="button"
            onClick={handleCopyHtml}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-purple-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Code className="w-3.5 h-3.5" />}
            <span>{copiedHtml ? "HTML Kopyalandı!" : "HTML Kopyala"}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyMd}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? "Kopyalandı!" : "Markdown Kopyala"}</span>
          </button>
        </div>
      </div>

      {/* Editor & Live Render Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-mono text-gray-400">Markdown Girdisi:</label>
          <textarea
            rows={18}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="# Başlık..."
            className="w-full font-mono text-xs p-4 rounded-2xl bg-black/70 border border-white/10 focus:border-purple-500 text-purple-200 outline-none resize-y leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>Canlı Önizleme (Render)</span>
            </label>
          </div>
          <div
            className="w-full min-h-[380px] max-h-[500px] overflow-y-auto p-5 rounded-2xl bg-black/85 border border-purple-500/30 text-gray-200 text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlOutput || "<span class='text-gray-600'>Önizleme burada görüntülenecek...</span>" }}
          />
        </div>
      </div>
    </div>
  );
};
