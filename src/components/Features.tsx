import React from "react";
import { Wrench, GraduationCap, Users, BookOpen } from "lucide-react";
import { FeatureCard, FeatureItem } from "./FeatureCard";

const featuresData: FeatureItem[] = [
  {
    id: "araclar",
    icon: Wrench,
    title: "Araçlar",
    description: "Günlük geliştirme işlerini kolaylaştıran araçlar.",
    href: "/araclar",
  },
  {
    id: "kaynaklar",
    icon: GraduationCap,
    title: "Kaynaklar",
    description: "Öğrenmek ve gelişmek için en iyi kaynaklar.",
    href: "/kaynaklar",
  },
  {
    id: "topluluk",
    icon: Users,
    title: "Topluluk",
    description: "Diğer geliştiricilerle tanış, soru sor, paylaş.",
    href: "/topluluk",
  },
  {
    id: "blog",
    icon: BookOpen,
    title: "Blog",
    description: "Yazılar, rehberler ve güncel geliştirme içerikleri.",
    href: "/blog",
  },
];

export const Features: React.FC = () => {
  return (
    <section id="ozellikler" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background soft ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Neler{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Sunuyoruz?
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-normal">
            Geliştirici yolculuğunu kolaylaştıran araçlar ve kaynaklar.
          </p>
        </div>

        {/* Responsive Grid: 4 cols on desktop, 2 cols on tablet, 1 col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
          {featuresData.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

      </div>
    </section>
  );
};
