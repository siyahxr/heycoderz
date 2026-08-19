"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import {
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Lütfen e-posta adresinizi girin.");
      return;
    }
    if (!turnstileToken && process.env.NODE_ENV !== "development") {
      setErrorMsg("Lütfen güvenlik doğrulamasını tamamlayın.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          turnstileToken: turnstileToken || "dev-bypass-token",
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {}

      setLoading(false);

      if (res.ok && data.success) {
        setSubmitted(true);
        // Start 60s cooldown
        setResendCooldown(60);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrorMsg(data?.message || "İstek işlenirken bir sorun oluştu. Lütfen tekrar deneyin.");
      }
    } catch {
      setLoading(false);
      setErrorMsg("Sunucu bağlantısı sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-md bg-[#09090F]/90 border border-purple-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.15)] backdrop-blur-2xl">
          
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_25px_rgba(139,92,246,0.35)]">
              <KeyRound className="w-8 h-8" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Şifreni <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Sıfırla</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Hesabınıza kayıtlı e-posta adresinizi girin. Size tek kullanımlık güvenli bir şifre sıfırlama bağlantısı göndereceğiz.
            </p>
          </div>

          {/* Success State */}
          {submitted ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-sm font-bold text-emerald-200">Bağlantı Gönderildi!</h2>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Eğer <strong className="text-white font-medium">{email}</strong> adresine ait bir hesap varsa, 15 dakika geçerli bir şifre sıfırlama bağlantısı gönderilmiştir.
                </p>
                <p className="text-[11px] text-gray-400">
                  Lütfen gelen kutunuzu ve spam (gereksiz) klasörünüzü kontrol edin.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  disabled={resendCooldown > 0}
                  className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                >
                  {resendCooldown > 0
                    ? `Tekrar Gönder (${resendCooldown}s)`
                    : "Farklı E-posta ile Tekrar Dene"}
                </button>

                <Link
                  href="/giris"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Giriş Sayfasına Dön</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Request Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>E-posta Adresi</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eposta@domain.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                />
              </div>

              {/* Cloudflare Turnstile */}
              <div className="pt-1">
                <TurnstileWidget action="forgot-password" onVerify={setTurnstileToken} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <span>Sıfırlama Bağlantısı Gönder</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-3 border-t border-white/[0.08]">
                <Link
                  href="/giris"
                  className="text-xs text-gray-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Giriş Yap sayfasına geri dön</span>
                </Link>
              </div>
            </form>
          )}

          {/* Security Notice */}
          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>256-bit uçtan uca şifreleme ve rate limit koruması</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
