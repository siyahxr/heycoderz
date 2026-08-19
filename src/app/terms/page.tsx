"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { ShieldCheck, ArrowLeft, FileText, Scale } from "lucide-react";

export default function TermsPage() {
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
            <Scale className="w-3.5 h-3.5" />
            <span>Yasal Bilgilendirme</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kullanım Koşulları{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              (Terms of Service)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono">
            Son Güncelleme: 19 Ağustos 2026 • Versiyon 2.6
          </p>
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] shadow-2xl space-y-8 text-sm text-gray-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">1.</span> Kabul ve Kapsam
            </h2>
            <p>
              heycoderz platformunu ("heycoderz", "Platform", "Biz") ziyaret ederek, üye olarak veya platformun sunduğu geliştirici araçlarını, kaynaklarını ve topluluk alanlarını kullanarak bu Kullanım Koşulları&apos;nı kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız lütfen platformu kullanmayınız.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">2.</span> Hizmetlerin Doğası & Araç Kullanımı
            </h2>
            <p>
              heycoderz, yazılımcıların ve mühendislerin üretkenliğini artırmak amacıyla çeşitli çevrimiçi geliştirici araçları (JSON biçimlendirici, Regex test edici, SQL formatlayıcı, Kod Diff karşılaştırıcı, Kripto ve Base64 dönüştürücüler vb.) sunar.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2">
              <li>Tüm araçlar istemci tarafında (Client-side) çalışacak şekilde tasarlanmıştır. Hassas veya özel kodlarınız sunucularımıza izinsiz kaydedilmez.</li>
              <li>Araçların çıktılarının doğruluğu konusunda azami özen gösterilmekle birlikte, kritik canlı üretim sistemlerinde kullanılmadan önce geliştirici tarafından test edilmesi tavsiye edilir.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">3.</span> Topluluk Kuralları & İçerik Paylaşımı
            </h2>
            <p>
              Topluluk tartışmalarında ve kod paylaşımlarında saygılı, yapıcı ve profesyonel bir dil kullanılması esastır. Aşağıdaki davranışlar kesinlikle yasaktır ve hesapların engellenmesine yol açabilir:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-400 pl-2">
              <li>Zararlı yazılım, virüs, kimlik avı (phishing) veya kötü niyetli kod parçacıkları paylaşmak.</li>
              <li>Diğer üyelere yönelik hakaret, taciz, spam veya reklam amaçlı içerik üretmek.</li>
              <li>Üçüncü şahıslara ait gizli ticari sırları veya izinsiz telifli materyalleri sızdırmak.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">4.</span> Fikri Mülkiyet & Belgelerin Kullanımı
            </h2>
            <p>
              Platformda yer alan blog makaleleri, eğitim rehberleri ve indirilebilir yol haritaları kişisel ve profesyonel gelişim amacıyla ücretsiz olarak okunabilir, indirilebilir ve kaynak belirtilerek paylaşılabilir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">5.</span> Sorumluluk Reddi (Disclaimer)
            </h2>
            <p>
              heycoderz servisleri &quot;olduğu gibi&quot; (as-is) sağlanmaktadır. Platformun kesintisiz veya tamamen hatasız çalışacağı garanti edilmemektedir. Doğrudan veya dolaylı veri kayıplarından heycoderz sorumlu tutulamaz.
            </p>
          </section>

          <section className="space-y-3 border-t border-white/[0.06] pt-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">6.</span> İletişim
            </h2>
            <p>
              Kullanım koşulları ile ilgili her türlü soru ve geri bildiriminiz için bizimle{" "}
              <span className="text-purple-400 font-mono">destek@heycoderz.com</span> üzerinden veya Instagram{" "}
              <a href="https://instagram.com/heycoderz" target="_blank" rel="noreferrer" className="text-purple-400 underline">
                @heycoderz
              </a>{" "}
              kanalıyla iletişime geçebilirsiniz.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
