"use client";

import React, { useState } from "react";
import { BookOpen, Copy, Check, Terminal, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ReadmeRendererProps {
  content: string;
}

export const ReadmeRenderer: React.FC<ReadmeRendererProps> = ({ content }) => {
  const { t } = useLanguage();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!content || !content.trim()) {
    return (
      <div className="p-8 rounded-2xl bg-[#09090F]/80 border border-white/[0.08] text-center text-gray-500 space-y-2">
        <FileText className="w-8 h-8 text-gray-600 mx-auto" />
        <p className="text-xs">{t("repo.noReadme")}</p>
      </div>
    );
  }

  const handleCopyCodeBlock = (codeText: string, index: number) => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Custom high-performance Markdown parser for GitHub-like READMEs
  const renderMarkdown = () => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLang = "";
    let codeIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block Start / End
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          // Close code block
          const fullCode = codeBuffer.join("\n");
          const currentIndex = codeIndex++;
          elements.push(
            <div
              key={`code-${i}`}
              className="my-4 rounded-xl bg-[#050508] border border-purple-500/20 overflow-hidden shadow-lg"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.06] text-xs font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span className="uppercase text-[11px] text-purple-300">{codeLang || "code"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCodeBlock(fullCode, currentIndex)}
                  className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px]"
                >
                  {copiedIndex === currentIndex ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-gray-200 overflow-x-auto selection:bg-purple-500/40 leading-relaxed">
                {fullCode}
              </pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
          codeLang = "";
        } else {
          // Open code block
          inCodeBlock = true;
          codeLang = line.trim().replace(/^```/, "").trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Headings
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={`h1-${i}`}
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pb-3 mb-4 border-b border-white/[0.1] mt-6 first:mt-0"
          >
            {line.replace("# ", "")}
          </h1>
        );
        continue;
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-xl sm:text-2xl font-bold text-purple-200 tracking-tight pb-2 mb-3 border-b border-white/[0.06] mt-6"
          >
            {line.replace("## ", "")}
          </h2>
        );
        continue;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-base sm:text-lg font-semibold text-gray-100 mt-4 mb-2"
          >
            {line.replace("### ", "")}
          </h3>
        );
        continue;
      }

      // Blockquote
      if (line.startsWith("> ")) {
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-3 pl-4 py-1 border-l-4 border-purple-500 bg-purple-950/20 rounded-r-xl text-xs sm:text-sm text-gray-300 italic"
          >
            {line.replace("> ", "")}
          </blockquote>
        );
        continue;
      }

      // Horizontal Rule
      if (line.trim() === "---" || line.trim() === "***") {
        elements.push(<hr key={`hr-${i}`} className="my-5 border-white/[0.08]" />);
        continue;
      }

      // List Items
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        elements.push(
          <li key={`li-${i}`} className="ml-5 list-disc text-xs sm:text-sm text-gray-300 my-1 leading-relaxed">
            {line.trim().replace(/^[-*]\s+/, "")}
          </li>
        );
        continue;
      }

      if (/^\d+\.\s+/.test(line.trim())) {
        elements.push(
          <li key={`oli-${i}`} className="ml-5 list-decimal text-xs sm:text-sm text-gray-300 my-1 leading-relaxed">
            {line.trim().replace(/^\d+\.\s+/, "")}
          </li>
        );
        continue;
      }

      // Paragraph / Blank line
      if (line.trim() === "") {
        elements.push(<div key={`blank-${i}`} className="h-2" />);
      } else {
        elements.push(
          <p key={`p-${i}`} className="text-xs sm:text-sm text-gray-300 leading-relaxed my-2">
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div className="rounded-2xl bg-[#09090F]/90 border border-white/[0.08] shadow-2xl p-5 sm:p-8 backdrop-blur-md">
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-white/[0.08] text-xs font-mono font-bold text-purple-300">
        <BookOpen className="w-4 h-4 text-purple-400" />
        <span>{t("repo.readmeTitle")}</span>
      </div>

      <div className="prose prose-invert max-w-none text-gray-300 selection:bg-purple-500/30">
        {renderMarkdown()}
      </div>
    </div>
  );
};
