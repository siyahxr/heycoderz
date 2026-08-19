"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Code2, 
  Layers, 
  Terminal, 
  Sparkles, 
  Maximize2, 
  Save, 
  ExternalLink,
  Laptop
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const PRESETS = [
  {
    name: "Glassmorphism Card",
    desc: "Modern fütüristik cam kart ve hover animasyonu",
    html: `<div class="card">
  <div class="badge">heycoderz</div>
  <h2>Futuristic Glass Card</h2>
  <p>Modern CSS backdrop-filter ve neon gradyan efektleri ile tasarlandı.</p>
  <button onclick="showAlert()">Detayları İncele</button>
</div>`,
    css: `body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #1e1035, #050508);
  font-family: system-ui, -apple-system, sans-serif;
  color: white;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 32px;
  max-width: 340px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 92, 246, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-6px);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(139, 92, 246, 0.4);
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #c4b5fd;
  border-radius: 999px;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

h2 {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 700;
}

p {
  color: #9ca3af;
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 20px;
}

button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}`,
    js: `function showAlert() {
  console.log("heycoderz butonu tıklandı!");
  alert("heycoderz Canlı Sandbox Harika Çalışıyor! 🚀");
}`,
  },
  {
    name: "Interactive Particle Canvas",
    desc: "Mouse hareketini takip eden parçacık animasyonu",
    html: `<canvas id="canvas"></canvas>
<div class="overlay">Fareyi hareket ettirin</div>`,
    css: `body {
  margin: 0;
  overflow: hidden;
  background: #030305;
  font-family: sans-serif;
}
canvas {
  display: block;
}
.overlay {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.4);
  font-size: 12px;
  letter-spacing: 1px;
  pointer-events: none;
}`,
    js: `const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 40; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    radius: Math.random() * 2.5 + 1.5
  });
}

function animate() {
  ctx.fillStyle = "rgba(3, 3, 5, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#8b5cf6";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#8b5cf6";
    ctx.fill();
  });
  
  requestAnimationFrame(animate);
}
animate();`,
  },
];

export default function PlaygroundPage() {
  const { user } = useAuth();
  const [htmlCode, setHtmlCode] = useState(PRESETS[0].html);
  const [cssCode, setCssCode] = useState(PRESETS[0].css);
  const [jsCode, setJsCode] = useState(PRESETS[0].js);
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [srcDoc, setSrcDoc] = useState("");
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Generate output iframe source document
  const runCode = () => {
    const combined = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>
            // Intercept console.log
            const originalLog = console.log;
            console.log = function(...args) {
              window.parent.postMessage({ type: 'CONSOLE_LOG', message: args.join(' ') }, '*');
              originalLog.apply(console, args);
            };
            try {
              ${jsCode}
            } catch (err) {
              console.log('Error: ' + err.message);
            }
          </script>
        </body>
      </html>
    `;
    setSrcDoc(combined);
  };

  useEffect(() => {
    runCode();
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === "CONSOLE_LOG") {
        setLogs((prev) => [...prev.slice(-15), e.data.message]);
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, []);

  const handleCopyCode = () => {
    const code = `<!-- HTML -->\n${htmlCode}\n\n/* CSS */\n${cssCode}\n\n// JavaScript\n${jsCode}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSnippet = () => {
    const saved = localStorage.getItem("heycoderz_saved_snippets");
    const existing = saved ? JSON.parse(saved) : [];
    const item = {
      id: String(Date.now()),
      title: "Playground Projesi (" + activeTab.toUpperCase() + ")",
      lang: "HTML/CSS/JS",
      date: "Bugün",
    };
    localStorage.setItem("heycoderz_saved_snippets", JSON.stringify([item, ...existing]));
    alert("Snippet Dashboard'unuza kaydedildi! 🚀");
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full flex flex-col">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-[11px] font-mono text-purple-300 mb-2">
              <Laptop className="w-3.5 h-3.5" />
              <span>Canlı Web IDE & Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Web <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Playground</span>
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={runCode}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Çalıştır (Auto-Sync)</span>
            </button>

            <button
              type="button"
              onClick={handleSaveSnippet}
              className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-gray-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Snippet Kaydet</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-gray-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Kopyalandı!" : "Kodu Kopyala"}</span>
            </button>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <span className="text-xs text-gray-500 font-mono shrink-0">Hazır Şablonlar:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setHtmlCode(p.html);
                setCssCode(p.css);
                setJsCode(p.js);
              }}
              className="px-3 py-1 rounded-lg bg-white/[0.03] hover:bg-purple-950/40 border border-white/10 hover:border-purple-500/40 text-xs text-gray-300 hover:text-white font-mono shrink-0 transition-all cursor-pointer"
            >
              ⚡ {p.name}
            </button>
          ))}
        </div>

        {/* Workspace Dual Pane: Editor Left / Preview Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* Left: Code Editor Pane */}
          <div className="lg:col-span-6 flex flex-col rounded-3xl bg-[#09090F]/95 border border-purple-500/30 overflow-hidden shadow-2xl">
            {/* Editor Tabs */}
            <div className="flex items-center justify-between bg-black/60 px-4 py-2.5 border-b border-white/10">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("html")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    activeTab === "html"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  HTML
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("css")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    activeTab === "css"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  CSS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("js")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    activeTab === "js"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  JavaScript
                </button>
              </div>

              <span className="text-[11px] font-mono text-purple-400">
                {activeTab.toUpperCase()} Düzenleyici
              </span>
            </div>

            {/* Code Input */}
            <div className="flex-1 p-4 bg-black/80 font-mono text-xs text-purple-200">
              {activeTab === "html" && (
                <textarea
                  rows={20}
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="<div>...</div>"
                  className="w-full h-full bg-transparent text-emerald-400 outline-none resize-none font-mono text-xs leading-relaxed"
                />
              )}
              {activeTab === "css" && (
                <textarea
                  rows={20}
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  placeholder="body { ... }"
                  className="w-full h-full bg-transparent text-pink-300 outline-none resize-none font-mono text-xs leading-relaxed"
                />
              )}
              {activeTab === "js" && (
                <textarea
                  rows={20}
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  placeholder="console.log('hello');"
                  className="w-full h-full bg-transparent text-yellow-300 outline-none resize-none font-mono text-xs leading-relaxed"
                />
              )}
            </div>

            {/* Console Log Drawer */}
            <div className="bg-black/90 border-t border-white/10 p-3 max-h-32 overflow-y-auto font-mono text-[11px]">
              <div className="flex items-center justify-between text-gray-500 mb-1.5">
                <span className="flex items-center gap-1.5 text-xs text-purple-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Konsol Çıktısı ({logs.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="hover:text-white text-[10px]"
                >
                  Temizle
                </button>
              </div>
              {logs.length === 0 ? (
                <span className="text-gray-600">&gt; Konsol temiz...</span>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-emerald-400">
                    &gt; {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Live Output Pane */}
          <div className="lg:col-span-6 flex flex-col rounded-3xl bg-[#09090F]/95 border border-purple-500/30 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between bg-black/60 px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-xs text-gray-400 font-mono ml-2">Canlı Önizleme (Output)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                ● Live 60 FPS
              </span>
            </div>

            <div className="flex-1 w-full bg-[#050508] min-h-[420px]">
              <iframe
                title="Preview"
                srcDoc={srcDoc}
                sandbox="allow-scripts allow-modals"
                className="w-full h-full border-none rounded-b-3xl"
              />
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
