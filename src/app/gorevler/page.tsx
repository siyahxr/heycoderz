"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Trophy, 
  Code2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Flame, 
  Award, 
  Terminal, 
  HelpCircle, 
  Clock, 
  Gift, 
  Swords, 
  Check, 
  ExternalLink,
  Zap
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Challenge {
  id: string;
  title: string;
  difficulty: "Kolay" | "Orta" | "İleri";
  xp: number;
  description: string;
  starterCode: string;
  testInput: any;
  expectedOutput: any;
  runTest: (code: string) => { passed: boolean; output: string };
}

interface BountyItem {
  id: string;
  title: string;
  reward: string;
  xpReward: number;
  badgeReward?: string;
  description: string;
  difficulty: "Orta" | "İleri" | "Efsanevi";
  author: string;
  submissionsCount: number;
  solved: boolean;
  tags: string[];
}

const CHALLENGES: Challenge[] = [
  {
    id: "dedup-array",
    title: "1. Dizideki Yinelenen Elemanları Kaldır (Deduplication)",
    difficulty: "Kolay",
    xp: 150,
    description: "Verilen bir dizideki tüm tekrar eden elemanları kaldıran ve sadece benzersiz elemanları sırasıyla döndüren 'removeDuplicates(arr)' fonksiyonunu yazın.",
    starterCode: `function removeDuplicates(arr) {
  // Çözümünüzü buraya yazın:
  return Array.from(new Set(arr));
}`,
    testInput: [1, 2, 2, 3, 4, 4, 5, 1],
    expectedOutput: "[1, 2, 3, 4, 5]",
    runTest: (codeStr: string) => {
      try {
        const fn = new Function(`${codeStr}; return removeDuplicates([1, 2, 2, 3, 4, 4, 5, 1]);`);
        const result = fn();
        const passed = JSON.stringify(result) === JSON.stringify([1, 2, 3, 4, 5]);
        return { passed, output: JSON.stringify(result) };
      } catch (err: any) {
        return { passed: false, output: err.message };
      }
    },
  },
  {
    id: "palindrome-checker",
    title: "2. Palindrom String Doğrulayıcı",
    difficulty: "Kolay",
    xp: 120,
    description: "Verilen cümlenin boşluklar ve büyük/küçük harf duyarsız olarak tersten okunuşuyla aynı olup olmadığını bulan 'isPalindrome(str)' fonksiyonunu yazın.",
    starterCode: `function isPalindrome(str) {
  // Çözümünüz:
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
    testInput: "A man, a plan, a canal: Panama",
    expectedOutput: "true",
    runTest: (codeStr: string) => {
      try {
        const fn = new Function(`${codeStr}; return isPalindrome("A man, a plan, a canal: Panama");`);
        const result = fn();
        const passed = result === true;
        return { passed, output: String(result) };
      } catch (err: any) {
        return { passed: false, output: err.message };
      }
    },
  },
  {
    id: "chunk-array",
    title: "3. Diziyi Belirli Boyutlarda Parçalara Böl (Chunk Array)",
    difficulty: "Orta",
    xp: 220,
    description: "Bir diziyi belirtilen 'size' boyutunda küçük alt dizilere bölen 'chunkArray(arr, size)' fonksiyonunu yazın.",
    starterCode: `function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}`,
    testInput: "[1, 2, 3, 4, 5, 6, 7], size = 3",
    expectedOutput: "[[1,2,3],[4,5,6],[7]]",
    runTest: (codeStr: string) => {
      try {
        const fn = new Function(`${codeStr}; return chunkArray([1, 2, 3, 4, 5, 6, 7], 3);`);
        const result = fn();
        const passed = JSON.stringify(result) === JSON.stringify([[1,2,3],[4,5,6],[7]]);
        return { passed, output: JSON.stringify(result) };
      } catch (err: any) {
        return { passed: false, output: err.message };
      }
    },
  },
];

const INITIAL_BOUNTIES: BountyItem[] = [
  {
    id: "bounty-1",
    title: "Next.js 16 Web Worker Tabanlı Markdown Parser Optimizasyonu",
    reward: "+600 XP & 'Bug Hunter' Rozeti",
    xpReward: 600,
    badgeReward: "Bug Hunter",
    description: "Büyük Markdown dokümanlarında UI donmasını önlemek için arka planda çalışan Web Worker tabanlı AST ayrıştırıcı modülü entegre edin.",
    difficulty: "İleri",
    author: "$ (Admin)",
    submissionsCount: 4,
    solved: false,
    tags: ["Next.js", "Web Worker", "Performance", "AST"],
  },
  {
    id: "bounty-2",
    title: "Tailwind CSS v4 Animasyonlu Radial Glow Bileşeni",
    reward: "+450 XP & 'UI Wizard' Rozeti",
    xpReward: 450,
    badgeReward: "UI Wizard",
    description: "Kullanıcı faresini takip eden fütüristik neon radyal ışıma efekti için 0 CPU maliyetli CSS shader/glow bileşeni geliştirin.",
    difficulty: "Orta",
    author: "Öykü",
    submissionsCount: 7,
    solved: true,
    tags: ["Tailwind v4", "CSS Animation", "Figma", "Design"],
  },
  {
    id: "bounty-3",
    title: "PostgreSQL Full-Text Search ve Trigram İndeks Mimarisi",
    reward: "+800 XP & 'DB Master' Rozeti",
    xpReward: 800,
    badgeReward: "DB Master",
    description: "Milyonlarca kod snippet'ı arasında 50ms altında Türkçe harf duyarsız arama yapabilen pg_trgm indeks stratejisi oluşturun.",
    difficulty: "Efsanevi",
    author: "$ (Admin)",
    submissionsCount: 2,
    solved: false,
    tags: ["PostgreSQL", "Database", "Search", "Optimization"],
  },
];

export default function ChallengesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"challenges" | "bounties">("challenges");
  const [activeChallenge, setActiveChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [userCode, setUserCode] = useState<string>(CHALLENGES[0].starterCode);
  const [testResult, setTestResult] = useState<{ passed: boolean; output: string } | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [streakDays, setStreakDays] = useState(5);

  // Bounties
  const [bounties, setBounties] = useState<BountyItem[]>(INITIAL_BOUNTIES);
  const [claimedBountyId, setClaimedBountyId] = useState<string | null>(null);

  const handleSelectChallenge = (c: Challenge) => {
    setActiveChallenge(c);
    setUserCode(c.starterCode);
    setTestResult(null);
  };

  const handleRunTest = () => {
    const res = activeChallenge.runTest(userCode);
    setTestResult(res);

    if (res.passed && !completedIds.includes(activeChallenge.id)) {
      setCompletedIds([...completedIds, activeChallenge.id]);
    }
  };

  const handleClaimBounty = (id: string) => {
    setClaimedBountyId(id);
    setTimeout(() => {
      setClaimedBountyId(null);
      setBounties(bounties.map((b) => (b.id === id ? { ...b, submissionsCount: b.submissionsCount + 1 } : b)));
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Trophy className="w-3.5 h-3.5" />
              <span>heycoderz Kod Meydan Okumaları & Bounties</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Algoritma &{" "}
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                Ödüllü Görevler
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Kodlama pratiği yapın, günlük serinizi koruyun ve topluluk bounties görevlerini tamamlayarak seviye atlayın.
            </p>
          </div>

          {/* Daily Streak Card */}
          <div className="p-4 rounded-2xl bg-[#09090F] border border-orange-500/30 shadow-xl flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <Flame className="w-6 h-6 animate-pulse fill-orange-500/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{streakDays} Günlük Seri</span>
                <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[10px] font-mono font-bold">+25% XP</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5 font-mono">Bugün 1 görev çöz ve serini uzat</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("challenges")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "challenges"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-gray-400 hover:text-white bg-white/[0.02]"
              }`}
            >
              <Code2 className="w-4 h-4" />
              Pratik Algoritmalar ({CHALLENGES.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bounties")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "bounties"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                  : "text-gray-400 hover:text-white bg-white/[0.02]"
              }`}
            >
              <Gift className="w-4 h-4 text-amber-300" />
              Ödüllü Bounties ({bounties.length})
            </button>
          </div>

          <Link
            href="/duello"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 flex items-center gap-1.5 transition-all"
          >
            <Swords className="w-3.5 h-3.5" />
            1v1 Düelloya Katıl
          </Link>
        </div>

        {activeTab === "challenges" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Challenges List */}
            <div className="lg:col-span-5 space-y-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Görev Listesi
              </h2>

              <div className="space-y-2.5">
                {CHALLENGES.map((ch) => {
                  const isSelected = activeChallenge.id === ch.id;
                  const isDone = completedIds.includes(ch.id);

                  return (
                    <div
                      key={ch.id}
                      onClick={() => handleSelectChallenge(ch)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-950/40 border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                          : "bg-[#09090F] border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            ch.difficulty === "Kolay" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}>
                            {ch.difficulty}
                          </span>
                          <span className="text-xs font-mono text-purple-300 font-semibold">+{ch.xp} XP</span>
                        </div>
                        {isDone && (
                          <span className="text-xs font-mono text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Tamamlandı
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white">{ch.title}</h3>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Challenge Workspace */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-3xl bg-[#09090F] border border-white/10 space-y-4 shadow-xl">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{activeChallenge.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{activeChallenge.description}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs font-mono">
                  <div className="text-gray-400">Örnek Girdi: <span className="text-white">{JSON.stringify(activeChallenge.testInput)}</span></div>
                  <div className="text-gray-400">Beklenen Çıktı: <span className="text-purple-300">{activeChallenge.expectedOutput}</span></div>
                </div>

                {/* Editor */}
                <div className="rounded-2xl overflow-hidden bg-black/90 border border-white/10">
                  <div className="px-4 py-2 bg-white/[0.03] border-b border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span>JavaScript Editörü</span>
                    <span>Testleri Çalıştır</span>
                  </div>
                  <textarea
                    rows={8}
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full p-4 bg-transparent text-purple-200 font-mono text-xs focus:outline-none leading-relaxed resize-none"
                  />
                </div>

                {/* Test Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setUserCode(activeChallenge.starterCode)}
                    className="text-xs text-gray-400 hover:text-white font-mono cursor-pointer"
                  >
                    Başlangıç Koduna Sıfırla
                  </button>

                  <button
                    type="button"
                    onClick={handleRunTest}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Testi Çalıştır
                  </button>
                </div>

                {/* Test Output */}
                {testResult && (
                  <div className={`p-4 rounded-xl border font-mono text-xs flex items-center justify-between ${
                    testResult.passed
                      ? "bg-green-500/10 border-green-500/30 text-green-300"
                      : "bg-red-500/10 border-red-500/30 text-red-300"
                  }`}>
                    <div className="flex items-center gap-2">
                      {testResult.passed ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                      <span>{testResult.passed ? "Tebrikler! Test başarıyla geçti." : `Test başarısız: ${testResult.output}`}</span>
                    </div>
                    {testResult.passed && <span className="font-bold text-green-400">+{activeChallenge.xp} XP Eklendi</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Bounties Board */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bounties.map((bounty) => (
              <div
                key={bounty.id}
                className="p-6 rounded-3xl bg-[#09090F] border border-amber-500/30 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1 font-mono">
                      <Gift className="w-3.5 h-3.5 text-amber-400" /> {bounty.reward}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${bounty.solved ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-300"}`}>
                      {bounty.solved ? "✓ Çözüldü" : "🔥 Açık Görev"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{bounty.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{bounty.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {bounty.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-mono">Açan: {bounty.author}</span>
                  <button
                    type="button"
                    onClick={() => handleClaimBounty(bounty.id)}
                    className="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {claimedBountyId === bounty.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        Çözüm İnceleniyor!
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Çözüm Gönder
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
