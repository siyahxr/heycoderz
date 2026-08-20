"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CodeEditor } from "./CodeEditor";

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-7">
            
            {/* Top Pill Badge */}
            <Link
              href="/hakkimizda"
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-950/30 border border-purple-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:border-purple-500/50 hover:bg-purple-900/30 transition-all duration-300 cursor-pointer active:scale-95 text-left"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#a855f7]" />
              <span className="text-xs sm:text-sm font-medium tracking-wide text-purple-200">
                {t("hero.badge")}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            </Link>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-extrabold tracking-tight text-white leading-[1.12]">
              {t("hero.titlePrefix")}{" "}
              <br className="hidden sm:inline" />
              {t("hero.titleBreak")}{" "}
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl font-normal">
              {t("hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
              <Link
                href="/depolar"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] transition-all duration-200 group text-center cursor-pointer active:scale-98"
              >
                <span>{t("nav.repositories")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/araclar"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-xl font-medium text-gray-200 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/15 hover:border-purple-500/40 backdrop-blur-sm transition-all duration-200 group text-center cursor-pointer active:scale-98"
              >
                <span>{t("hero.exploreBtn")}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>

          </div>

          {/* Right Column: Code Editor */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <CodeEditor />
          </div>

        </div>
      </div>
    </section>
  );
};
