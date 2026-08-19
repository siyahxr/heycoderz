"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface TechLogo {
  name: string;
  url: string;
  svg: React.ReactNode;
}

export const TrustBar: React.FC = () => {
  const { t } = useLanguage();

  const logos: TechLogo[] = [
    {
      name: "VS Code",
      url: "https://code.visualstudio.com",
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.27a1 1 0 0 0-.056 1.469l4.57 4.26-4.57 4.26a1 1 0 0 0 .056 1.469l1.322 1.21a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 21.86V3.97a1.5 1.5 0 0 0-.85-1.383zm-6.65 13.913l-6.3-4.5 6.3-4.5v9z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      url: "https://github.com",
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      name: "Figma",
      url: "https://figma.com",
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 12a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm-6 0a3 3 0 0 1 3-3V3H6a3 3 0 0 0 0 6zm0 6a3 3 0 0 1 3-3v6a3 3 0 0 1-3-3zm6-6h3a3 3 0 1 0-3-3v3zm0 6h3a3 3 0 0 0 0-6h-3v6z" />
        </svg>
      ),
    },
    {
      name: "Tailwind CSS",
      url: "https://tailwindcss.com",
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
      ),
    },
    {
      name: "Vercel",
      url: "https://vercel.com",
      svg: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 22.525H0l12-21.05 12 21.05z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full border-y border-white/[0.05] bg-[#050508]/60 backdrop-blur-sm py-8 sm:py-9 my-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          
          {/* Left Text */}
          <div className="flex items-center gap-3 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
            <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-400">
              {t("trust.label")}
            </p>
          </div>

          {/* Right Logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-12">
            {logos.map((logo) => (
              <a
                key={logo.name}
                href={logo.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-500 hover:text-gray-200 transition-colors duration-200 group cursor-pointer"
                title={`${logo.name} resmi sayfasına git`}
              >
                <div className="opacity-70 group-hover:opacity-100 group-hover:text-purple-400 group-hover:scale-105 transition-all duration-200">
                  {logo.svg}
                </div>
                <span className="text-sm font-medium tracking-tight opacity-80 group-hover:opacity-100">
                  {logo.name}
                </span>
              </a>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
