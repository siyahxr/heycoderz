import React from "react";
import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";

export interface FeatureItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

interface FeatureCardProps {
  feature: FeatureItem;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <Link
      href={feature.href}
      className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#08080E]/90 backdrop-blur-xl border border-white/[0.07] hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_-10px_rgba(139,92,246,0.25)] cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
    >
      {/* Subtle top-right ambient hover glow within card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Part: Icon, Title & Description */}
      <div>
        {/* Purple Icon Container */}
        <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:border-purple-500/50 group-hover:bg-purple-900/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all duration-300 mb-5">
          <Icon className="w-6 h-6 stroke-[1.8]" />
        </div>

        {/* Card Title */}
        <h3 className="text-xl font-bold text-white tracking-tight mb-2.5 group-hover:text-purple-200 transition-colors duration-200">
          {feature.title}
        </h3>

        {/* Card Description */}
        <p className="text-sm text-gray-400 leading-relaxed font-normal">
          {feature.description}
        </p>
      </div>

      {/* Bottom Action / Arrow */}
      <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs font-medium text-gray-500 group-hover:text-purple-300 transition-colors duration-200">
        <span className="opacity-70 group-hover:opacity-100 transition-opacity duration-200 text-[13px]">
          Sayfaya Git
        </span>
        <div className="w-8 h-8 rounded-lg bg-white/[0.02] group-hover:bg-purple-950/50 border border-white/[0.05] group-hover:border-purple-500/30 flex items-center justify-center transition-all duration-200 ml-auto">
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
};
