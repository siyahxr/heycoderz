"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "./AuthContext";

export interface RepoFile {
  name: string;
  path: string;
  content: string;
  size: string;
  language: string;
}

export interface RepoComment {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorBadge: string;
  body: string;
  createdAt: number | string;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    badge: string;
    role: "admin" | "developer" | "pro";
  };
  isPublic: boolean;
  stars: number;
  starredByUserIds: string[];
  forks: number;
  forkedFrom?: {
    repoId: string;
    authorName: string;
    authorUsername: string;
    repoName: string;
  };
  primaryLanguage: string;
  languageColor: string;
  tags: string[];
  license: string;
  defaultBranch: string;
  category: "web" | "backend" | "ai" | "tools" | "games";
  files: RepoFile[];
  comments: RepoComment[];
  releases: Array<{
    version: string;
    title: string;
    date: string;
    notes: string;
  }>;
  createdAt: number | string;
  updatedAt: number | string;
}

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  CSS: "#563d7c",
  HTML: "#e34c26",
  "C++": "#f34b7d",
  JSON: "#cbcb41",
  Markdown: "#083fa1",
};

const DEFAULT_REPOSITORIES: Repository[] = [];

export interface CreateRepoInput {
  name: string;
  description: string;
  primaryLanguage: string;
  category: "web" | "backend" | "ai" | "tools" | "games";
  tags: string[];
  isPublic: boolean;
  license: string;
  files: RepoFile[];
}

interface RepoContextType {
  repositories: Repository[];
  getRepoById: (id: string) => Repository | undefined;
  createRepository: (input: CreateRepoInput, currentUser: UserProfile | null) => Repository;
  deleteRepository: (id: string) => void;
  toggleStar: (id: string, currentUser: UserProfile | null) => void;
  forkRepository: (id: string, currentUser: UserProfile | null) => Repository | null;
  addFileToRepo: (repoId: string, file: RepoFile) => void;
  updateRepoFile: (repoId: string, filePath: string, newContent: string) => void;
  deleteRepoFile: (repoId: string, filePath: string) => void;
  addRepoComment: (repoId: string, text: string, currentUser: UserProfile | null) => void;
  downloadSingleFile: (file: RepoFile) => void;
  downloadRepoZip: (repo: Repository) => void;
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export const RepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("heycoderz_repositories");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Purge dummy mock starter projects and their forks
          const DUMMY_PREFIXES = [
            "neural-code-companion",
            "glassmorphic-ui-kit",
            "fastapi-jwt-starter",
            "algo-visualizer-engine",
            "rust-wasm-parser",
          ];
          const userOnlyRepos = parsed.filter((r: Repository) => {
            const isMockId = DUMMY_PREFIXES.some((prefix) => r.id.startsWith(prefix));
            const isMockFork = r.forkedFrom && DUMMY_PREFIXES.some((prefix) => r.forkedFrom?.repoId?.startsWith(prefix));
            return !isMockId && !isMockFork;
          });
          setRepositories(userOnlyRepos);
          localStorage.setItem("heycoderz_repositories", JSON.stringify(userOnlyRepos));
          return;
        }
      }
    } catch {}
    // Save defaults
    try {
      localStorage.setItem("heycoderz_repositories", JSON.stringify(DEFAULT_REPOSITORIES));
    } catch {}
  }, []);

  const saveRepos = (newRepos: Repository[]) => {
    setRepositories(newRepos);
    try {
      localStorage.setItem("heycoderz_repositories", JSON.stringify(newRepos));
    } catch {}
  };

  const getRepoById = (id: string): Repository | undefined => {
    return repositories.find((r) => r.id === id);
  };

  const createRepository = (
    input: CreateRepoInput,
    currentUser: UserProfile | null
  ): Repository => {
    const slug = input.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-");

    const langColor = LANGUAGE_COLORS[input.primaryLanguage] || "#a855f7";

    const newRepo: Repository = {
      id: `${slug}-${Date.now().toString(36)}`,
      name: slug,
      description: input.description.trim(),
      author: {
        id: currentUser?.id || "guest",
        name: currentUser?.name || "HeyCoder",
        username: currentUser?.username?.replace(/^@/, "") || "coder",
        avatar:
          currentUser?.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        badge: currentUser?.badge || "Geliştirici",
        role: currentUser?.role || "developer",
      },
      isPublic: input.isPublic,
      stars: 1,
      starredByUserIds: currentUser?.id ? [currentUser.id] : [],
      forks: 0,
      primaryLanguage: input.primaryLanguage,
      languageColor: langColor,
      tags: input.tags.length > 0 ? input.tags : ["open-source", slug],
      license: input.license || "MIT",
      defaultBranch: "main",
      category: input.category || "web",
      files: input.files.length > 0 ? input.files : [
        {
          name: "README.md",
          path: "README.md",
          size: "400 B",
          language: "markdown",
          content: `# ${input.name}\n\n${input.description}\n\n## 🚀 Başlangıç\n\nBu depo Hey! Coder'z platformunda oluşturuldu.`,
        },
      ],
      comments: [],
      releases: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updated = [newRepo, ...repositories];
    saveRepos(updated);
    return newRepo;
  };

  const deleteRepository = (id: string) => {
    const updated = repositories.filter((r) => r.id !== id);
    saveRepos(updated);
  };

  const toggleStar = (id: string, currentUser: UserProfile | null) => {
    const userId = currentUser?.id || "guest-session";
    const updated = repositories.map((r) => {
      if (r.id !== id) return r;
      const hasStarred = r.starredByUserIds.includes(userId);
      const newStarredList = hasStarred
        ? r.starredByUserIds.filter((uid) => uid !== userId)
        : [...r.starredByUserIds, userId];
      return {
        ...r,
        stars: hasStarred ? Math.max(0, r.stars - 1) : r.stars + 1,
        starredByUserIds: newStarredList,
      };
    });
    saveRepos(updated);
  };

  const forkRepository = (id: string, currentUser: UserProfile | null): Repository | null => {
    const source = repositories.find((r) => r.id === id);
    if (!source) return null;

    const forkedSlug = `${source.name}-fork`;
    const forkedRepo: Repository = {
      ...source,
      id: `${forkedSlug}-${Date.now().toString(36)}`,
      name: forkedSlug,
      author: {
        id: currentUser?.id || "guest",
        name: currentUser?.name || "Geliştirici",
        username: currentUser?.username?.replace(/^@/, "") || "coder",
        avatar:
          currentUser?.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        badge: currentUser?.badge || "Geliştirici",
        role: currentUser?.role || "developer",
      },
      forkedFrom: {
        repoId: source.id,
        authorName: source.author.name,
        authorUsername: source.author.username,
        repoName: source.name,
      },
      stars: 1,
      starredByUserIds: currentUser?.id ? [currentUser.id] : [],
      forks: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Increment original repo fork count
    const updatedSource = repositories.map((r) =>
      r.id === id ? { ...r, forks: r.forks + 1 } : r
    );

    const updated = [forkedRepo, ...updatedSource];
    saveRepos(updated);
    return forkedRepo;
  };

  const addFileToRepo = (repoId: string, file: RepoFile) => {
    const updated = repositories.map((r) => {
      if (r.id !== repoId) return r;
      // remove duplicate path if exists
      const filtered = r.files.filter((f) => f.path !== file.path);
      return {
        ...r,
        files: [...filtered, file],
        updatedAt: Date.now(),
      };
    });
    saveRepos(updated);
  };

  const updateRepoFile = (repoId: string, filePath: string, newContent: string) => {
    const updated = repositories.map((r) => {
      if (r.id !== repoId) return r;
      const updatedFiles = r.files.map((f) => {
        if (f.path !== filePath) return f;
        const bytes = new Blob([newContent]).size;
        const sizeStr = bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
        return {
          ...f,
          content: newContent,
          size: sizeStr,
        };
      });
      return {
        ...r,
        files: updatedFiles,
        updatedAt: Date.now(),
      };
    });
    saveRepos(updated);
  };

  const deleteRepoFile = (repoId: string, filePath: string) => {
    const updated = repositories.map((r) => {
      if (r.id !== repoId) return r;
      return {
        ...r,
        files: r.files.filter((f) => f.path !== filePath),
        updatedAt: Date.now(),
      };
    });
    saveRepos(updated);
  };

  const addRepoComment = (
    repoId: string,
    text: string,
    currentUser: UserProfile | null
  ) => {
    if (!text.trim()) return;
    const newComment: RepoComment = {
      id: `c-${Date.now()}`,
      authorId: currentUser?.id || "guest",
      authorName: currentUser?.name || "HeyCoder",
      authorUsername: currentUser?.username?.replace(/^@/, "") || "coder",
      authorAvatar:
        currentUser?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      authorBadge: currentUser?.badge || "Geliştirici",
      body: text.trim(),
      createdAt: Date.now(),
    };

    const updated = repositories.map((r) => {
      if (r.id !== repoId) return r;
      return {
        ...r,
        comments: [...r.comments, newComment],
      };
    });
    saveRepos(updated);
  };

  const downloadSingleFile = (file: RepoFile) => {
    if (typeof window === "undefined") return;
    const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadRepoZip = (repo: Repository) => {
    if (typeof window === "undefined") return;
    // Generate bundle export file
    const bundleData = {
      repository: repo.name,
      author: repo.author.username,
      license: repo.license,
      exportedAt: new Date().toISOString(),
      files: repo.files.map((f) => ({
        path: f.path,
        name: f.name,
        language: f.language,
        content: f.content,
      })),
    };

    const blob = new Blob([JSON.stringify(bundleData, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${repo.name}-bundle.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <RepoContext.Provider
      value={{
        repositories,
        getRepoById,
        createRepository,
        deleteRepository,
        toggleStar,
        forkRepository,
        addFileToRepo,
        updateRepoFile,
        deleteRepoFile,
        addRepoComment,
        downloadSingleFile,
        downloadRepoZip,
      }}
    >
      {children}
    </RepoContext.Provider>
  );
};

export const useRepo = () => {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error("useRepo must be used within a RepoProvider");
  }
  return context;
};
