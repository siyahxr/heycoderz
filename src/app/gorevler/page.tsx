"use client";

import React, { useState } from "react";
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
  Clock
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
        const passed = JSON.stringify(result) === JSON.stringify([[1, 2, 3], [4, 5, 6], [7]]);
        return { passed, output: JSON.stringify(result) };
      } catch (err: any) {
        return { passed: false, output: err.message };
      }
    },
  },
];

export default function ChallengesPage() {
  const { user, updateProfile } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [userCode, setUserCode] = useState(CHALLENGES[0].starterCode);
  const [testResult, setTestResult] = useState<{ passed: boolean; output: string } | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  const handleSelectChallenge = (c: Challenge) => {
    setSelectedChallenge(c);
    setUserCode(c.starterCode);
    setTestResult(null);
  };

  const handleRunTests = () => {
    const res = selectedChallenge.runTest(userCode);
    setTestResult(res);

    if (res.passed && !solvedIds.includes(selectedChallenge.id)) {
      setSolvedIds([...solvedIds, selectedChallenge.id]);
      if (user) {
        updateProfile({ xp: (user.xp || 100) + selectedChallenge.xp });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Trophy className="w-3.5 h-3.5" />
            <span>heycoderz Dev Challenges & Quest</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Kodlama Görevleri &{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              XP Arenası
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Algoritmaları tarayıcıda çözün, testleri geçin, XP kazanın ve geliştirici seviyenizi yükseltin.
          </p>
        </div>

        {/* Workspace Dual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Challenges List */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Haftalık Görevler ({CHALLENGES.length})</span>
            </h3>

            <div className="space-y-3">
              {CHALLENGES.map((c) => {
                const isSelected = selectedChallenge.id === c.id;
                const isSolved = solvedIds.includes(c.id);

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectChallenge(c)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-purple-950/40 border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.25)]"
                        : "bg-[#08080E]/90 border-white/[0.08] hover:border-purple-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        c.difficulty === "Kolay"
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-950/60 text-amber-400 border-amber-500/30"
                      }`}>
                        {c.difficulty}
                      </span>
                      <span className="text-xs font-mono text-purple-300 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        +{c.xp} XP
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                      {c.title}
                    </h4>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] text-gray-500">
                      <span>JavaScript ES6</span>
                      {isSolved && (
                        <span className="text-emerald-400 font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Çözüldü</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Code Editor & Test Runner */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#09090F]/95 border border-purple-500/30 shadow-2xl space-y-5">
              
              {/* Challenge Header */}
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white">{selectedChallenge.title}</h2>
                  <span className="px-3 py-1 rounded-xl bg-purple-600 text-xs font-bold text-white shadow-md">
                    +{selectedChallenge.xp} XP
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {selectedChallenge.description}
                </p>
              </div>

              {/* Code Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>JavaScript Çözümünüz:</span>
                  <span className="text-[11px] text-purple-400">Node.js ES6+</span>
                </div>
                <textarea
                  rows={10}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full bg-black/80 border border-purple-500/30 focus:border-purple-500 rounded-2xl p-4 font-mono text-xs text-emerald-400 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Action & Test Runner Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleRunTests}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Testleri Çalıştır & Gönder</span>
                </button>

                {testResult && (
                  <div className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 ${
                    testResult.passed
                      ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                      : "bg-red-950/60 border border-red-500/40 text-red-300"
                  }`}>
                    {testResult.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span>{testResult.passed ? `Tebrikler! Test Geçti (+${selectedChallenge.xp} XP)` : "Test Başarısız: Hatalı Çıktı"}</span>
                  </div>
                )}
              </div>

              {/* Test Case Details */}
              {testResult && (
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-xs font-mono">
                  <div className="text-gray-400">Beklenen Çıktı: <span className="text-purple-300">{selectedChallenge.expectedOutput}</span></div>
                  <div className="text-gray-400">Alınan Çıktı: <span className={testResult.passed ? "text-emerald-400" : "text-red-400"}>{testResult.output}</span></div>
                </div>
              )}

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
