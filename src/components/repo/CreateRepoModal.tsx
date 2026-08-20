"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  FolderPlus, 
  Code2, 
  Upload, 
  Plus, 
  Trash2, 
  FileText, 
  Globe2, 
  Lock, 
  Sparkles, 
  Check, 
  Layers
} from "lucide-react";
import { RepoFile, useRepo } from "@/context/RepoContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface CreateRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATES: Record<string, { desc: string; lang: string; category: "web" | "backend" | "ai" | "tools" | "games"; tags: string[]; files: RepoFile[] }> = {
  blank: {
    desc: "Temel README.md dosyası içeren boş bir depo.",
    lang: "TypeScript",
    category: "web",
    tags: ["open-source"],
    files: [
      {
        name: "README.md",
        path: "README.md",
        size: "350 B",
        language: "markdown",
        content: `# Proje Başlığı\n\nBu depo Hey! Coder'z ekosisteminde paylaşıldı.\n\n## 🚀 Başlangıç\n\nProjenizi buraya açıklayın.`,
      },
    ],
  },
  nextjs: {
    desc: "Next.js App Router, Tailwind CSS ve TypeScript hazır şablonu.",
    lang: "TypeScript",
    category: "web",
    tags: ["nextjs", "react", "typescript", "tailwind"],
    files: [
      {
        name: "README.md",
        path: "README.md",
        size: "450 B",
        language: "markdown",
        content: `# ⚡ Next.js Modern Web Starter\n\nHey! Coder'z Next.js 16 + React 19 hızlı başlangıç şablonu.\n\n## 📦 Kurulum\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,
      },
      {
        name: "page.tsx",
        path: "src/app/page.tsx",
        size: "600 B",
        language: "typescript",
        content: `export default function HomePage() {\n  return (\n    <main className="min-h-screen flex items-center justify-center bg-black text-white">\n      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">\n        Hey! Coder'z Next.js Starter\n      </h1>\n    </main>\n  );\n}`,
      },
      {
        name: "package.json",
        path: "package.json",
        size: "380 B",
        language: "json",
        content: `{\n  "name": "nextjs-starter",\n  "version": "0.1.0",\n  "private": true,\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build"\n  }\n}`,
      },
    ],
  },
  fastapi: {
    desc: "Python FastAPI, Pydantic ve Docker hazır mikroservis.",
    lang: "Python",
    category: "backend",
    tags: ["python", "fastapi", "docker", "api"],
    files: [
      {
        name: "README.md",
        path: "README.md",
        size: "400 B",
        language: "markdown",
        content: `# 🐍 FastAPI Microservice\n\nAsenkron Python API şablonu.\n\n## 🏃 Çalıştırma\n\`\`\`bash\nuvicorn main:app --reload\n\`\`\``,
      },
      {
        name: "main.py",
        path: "main.py",
        size: "500 B",
        language: "python",
        content: `from fastapi import FastAPI\n\napp = FastAPI(title="HeyCoderz API")\n\n@app.get("/")\ndef home():\n    return {"status": "online", "platform": "heycoderz"}`,
      },
      {
        name: "requirements.txt",
        path: "requirements.txt",
        size: "80 B",
        language: "python",
        content: `fastapi>=0.115.0\nuvicorn[standard]>=0.30.0\npydantic>=2.8.0`,
      },
    ],
  },
  web: {
    desc: "Saf HTML, CSS ve JavaScript canlı web sayfası projesi.",
    lang: "JavaScript",
    category: "web",
    tags: ["html", "css", "javascript", "vanilla"],
    files: [
      {
        name: "README.md",
        path: "README.md",
        size: "250 B",
        language: "markdown",
        content: `# 🌐 Vanilla Web Projesi\n\nHTML, CSS ve JavaScript ile geliştirilmiş modern web arayüzü.`,
      },
      {
        name: "index.html",
        path: "index.html",
        size: "450 B",
        language: "html",
        content: `<!DOCTYPE html>\n<html lang="tr">\n<head>\n  <meta charset="UTF-8">\n  <title>Hey! Coder'z Projesi</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Merhaba Dünya!</h1>\n  <script src="script.js"></script>\n</body>\n</html>`,
      },
      {
        name: "style.css",
        path: "style.css",
        size: "300 B",
        language: "css",
        content: `body {\n  margin: 0;\n  background: #030303;\n  color: #fff;\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}`,
      },
      {
        name: "script.js",
        path: "script.js",
        size: "150 B",
        language: "javascript",
        content: `console.log("Hey! Coder'z projesi başarıyla yüklendi.");`,
      },
    ],
  },
};

export const CreateRepoModal: React.FC<CreateRepoModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { createRepository } = useRepo();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [primaryLanguage, setPrimaryLanguage] = useState("TypeScript");
  const [category, setCategory] = useState<"web" | "backend" | "ai" | "tools" | "games">("web");
  const [isPublic, setIsPublic] = useState(true);
  const [tagsInput, setTagsInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("nextjs");
  const [files, setFiles] = useState<RepoFile[]>(TEMPLATES.nextjs.files);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  // New file input sub-form
  const [showAddFile, setShowAddFile] = useState(false);
  const [newFilePath, setNewFilePath] = useState("");

  if (!isOpen) return null;

  const handleTemplateChange = (tmplKey: string) => {
    setSelectedTemplate(tmplKey);
    const tmpl = TEMPLATES[tmplKey];
    if (tmpl) {
      setPrimaryLanguage(tmpl.lang);
      setCategory(tmpl.category);
      setTagsInput(tmpl.tags.join(", "));
      setFiles(JSON.parse(JSON.stringify(tmpl.files)));
      setActiveFileIndex(0);
    }
  };

  const handleFileContentChange = (index: number, content: string) => {
    const updated = [...files];
    const bytes = new Blob([content]).size;
    const sizeStr = bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
    updated[index] = {
      ...updated[index],
      content,
      size: sizeStr,
    };
    setFiles(updated);
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath.trim()) return;

    const path = newFilePath.trim();
    const name = path.split("/").pop() || path;
    const ext = name.split(".").pop()?.toLowerCase() || "txt";

    const newFile: RepoFile = {
      name,
      path,
      content: `// ${name}\n`,
      size: "20 B",
      language: ext,
    };

    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
    setNewFilePath("");
    setShowAddFile(false);
  };

  const handleDeleteFile = (index: number) => {
    if (files.length <= 1) {
      alert("En az 1 dosya bulunmalıdır.");
      return;
    }
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    setActiveFileIndex(Math.max(0, index - 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    Array.from(uploadedFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const bytes = file.size;
        const sizeStr = bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
        const ext = file.name.split(".").pop()?.toLowerCase() || "txt";

        const newRepoFile: RepoFile = {
          name: file.name,
          path: file.name,
          content: content || "",
          size: sizeStr,
          language: ext,
        };

        setFiles((prev) => {
          // If already exists, replace; else append
          const filtered = prev.filter((f) => f.path !== file.name);
          return [...filtered, newRepoFile];
        });
      };
      reader.readAsText(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const created = createRepository(
      {
        name: name.trim(),
        description: description.trim(),
        primaryLanguage,
        category,
        tags,
        isPublic,
        license: "MIT",
        files,
      },
      user
    );

    onClose();
    router.push(`/depolar/${created.id}`);
  };

  const currentActiveFile = files[activeFileIndex] || files[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#09090F] border border-purple-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.2)] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {t("repo.createModalTitle")}
              </h2>
              <p className="text-xs text-gray-400">
                {t("repo.createModalDesc")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Quick Template Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{t("repo.templateLabel")}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: "nextjs", label: t("repo.templateNext"), icon: "⚡" },
                { id: "fastapi", label: t("repo.templatePython"), icon: "🐍" },
                { id: "web", label: t("repo.templateHtml"), icon: "🌐" },
                { id: "blank", label: t("repo.templateBlank"), icon: "📄" },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleTemplateChange(tmpl.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? "bg-purple-950/50 border-purple-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                      : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <span className="text-base mr-1.5">{tmpl.icon}</span>
                  <span className="text-xs font-medium">{tmpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Repo Name & Primary Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                {t("repo.nameLabel")} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ornek-kod-projesi"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                {t("repo.langLabel")}
              </label>
              <select
                value={primaryLanguage}
                onChange={(e) => setPrimaryLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="TypeScript">TypeScript</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Rust">Rust</option>
                <option value="CSS">CSS / Tailwind</option>
                <option value="HTML">HTML</option>
                <option value="Go">Go</option>
                <option value="C++">C++</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              {t("repo.descLabel")}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Projenin amacını, teknolojilerini kısaca açıklayın..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Category & Visibility & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="web">Web & Frontend</option>
                <option value="backend">Backend & API</option>
                <option value="ai">Yapay Zeka (AI/ML)</option>
                <option value="tools">Araçlar & Kütüphane</option>
                <option value="games">Oyun & Canvas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                {t("repo.visibilityLabel")}
              </label>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    isPublic
                      ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                      : "bg-white/[0.02] border-white/10 text-gray-400"
                  }`}
                >
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>{t("repo.public")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    !isPublic
                      ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
                      : "bg-white/[0.02] border-white/10 text-gray-400"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t("repo.private")}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                {t("repo.tagsLabel")}
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, tailwind, auth"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Files Editor Section */}
          <div className="border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
            
            {/* Files Tabs Bar */}
            <div className="px-3 py-2 bg-white/[0.03] border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 min-w-0">
                {files.map((f, idx) => {
                  const isActive = activeFileIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveFileIndex(idx)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? "bg-purple-600/30 text-purple-200 border border-purple-500/40 font-semibold"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      <span>{f.path}</span>
                      {files.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(idx);
                          }}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add File / Upload Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-purple-950/40 border border-white/10 hover:border-purple-500/30 text-xs font-medium text-gray-300 hover:text-purple-300 transition-all cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("repo.uploadFiles")}</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowAddFile(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-medium text-purple-300 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t("repo.addFileBtn")}</span>
                </button>
              </div>
            </div>

            {/* Sub-form for adding new file tab */}
            {showAddFile && (
              <div className="p-3 bg-purple-950/30 border-b border-purple-500/20 flex items-center gap-2">
                <input
                  type="text"
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  placeholder="Dosya yolu (örn: src/components/Button.tsx)"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-purple-500/40 text-white font-mono text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFile}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium"
                >
                  Ekle
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFile(false)}
                  className="px-2 py-1.5 text-gray-400 hover:text-white text-xs"
                >
                  İptal
                </button>
              </div>
            )}

            {/* Active File Editor */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2 text-xs font-mono text-gray-400">
                <span>{currentActiveFile?.path} ({currentActiveFile?.size})</span>
                <span className="text-purple-400 uppercase">{currentActiveFile?.language}</span>
              </div>
              <textarea
                rows={10}
                value={currentActiveFile?.content || ""}
                onChange={(e) => handleFileContentChange(activeFileIndex, e.target.value)}
                placeholder="// Dosya içeriğini yazın..."
                className="w-full bg-[#050508] border border-white/10 rounded-xl p-4 text-gray-200 font-mono text-xs focus:outline-none focus:border-purple-500 leading-relaxed resize-y"
              />
            </div>

          </div>

          {/* Modal Footer CTA */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-medium text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all cursor-pointer"
            >
              {t("repo.submitCreate")}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
