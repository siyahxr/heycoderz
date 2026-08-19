"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Sparkles, Users, Rocket, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Misyonumuz & Hikayemiz</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Geliştiricileri{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Güçlendirmek İçin
            </span>{" "}
            Buradayız
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            heycoderz, yazılımcıların daha hızlı öğrenmesini, kaliteli geliştirici araçlarına ücretsiz erişmesini ve birlikte üretmesini hedefleyen modern bir ekosistemdir.
          </p>
        </div>

        {/* 3 Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-7 rounded-2xl bg-[#08080E]/90 border border-white/[0.08] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Yüksek Üretkenlik</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Kodlama sürecindeki gereksiz zaman kayıplarını ortadan kaldıran anlık araçlar ve temiz çözümler.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#08080E]/90 border border-white/[0.08] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Paylaşımcı Topluluk</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Geliştiricilerin birbirine destek olduğu, sorularını paylaştığı ve birlikte büyüdüğü bir alan.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#08080E]/90 border border-white/[0.08] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Açık & Güvenli</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Tarayıcıda istemci tarafında çalışan araçlarla kodunuz ve verileriniz her zaman gizli ve güvende kalır.
            </p>
          </div>
        </div>

        {/* Platform Pillars */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/20 via-black to-indigo-950/20 border border-purple-500/20 text-center space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Modern ve Geleceğe Hazır Teknoloji Altyapısı
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-3xl font-extrabold text-purple-400 font-mono">100%</div>
              <div className="text-xs text-gray-400 mt-1">Ücretsiz & Açık</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-3xl font-extrabold text-purple-400 font-mono">8+</div>
              <div className="text-xs text-gray-400 mt-1">Üretkenlik Aracı</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-3xl font-extrabold text-purple-400 font-mono">0ms</div>
              <div className="text-xs text-gray-400 mt-1">İstemci Tabanlı Hız</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-3xl font-extrabold text-purple-400 font-mono">2026</div>
              <div className="text-xs text-gray-400 mt-1">Next.js 16 & React 19</div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
