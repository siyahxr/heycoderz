"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { useLanguage, LANGUAGES, LanguageOption } from "@/context/LanguageContext";

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredLanguages = LANGUAGES.filter(
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
        <span className="text-sm">{currentLanguage.flag}</span>
        <span className="font-mono uppercase font-bold tracking-wider text-purple-300">
          {currentLanguage.code}
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
              placeholder="Dil ara..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Languages List */}
          <div className="overflow-y-auto max-h-56 space-y-0.5 custom-scrollbar pr-1">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
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
