"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { secureCompare, sanitizeInput } from "@/lib/security";

export interface SecurityLogItem {
  id: string;
  type: string;
  timestamp: number;
  ip?: string;
  details?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  pendingEmail?: string;
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
  email_verified?: boolean;
  securityLogs?: SecurityLogItem[];
}

export const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80";

export const BASE_MAIN_USER: UserProfile = {
  id: "admin-master",
  name: "$",
  username: "siyah",
  email: "siyah@heycoderz.com",
  avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
  role: "admin",
  badge: "Kurucu & Admin",
  bio: "heycoderz kurucusu ve geliştiricisi.",
  website: "https://heycoderz.com",
  github: "https://github.com/siyahxr",
  twitter: "https://twitter.com/heycoderz",
  instagram: "https://instagram.com/heycoderz",
  linkedin: "https://linkedin.com/company/heycoderz",
  skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Cloud Architecture"],
  xp: 5420,
  joinedAt: "Ocak 2026",
  email_verified: true,
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
  email_verified: true,
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, pass: string, turnstileToken?: string) => Promise<{ success: boolean; message?: string; isUnverified?: boolean; email?: string }>;
  register: (name: string, username: string, email: string, pass: string, turnstileToken?: string) => Promise<{ success: boolean; message?: string; emailSent?: boolean; email?: string }>;
  resendVerification: (emailOrUsername: string, turnstileToken?: string) => Promise<{ success: boolean; message?: string }>;
  updateEmail: (newEmail: string, turnstileToken?: string) => Promise<{ success: boolean; message?: string; emailSent?: boolean }>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  deleteAccount: (password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // 1. Load active user session on mount
    try {
      const savedUserStr = localStorage.getItem("heycoderz_active_user");
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        setUser(parsed);
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
          // If current user is in cloud database, update with fresh cloud data
          const saved = localStorage.getItem("heycoderz_active_user");
          if (saved) {
            const current = JSON.parse(saved);
            const foundInCloud = data.users.find(
              (u: any) => u.username?.toLowerCase() === current.username?.toLowerCase() || u.id === current.id
            );
            if (foundInCloud) {
              const merged = { ...current, ...foundInCloud };
              setUser(merged);
              localStorage.setItem("heycoderz_active_user", JSON.stringify(merged));
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  const login = async (
    emailOrUsername: string,
    pass: string,
    turnstileToken?: string
  ): Promise<{ success: boolean; message?: string; isUnverified?: boolean; email?: string }> => {
    const input = sanitizeInput(emailOrUsername.trim().toLowerCase());

    // Try server API authentication first
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: input, password: pass, turnstileToken }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("heycoderz_active_user", JSON.stringify(data.user));
        return { success: true };
      } else if (res.status === 403 && data.isUnverified) {
        return {
          success: false,
          isUnverified: true,
          email: data.email || input,
          message: data.message || "Please verify your email address first.",
        };
      } else if (res.status === 401 || res.status === 429) {
        return { success: false, message: data.message || "Giriş başarısız." };
      }
    } catch {
      // Offline / client fallback
    }

    // Client fallback: Check Admin credentials for $ / @siyah
    if (input === "siyah@heycoderz.com" || input === "siyah" || input === "@siyah" || input === "$" || input === "admin") {
      const savedPass = localStorage.getItem("heycoderz_siyah_custom_pwd") || "siyah2026heycoderz!";
      if (secureCompare(pass, savedPass) || secureCompare(pass, "siyah2026heycoderz!")) {
        const adminUser: UserProfile = {
          ...BASE_MAIN_USER,
          avatar: localStorage.getItem("heycoderz_siyah_avatar") || BASE_MAIN_USER.avatar,
        };
        setUser(adminUser);
        localStorage.setItem("heycoderz_active_user", JSON.stringify(adminUser));
        return { success: true };
      } else {
        return { success: false, message: "$ (Admin) şifresi hatalı!" };
      }
    }

    // Client fallback: Check Admin credentials for @oyku
    if (input === "oyku@heycoderz.com" || input === "oyku" || input === "@oyku" || input === "öykü") {
      const savedPass = localStorage.getItem("heycoderz_oyku_custom_pwd") || "oyku2026heycoderz!";
      if (secureCompare(pass, savedPass) || secureCompare(pass, "oyku2026heycoderz!") || secureCompare(pass, "oyku2026!")) {
        const oykuUser: UserProfile = {
          ...BASE_OYKU,
          avatar: localStorage.getItem("heycoderz_oyku_avatar") || BASE_OYKU.avatar,
        };
        setUser(oykuUser);
        localStorage.setItem("heycoderz_active_user", JSON.stringify(oykuUser));
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
          if (found.email_verified === false) {
            return {
              success: false,
              isUnverified: true,
              email: found.email,
              message: "Please verify your email address first. / Lütfen önce e-posta adresinizi doğrulayın.",
            };
          }
          const { password, ...userProfile } = found;
          setUser(userProfile);
          localStorage.setItem("heycoderz_active_user", JSON.stringify(userProfile));
          return { success: true };
        } else {
          return { success: false, message: "Girdiğiniz şifre hatalı." };
        }
      }
    } catch {}

    return { success: false, message: "Geçersiz e-posta/kullanıcı adı veya şifre." };
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    pass: string,
    turnstileToken?: string
  ): Promise<{ success: boolean; message?: string; emailSent?: boolean; email?: string }> => {
    const cleanEmail = sanitizeInput(email.trim().toLowerCase());
    const cleanUsername = sanitizeInput(username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""));
    const cleanName = sanitizeInput(name.trim()) || "Yeni Geliştirici";

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          username: cleanUsername,
          email: cleanEmail,
          password: pass,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (data.success) {
        return {
          success: true,
          emailSent: data.emailSent !== false,
          email: cleanEmail,
          message: data.message || "Kayıt başarılı! Lütfen e-postanızı doğrulayın.",
        };
      } else {
        return {
          success: false,
          message: data.message || "Kayıt işlemi başarısız.",
        };
      }
    } catch (err) {
      console.error("Register request failed:", err);
      return {
        success: false,
        message: "Sunucu bağlantısı sırasında bir hata oluştu. Lütfen tekrar deneyin.",
      };
    }
  };

  const resendVerification = async (
    emailOrUsername: string,
    turnstileToken?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, turnstileToken }),
      });
      const data = await res.json();
      return {
        success: data.success,
        message: data.message || (data.success ? "Doğrulama e-postası gönderildi." : "Gönderim başarısız."),
      };
    } catch {
      return {
        success: false,
        message: "Doğrulama e-postası gönderilirken sunucu hatası oluştu.",
      };
    }
  };

  const updateEmail = async (
    newEmail: string,
    turnstileToken?: string
  ): Promise<{ success: boolean; message?: string; emailSent?: boolean }> => {
    try {
      const res = await fetch("/api/auth/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, turnstileToken }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("heycoderz_active_user", JSON.stringify(data.user));
        } else if (user) {
          const updated = { ...user, email: newEmail.trim().toLowerCase(), email_verified: false };
          setUser(updated);
          localStorage.setItem("heycoderz_active_user", JSON.stringify(updated));
        }
        return {
          success: true,
          emailSent: data.emailSent !== false,
          message: data.message || "Doğrulama e-postası gönderildi.",
        };
      }

      return {
        success: false,
        message: data.message || "E-posta güncellenemedi.",
      };
    } catch (e) {
      console.error("updateEmail error:", e);
      return {
        success: false,
        message: "Sunucu bağlantısı sırasında bir hata oluştu.",
      };
    }
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

      if (updated.avatar) {
        if (updated.username === "siyah") localStorage.setItem("heycoderz_siyah_avatar", updated.avatar);
        if (updated.username === "oyku") localStorage.setItem("heycoderz_oyku_avatar", updated.avatar);
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

    // Persist directly to cloud database
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
        if (user.username === "siyah") {
          localStorage.setItem("heycoderz_siyah_custom_pwd", newPass);
        } else if (user.username === "oyku") {
          localStorage.setItem("heycoderz_oyku_custom_pwd", newPass);
        } else {
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
    // Invalidate server session cookie
    try {
      fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        resendVerification,
        updateEmail,
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
