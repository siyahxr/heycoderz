"use client";

import React, { useState, useMemo } from "react";
import { 
  FileCode2, 
  Folder, 
  FolderOpen, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Code, 
  FileText, 
  Edit3, 
  Trash2, 
  Plus, 
  Save, 
  X,
  FileJson,
  Binary,
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  FileArchive
} from "lucide-react";
import { RepoFile, Repository, useRepo } from "@/context/RepoContext";
import { useLanguage } from "@/context/LanguageContext";

interface FileExplorerProps {
  repo: Repository;
  isOwner?: boolean;
}

const IMAGE_EXTENSIONS_REGEX = /\.(png|jpg|jpeg|gif|webp|svg|ico|bmp|avif)$/i;
const BINARY_EXTENSIONS_REGEX = /\.(exe|dll|so|dylib|bin|dat|woff|woff2|ttf|eot|otf|pdf|zip|rar|7z|tar|gz|mp3|mp4)$/i;

export const FileExplorer: React.FC<FileExplorerProps> = ({ repo, isOwner = false }) => {
  const { t } = useLanguage();
  const { downloadSingleFile, downloadRepoZip, updateRepoFile, deleteRepoFile, addFileToRepo } = useRepo();

  const [selectedFile, setSelectedFile] = useState<RepoFile>(
    repo.files[0] || {
      name: "README.md",
      path: "README.md",
      content: "",
      size: "0 B",
      language: "markdown",
    }
  );
  const [copied, setCopied] = useState(false);
  const [isRaw, setIsRaw] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(selectedFile.content);

  // New file modal state
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFilePath, setNewFilePath] = useState("");
  const [newFileContent, setNewFileContent] = useState("");

  const handleSelectFile = (file: RepoFile) => {
    setSelectedFile(file);
    setIsEditing(false);
    setEditContent(file.content);
  };

  // Determine file type
  const isImage = useMemo(() => {
    return (
      selectedFile.language === "image" ||
      selectedFile.content.startsWith("data:image/") ||
      IMAGE_EXTENSIONS_REGEX.test(selectedFile.name) ||
      IMAGE_EXTENSIONS_REGEX.test(selectedFile.path)
    );
  }, [selectedFile]);

  const isBinary = useMemo(() => {
    return (
      !isImage &&
      (selectedFile.language === "binary" ||
        selectedFile.content.startsWith("[İkili Dosya") ||
        BINARY_EXTENSIONS_REGEX.test(selectedFile.name) ||
        BINARY_EXTENSIONS_REGEX.test(selectedFile.path))
    );
  }, [selectedFile, isImage]);

  const handleCopyCode = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    updateRepoFile(repo.id, selectedFile.path, editContent);
    setSelectedFile({ ...selectedFile, content: editContent });
    setIsEditing(false);
  };

  const handleDeleteFile = (filePath: string) => {
    if (repo.files.length <= 1) {
      alert("Depodaki son dosyayı silemezsiniz.");
      return;
    }
    if (confirm(`'${filePath}' dosyasını silmek istediğinize emin misiniz?`)) {
      deleteRepoFile(repo.id, filePath);
      const remaining = repo.files.filter((f) => f.path !== filePath);
      if (remaining.length > 0) {
        setSelectedFile(remaining[0]);
      }
    }
  };

  const handleCreateNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath.trim()) return;

    const fileName = newFilePath.split("/").pop() || newFilePath;
    const ext = fileName.split(".").pop()?.toLowerCase() || "txt";
    const bytes = new Blob([newFileContent]).size;
    const sizeStr = bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;

    const newFile: RepoFile = {
      name: fileName,
      path: newFilePath.trim(),
      content: newFileContent,
      size: sizeStr,
      language: ext,
    };

    addFileToRepo(repo.id, newFile);
    setSelectedFile(newFile);
    setIsAddingFile(false);
    setNewFilePath("");
    setNewFileContent("");
  };

  const getFileIcon = (fileName: string, lang?: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (lang === "image" || (ext && ["png", "jpg", "jpeg", "webp", "gif", "svg", "ico", "bmp", "avif"].includes(ext))) {
      return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    }
    if (ext === "json") return <FileJson className="w-4 h-4 text-amber-400" />;
    if (ext === "md") return <FileText className="w-4 h-4 text-sky-400" />;
    if (ext === "css" || ext === "scss" || ext === "less") return <Code className="w-4 h-4 text-pink-400" />;
    if (ext === "ts" || ext === "tsx") return <FileCode2 className="w-4 h-4 text-blue-400" />;
    if (ext === "js" || ext === "jsx") return <FileCode2 className="w-4 h-4 text-yellow-400" />;
    if (ext === "py") return <Binary className="w-4 h-4 text-emerald-400" />;
    if (ext === "rs") return <Binary className="w-4 h-4 text-orange-400" />;
    if (lang === "binary" || (ext && ["exe", "dll", "zip", "rar", "bin", "dat", "pdf"].includes(ext))) {
      return <FileArchive className="w-4 h-4 text-gray-500" />;
    }
    return <FileCode2 className="w-4 h-4 text-purple-400" />;
  };

  // Safe line count and lines splitting - NEVER split large binaries or images
  const codeLines = useMemo(() => {
    if (isImage || isBinary) return [];
    const source = isEditing ? editContent : selectedFile.content;
    if (!source) return [];
    return source.split("\n");
  }, [isImage, isBinary, isEditing, editContent, selectedFile.content]);

  return (
    <div className="rounded-2xl bg-[#09090F]/95 border border-white/[0.08] shadow-2xl overflow-hidden backdrop-blur-md">
      
      {/* Top Header bar with files list / tree and actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/[0.08]">
        
        {/* Left column: Files Tree Navigation */}
        <div className="lg:col-span-4 bg-black/40 p-4 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 uppercase tracking-wider">
              <FolderOpen className="w-4 h-4 text-purple-400" />
              <span>{t("common.files")} ({repo.files.length})</span>
            </div>

            {isOwner && (
              <button
                type="button"
                onClick={() => setIsAddingFile(true)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-medium transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Dosya Ekle</span>
              </button>
            )}
          </div>

          {/* Files List */}
          <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {repo.files.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => handleSelectFile(file)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-950/50 text-white border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.2)] font-semibold"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getFileIcon(file.name, file.language)}
                    <span className="truncate">{file.path}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-gray-500">{file.size}</span>
                    {isOwner && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.path);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity cursor-pointer"
                        title="Dosyayı Sil"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Selected File Actions Header */}
        <div className="lg:col-span-8 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 bg-white/[0.01]">
          <div className="flex items-center gap-2.5 min-w-0">
            {getFileIcon(selectedFile.name, selectedFile.language)}
            <span className="text-sm font-mono font-bold text-white truncate">
              {selectedFile.path}
            </span>
            {!isImage && !isBinary && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.05] text-gray-400 font-mono">
                {codeLines.length} {t("repo.lines")}
              </span>
            )}
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.05] text-gray-400 font-mono">
              {selectedFile.size}
            </span>
            {isImage && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 font-mono">
                Görsel
              </span>
            )}
          </div>

          {/* Action Buttons: Edit, Copy, Raw, Download */}
          <div className="flex items-center gap-2">
            {!isImage && !isBinary && isOwner && !isEditing && (
              <button
                type="button"
                onClick={() => {
                  setEditContent(selectedFile.content);
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-purple-950/40 border border-white/10 hover:border-purple-500/40 text-xs font-medium text-gray-300 hover:text-purple-300 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Düzenle</span>
              </button>
            )}

            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-xs font-medium text-emerald-300 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t("common.save")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-gray-400 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t("common.cancel")}</span>
                </button>
              </div>
            )}

            {!isEditing && !isImage && !isBinary && (
              <>
                <button
                  type="button"
                  onClick={() => setIsRaw(!isRaw)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    isRaw
                      ? "bg-purple-600/20 border-purple-500/50 text-purple-300"
                      : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white"
                  }`}
                  title="Ham metin moduna geç"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Raw</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-purple-950/30 border border-white/10 hover:border-purple-500/30 text-xs font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{t("common.copied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t("common.copy")}</span>
                    </>
                  )}
                </button>
              </>
            )}

            {/* Download File Button */}
            <button
              type="button"
              onClick={() => downloadSingleFile(selectedFile)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-purple-950/30 border border-white/10 hover:border-purple-500/30 text-xs font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
              title={t("repo.downloadFile")}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("common.download")}</span>
            </button>

            {/* Download Whole Repo ZIP / RAR */}
            <button
              type="button"
              onClick={() => downloadRepoZip(repo, "zip")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/35 text-xs font-medium text-purple-300 hover:text-white transition-all cursor-pointer"
              title="Tüm depoyu fotoğraflarla birlikte ZIP/RAR arşivi olarak indir"
            >
              <FileArchive className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ZIP/RAR İndir</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Content Area: Image Previewer, Binary Card, or Code View */}
      <div className="relative bg-[#050508] p-4 font-mono text-[13px] leading-6 overflow-x-auto min-h-[360px] max-h-[620px] custom-scrollbar">
        
        {/* 1. IMAGE PREVIEWER (Zero lag, clean photo rendering) */}
        {isImage ? (
          <div className="flex flex-col items-center justify-center p-6 sm:p-10 min-h-[380px] rounded-2xl bg-[#030306] border border-white/[0.05] space-y-4">
            <div className="relative max-w-full p-3 rounded-2xl bg-black/70 border border-purple-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(139,92,246,0.15)] backdrop-blur-md">
              <img
                src={selectedFile.content}
                alt={selectedFile.name}
                className="max-h-[440px] max-w-full rounded-xl object-contain mx-auto transition-transform hover:scale-[1.01]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
              <span className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-gray-300 font-mono">
                {selectedFile.name}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 font-mono">{selectedFile.size}</span>
              <span className="text-gray-600">•</span>
              <button
                type="button"
                onClick={() => downloadSingleFile(selectedFile)}
                className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Orijinal Görseli İndir</span>
              </button>
            </div>
          </div>
        ) : isBinary ? (
          /* 2. BINARY NON-TEXT FILE HANDLER */
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 space-y-4 min-h-[360px]">
            <div className="w-14 h-14 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xl">
              <Binary className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">İkili Dosya (Binary)</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Bu dosya metin tabanlı kod olmadığı için doğrudan tarayıcıda önizlenemiyor. Dosyayı indirerek inceleyebilirsiniz.
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadSingleFile(selectedFile)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Dosyayı İndir ({selectedFile.size})</span>
            </button>
          </div>
        ) : isEditing ? (
          /* 3. CODE EDITOR */
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-96 bg-black/60 border border-purple-500/30 rounded-xl p-4 text-gray-200 font-mono text-xs focus:outline-none focus:border-purple-500 resize-y"
            placeholder="Dosya içeriğini yazın..."
          />
        ) : isRaw ? (
          /* 4. RAW CODE */
          <pre className="text-gray-300 whitespace-pre font-mono selection:bg-purple-500/30">
            {selectedFile.content}
          </pre>
        ) : (
          /* 5. SMOOTH LINE NUMBERED CODE TABLE */
          <div className="table w-full border-collapse">
            {codeLines.map((line, idx) => (
              <div key={idx} className="table-row group/line hover:bg-white/[0.03] transition-colors">
                <span className="table-cell pr-6 text-right select-none text-gray-600 font-mono text-xs group-hover/line:text-gray-400 w-10">
                  {idx + 1}
                </span>
                <span className="table-cell text-gray-300 whitespace-pre font-mono selection:bg-purple-500/40">
                  {line || " "}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for adding a new file */}
      {isAddingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#0e0e17] border border-purple-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                <span>Yeni Dosya Ekle</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingFile(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewFile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Dosya Yolu (örn: src/utils/helpers.ts veya config.json)
                </label>
                <input
                  type="text"
                  required
                  value={newFilePath}
                  onChange={(e) => setNewFilePath(e.target.value)}
                  placeholder="src/utils/helpers.ts"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Dosya İçeriği (Kod)
                </label>
                <textarea
                  rows={8}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="// Kodunuzu buraya yazın..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-purple-500 resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingFile(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-medium text-gray-300 hover:text-white cursor-pointer"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-medium text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer"
                >
                  Dosyayı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
