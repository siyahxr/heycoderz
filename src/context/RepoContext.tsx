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

const DEFAULT_REPOSITORIES: Repository[] = [
  {
    id: "neural-code-companion",
    name: "neural-code-companion",
    description: "Geliştiriciler için lokal ve bulut tabanlı akıllı kod tamamlama, analiz ve hata ayıklama motoru.",
    author: {
      id: "admin-siyah",
      name: "Efe Taşkın",
      username: "siyah",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      badge: "Kurucu & Admin",
      role: "admin",
    },
    isPublic: true,
    stars: 128,
    starredByUserIds: ["admin-siyah"],
    forks: 34,
    primaryLanguage: "TypeScript",
    languageColor: "#3178c6",
    tags: ["ai", "typescript", "llm", "developer-tools", "productivity"],
    license: "MIT",
    defaultBranch: "main",
    category: "ai",
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 3600000 * 2,
    releases: [
      {
        version: "v1.2.0",
        title: "Streaming Parser & Context Window Optimization",
        date: "2 gün önce",
        notes: "Gecikme süresi 18ms seviyesine indirildi ve AST ağaç çözümleme hızlandırıldı.",
      },
      {
        version: "v1.0.0",
        title: "Initial Stable Release",
        date: "12 gün önce",
        notes: "İlk stabil genel sürüm yayınlandı.",
      },
    ],
    comments: [
      {
        id: "c-1",
        authorId: "user-oyku",
        authorName: "Öykü",
        authorUsername: "oyku",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        authorBadge: "Kurucu Ortak & Admin",
        body: "AST token hesaplama optimizasyonu harika çalışıyor! Eline sağlık.",
        createdAt: Date.now() - 3600000 * 5,
      },
    ],
    files: [
      {
        name: "README.md",
        path: "README.md",
        size: "1.8 KB",
        language: "markdown",
        content: `# 🧠 Neural Code Companion (Hey! Coder'z AI Engine)

Modern geliştirici iş akışları için optimize edilmiş, ultra düşük gecikmeli yapay zeka kod tamamlama ve akıllı refactoring aracı.

---

## ⚡ Özellikler
- 🚀 **18ms altı yanıt gecikmesi**: Akıllı streaming ve lokal önbellekleme.
- 🔍 **Semantik AST Analizi**: Yalnızca satır değil, soyut sözdizim ağacı (AST) seviyesinde bağlam algılama.
- 🛡️ **Tip Güvenliği**: TypeScript 5.x ve Python 3.12+ tip çıkarımlarını otomatik doğrular.
- 📦 **Çoklu Dil Desteği**: TypeScript, Python, Rust, Go, CSS ve SQL.

## 🚀 Hızlı Başlangıç

\`\`\`bash
# Bağımlılıkları yükleyin
npm install @heycoderz/neural-companion

# Motoru başlatın
npx neural-companion start --port=8080
\`\`\`

### 💻 Kod Örneği

\`\`\`typescript
import { NeuralEngine } from "./src/engine";

const engine = new NeuralEngine({
  model: "neural-coder-large",
  stream: true,
  temperature: 0.2
});

const suggestion = await engine.completeCode({
  file: "src/api/auth.ts",
  cursorLine: 42,
  context: "JWT token validation with refresh token rotation"
});

console.log("Öneri:", suggestion.code);
\`\`\`

## 📜 Lisans
MIT License © 2026 Hey! Coder'z Ecosystem`,
      },
      {
        name: "index.ts",
        path: "src/index.ts",
        size: "1.2 KB",
        language: "typescript",
        content: `import { NeuralEngine } from "./engine/model";
import { ASTParser } from "./parser/ast";

export interface CompanionConfig {
  apiKey?: string;
  model?: "neural-coder-fast" | "neural-coder-large";
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export class NeuralCodeCompanion {
  private engine: NeuralEngine;
  private parser: ASTParser;

  constructor(private config: CompanionConfig = {}) {
    this.engine = new NeuralEngine(config);
    this.parser = new ASTParser();
  }

  public async suggest(codeContext: string, cursorOffset: number): Promise<string> {
    const tokens = this.parser.tokenize(codeContext);
    const scope = this.parser.findScope(tokens, cursorOffset);
    return await this.engine.infer(scope);
  }
}

export default NeuralCodeCompanion;`,
      },
      {
        name: "model.ts",
        path: "src/engine/model.ts",
        size: "1.5 KB",
        language: "typescript",
        content: `import { CompanionConfig } from "../index";

export class NeuralEngine {
  private modelName: string;
  private temp: number;

  constructor(config: CompanionConfig) {
    this.modelName = config.model || "neural-coder-fast";
    this.temp = config.temperature ?? 0.2;
  }

  public async infer(scopeContext: Record<string, any>): Promise<string> {
    // Simüle edilmiş ultra hızlı çıkarım boru hattı
    const payload = JSON.stringify({ scope: scopeContext, model: this.modelName });
    await new Promise((r) => setTimeout(r, 45));
    return \`// Auto-generated by Hey! Coder'z Neural Engine\\nexport const validateToken = async (token: string) => {\\n  return Boolean(token && token.length > 16);\\n};\`;
  }
}`,
      },
      {
        name: "package.json",
        path: "package.json",
        size: "620 B",
        language: "json",
        content: `{
  "name": "@heycoderz/neural-code-companion",
  "version": "1.2.0",
  "description": "Ultra fast AI code completion engine for Hey! Coder'z",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run"
  },
  "keywords": ["ai", "copilot", "typescript", "devtools"],
  "license": "MIT"
}`,
      },
    ],
  },
  {
    id: "glassmorphic-ui-kit",
    name: "glassmorphic-ui-kit",
    description: "Modern web uygulamaları için neon gradyanlar, dinamik backdrop-blur ve fütüristik cam bileşen kütüphanesi.",
    author: {
      id: "user-oyku",
      name: "Öykü",
      username: "oyku",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      badge: "Kurucu Ortak & Admin",
      role: "admin",
    },
    isPublic: true,
    stars: 94,
    starredByUserIds: [],
    forks: 19,
    primaryLanguage: "CSS",
    languageColor: "#563d7c",
    tags: ["css", "react", "glassmorphism", "tailwind", "ui-kit"],
    license: "MIT",
    defaultBranch: "main",
    category: "web",
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 3600000 * 14,
    releases: [
      {
        version: "v2.0.1",
        title: "Performance & GPU Acceleration",
        date: "4 gün önce",
        notes: "will-change ve transform3d ile 60 FPS kaydırma performansı sağlandı.",
      },
    ],
    comments: [],
    files: [
      {
        name: "README.md",
        path: "README.md",
        size: "1.4 KB",
        language: "markdown",
        content: `# ✨ Glassmorphic UI Kit

Hey! Coder'z geliştiricileri için tasarlanmış yüksek performanslı cam (Glassmorphism) stil ve React bileşen paketi.

## 🌟 Bileşenler
1. \`GlassCard\`: Hover neon ışıması ve dinamik yansıma.
2. \`GlassButton\`: Tıklama dalgası ve gradyan kenarlık.
3. \`GlassModal\`: Arka plan bulanıklaştırmalı fütüristik diyalog kutusu.

## 🎨 Kullanım

\`\`\`tsx
import { GlassCard } from "./components/GlassCard";
import "./styles/glass.css";

export default function App() {
  return (
    <GlassCard glowColor="purple" title="Fütüristik Kart">
      <p>Modern CSS filtreleri ile güçlendirildi.</p>
    </GlassCard>
  );
}
\`\`\``,
      },
      {
        name: "GlassCard.tsx",
        path: "src/components/GlassCard.tsx",
        size: "1.1 KB",
        language: "typescript",
        content: `import React from "react";

interface GlassCardProps {
  title: string;
  children: React.ReactNode;
  glowColor?: "purple" | "cyan" | "pink";
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  children,
  glowColor = "purple",
  className = "",
}) => {
  return (
    <div className={\`glass-panel glass-glow-\${glowColor} \${className}\`}>
      <div className="glass-header">
        <span className="glass-dot" />
        <h3 className="glass-title">{title}</h3>
      </div>
      <div className="glass-body">{children}</div>
    </div>
  );
};`,
      },
      {
        name: "glass.css",
        path: "src/styles/glass.css",
        size: "1.6 KB",
        language: "css",
        content: `.glass-panel {
  background: rgba(13, 13, 24, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  color: #f3f4f6;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-panel:hover {
  transform: translateY(-4px);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(139, 92, 246, 0.25);
}

.glass-glow-purple:hover {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(168, 85, 247, 0.35);
}

.glass-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.glass-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a855f7;
  box-shadow: 0 0 10px #a855f7;
}`,
      },
      {
        name: "package.json",
        path: "package.json",
        size: "480 B",
        language: "json",
        content: `{
  "name": "@heycoderz/glassmorphic-ui-kit",
  "version": "2.0.1",
  "description": "Futuristic glassmorphism styling and UI components",
  "main": "dist/index.js",
  "license": "MIT"
}`,
      },
    ],
  },
  {
    id: "fastapi-jwt-starter",
    name: "fastapi-jwt-starter",
    description: "Asenkron mimari, JWT Token rotasyonu, Docker entegrasyonu ve SQLAlchemy 2.0 ile hazır Python mikroservis şablonu.",
    author: {
      id: "admin-siyah",
      name: "Efe Taşkın",
      username: "siyah",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      badge: "Kurucu & Admin",
      role: "admin",
    },
    isPublic: true,
    stars: 82,
    starredByUserIds: [],
    forks: 27,
    primaryLanguage: "Python",
    languageColor: "#3572A5",
    tags: ["python", "fastapi", "jwt", "docker", "backend", "postgresql"],
    license: "MIT",
    defaultBranch: "main",
    category: "backend",
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 1,
    releases: [
      {
        version: "v1.1.0",
        title: "Docker Compose & Healthcheck",
        date: "1 gün önce",
        notes: "Tek komutla ayağa kaldırılabilen Docker Compose yapısı eklendi.",
      },
    ],
    comments: [],
    files: [
      {
        name: "README.md",
        path: "README.md",
        size: "1.5 KB",
        language: "markdown",
        content: `# 🚀 FastAPI JWT Microservice Starter

Modern, asenkron ve güvenli backend API geliştirme şablonu.

## 🛠️ Dahili Özellikler
- **FastAPI 0.115+** ile tam tip güvenliği ve otomatik OpenAPI (Swagger) dökümantasyonu.
- **JWT Authentication**: Access & Refresh token rotasyonu.
- **SQLAlchemy 2.0 Async** & PostgreSQL desteği.
- **Docker & Docker-Compose** hazır yapılandırma.

## 🏃 Çalıştırma

\`\`\`bash
# Sanal ortamı kurun
python -m venv .venv
source .venv/bin/activate # Windows: .venv\\Scripts\\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Geliştirme sunucusunu başlatın
uvicorn main:app --reload --port 8000
\`\`\`

OpenAPI Dokümantasyonu: \`http://localhost:8000/docs\``,
      },
      {
        name: "main.py",
        path: "main.py",
        size: "1.3 KB",
        language: "python",
        content: `from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Hey! Coder'z Microservice API",
    description="High performance async Python backend template",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str
    uptime: str
    environment: str

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {
        "status": "healthy",
        "uptime": "99.98%",
        "environment": "production"
    }

@app.get("/")
async def root():
    return {"message": "Welcome to Hey! Coder'z FastAPI Starter"}`,
      },
      {
        name: "requirements.txt",
        path: "requirements.txt",
        size: "240 B",
        language: "python",
        content: `fastapi>=0.115.0
uvicorn[standard]>=0.30.0
pydantic>=2.8.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
sqlalchemy>=2.0.30
asyncpg>=0.29.0`,
      },
      {
        name: "Dockerfile",
        path: "Dockerfile",
        size: "380 B",
        language: "dockerfile",
        content: `FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      },
    ],
  },
  {
    id: "algo-visualizer-engine",
    name: "algo-visualizer-engine",
    description: "Sıralama, yol bulma ve ağaç algoritmalarını HTML5 Canvas üzerinde 60 FPS hızında görselleştiren TypeScript kütüphanesi.",
    author: {
      id: "admin-siyah",
      name: "Efe Taşkın",
      username: "siyah",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      badge: "Kurucu & Admin",
      role: "admin",
    },
    isPublic: true,
    stars: 76,
    starredByUserIds: [],
    forks: 14,
    primaryLanguage: "TypeScript",
    languageColor: "#3178c6",
    tags: ["algorithms", "canvas", "visualization", "typescript", "data-structures"],
    license: "MIT",
    defaultBranch: "main",
    category: "games",
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 3,
    releases: [],
    comments: [],
    files: [
      {
        name: "README.md",
        path: "README.md",
        size: "1.1 KB",
        language: "markdown",
        content: `# 📊 Algorithm Visualizer Engine

TypeScript ve HTML5 Canvas ile geliştirilmiş interaktif algoritma görselleştirici.

## 🎯 Desteklenen Algoritmalar
- **Quick Sort** (O(n log n))
- **Merge Sort** (O(n log n))
- **Dijkstra Pathfinding**
- **A* Search Algorithm**`,
      },
      {
        name: "sorting.ts",
        path: "src/algorithms/sorting.ts",
        size: "1.4 KB",
        language: "typescript",
        content: `export async function* quickSort(arr: number[], left = 0, right = arr.length - 1): AsyncGenerator<{ array: number[]; activeIndices: number[] }> {
  if (left >= right) return;

  const pivot = arr[right];
  let partitionIndex = left;

  for (let i = left; i < right; i++) {
    yield { array: [...arr], activeIndices: [i, right] };
    if (arr[i] < pivot) {
      [arr[i], arr[partitionIndex]] = [arr[partitionIndex], arr[i]];
      partitionIndex++;
      yield { array: [...arr], activeIndices: [i, partitionIndex] };
    }
  }

  [arr[partitionIndex], arr[right]] = [arr[right], arr[partitionIndex]];
  yield { array: [...arr], activeIndices: [partitionIndex, right] };

  yield* quickSort(arr, left, partitionIndex - 1);
  yield* quickSort(arr, partitionIndex + 1, right);
}`,
      },
      {
        name: "index.html",
        path: "index.html",
        size: "820 B",
        language: "html",
        content: `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Algorithm Visualizer Engine</title>
  <style>
    body { background: #050508; color: #fff; margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace; }
    canvas { background: rgba(255,255,255,0.03); border: 1px solid rgba(139,92,246,0.3); border-radius: 16px; }
  </style>
</head>
<body>
  <canvas id="canvas" width="800" height="400"></canvas>
</body>
</html>`,
      },
    ],
  },
  {
    id: "rust-wasm-parser",
    name: "rust-wasm-parser",
    description: "Yüksek hızlı Markdown, AST ve kod sözdizim ayrıştırıcısı (Rust & WebAssembly derlemesi).",
    author: {
      id: "admin-siyah",
      name: "Efe Taşkın",
      username: "siyah",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      badge: "Kurucu & Admin",
      role: "admin",
    },
    isPublic: true,
    stars: 61,
    starredByUserIds: [],
    forks: 11,
    primaryLanguage: "Rust",
    languageColor: "#dea584",
    tags: ["rust", "wasm", "webassembly", "markdown", "parser"],
    license: "MIT",
    defaultBranch: "main",
    category: "tools",
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now() - 86400000 * 5,
    releases: [],
    comments: [],
    files: [
      {
        name: "README.md",
        path: "README.md",
        size: "950 B",
        language: "markdown",
        content: `# 🦀 Rust WASM Fast Markdown Parser

Rust dilinde yazılmış ve tarayıcıda doğrudan WebAssembly olarak çalıştırılan ultra hızlı Markdown çözümleyici.

## 🚀 Performans
- Saf JavaScript çözücülere kıyasla **~12 kat daha hızlı**.
- Bellek tüketimi **< 2MB**.`,
      },
      {
        name: "lib.rs",
        path: "src/lib.rs",
        size: "1.2 KB",
        language: "rust",
        content: `use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct FastMarkdownParser {
    strict_mode: bool,
}

#[wasm_bindgen]
impl FastMarkdownParser {
    #[wasm_bindgen(constructor)]
    pub fn new(strict: bool) -> FastMarkdownParser {
        FastMarkdownParser { strict_mode: strict }
    }

    pub fn parse_to_html(&self, markdown: &str) -> String {
        let mut html = String::new();
        for line in markdown.lines() {
            if line.starts_with("# ") {
                html.push_str(&format!("<h1>{}</h1>\\n", &line[2..]));
            } else if line.starts_with("## ") {
                html.push_str(&format!("<h2>{}</h2>\\n", &line[3..]));
            } else {
                html.push_str(&format!("<p>{}</p>\\n", line));
            }
        }
        html
    }
}`,
      },
      {
        name: "Cargo.toml",
        path: "Cargo.toml",
        size: "420 B",
        language: "toml",
        content: `[package]
name = "rust-wasm-parser"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"`,
      },
    ],
  },
];

interface CreateRepoInput {
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
  const [repositories, setRepositories] = useState<Repository[]>(DEFAULT_REPOSITORIES);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("heycoderz_repositories");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRepositories(parsed);
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
