"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Code2, 
  Gift, 
  Zap, 
  Check, 
  ArrowRight,
  Send,
  X,
  ExternalLink
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Challenge {
  id: string;
  title: string;
  category: "JavaScript" | "TypeScript" | "Algorithms" | "Regex";
  difficulty: "Kolay" | "Orta" | "Zor";
  xp: number;
  description: string;
  starterCode: string;
  testInput: string;
  runTest: (code: string) => { passed: boolean; output: string };
}

interface BountyItem {
  id: string;
  title: string;
  reward: string;
  xpReward: number;
  badgeReward: string;
  description: string;
  difficulty: "Kolay" | "Orta" | "İleri" | "Efsanevi";
  author: string;
  submissionsCount: number;
  solved: boolean;
  tags: string[];
}

const CHALLENGES: Challenge[] = [
  {
    id: "c-1",
    title: "1. Ters Çevrilmiş Dizgi & Palindrom",
    category: "JavaScript",
    difficulty: "Kolay",
    xp: 50,
    description: "Verilen kelimenin tersten okunuşunun kendisiyle aynı olup olmadığını bulan `isPalindrome(str)` fonksiyonunu yazın.",
    starterCode: `function isPalindrome(str) {
  // Temizle ve ters çevir:
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
    testInput: 'isPalindrome("kayak") ve isPalindrome("heycoderz")',
    runTest: (codeStr: string) => {
      try {
        const fn = new Function(`${codeStr}; return [isPalindrome("kayak"), isPalindrome("heycoderz")];`);
        const result = fn();
        const passed = Array.isArray(result) && result[0] === true && result[1] === false;
        return { passed, output: JSON.stringify(result) };
      } catch (err: any) {
        return { passed: false, output: err.message };
      }
    },
  },
  {
    id: "c-2",
    title: "2. Flatten Nested Arrays (Derin Dizi Düzleştirme)",
    category: "Algorithms",
    difficulty: "Orta",
    xp: 120,
    description: "İç içe geçmiş dizileri tek bir seviyeye indiren `flatten(arr)` fonksiyonunu özyinelemeli (recursive) olarak yazın.",
    starterCode: `function flatten(arr) {
  let result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result = result.concat(flatten(item));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
    testInput: 'flatten([1, [2, [3, [4]], 5]])',
    runTest: (codeStr: string) => {
      try {
        const fn = new Function(`${codeStr}; return flatten([1, [2, [3, [4]], 5]]);`);
        const result = fn();
        const passed = JSON.stringify(result) === JSON.stringify([1, 2, 3, 4, 5]);
        return { passed, output: JSON.stringify(result) };
      } catch (err: any) {
        return { passed: false, output: err.message };
      }
    },
  },
  {
    id: "c-3",
    title: "3. Dizi Elemanlarını Gruplama (Chunk)",
    category: "JavaScript",
    difficulty: "Kolay",
    xp: 80,
    description: "Verilen diziyi `size` boyutunda parçalara ayıran `chunk(arr, size)` fonksiyonunu yazın.",
    starterCode: `function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}`,
    testInput: 'chunk([1, 2, 3, 4, 5, 6, 7], 3)',
    runTest: (codeStr: string) => {
      try {
        const fn = new Function(`${codeStr}; return chunk([1, 2, 3, 4, 5, 6, 7], 3);`);
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
    author: "$",
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
    author: "$",
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

  // Bounties state
  const [bounties, setBounties] = useState<BountyItem[]>(INITIAL_BOUNTIES);
  const [selectedBounty, setSelectedBounty] = useState<BountyItem | null>(null);
  const [bountySolutionText, setBountySolutionText] = useState("");
  const [bountySubmitting, setBountySubmitting] = useState(false);
  const [bountySuccessMsg, setBountySuccessMsg] = useState(false);

  // Load saved completed challenges
  useEffect(() => {
    try {
      const saved = localStorage.getItem("heycoderz_completed_challenges");
      if (saved) setCompletedIds(JSON.parse(saved));
      const savedBounties = localStorage.getItem("heycoderz_bounties_v3");
      if (savedBounties) setBounties(JSON.parse(savedBounties));
    } catch {}
  }, []);

  const handleSelectChallenge = (c: Challenge) => {
    setActiveChallenge(c);
    setUserCode(c.starterCode);
    setTestResult(null);
  };

  const handleRunTest = () => {
    const res = activeChallenge.runTest(userCode);
    setTestResult(res);

    if (res.passed && !completedIds.includes(activeChallenge.id)) {
      const updated = [...completedIds, activeChallenge.id];
      setCompletedIds(updated);
      try {
        localStorage.setItem("heycoderz_completed_challenges", JSON.stringify(updated));
        
        // Award XP
        const active = localStorage.getItem("heycoderz_active_user");
        if (active) {
          const parsed = JSON.parse(active);
          parsed.xp = (parsed.xp || 100) + activeChallenge.xp;
          localStorage.setItem("heycoderz_active_user", JSON.stringify(parsed));
        }
      } catch {}
    }
  };

  const handleSubmitBounty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBounty || !bountySolutionText.trim()) return;

    setBountySubmitting(true);
    setTimeout(() => {
      const updated = bounties.map((b) =>
        b.id === selectedBounty.id ? { ...b, submissionsCount: b.submissionsCount + 1 } : b
      );
      setBounties(updated);
      try {
        localStorage.setItem("heycoderz_bounties_v3", JSON.stringify(updated));
        const active = localStorage.getItem("heycoderz_active_user");
        if (active) {
          const parsed = JSON.parse(active);
          parsed.xp = (parsed.xp || 100) + selectedBounty.xpReward;
          localStorage.setItem("heycoderz_active_user", JSON.stringify(parsed));
        }
      } catch {}

      setBountySubmitting(false);
      setBountySuccessMsg(true);
      setTimeout(() => {
        setBountySuccessMsg(false);
        setSelectedBounty(null);
        setBountySolutionText("");
      }, 1800);
    }, 800);
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
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Yeteneklerini Test Et,{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-amber-400 bg-clip-text text-transparent">
                Ödülleri Kazan
              </span>
            </h1>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
              Her gün güncellenen algoritmaları çözerek XP topla, serini koru veya topluluk tarafından açılan büyük ödüllü Bounties panosuna çözüm gönder.
            </p>
          </div>

          {/* Daily Streak Counter */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#09090F] border border-amber-500/30 shadow-lg shadow-amber-500/5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                <span>{streakDays} Günlük Seri!</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono">
                  +%25 XP
                </span>
              </div>
              <p className="text-xs text-gray-400">Bugünkü görevini çöz ve serini sürdür.</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("challenges")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "challenges"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-white/[0.03] text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Günlük Kod Meydan Okumaları ({completedIds.length}/{CHALLENGES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bounties")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "bounties"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30"
                : "bg-white/[0.03] text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            <Gift className="w-4 h-4" />
            Ödüllü Bounties Panosu ({bounties.length})
          </button>
        </div>

        {/* Content Area */}
        {activeTab === "challenges" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Challenge List */}
            <div className="lg:col-span-4 space-y-3">
              {CHALLENGES.map((c) => {
                const isCompleted = completedIds.includes(c.id);
                const isSelected = activeChallenge.id === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectChallenge(c)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50"
                        : "bg-[#09090F] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-gray-300">
                        {c.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-amber-400">+{c.xp} XP</span>
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white">{c.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-1">{c.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Right: Challenge Editor & Runner */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-6 rounded-3xl bg-[#09090F] border border-purple-500/30 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{activeChallenge.title}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono">
                        +{activeChallenge.xp} XP
                      </span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">{activeChallenge.description}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-black/60 border border-white/10 overflow-hidden">
                  <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
                    <span>JavaScript Fonksiyonu</span>
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
                    onClick={() => setSelectedBounty(bounty)}
                    className="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Çözüm Gönder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Bounty Solution Submission Modal */}
      {selectedBounty && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 isolate">
          <div 
            onClick={() => setSelectedBounty(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative z-10 w-full max-w-xl bg-[#09090F] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Bounty Çözüm Gönderimi</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBounty(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-300">{selectedBounty.title}</h4>
              <p className="text-xs text-gray-400">{selectedBounty.description}</p>
              <div className="text-xs font-mono text-amber-400 pt-1">
                Ödül: {selectedBounty.reward}
              </div>
            </div>

            <form onSubmit={handleSubmitBounty} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">
                  Çözüm Kodu veya GitHub PR / Gist Bağlantısı:
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="// Çözüm kodunuzu veya GitHub PR linkinizi buraya ekleyin..."
                  value={bountySolutionText}
                  onChange={(e) => setBountySolutionText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {bountySuccessMsg && (
                <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Çözümünüz başarıyla kaydedildi ve +{selectedBounty.xpReward} XP hesabınıza eklendi!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBounty(null)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={bountySubmitting || bountySuccessMsg}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {bountySubmitting ? (
                    <span>Gönderiliyor...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Çözümü Gönder</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
