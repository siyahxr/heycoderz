"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Users, 
  Code2, 
  Share2, 
  Copy, 
  Check, 
  Play, 
  Terminal, 
  Mic, 
  MicOff, 
  Layers, 
  Sparkles, 
  RotateCcw,
  Zap,
  ArrowRightLeft
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function PairProgrammingPage() {
  const { user } = useAuth();
  
  // Room state
  const [roomId, setRoomId] = useState("heycoderz-room-8821");
  const [inRoom, setInRoom] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [myRole, setMyRole] = useState<"Driver" | "Navigator">("Driver");
  const [micEnabled, setMicEnabled] = useState(false);

  // Editor state
  const [language, setLanguage] = useState<"javascript" | "typescript" | "python">("javascript");
  const [code, setCode] = useState(`// Eşli Kodlama Odası (Pair Programming)
// Rolünüz: Driver (Kod yazıcı)

function calculateDeveloperVelocity(commits, reviews, tasksCompleted) {
  const velocityScore = (commits * 1.5) + (reviews * 2.0) + (tasksCompleted * 3.0);
  return {
    score: velocityScore,
    tier: velocityScore > 50 ? "Senior Titan" : "Pro Developer",
    active: true
  };
}

console.log(calculateDeveloperVelocity(12, 8, 5));
`);

  // Console output
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "heycoderz Pair Room v2.0 bağlandı.",
    "Oda ID: heycoderz-room-8821",
    "Partner bağlandı: @oyku (Navigator)",
  ]);

  const [partner, setPartner] = useState({
    name: "Öykü",
    username: "oyku",
    role: "Navigator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    typing: false,
  });

  const copyInviteLink = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/pair?room=${roomId}` : `https://heycoderz.com/pair?room=${roomId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRunCode = () => {
    try {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => {
          logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "));
        },
        error: (...args: any[]) => {
          logs.push("HATA: " + args.join(" "));
        },
      };

      const fn = new Function("console", code);
      fn(customConsole);

      if (logs.length === 0) {
        setConsoleLogs((prev) => [...prev, "Kod başarıyla çalıştırıldı (çıktı üretilmedi)."]);
      } else {
        setConsoleLogs((prev) => [...prev, ...logs]);
      }
    } catch (err: any) {
      setConsoleLogs((prev) => [...prev, `Çalışma Hatası: ${err.message}`]);
    }
  };

  const swapRoles = () => {
    setMyRole((prev) => (prev === "Driver" ? "Navigator" : "Driver"));
    setPartner((prev) => ({
      ...prev,
      role: prev.role === "Driver" ? "Navigator" : "Driver",
    }));
    setConsoleLogs((prev) => [...prev, `Roller değiştirildi. Yeni Driver: ${myRole === "Driver" ? partner.name : (user?.name || "Sen")}`]);
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-6">
        
        {/* Top Room Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-[#09090F] border border-purple-500/30 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">Canlı Eşli Kodlama Odası</h1>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-mono font-bold">
                  🟢 Canlı Bağlantı
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Oda Kodu: <strong className="text-purple-300">{roomId}</strong></p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={swapRoles}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-purple-400" />
              Rol Değiştir ({myRole})
            </button>

            <button
              type="button"
              onClick={() => setMicEnabled(!micEnabled)}
              className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                micEnabled
                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                  : "bg-white/5 text-gray-400 hover:text-white border-white/10"
              }`}
              title={micEnabled ? "Mikrofonu Kapat" : "Mikrofonu Aç"}
            >
              {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={copyInviteLink}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-300" />
                  Link Kopyalandı
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  Davet Linki Kopyala
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Coding Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Editor & Console (9 Cols) */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Editor Container */}
            <div className="rounded-3xl overflow-hidden bg-[#09090F] border border-white/10 shadow-2xl">
              {/* Editor Bar */}
              <div className="px-5 py-3 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-gray-400">workspace.js</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunCode}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Kodu Çalıştır
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <textarea
                rows={14}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-5 bg-black/60 text-purple-200 font-mono text-xs focus:outline-none leading-relaxed resize-none selection:bg-purple-500/30"
              />
            </div>

            {/* Terminal Console */}
            <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-xl">
              <div className="px-4 py-2 bg-white/[0.03] border-b border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  Çıktı Konsolu
                </span>
                <button
                  type="button"
                  onClick={() => setConsoleLogs([])}
                  className="text-gray-500 hover:text-white text-[11px] cursor-pointer"
                >
                  Temizle
                </button>
              </div>
              <div className="p-4 font-mono text-xs space-y-1.5 max-h-[140px] overflow-y-auto text-green-400">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-gray-600 mr-2">&gt;</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Room Participants & Quick Chat (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Participants Card */}
            <div className="p-5 rounded-3xl bg-[#09090F] border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Oda Katılımcıları (2)
              </h3>

              <div className="space-y-3">
                {/* You */}
                <div className="p-3 rounded-2xl bg-black/40 border border-purple-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"}
                      alt="You"
                      className="w-8 h-8 rounded-xl object-cover border border-purple-500/40"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{user?.name || "Sen"} (Sen)</span>
                      <span className="text-[10px] text-purple-400 font-mono">{myRole}</span>
                    </div>
                  </div>
                </div>

                {/* Partner */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-8 h-8 rounded-xl object-cover border border-indigo-500/40"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{partner.name}</span>
                      <span className="text-[10px] text-indigo-400 font-mono">{partner.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-5 rounded-3xl bg-purple-950/20 border border-purple-500/20 space-y-2">
              <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Pair Programming İpucu
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                <strong>Driver</strong> kodu yazar, <strong>Navigator</strong> ise mimariyi inceler, hataları yakalar ve yönlendirir. Her 15 dakikada bir rolleri değiştirerek maksimum verim elde edin.
              </p>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
