"use client";

import React, { useEffect } from "react";
import { X, Wrench, GraduationCap, Users, BookOpen, ExternalLink, Sparkles, Check, ArrowRight } from "lucide-react";

export type ModalType = "araclar" | "kaynaklar" | "topluluk" | "blog" | "hakkimizda" | "gizlilik" | "kullanim" | null;

interface FeatureDetailModalProps {
  type: ModalType;
  onClose: () => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && type) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [type, onClose]);

  if (!type) return null;

  const getContent = () => {
    switch (type) {
      case "araclar":
        return {
          icon: Wrench,
          badge: "Geliştirici Araç Kiti",
          title: "heycoderz Araçlar",
          description: "Günlük iş akışınızı hızlandıracak, tarayıcı tabanlı güçlü geliştirici araçları.",
          items: [
            {
              title: "JSON Biçimlendirici & Doğrulayıcı",
              desc: "Bozuk JSON verilerini anında temizleyin, ağaç görünümünde inceleyin.",
              tag: "Popüler",
            },
            {
              title: "CSS Gradient & Glassmorphism Oluşturucu",
              desc: "Modern CSS arka plan ve cam efektlerini canlı önizleme ile kodlayın.",
              tag: "Yeni",
            },
            {
              title: "Regex Test Edici & Açıklayıcı",
              desc: "Düzenli ifadelerinizi gerçek zamanlı eşleşmeler ve açıklamalarla test edin.",
              tag: "Yardımcı",
            },
            {
              title: "Base64, Hash & UUID Üretici",
              desc: "Kriptografik ve kodlama yardımcılarına tek tıkla ulaşın.",
              tag: "Hızlı",
            },
          ],
        };

      case "kaynaklar":
        return {
          icon: GraduationCap,
          badge: "Öğrenme & Gelişim",
          title: "Geliştirici Kaynakları",
          description: "Sıfırdan ileri seviyeye kadar en güncel rehberler, yol haritaları ve dökümantasyonlar.",
          items: [
            {
              title: "2026 Modern Frontend Yol Haritası",
              desc: "React 19, Next.js, Tailwind v4 ve modern durum yönetimi stratejileri.",
              tag: "Rehber",
            },
            {
              title: "Backend & Mimari Tasarım Örüntüleri",
              desc: "Mikroservisler, REST/GraphQL API dizaynı ve veritabanı optimizasyonu.",
              tag: "İleri",
            },
            {
              title: "TypeScript İpuçları & Hile Sayfası (Cheatsheet)",
              desc: "Generics, conditional types ve tip güvenliği için pratik kod parçaları.",
              tag: "PDF",
            },
            {
              title: "Açık Kaynak UI Kütüphaneleri Koleksiyonu",
              desc: "Erişilebilir ve şık bileşen setleri kataloğu.",
              tag: "Koleksiyon",
            },
          ],
        };

      case "topluluk":
        return {
          icon: Users,
          badge: "Geliştirici Ağı",
          title: "heycoderz Topluluğu",
          description: "Binlerce tutkulu yazılımcı ile bağlantı kur, projelerini paylaş ve yardım al.",
          items: [
            {
              title: "Discord Geliştirici Sunucusu",
              desc: "7/24 sesli/metin odaları, kod inceleme kanalları ve haftalık etkinlikler.",
              tag: "5.000+ Üye",
            },
            {
              title: "Haftalık Kodlama Meydan Okumaları",
              desc: "Algoritma ve UI yarışmalarına katıl, ödüller ve rozetler kazan.",
              tag: "Aktif",
            },
            {
              title: "Açık Kaynak İşbirlikleri",
              desc: "Birlikte açık kaynak projeler geliştirin ve portfolyonuzu güçlendirin.",
              tag: "GitHub",
            },
            {
              title: "Mentorluk & Kariyer Destek",
              desc: "Kıdemli mühendislerden CV incelemesi ve mülakat simülasyonları.",
              tag: "Ücretsiz",
            },
          ],
        };

      case "blog":
        return {
          icon: BookOpen,
          badge: "İçerik & Makaleler",
          title: "heycoderz Blog",
          description: "Yazılım dünyasındaki en son trendler, derinlemesine teknik analizler ve rehberler.",
          items: [
            {
              title: "Next.js 16 ve Turbopack ile Ultra Hızlı Web Geliştirme",
              desc: "Yeni mimari yenilikleri ve performans kazanımları üzerine derinlemesine bir bakış.",
              tag: "5 dk okuma",
            },
            {
              title: "Tailwind CSS v4 ile Stil Yönetiminde Yeni Çağ",
              desc: "CSS değişkenleri ve yeni motorla nasıl daha temiz kod yazılır?",
              tag: "4 dk okuma",
            },
            {
              title: "Yapay Zeka Destekli Kodlamada En İyi Pratikler",
              desc: "AI araçlarıyla üretkenliği 3 katına çıkarmanın püf noktaları.",
              tag: "7 dk okuma",
            },
            {
              title: "Büyük Ölçekli React Uygulamalarında Durum Yönetimi",
              desc: "Zustand, Redux Toolkit ve React Server Actions karşılaştırması.",
              tag: "6 dk okuma",
            },
          ],
        };

      case "hakkimizda":
        return {
          icon: Sparkles,
          badge: "Biz Kimiz?",
          title: "heycoderz Hakkında",
          description: "Geliştiricilerin potansiyellerini en üst seviyeye çıkarmak için inşa edilen modern bir ekosistem.",
          items: [
            {
              title: "Misyonumuz",
              desc: "Yazılım geliştiricilerine modern araçlar, kaliteli kaynaklar ve birleştirici bir topluluk sunmak.",
              tag: "Vizyon",
            },
            {
              title: "Açık ve Ücretsiz",
              desc: "Geliştirici araçlarımızın ve topluluk kaynaklarımızın büyük kısmı herkese tamamen açık.",
              tag: "Topluluk",
            },
            {
              title: "Sürekli Gelişim",
              desc: "Ekosistemimizi her hafta yeni özellikler ve topluluk talepleri doğrultusunda güncelliyoruz.",
              tag: "İnovasyon",
            },
          ],
        };

      case "gizlilik":
        return {
          icon: Sparkles,
          badge: "Yasal Bilgilendirme",
          title: "Gizlilik Politikası",
          description: "Verilerinizin güvenliği ve gizliliği heycoderz için en yüksek önceliktir.",
          items: [
            {
              title: "Veri Toplama",
              desc: "Yalnızca platform deneyiminizi iyileştirmek için gerekli temel bilgileri toplarız.",
              tag: "Güvenli",
            },
            {
              title: "Çerez Politikası",
              desc: "Oturum yönetimi ve performans analitiği için güvenli çerezler kullanılır.",
              tag: "KVKK / GDPR",
            },
            {
              title: "Üçüncü Taraflar",
              desc: "Kişisel verileriniz hiçbir koşulda üçüncü taraflara satılmaz veya paylaşılmaz.",
              tag: "Şeffaf",
            },
          ],
        };

      case "kullanim":
        return {
          icon: Sparkles,
          badge: "Yasal Bilgilendirme",
          title: "Kullanım Şartları",
          description: "heycoderz platformunu kullanırken geçerli olan genel kurallar ve şartlar.",
          items: [
            {
              title: "Hizmet Kullanımı",
              desc: "Platformdaki araçlar ve içerikler geliştirici topluluğuna fayda sağlamak amacıyla sunulur.",
              tag: "Kullanım",
            },
            {
              title: "Telif Hakları",
              desc: "Platformda paylaşılan özgün kod parçaları ve rehberler heycoderz lisansına tabidir.",
              tag: "Lisans",
            },
          ],
        };

      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;
  const Icon = content.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#0A0A12]/95 border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.2)] z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/5 transition-all"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.25)]">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-medium text-purple-400 bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              {content.badge}
            </span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight mt-1.5">
              {content.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {content.description}
            </p>
          </div>
        </div>

        {/* List of items */}
        <div className="space-y-3 my-6">
          {content.items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 hover:bg-white/[0.04] transition-all flex items-start justify-between gap-4 group cursor-pointer"
              onClick={() => alert(`"${item.title}" modülü açılıyor...`)}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/30 text-purple-300 border border-purple-500/20">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </div>
          ))}
        </div>

        {/* Modal Footer CTA */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono">heycoderz v1.0</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
          >
            Tamam
          </button>
        </div>

      </div>
    </div>
  );
};
