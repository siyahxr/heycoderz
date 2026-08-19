"use client";

import React, { useState, useRef } from "react";
import { Upload, Copy, Check, Sparkles, Image as ImageIcon, Trash2, FileCode, Layers } from "lucide-react";

export const ImageBase64Tool: React.FC = () => {
  const [base64Uri, setBase64Uri] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"uri" | "html" | "css" | "react">("uri");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBase64Uri(result);

      // Measure dimensions
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const getFormattedCode = () => {
    if (!base64Uri) return "";
    switch (activeTab) {
      case "html":
        return `<img src="${base64Uri}" alt="${fileName || 'image'}" width="${dimensions?.width || 'auto'}" height="${dimensions?.height || 'auto'}" />`;
      case "css":
        return `.custom-element {\n  background-image: url("${base64Uri}");\n  background-size: cover;\n  background-position: center;\n}`;
      case "react":
        return `// React / JSX Component\n<img\n  src="${base64Uri}"\n  alt="${fileName || 'image'}"\n  className="w-full h-auto rounded-xl"\n/>`;
      default:
        return base64Uri;
    }
  };

  const handleCopy = () => {
    const code = getFormattedCode();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setBase64Uri("");
    setFileName("");
    setFileSize(0);
    setDimensions(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Görsel / Dosya → Base64 Çevirici</h2>
            <p className="text-xs text-gray-400">
              Görselleri (PNG, JPG, SVG, WebP, GIF) tek tıkla Data URI, HTML &lt;img&gt; ve CSS formatlarına dönüştürün.
            </p>
          </div>
        </div>

        {fileSize > 0 && (
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
            <span>{fileName}</span>
            <span>•</span>
            <span className="text-purple-300">{(fileSize / 1024).toFixed(1)} KB</span>
            {dimensions && (
              <>
                <span>•</span>
                <span className="text-emerald-400">{dimensions.width}×{dimensions.height}px</span>
              </>
            )}
          </div>
        )}
      </div>

      {!base64Uri ? (
        /* Upload Area */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-3xl p-12 text-center bg-black/40 hover:bg-purple-950/10 transition-all cursor-pointer space-y-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Görseli buraya sürükleyin veya seçin</h3>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG, WebP, GIF ve ICO formatlarını destekler</p>
          </div>
        </div>
      ) : (
        /* Preview & Output */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-black/80 border border-purple-500/30 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <img
                src={base64Uri}
                alt="Preview"
                className="max-h-52 max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
              />
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-red-500/20 border border-white/10 text-xs text-gray-400 hover:text-red-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Görseli Değiştir / Temizle</span>
              </button>
            </div>
          </div>

          {/* Code Output with Format Tabs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("uri")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                    activeTab === "uri" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Data URI
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("html")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                    activeTab === "html" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  HTML &lt;img&gt;
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("css")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                    activeTab === "css" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  CSS Arka Plan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("react")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                    activeTab === "react" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  React JSX
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Kopyalandı!" : "Kodu Kopyala"}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={12}
              value={getFormattedCode()}
              className="w-full font-mono text-xs p-4 rounded-2xl bg-black/85 border border-purple-500/30 text-emerald-400 outline-none resize-none leading-relaxed break-all"
            />
          </div>
        </div>
      )}
    </div>
  );
};
