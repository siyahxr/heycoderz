"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TurnstileWidget } from "@/components/TurnstileWidget";

export default function LoginPage() {
  const router = useRouter();
  const { login, resendVerification } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Unverified state handlers
  const [isUnverified, setIsUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setErrorMsg("Lütfen güvenlik doğrulamasını tamamlayın.");
      return;
    }
    setErrorMsg("");
    setIsUnverified(false);
    setResendStatus(null);
    setLoading(true);

    try {
      const res = await login(email, password, turnstileToken);
      setLoading(false);
      if (res.success) {
        router.push("/dashboard");
      } else if (res.isUnverified) {
        setIsUnverified(true);
        setUnverifiedEmail(res.email || email);
        setErrorMsg(res.message || "Please verify your email address first.");
      } else {
        setErrorMsg(res.message || "Giriş bilgileri hatalı.");
      }
    } catch {
      setLoading(false);
      setErrorMsg("Giriş yapılırken bir hata oluştu.");
    }
  };

  const handleResend = async () => {
    const target = unverifiedEmail || email;
    if (!target) return;
    if (!turnstileToken) {
      setResendStatus({ type: "error", text: "Lütfen güvenlik doğrulamasını tamamlayın." });
      return;
    }

    setResendLoading(true);
    setResendStatus(null);

    try {
      const res = await resendVerification(target, turnstileToken);
      setResendLoading(false);
      if (res.success) {
        setResendStatus({
          type: "success",
          text: res.message || "Doğrulama bağlantısı e-posta adresinize tekrar gönderildi.",
        });
      } else {
        setResendStatus({
          type: "error",
          text: res.message || "Doğrulama maili gönderilemedi.",
        });
      }
    } catch {
      setResendLoading(false);
      setResendStatus({
        type: "error",
        text: "Sunucu bağlantı hatası oluştu.",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md bg-[#09090F]/95 border border-purple-500/30 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.2)] backdrop-blur-2xl">
          
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center font-mono text-sm font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]">
                &lt;/&gt;
              </div>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              heycoderz&apos;a Giriş Yap
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Geliştirici hesabınıza giriş yaparak ekosisteme bağlanın.
            </p>
          </div>

          {/* Unverified Email Warning Box */}
          {isUnverified ? (
            <div className="mb-5 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">E-posta Doğrulaması Gerekli</p>
                  <p className="text-amber-200/80 mt-0.5 leading-relaxed">
                    Hesabınıza erişebilmek için e-posta adresinizi doğrulamanız gerekmektedir.
                  </p>
                </div>
              </div>

              {resendStatus && (
                <div
                  className={`p-2.5 rounded-lg flex items-center gap-2 text-[11px] ${
                    resendStatus.type === "success"
                      ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                      : "bg-red-950/80 border border-red-500/40 text-red-300"
                  }`}
                >
                  {resendStatus.type === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{resendStatus.text}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {resendLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Doğrulama E-postasını Tekrar Gönder</span>
                  </>
                )}
              </button>
            </div>
          ) : errorMsg ? (
            /* Standard Error Message */
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          ) : null}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                E-posta veya Kullanıcı Adı
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com veya @kullaniciadi"
                  className="w-full bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-300">
                  Şifre
                </label>
                <Link
                  href="/sifremi-unuttum"
                  className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Şifremi unuttum?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-center mt-2">
              <TurnstileWidget 
                onVerify={(token) => setTurnstileToken(token)}
                action="login"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-xs text-gray-400 mt-6 pt-6 border-t border-white/[0.08]">
            Hesabınız yok mu?{" "}
            <Link href="/kayit" className="text-purple-400 hover:text-purple-300 font-semibold">
              Kayıt Ol
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
