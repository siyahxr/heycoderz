"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeAccent = "purple" | "emerald" | "cyan" | "pink" | "amber";

interface ThemeContextType {
  accent: ThemeAccent;
  setAccent: (accent: ThemeAccent) => void;
  accentColors: {
    name: string;
    primary: string;
    glow: string;
    gradient: string;
    border: string;
  };
}

const ACCENT_MAP: Record<ThemeAccent, { name: string; primary: string; glow: string; gradient: string; border: string }> = {
  purple: {
    name: "Electric Purple",
    primary: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.4)",
    gradient: "from-purple-500 to-indigo-500",
    border: "border-purple-500/40",
  },
  emerald: {
    name: "Matrix Green",
    primary: "#10B981",
    glow: "rgba(16, 185, 129, 0.4)",
    gradient: "from-emerald-500 to-teal-500",
    border: "border-emerald-500/40",
  },
  cyan: {
    name: "Cyber Cyan",
    primary: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.4)",
    gradient: "from-cyan-500 to-blue-500",
    border: "border-cyan-500/40",
  },
  pink: {
    name: "Neon Rose",
    primary: "#EC4899",
    glow: "rgba(236, 72, 153, 0.4)",
    gradient: "from-pink-500 to-rose-500",
    border: "border-pink-500/40",
  },
  amber: {
    name: "Solar Gold",
    primary: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.4)",
    gradient: "from-amber-500 to-orange-500",
    border: "border-amber-500/40",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState<ThemeAccent>("purple");

  useEffect(() => {
    const saved = localStorage.getItem("heycoderz_theme_accent") as ThemeAccent;
    if (saved && ACCENT_MAP[saved]) {
      setAccentState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const setAccent = (newAccent: ThemeAccent) => {
    setAccentState(newAccent);
    localStorage.setItem("heycoderz_theme_accent", newAccent);
    document.documentElement.setAttribute("data-theme", newAccent);
  };

  return (
    <ThemeContext.Provider
      value={{
        accent,
        setAccent,
        accentColors: ACCENT_MAP[accent],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
