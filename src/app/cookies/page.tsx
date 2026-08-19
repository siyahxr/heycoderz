"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Cookie, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Back Link */}
        <div className="mb-8 pb-4 border-b border-white/[0.08]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-purple-400" />
            <span>Anasayfaya Dön</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-300">
            <Cookie className="w-3.5 h-3.5" />
            <span>Çerez Bildirimi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Çerez Politikası{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              (Cookie Policy)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono">
            Son Güncelleme: 19 Ağustos 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] shadow-2xl space-y-8 text-sm text-gray-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">1.</span> Çerez Nedir?
            </h2>
            <p>
              Çerezler (Cookies) ve yerel depolama anahtarları (LocalStorage), web sitelerini ziyaret ettiğinizde cihazınızda saklanan küçük veri dosyalarıdır. heycoderz, kullanıcı deneyimini optimize etmek ve oturumunuzu güvenle açık tutmak için bu teknolojileri kullanır.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">2.</span> Kullandığımız Çerez & Depolama Türleri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zorunlu Oturum Depolaması</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Giriş yaptığınızda oturumunuzun aktif kalmasını ve profilinize erişebilmenizi sağlayan temel depolama anahtarları.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Tercih & Araç Önbelleği</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Geliştirici araçlarındaki son ayarlarınızı ve kaydettiğiniz kod parçacıklarını hatırlamak için kullanılan yerel depolama.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">3.</span> Üçüncü Taraf Takip Çerezleri
            </h2>
            <p>
              heycoderz platformunda kullanıcıları siteler arası takip eden (cross-site tracking), üçüncü taraf pazarlama veya agresif reklam çerezleri <strong>kesinlikle bulunmaz</strong>.
            </p>
          </section>

          <section className="space-y-3 border-t border-white/[0.06] pt-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">4.</span> Çerezleri Nasıl Yönetebilirsiniz?
            </h2>
            <p>
              Tarayıcınızın ayarlarından dilediğiniz an çerezleri temizleyebilir veya yerel depolama verilerini sıfırlayabilirsiniz.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
