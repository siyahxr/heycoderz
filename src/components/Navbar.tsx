"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, LogOut, LayoutDashboard, ShieldCheck, Globe, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const mainNavItems = [
    { id: "araclar", label: t("nav.tools"), href: "/araclar" },
    { id: "playground", label: t("nav.playground"), href: "/playground" },
    { id: "kaynaklar", label: t("nav.resources"), href: "/kaynaklar" },
    { id: "topluluk", label: t("nav.community"), href: "/topluluk" },
    { id: "kesfet", label: t("nav.explore"), href: "/kesfet" },
    { id: "blog", label: t("nav.blog"), href: "/blog" },
    { id: "hakkimizda", label: t("nav.about"), href: "/hakkimizda" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030303]/90 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[92px] flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg p-1 shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center font-mono text-base font-bold shadow-[0_0_15px_rgba(139,92,246,0.25)] group-hover:border-purple-500/60 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all">
            <span className="text-white">&lt;</span>
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-extrabold">/</span>
            <span className="text-white">&gt;</span>
          </div>
          <div className="flex items-baseline text-2xl font-bold tracking-tight">
            <span className="text-white">Hey!</span>
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent ml-1.5">
              Coder&apos;z
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`text-[15px] font-medium transition-all duration-200 relative py-1 cursor-pointer ${
                  isActive
                    ? "text-purple-400 font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & Auth Area */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSelector />

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-purple-500/40"
                />
                <span className="text-xs font-medium text-white max-w-[100px] truncate">
                  {user.name}
                </span>
                {user.role === "admin" && (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#09090F] border border-purple-500/30 shadow-2xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-purple-950/40 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-purple-400" />
                    <span>{t("nav.dashboard")}</span>
                  </Link>

                  <Link
                    href={`/@${user.username}`}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-purple-950/40 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>{t("nav.publicProfile")}</span>
                  </Link>

                  <Link
                    href="/ayarlar"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-purple-950/40 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span>{t("nav.settings")}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("nav.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/giris"
                className="px-4 py-2 text-xs font-medium text-gray-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-purple-500/30 rounded-xl transition-all duration-200 cursor-pointer"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/kayit"
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all duration-200 cursor-pointer"
              >
                {t("nav.register")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] border border-white/10 focus:outline-none cursor-pointer"
            aria-label="Menüyü aç"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#06060A]/95 backdrop-blur-2xl px-5 pt-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1.5">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-purple-950/40 text-purple-300 border border-purple-500/25"
                      : "text-gray-300 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs text-gray-400 font-medium">{t("nav.langSelect")}:</span>
              <LanguageSelector />
            </div>

            {isAuthenticated && user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-xs font-medium text-white bg-purple-600 rounded-xl flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t("nav.dashboard")}</span>
                </Link>
                <Link
                  href="/ayarlar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-xs font-medium text-gray-300 hover:text-white bg-white/[0.04] border border-white/10 rounded-xl flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span>{t("nav.settings")}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-medium text-red-400 bg-white/[0.04] border border-white/10 rounded-xl cursor-pointer"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-xs font-medium text-center text-gray-300 hover:text-white bg-white/[0.04] border border-white/10 rounded-xl"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/kayit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{t("nav.register")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
