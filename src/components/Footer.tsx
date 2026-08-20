"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full border-t border-white/[0.06] bg-[#020204] pt-16 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Col */}
          <div className="lg:col-span-3 md:col-span-4 space-y-4">
            <Link
              href="/"
              onClick={scrollToTop}
              className="flex items-center gap-2.5 group inline-flex cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center font-mono text-sm font-bold shadow-[0_0_12px_rgba(139,92,246,0.2)] group-hover:border-purple-500/60">
                <span className="text-white">&lt;</span>
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-extrabold">/</span>
                <span className="text-white">&gt;</span>
              </div>
              <div className="flex items-baseline text-xl font-bold tracking-tight">
                <span className="text-white">Hey!</span>
                <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent ml-1.5">
                  Coder&apos;z
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {t("footer.desc")}
            </p>
          </div>

          {/* Nav Links Col 1: Navigasyon */}
          <div className="lg:col-span-2 md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
              {t("footer.navigation")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-purple-300 transition-colors">
                  {t("nav.home") || "Anasayfa"}
                </Link>
              </li>
              <li>
                <Link href="/depolar" className="hover:text-purple-300 transition-colors">
                  {t("nav.repositories")}
                </Link>
              </li>
              <li>
                <Link href="/araclar" className="hover:text-purple-300 transition-colors">
                  {t("nav.tools")}
                </Link>
              </li>
              <li>
                <Link href="/playground" className="hover:text-purple-300 transition-colors">
                  {t("nav.playground")}
                </Link>
              </li>
              <li>
                <Link href="/kaynaklar" className="hover:text-purple-300 transition-colors">
                  {t("nav.resources")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-purple-300 transition-colors">
                  {t("nav.blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Links Col 2: Platform */}
          <div className="lg:col-span-2 md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/hakkimizda" className="hover:text-purple-300 transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/topluluk" className="hover:text-purple-300 transition-colors">
                  {t("nav.community")}
                </Link>
              </li>
              <li>
                <Link href="/giris" className="hover:text-purple-300 transition-colors">
                  {t("nav.login")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-purple-300 transition-colors">
                  {t("nav.dashboard")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Links Col 3: Yasal */}
          <div className="lg:col-span-2 md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-purple-300 transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-300 transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-purple-300 transition-colors">
                  {t("footer.cookies")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / Media Col */}
          <div className="lg:col-span-3 md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
              Sosyal Medya
            </h4>
            <div className="flex flex-col gap-2">
              {/* Instagram */}
              <a
                href="https://instagram.com/heycoderz"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram @heycoderz"
                className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-gradient-to-r hover:from-purple-900/40 hover:to-pink-900/40 border border-white/10 hover:border-pink-500/40 flex items-center gap-2.5 text-gray-300 hover:text-white transition-all duration-200 cursor-pointer shadow-sm group"
              >
                <svg className="w-4 h-4 fill-current text-pink-400 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="text-xs font-mono font-medium">@heycoderz</span>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/heycoderz"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub @heycoderz"
                className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/40 flex items-center gap-2.5 text-gray-300 hover:text-white transition-all duration-200 cursor-pointer shadow-sm group"
              >
                <svg className="w-4 h-4 fill-current text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-xs font-mono font-medium">@heycoderz</span>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com/heycoderz"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter) @heycoderz"
                className="px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-sky-950/30 border border-white/10 hover:border-sky-500/40 flex items-center gap-2.5 text-gray-300 hover:text-white transition-all duration-200 cursor-pointer shadow-sm group"
              >
                <svg className="w-4 h-4 fill-current text-sky-400 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-xs font-mono font-medium">@heycoderz</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} heycoderz. {t("footer.copyright")}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/terms" className="hover:text-purple-300 transition-colors">
              {t("footer.terms")}
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-purple-300 transition-colors">
              {t("footer.privacy")}
            </Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-purple-300 transition-colors">
              {t("footer.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
