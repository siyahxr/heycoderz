"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { ShieldCheck, ArrowLeft, Lock, EyeOff } from "lucide-react";

export default function PrivacyPage() {
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
            <Lock className="w-3.5 h-3.5" />
            <span>Gizlilik & Güvenlik</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Gizlilik Politikası{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              (Privacy Policy)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono">
            Son Güncelleme: 19 Ağustos 2026 • KVKK ve GDPR Uyumlu
          </p>
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] shadow-2xl space-y-8 text-sm text-gray-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">1.</span> Gizlilik Taahhüdümüz
            </h2>
            <p>
              heycoderz olarak geliştiricilerin gizliliğine ve veri güvenliğine en üst düzeyde önem veriyoruz. Bu Gizlilik Politikası, platformumuzu kullandığınızda hangi verilerin işlendiğini ve nasıl korunduğunu açıklamaktadır.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">2.</span> İstemci Tarafı (Client-Side) Güvenlik Mimarisi
            </h2>
            <p>
              heycoderz araçlarında girdiğiniz kodlar, JSON verileri, SQL sorguları, JWT tokenları ve kriptografik anahtarlar <strong>%100 tarayıcınızın kendi belleğinde (Client-side)</strong> işlenir. Bu veriler hiçbir şekilde uzaktaki bir sunucuya kaydedilmez veya analiz edilmez.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">3.</span> Toplanan Bilgiler
            </h2>
            <p>Platformumuzda yalnızca hizmetin işleyişi için gerekli olan minimum düzeyde veri saklanır:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2">
              <li><strong>Hesap Bilgileri:</strong> Kayıt olduğunuzda girdiğiniz Ad Soyad, Kullanıcı Adı, E-posta adresi ve şifreniz.</li>
              <li><strong>Profil Bilgileri:</strong> İsteğe bağlı olarak profilinize eklediğiniz GitHub, Twitter, Instagram, Web sitesi ve yetenek etiketleri.</li>
              <li><strong>Yerel Depolama (LocalStorage):</strong> Kaydettiğiniz kod parçacıkları (snippets) ve oturum verileriniz tarayıcınızın yerel depolama alanında güvenle tutulur.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">4.</span> Üçüncü Taraflarla Veri Paylaşımı
            </h2>
            <p>
              Kullanıcı verileriniz kesinlikle reklam şirketlerine veya üçüncü şahıslara satılmaz, kiralanmaz veya ticari amaçlarla paylaşılmaz.
            </p>
          </section>

          <section className="space-y-3 border-t border-white/[0.06] pt-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">5.</span> Haklarınız & Veri Silme
            </h2>
            <p>
              Hesabınızı veya platform üzerindeki tüm yerel verilerinizi dilediğiniz an Dashboard sayfanızdan silebilir veya veritabanı yedeğinizi JSON formatında dışa aktarabilirsiniz.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
