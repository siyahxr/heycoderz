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
  login: (emailOrUsername: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, username: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  deleteAccount: (password: string) => Promise<{ success: boolean; message?: string }>;
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
    } catch {}
    return BASE_EFE;
  };

  // Helper to load persistent admin profile for Öykü
  const getPersistentOyku = (): UserProfile => {
    try {
      const customSaved = localStorage.getItem("heycoderz_oyku_profile_custom");
      if (customSaved) {
        return { ...BASE_OYKU, ...JSON.parse(customSaved) };
      }
    } catch {}
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

    // 2. Fetch latest server db state in background
    fetch("/api/sync")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.users)) {
          localStorage.setItem("heycoderz_registered_users", JSON.stringify(data.users));
        }
      })
      .catch(() => {});
  }, []);

  const login = async (emailOrUsername: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const input = sanitizeInput(emailOrUsername.trim().toLowerCase());

    // Try server API authentication first
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: input, password: pass }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        let fullUser = data.user;
        if (input === "efe" || input === "@efe" || input === "admin@heycoderz.com" || input === "efeabsteam@gmail.com") {
          fullUser = { ...getPersistentEfe(), ...data.user };
        } else if (input === "oyku" || input === "@oyku" || input === "öykü" || input === "oyku@heycoderz.com") {
          fullUser = { ...getPersistentOyku(), ...data.user };
        }

        setUser(fullUser);
        localStorage.setItem("heycoderz_active_user", JSON.stringify(fullUser));
        return { success: true };
      } else if (res.status === 401 || res.status === 429) {
        return { success: false, message: data.message || "Giriş başarısız." };
      }
    } catch {
      // Offline / client fallback
    }

    // Client fallback: Check Admin credentials for @efe
    if (input === "efeabsteam@gmail.com" || input === "efe" || input === "@efe" || input === "admin@heycoderz.com") {
      const savedPass = localStorage.getItem("heycoderz_efe_custom_pwd") || "efe2008efeAxA!!3131";
      if (secureCompare(pass, savedPass) || secureCompare(pass, "efe2008efeAxA!!3131")) {
        const persistentAdmin = getPersistentEfe();
        setUser(persistentAdmin);
        localStorage.setItem("heycoderz_active_user", JSON.stringify(persistentAdmin));
        return { success: true };
      } else {
        return { success: false, message: "Efe (Admin) şifresi hatalı!" };
      }
    }

    // Client fallback: Check Admin credentials for @oyku
    if (input === "oyku@heycoderz.com" || input === "oyku" || input === "@oyku" || input === "öykü") {
      const savedPass = localStorage.getItem("heycoderz_oyku_custom_pwd") || "oyku2026heycoderz!";
      if (secureCompare(pass, savedPass) || secureCompare(pass, "oyku2026heycoderz!") || secureCompare(pass, "oyku2026!")) {
        const persistentOyku = getPersistentOyku();
        setUser(persistentOyku);
        localStorage.setItem("heycoderz_active_user", JSON.stringify(persistentOyku));
        return { success: true };
      } else {
        return { success: false, message: "Öykü (Kurucu Ortak) şifresi hatalı!" };
      }
    }

    // Client fallback: Check stored registered users
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
    } catch {}

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
    } catch {}
    return { success: true };
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; message?: string }> => {
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
    } catch {}

    setUser(newUser);

    // Sync with server DB in background
    try {
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile: { ...newUser, password: pass } }),
      }).catch(() => {});
    } catch {}

    return { success: true };
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
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

    // Persist to server API database
    try {
      await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile: updated }),
      });
    } catch (e) {
      console.warn("Server sync warning:", e);
    }
  };

  const changePassword = async (
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: "Oturum açık değil." };

    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrEmail: user.username,
          currentPassword: oldPass,
          newPassword: newPass,
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (user.username === "efe") {
          localStorage.setItem("heycoderz_efe_custom_pwd", newPass);
        } else if (user.username === "oyku") {
          localStorage.setItem("heycoderz_oyku_custom_pwd", newPass);
        } else {
          // Update in local registered users
          const regStr = localStorage.getItem("heycoderz_registered_users");
          if (regStr) {
            const list = JSON.parse(regStr);
            const idx = list.findIndex((u: any) => u.username === user.username);
            if (idx !== -1) {
              list[idx].password = newPass;
              localStorage.setItem("heycoderz_registered_users", JSON.stringify(list));
            }
          }
        }
        return { success: true, message: data.message || "Şifreniz başarıyla güncellendi." };
      }
      return { success: false, message: data.message || "Şifre değiştirilemedi." };
    } catch {
      // Local client fallback
      if (user.username === "efe") {
        const activePass = localStorage.getItem("heycoderz_efe_custom_pwd") || "efe2008efeAxA!!3131";
        if (secureCompare(oldPass, activePass)) {
          localStorage.setItem("heycoderz_efe_custom_pwd", newPass);
          return { success: true, message: "Şifre başarıyla güncellendi." };
        }
        return { success: false, message: "Mevcut şifreniz hatalı." };
      }
      return { success: false, message: "Sunucu bağlantı hatası oluştu." };
    }
  };

  const deleteAccount = async (
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: "Oturum açık değil." };

    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrEmail: user.username,
          password: password,
        }),
      });
      const data = await res.json();

      if (data.success) {
        // Clean local state
        const regStr = localStorage.getItem("heycoderz_registered_users");
        if (regStr) {
          const list = JSON.parse(regStr).filter((u: any) => u.username !== user.username);
          localStorage.setItem("heycoderz_registered_users", JSON.stringify(list));
        }
        logout();
        return { success: true, message: data.message || "Hesabınız başarıyla silindi." };
      }
      return { success: false, message: data.message || "Hesap silinemedi." };
    } catch {
      return { success: false, message: "Hesap silinirken bir hata oluştu." };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("heycoderz_active_user");
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        updateProfile,
        changePassword,
        deleteAccount,
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
