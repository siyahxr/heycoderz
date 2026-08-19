"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "zh-CN", name: "Chinese", nativeName: "简体中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", flag: "🇦🇿" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
];

export const LanguageSelector: React.FC = () => {
  const { setLanguage, language: currentContextLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageOption>(LANGUAGES[0]);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize invisible translation engine & sync
  useEffect(() => {
    // 1. Detect saved language from cookies or localStorage
    const saved = localStorage.getItem("heycoderz_language") || currentContextLang || "tr";
    const found = LANGUAGES.find((l) => l.code === saved) || LANGUAGES[0];
    setCurrentLang(found);

    // 2. Setup Google Translate Callback
    (window as any).googleTranslateElementInit = () => {
      try {
        if ((window as any).google?.translate?.TranslateElement) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "tr",
              includedLanguages: LANGUAGES.map((l) => l.code).join(","),
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      } catch {}
    };

    // 3. Inject script with https: protocol
    if (!document.getElementById("google-translate-script")) {
      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.type = "text/javascript";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    } else if ((window as any).google?.translate?.TranslateElement) {
      (window as any).googleTranslateElementInit();
    }

    // 4. Close on outside click
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [currentContextLang]);

  const handleSelectLanguage = (lang: LanguageOption) => {
    setCurrentLang(lang);
    setIsOpen(false);
    localStorage.setItem("heycoderz_language", lang.code);
    localStorage.setItem("heycoderz_site_lang", lang.code);

    try {
      setLanguage(lang.code as LanguageCode);
    } catch {}

    const hostname = window.location.hostname;
    const domainParts = hostname.split(".");

    if (lang.code === "tr") {
      // Clear cookie to revert back to native Turkish
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${hostname}; path=/;`;
      
      if (domainParts.length >= 2) {
        const rootDomain = domainParts.slice(-2).join(".");
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${rootDomain}; path=/;`;
      }

      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (combo) {
        combo.value = "tr";
        combo.dispatchEvent(new Event("change"));
      }
      window.location.reload();
      return;
    }

    // Set translation cookie for whole domain & path
    const cookieVal = `/tr/${lang.code}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; domain=${hostname}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; domain=.${hostname}; path=/;`;
    if (domainParts.length >= 2) {
      const rootDomain = domainParts.slice(-2).join(".");
      document.cookie = `googtrans=${cookieVal}; domain=.${rootDomain}; path=/;`;
    }

    // Trigger instant DOM translation via combo element or reload
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (combo) {
      combo.value = lang.code;
      combo.dispatchEvent(new Event("change"));
    }
    
    // Reload to apply Google Translate across all DOM nodes and Next.js SSR trees
    window.location.reload();
  };

  const filtered = LANGUAGES.filter(
    (l) =>
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/40 text-xs font-medium text-gray-200 transition-all duration-200 cursor-pointer shadow-sm"
        title="Dili Değiştir / Change Language"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="font-mono uppercase font-bold tracking-wider text-purple-300">
          {currentLang.code.split("-")[0]}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-purple-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 max-h-80 rounded-2xl bg-[#09090F]/95 border border-purple-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.2)] p-2 z-50 flex flex-col animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input */}
          <div className="relative mb-2 px-1">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Dil ara / Search language..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Languages List */}
          <div className="overflow-y-auto max-h-56 space-y-0.5 custom-scrollbar pr-1">
            {filtered.map((lang) => {
              const isSelected = currentLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                    isSelected
                      ? "bg-purple-600/30 text-white border border-purple-500/40"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm shrink-0">{lang.flag}</span>
                    <span className="truncate">{lang.nativeName}</span>
                    <span className="text-[10px] text-gray-500 font-mono">({lang.code})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
