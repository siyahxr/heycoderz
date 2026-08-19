"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { secureCompare, sanitizeInput } from "@/lib/security";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: "admin" | "developer" | "pro";
  badge: string;
  bio: string;
  website: string;
  github: string;
  twitter: string;
  instagram?: string;
  linkedin: string;
  skills: string[];
  xp: number;
  joinedAt: string;
}

export const BASE_EFE: UserProfile = {
  id: "admin-master",
  name: "Efe Taşkın",
  username: "efe",
  email: "efeabsteam@gmail.com",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=1787085332805",
  role: "admin",
  badge: "Kurucu & Admin",
  bio: "heycoderz kurucusu. Açık kaynak aşığı, Next.js, React ve Cloud mimarisi geliştiricisi.",
  website: "https://heycoderz.com",
  github: "https://github.com/heycoderz",
  twitter: "https://twitter.com/heycoderz",
  instagram: "https://instagram.com/heycoderz",
  linkedin: "https://linkedin.com/company/heycoderz",
  skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Cloud Architecture"],
  xp: 5420,
  joinedAt: "Ocak 2026",
};

export const BASE_OYKU: UserProfile = {
  id: "admin-oyku",
  name: "Öykü",
  username: "oyku",
  email: "oyku@heycoderz.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  role: "admin",
  badge: "Kurucu Ortak & Admin",
  bio: "heycoderz kurucu ortağı. UI/UX mimarisi, modern tasarım sistemleri ve Frontend geliştiricisi.",
  website: "https://heycoderz.com",
  github: "https://github.com/heycoderz",
  twitter: "https://twitter.com/heycoderz",
  instagram: "https://instagram.com/heycoderz",
  linkedin: "https://linkedin.com/company/heycoderz",
  skills: ["UI/UX Design", "Design Systems", "React", "Next.js", "Tailwind CSS", "Figma"],
  xp: 5420,
  joinedAt: "Ocak 2026",
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, pass: string) => { success: boolean; message?: string };
  register: (name: string, username: string, email: string, pass: string) => { success: boolean; message?: string };
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Helper to load persistent admin profile for Efe
  const getPersistentEfe = (): UserProfile => {
    try {
      const customSaved = localStorage.getItem("heycoderz_admin_profile_custom");
      if (customSaved) {
        return { ...BASE_EFE, ...JSON.parse(customSaved) };
      }
    } catch (e) {}
    return BASE_EFE;
  };

  // Helper to load persistent admin profile for Öykü
  const getPersistentOyku = (): UserProfile => {
    try {
      const customSaved = localStorage.getItem("heycoderz_oyku_profile_custom");
      if (customSaved) {
        return { ...BASE_OYKU, ...JSON.parse(customSaved) };
      }
    } catch (e) {}
    return BASE_OYKU;
  };

  useEffect(() => {
    // 1. Load active user session on mount
    try {
      const savedUserStr = localStorage.getItem("heycoderz_active_user");
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed.username === "efe" || parsed.email === "efeabsteam@gmail.com") {
          const finalAdmin = { ...getPersistentEfe(), ...parsed };
          setUser(finalAdmin);
          localStorage.setItem("heycoderz_active_user", JSON.stringify(finalAdmin));
        } else if (parsed.username === "oyku" || parsed.email === "oyku@heycoderz.com") {
          const finalOyku = { ...getPersistentOyku(), ...parsed };
          setUser(finalOyku);
          localStorage.setItem("heycoderz_active_user", JSON.stringify(finalOyku));
        } else {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error("Auth session load error:", e);
    }
  }, []);

  const login = (emailOrUsername: string, pass: string) => {
    const input = sanitizeInput(emailOrUsername.trim().toLowerCase());

    // 1. Check Admin credentials for @efe (Timing-attack safe)
    if (input === "efeabsteam@gmail.com" || input === "efe" || input === "@efe" || input === "admin@heycoderz.com") {
      if (secureCompare(pass, "efe2008efeAxA!!3131")) {
        const persistentAdmin = getPersistentEfe();
        setUser(persistentAdmin);
        try {
          localStorage.setItem("heycoderz_active_user", JSON.stringify(persistentAdmin));
        } catch (e) {}
        return { success: true };
      } else {
        return { success: false, message: "Efe (Admin) şifresi hatalı!" };
      }
    }

    // 2. Check Admin credentials for @oyku (Co-founder) (Timing-attack safe)
    if (input === "oyku@heycoderz.com" || input === "oyku" || input === "@oyku" || input === "öykü" || input === "@öykü") {
      if (secureCompare(pass, "oyku2026heycoderz!") || secureCompare(pass, "oyku2026!")) {
        const persistentOyku = getPersistentOyku();
        setUser(persistentOyku);
        try {
          localStorage.setItem("heycoderz_active_user", JSON.stringify(persistentOyku));
        } catch (e) {}
        return { success: true };
      } else {
        return { success: false, message: "Öykü (Kurucu Ortak) şifresi hatalı!" };
      }
    }

    // 3. Check stored registered users
    try {
      const registeredUsersStr = localStorage.getItem("heycoderz_registered_users");
      const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
      const found = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === input || u.username.toLowerCase() === input
      );

      if (found) {
        if (secureCompare(found.password, pass)) {
          const { password, ...userProfile } = found;
          setUser(userProfile);
          localStorage.setItem("heycoderz_active_user", JSON.stringify(userProfile));
          return { success: true };
        } else {
          return { success: false, message: "Girdiğiniz şifre hatalı." };
        }
      }
    } catch (e) {}

    // Fallback normal login for new developers
    const genericUser: UserProfile = {
      id: "user-" + Date.now(),
      name: input.includes("@") ? input.split("@")[0] : input,
      username: input.includes("@") ? input.split("@")[0] : input,
      email: input.includes("@") ? input : `${input}@heycoderz.com`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${input}`,
      role: "developer",
      badge: "Geliştirici",
      bio: "heycoderz geliştirici topluluğu üyesi.",
      website: "",
      github: "",
      twitter: "",
      linkedin: "",
      skills: ["React", "JavaScript"],
      xp: 100,
      joinedAt: "Yeni",
    };

    setUser(genericUser);
    try {
      localStorage.setItem("heycoderz_active_user", JSON.stringify(genericUser));
    } catch (e) {}
    return { success: true };
  };

  const register = (name: string, username: string, email: string, pass: string) => {
    const cleanEmail = sanitizeInput(email.trim().toLowerCase());
    const cleanUsername = sanitizeInput(username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""));
    const cleanName = sanitizeInput(name.trim()) || "Yeni Geliştirici";

    const registeredUsersStr = localStorage.getItem("heycoderz_registered_users");
    const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];

    if (
      cleanUsername === "efe" || 
      cleanUsername === "oyku" ||
      registeredUsers.some((u: any) => u.email === cleanEmail || u.username === cleanUsername)
    ) {
      return { success: false, message: "Bu e-posta veya kullanıcı adı ile zaten bir hesap mevcut." };
    }

    const newUser: UserProfile = {
      id: "usr-" + Date.now(),
      name: cleanName,
      username: cleanUsername || "dev" + Math.floor(Math.random() * 1000),
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername || "dev"}`,
      role: "developer",
      badge: "Yeni Geliştirici 🚀",
      bio: "heycoderz ile kodlamaya başladım!",
      website: "",
      github: "",
      twitter: "",
      instagram: "https://instagram.com/heycoderz",
      linkedin: "",
      skills: ["HTML", "CSS", "JavaScript"],
      xp: 100,
      joinedAt: "Bugün",
    };

    registeredUsers.push({ ...newUser, password: pass });
    try {
      localStorage.setItem("heycoderz_registered_users", JSON.stringify(registeredUsers));
      localStorage.setItem("heycoderz_active_user", JSON.stringify(newUser));
    } catch (e) {}

    setUser(newUser);
    return { success: true };
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    
    // Sanitize any text inputs
    const sanitizedData: Partial<UserProfile> = { ...updatedData };
    if (sanitizedData.name) sanitizedData.name = sanitizeInput(sanitizedData.name);
    if (sanitizedData.username) sanitizedData.username = sanitizeInput(sanitizedData.username);
    if (sanitizedData.bio) sanitizedData.bio = sanitizeInput(sanitizedData.bio);

    const updated = { ...user, ...sanitizedData };
    setUser(updated);

    try {
      localStorage.setItem("heycoderz_active_user", JSON.stringify(updated));

      // Persist Efe
      if (updated.username === "efe" || updated.email === "efeabsteam@gmail.com") {
        localStorage.setItem("heycoderz_admin_profile_custom", JSON.stringify(updated));
      }
      // Persist Öykü
      if (updated.username === "oyku" || updated.email === "oyku@heycoderz.com") {
        localStorage.setItem("heycoderz_oyku_profile_custom", JSON.stringify(updated));
      }

      // Also update in registered list if exists
      const registeredUsersStr = localStorage.getItem("heycoderz_registered_users");
      if (registeredUsersStr) {
        const registeredUsers = JSON.parse(registeredUsersStr);
        const idx = registeredUsers.findIndex((u: any) => u.id === user.id || u.username === user.username);
        if (idx !== -1) {
          registeredUsers[idx] = { ...registeredUsers[idx], ...updatedData };
          localStorage.setItem("heycoderz_registered_users", JSON.stringify(registeredUsers));
        }
      }
    } catch (e) {
      console.error("Failed to save profile to localStorage:", e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("heycoderz_active_user");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
