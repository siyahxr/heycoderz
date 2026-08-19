"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Swords, 
  Trophy, 
  Flame, 
  Timer, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  User, 
  ShieldAlert, 
  RotateCcw, 
  Award, 
  Code2,
  Zap,
  Check
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DuelQuestion {
  id: string;
  title: string;
  category: "Algoritma" | "Hata Avı (Bug Hunt)" | "Frontend";
  difficulty: "Kolay" | "Orta" | "Zor";
  timeLimitSec: number;
  description: string;
  starterCode: string;
  testInputDescription: string;
  testRunner: (code: string) => { passed: boolean; output: string };
}

const DUEL_QUESTIONS: DuelQuestion[] = [
  {
    id: "anagram-check",
    title: "1. Anagram Dizgi Doğrulayıcı",
    category: "Algoritma",
    difficulty: "Kolay",
    timeLimitSec: 120,
    description: "Verilen iki kelimenin birbirinin anagramı (aynı harflerden oluşan farklı kelime) olup olmadığını kontrol eden 'isAnagram(s1, s2)' fonksiyonunu yazın.",
    starterCode: `function isAnagram(s1, s2) {
  // Kodunuzu buraya yazın:
  const normalize = s => s.toLowerCase().split('').sort().join('');
  return normalize(s1) === normalize(s2);
}`,
    testInputDescription: 'isAnagram("listen", "silent") ve isAnagram("hello", "world")',
    testRunner: (codeStr: string) => {
      try {
        const fn = new Function(`${codeStr}; return [isAnagram("listen", "silent"), isAnagram("hello", "world")];`);
        const result = fn();
        const passed = Array.isArray(result) && result[0] === true && result[1] === false;
        return { passed, output: JSON.stringify(result) };
      } catch (err: any) {
        return { passed: false, output: err.message };
      }
    },
  },
  {
    id: "bug-hunt-fibonacci",
    title: "2. Hata Avı: Bozuk Fibonacci Dizisi",
    category: "Hata Avı (Bug Hunt)",
    difficulty: "Orta",
    timeLimitSec: 90,
    description: "Aşağıdaki fibonacci fonksiyonunda sınır koşulu (n <= 1) ve indeks hesaplama hatası var. Hataları düzeltip n. fibonacci sayısını doğru döndürün.",
    starterCode: `function fibonacci(n) {
  // HATA: 0 veya 1 geldiğinde yanlış değer veriyor, düzeltin:
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    let c = a + b;
    a = b;
    b = c;
  }
  return b;
}`,
    testInputDescription: "fibonacci(0)=0, fibonacci(1)=1, fibonacci(7)=13",
    testRunner: (codeStr: string) => {
      try {
        const fn = new Function(`${codeStr}; return [fibonacci(0), fibonacci(1), fibonacci(7)];`);
        const result = fn();
        const passed = Array.isArray(result) && result[0] === 0 && result[1] === 1 && result[2] === 13;
        return { passed, output: JSON.stringify(result) };
      } catch (err: any) {
        return { passed: false, output: err.message };
      }
    },
  },
  {
    id: "array-intersection",
    title: "3. İki Dizinin Kesişimi (Unique Intersection)",
    category: "Algoritma",
    difficulty: "Kolay",
    timeLimitSec: 120,
    description: "Verilen iki dizideki ortak ve benzersiz elemanları döndüren 'getIntersection(arr1, arr2)' fonksiyonunu yazın.",
    starterCode: `function getIntersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return Array.from(new Set(arr1.filter(item => set2.has(item))));
}`,
    testInputDescription: "getIntersection([1, 2, 2, 1], [2, 2]) => [2]",
    testRunner: (codeStr: string) => {
      try {
        const fn = new Function(`${codeStr}; return getIntersection([1, 2, 2, 1], [2, 2]);`);
        const result = fn();
        const passed = Array.isArray(result) && result.length === 1 && result[0] === 2;
        return { passed, output: JSON.stringify(result) };
      } catch (err: any) {
        return { passed: false, output: err.message };
      }
    },
  },
];

const OPPONENTS_LIST = [
  { name: "Öykü", rank: "Master", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80", winRate: "89%" },
  { name: "Caner Taşkın", rank: "Diamond", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80", winRate: "76%" },
  { name: "Selin Yıldız", rank: "Platinum", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80", winRate: "68%" },
  { name: "Barış Kaya", rank: "Grandmaster", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80", winRate: "92%" },
];

export default function CodeDuelPage() {
  const { user } = useAuth();

  // State: "lobby" | "searching" | "battling" | "finished"
  const [gameState, setGameState] = useState<"lobby" | "searching" | "battling" | "finished">("lobby");
  const [currentQuestion, setCurrentQuestion] = useState<DuelQuestion>(DUEL_QUESTIONS[0]);
  const [opponent, setOpponent] = useState(OPPONENTS_LIST[0]);
  const [userCode, setUserCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);

  // Opponent progress simulation
  const [opponentProgress, setOpponentProgress] = useState(0); // 0 to 100%
  const [opponentStatus, setOpponentStatus] = useState("Kod yazmaya başladı...");

  // Match result
  const [winner, setWinner] = useState<"user" | "opponent" | "timeout" | null>(null);
  const [testResult, setTestResult] = useState<{ passed: boolean; output: string } | null>(null);

  // Start matchmaking
  const startMatchmaking = (qIdx: number = 0) => {
    const selectedQ = DUEL_QUESTIONS[qIdx];
    const randOpponent = OPPONENTS_LIST[Math.floor(Math.random() * OPPONENTS_LIST.length)];

    setCurrentQuestion(selectedQ);
    setOpponent(randOpponent);
    setUserCode(selectedQ.starterCode);
    setTimeLeft(selectedQ.timeLimitSec);
    setOpponentProgress(0);
    setOpponentStatus("Rakip bekleniyor...");
    setWinner(null);
    setTestResult(null);

    setGameState("searching");

    // Match found in 1.4s
    setTimeout(() => {
      setGameState("battling");
    }, 1400);
  };

  // Timer & Opponent Progress loop during battling
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let botInterval: NodeJS.Timeout | null = null;

    if (gameState === "battling") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            setWinner("timeout");
            setGameState("finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Opponent progress simulation
      botInterval = setInterval(() => {
        setOpponentProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 8) + 2;
          if (next >= 30 && next < 60) setOpponentStatus("Hata ayıklama yapıyor...");
          else if (next >= 60 && next < 85) setOpponentStatus("Test senaryolarını deniyor...");
          else if (next >= 85 && next < 100) setOpponentStatus("Çözümü doğrulamak üzere!");
          
          if (next >= 100) {
            clearInterval(botInterval!);
            setWinner("opponent");
            setGameState("finished");
            return 100;
          }
          return next;
        });
      }, 2400);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (botInterval) clearInterval(botInterval);
    };
  }, [gameState]);

  // Submit code
  const handleSubmitCode = () => {
    const res = currentQuestion.testRunner(userCode);
    setTestResult(res);

    if (res.passed) {
      setWinner("user");
      setGameState("finished");

      // Persist XP reward
      try {
        const active = localStorage.getItem("heycoderz_active_user");
        if (active) {
          const parsed = JSON.parse(active);
          parsed.xp = (parsed.xp || 100) + 150;
          localStorage.setItem("heycoderz_active_user", JSON.stringify(parsed));
        }
      } catch {}
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Swords className="w-3.5 h-3.5" />
              <span>1v1 Canlı Kod Düellosu Arenası</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Kod{" "}
              <span className="bg-gradient-to-r from-red-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                Düello & Arena
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Gerçek zamanlı algoritma ve hata ayıklama yarışlarında rakibini ele, lig puanı kazan ve sıralamada yüksel.
            </p>
          </div>
        </div>

        {/* LOBBY VIEW */}
        {gameState === "lobby" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Arena Match Cards (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Aktif Düello Meydan Okumaları
              </h2>

              <div className="space-y-3">
                {DUEL_QUESTIONS.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-[#09090F] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
                  >
                    <div className="space-y-1.5 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-300">
                          {q.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-[10px] font-mono text-green-400">
                          {q.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                          <Timer className="w-3 h-3 text-purple-400" /> {q.timeLimitSec} sn
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{q.title}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2">{q.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => startMatchmaking(idx)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:scale-105 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      Düelloyu Başlat
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Duel Leaderboard (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Haftalık Düello Liderleri
              </h2>

              <div className="p-5 rounded-2xl bg-[#09090F] border border-white/10 space-y-4 shadow-xl">
                {[
                  { rank: 1, name: "$ (Admin)", badge: "Grandmaster", score: "42 Galibiyet", avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80", color: "text-amber-400" },
                  { rank: 2, name: "Öykü", badge: "Master", score: "38 Galibiyet", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80", color: "text-gray-300" },
                  { rank: 3, name: "Caner", badge: "Diamond", score: "29 Galibiyet", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80", color: "text-amber-600" },
                ].map((lead) => (
                  <div key={lead.rank} className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <span className={`font-mono font-bold text-xs ${lead.color}`}>#{lead.rank}</span>
                      <img src={lead.avatar} alt={lead.name} className="w-7 h-7 rounded-lg object-cover border border-purple-500/30" />
                      <div>
                        <span className="text-xs font-bold text-white block">{lead.name}</span>
                        <span className="text-[10px] text-gray-500">{lead.badge}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-purple-300 font-bold">{lead.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEARCHING MATCH VIEW */}
        {gameState === "searching" && (
          <div className="min-h-[350px] flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-[#09090F] border border-purple-500/30 shadow-2xl space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin flex items-center justify-center" />
              <Swords className="w-8 h-8 text-purple-400 absolute inset-0 m-auto" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Rakip Aranıyor...</h2>
              <p className="text-xs text-gray-400 font-mono">Uygun seviyedeki geliştirici eşleştiriliyor</p>
            </div>
          </div>
        )}

        {/* BATTLING / DUEL ARENA VIEW */}
        {gameState === "battling" && (
          <div className="space-y-6">
            {/* Top Battle Bar */}
            <div className="p-4 rounded-2xl bg-[#09090F] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* User Side */}
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"}
                  alt="You"
                  className="w-10 h-10 rounded-xl object-cover border border-purple-500/50"
                />
                <div>
                  <span className="text-xs font-bold text-white block">{user?.name || "Sen (Geliştirici)"}</span>
                  <span className="text-[10px] text-green-400 font-mono">🟢 Çözüm Yazılıyor</span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex flex-col items-center">
                <div className="px-5 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-300 font-mono text-xl font-black flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <Timer className="w-5 h-5 text-red-400 animate-pulse" />
                  <span>{timeLeft}s</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 font-mono">Kalan Süre</span>
              </div>

              {/* Opponent Side */}
              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="text-xs font-bold text-white block">{opponent.name}</span>
                  <span className="text-[10px] text-purple-400 font-mono">{opponentStatus} ({opponentProgress}%)</span>
                </div>
                <img
                  src={opponent.avatar}
                  alt={opponent.name}
                  className="w-10 h-10 rounded-xl object-cover border border-indigo-500/50"
                />
              </div>
            </div>

            {/* Opponent Progress Bar */}
            <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-500"
                style={{ width: `${opponentProgress}%` }}
              />
            </div>

            {/* Problem & Code Editor Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Problem Description (5 Cols) */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-[#09090F] border border-white/10 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-purple-400">{currentQuestion.category}</span>
                  <h3 className="text-base font-bold text-white">{currentQuestion.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{currentQuestion.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-gray-500 font-mono">Beklenen Test Senaryosu:</span>
                  <p className="text-xs text-purple-300 font-mono">{currentQuestion.testInputDescription}</p>
                </div>

                {testResult && (
                  <div className={`p-3 rounded-xl border text-xs font-mono ${testResult.passed ? "bg-green-500/10 border-green-500/30 text-green-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
                    {testResult.passed ? "✓ Tebrikler! Tüm testler başarıyla geçti." : `✗ Hata: ${testResult.output}`}
                  </div>
                )}
              </div>

              {/* Code Editor (7 Cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="rounded-2xl overflow-hidden bg-black/80 border border-white/10 shadow-2xl">
                  <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span>JavaScript (ES6+)</span>
                    <span>Hızlı Kod Yaz</span>
                  </div>
                  <textarea
                    rows={12}
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full p-4 bg-transparent text-gray-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleSubmitCode}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-600/30 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Çözümü Gönder & Test Et
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FINISHED / RESULTS VIEW */}
        {gameState === "finished" && (
          <div className="min-h-[380px] p-8 rounded-3xl bg-[#09090F] border border-purple-500/40 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              {winner === "user" ? (
                <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                  <Trophy className="w-10 h-10 text-amber-400" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                  <ShieldAlert className="w-10 h-10 text-red-400" />
                </div>
              )}
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-black text-white">
                {winner === "user" ? "🏆 ZAFER SENİN!" : winner === "opponent" ? "Rakip Daha Hızlı Çözdü!" : "Süre Doldu!"}
              </h2>
              <p className="text-xs text-gray-400">
                {winner === "user"
                  ? "Tüm test senaryolarını rakibinden önce tamamladın. +150 XP profil puanına eklendi!"
                  : "Bu turu rakip kazandı. Yeniden deneyerek şansını artırabilirsin."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setGameState("lobby")}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                Lobiye Dön
              </button>
              <button
                type="button"
                onClick={() => startMatchmaking(0)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Yeni Maç Başlat
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
