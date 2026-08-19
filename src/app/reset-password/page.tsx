"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password && password === confirmPassword;

  const isFormValid = hasMinLength && hasUpper && hasLower && hasNumber && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg("Şifre sıfırlama bağlantısı bulunamadı veya eksik.");
      return;
    }
    if (!isFormValid) {
      setErrorMsg("Lütfen tüm şifre gereksinimlerini karşılayın ve şifrelerin eşleştiğinden emin olun.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
          turnstileToken: turnstileToken || "dev-bypass-token",
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(data.message || "Şifre sıfırlanamadı. Bağlantı süresi dolmuş olabilir.");
      }
    } catch {
      setLoading(false);
      setErrorMsg("Sunucuya bağlanırken bir hata oluştu.");
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md bg-[#09090F]/90 border border-red-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Geçersiz Bağlantı</h1>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Şifre sıfırlama bağlantısı bulunamadı veya eksik parametre içeriyor.
          </p>
        </div>
        <Link
          href="/sifremi-unuttum"
          className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25"
        >
          <span>Yeni Sıfırlama Bağlantısı Al</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-[#09090F]/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Şifreniz Güncellendi!</h1>
          <p className="text-xs text-gray-300 mt-2 leading-relaxed">
            Your password has been reset successfully. Artık yeni belirlediğiniz şifreniz ile hesabınıza giriş yapabilirsiniz.
          </p>
        </div>
        <Link
          href="/giris"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all"
        >
          <span>Giriş Yap</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-[#09090F]/90 border border-purple-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.15)] backdrop-blur-2xl">
      
      {/* Header Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_25px_rgba(139,92,246,0.35)]">
          <KeyRound className="w-8 h-8" />
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Yeni Şifre <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Belirle</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1.5">
          Hesabınız için güçlü ve güvenli yeni bir şifre oluşturun.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Yeni Şifre</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 pr-10 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Yeni Şifre (Tekrar)</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 pr-10 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Strength Checklist */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5 text-[11px]">
          <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : "text-gray-500"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>En az 8 karakter</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasUpper && hasLower ? "text-emerald-400" : "text-gray-500"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>Büyük ve küçük harf</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400" : "text-gray-500"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>En az bir rakam</span>
          </div>
          {password && confirmPassword && (
            <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{passwordsMatch ? "Şifreler eşleşiyor" : "Şifreler eşleşmiyor"}</span>
            </div>
          )}
        </div>

        {/* Cloudflare Turnstile */}
        <div className="pt-1">
          <TurnstileWidget action="reset-password" onVerify={setTurnstileToken} />
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Şifre Sıfırlanıyor...</span>
            </>
          ) : (
            <>
              <span>Şifremi Sıfırla</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <Suspense
          fallback={
            <div className="w-full max-w-md bg-[#09090F]/90 border border-purple-500/30 rounded-3xl p-10 text-center text-gray-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-400 mb-2" />
              <p className="text-xs">Yükleniyor...</p>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
