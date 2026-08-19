"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TurnstileWidget } from "@/components/TurnstileWidget";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resendVerification } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "already_verified" | "expired" | "error" | "idle">(
    token ? "loading" : "idle"
  );
  const [message, setMessage] = useState<string>("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccessMsg, setResendSuccessMsg] = useState("");
  const [resendErrorMsg, setResendErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("idle");
      return;
    }

    let isMounted = true;

    async function verifyToken() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.success) {
          if (data.alreadyVerified) {
            setStatus("already_verified");
            setMessage(data.message || "E-posta adresiniz zaten doğrulanmış.");
          } else {
            setStatus("success");
            setMessage(data.message || "E-posta adresiniz başarıyla doğrulandı!");
          }
        } else {
          if (data.code === "EXPIRED_TOKEN") {
            setStatus("expired");
            if (data.email) setResendEmail(data.email);
            setMessage(data.message || "Doğrulama bağlantısının süresi dolmuş.");
          } else {
            setStatus("error");
            setMessage(data.message || "Geçersiz veya kullanılmış doğrulama bağlantısı.");
          }
        }
      } catch {
        if (isMounted) {
          setStatus("error");
          setMessage("Doğrulama sırasında sunucuya ulaşılamadı.");
        }
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    if (!turnstileToken) {
      setResendErrorMsg("Lütfen güvenlik doğrulamasını tamamlayın.");
      return;
    }

    setResendLoading(true);
    setResendSuccessMsg("");
    setResendErrorMsg("");

    try {
      const res = await resendVerification(resendEmail.trim(), turnstileToken);
      setResendLoading(false);
      if (res.success) {
        setResendSuccessMsg(res.message || "Doğrulama bağlantısı gönderildi. Lütfen e-postanızı kontrol edin.");
      } else {
        setResendErrorMsg(res.message || "Doğrulama maili gönderilemedi.");
      }
    } catch {
      setResendLoading(false);
      setResendErrorMsg("Sunucu hatası oluştu.");
    }
  };

  return (
    <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-lg bg-[#09090F]/95 border border-purple-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.2)] backdrop-blur-2xl text-center">
        
        {/* Top Logo */}
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center font-mono text-base font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            &lt;/&gt;
          </div>
        </div>

        {/* 1. Loading State */}
        {status === "loading" && (
          <div className="space-y-6 py-4">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
              <ShieldCheck className="w-7 h-7 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Doğrulanıyor...</h1>
              <p className="text-sm text-gray-400 mt-2">
                Güvenlik token&apos;ınız kontrol ediliyor, lütfen bir saniye bekleyin.
              </p>
            </div>
          </div>
        )}

        {/* 2. Success State */}
        {status === "success" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hesap Aktif</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                E-postanız Doğrulandı!
              </h1>
              <p className="text-sm text-gray-300 mt-2">
                {message || "HeyCoderz topluluğuna hoş geldiniz. Artık hesabınıza güvenle giriş yapabilirsiniz."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/giris"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer"
              >
                <span>Hemen Giriş Yap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 3. Already Verified State */}
        {status === "already_verified" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                E-postanız Zaten Doğrulanmış
              </h1>
              <p className="text-sm text-gray-300 mt-2">
                {message || "Bu hesap daha önce doğrulanmış. Doğrudan giriş yaparak platformu kullanmaya devam edebilirsiniz."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/giris"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer"
              >
                <span>Giriş Yap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 4. Expired Token State */}
        {status === "expired" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Bağlantının Süresi Dolmuş
              </h1>
              <p className="text-sm text-gray-300 mt-2">
                Güvenliğiniz için doğrulama bağlantıları <strong>15 dakika</strong> geçerlidir. Aşağıdan yeni bir doğrulama e-postası talep edebilirsiniz.
              </p>
            </div>

            {resendSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resendSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleResend} className="space-y-3 pt-2 text-left">
                {resendErrorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resendErrorMsg}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    E-posta Adresiniz
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="ornek@mail.com"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-center mt-2">
                  <TurnstileWidget 
                    onVerify={(token) => setTurnstileToken(token)}
                    action="verify_resend"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resendLoading}
                  className="w-full py-3 rounded-xl font-medium text-sm text-white bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {resendLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Yeni Doğrulama Maili Gönder</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* 5. Error / Invalid Token State */}
        {status === "error" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Geçersiz Doğrulama Bağlantısı
              </h1>
              <p className="text-sm text-gray-300 mt-2">
                {message || "Bu doğrulama linki geçersiz, bozulmuş veya daha önce kullanılmış olabilir."}
              </p>
            </div>

            {resendSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resendSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleResend} className="space-y-3 pt-2 text-left">
                {resendErrorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resendErrorMsg}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Kayıtlı E-posta Adresiniz
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="ornek@mail.com"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-center mt-2">
                  <TurnstileWidget 
                    onVerify={(token) => setTurnstileToken(token)}
                    action="verify_resend_error"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resendLoading}
                  className="w-full py-3 rounded-xl font-medium text-sm text-white bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {resendLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Doğrulama E-postasını Tekrar Gönder</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* 6. Idle / Direct Visit State */}
        {status === "idle" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_30px_rgba(139,92,246,0.25)]">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                E-posta Doğrulama
              </h1>
              <p className="text-sm text-gray-300 mt-2">
                Hesabınızı aktifleştirmek için e-postanıza gönderilen bağlantıya tıklayın veya yeni bir bağlantı talep edin.
              </p>
            </div>

            {resendSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resendSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleResend} className="space-y-3 pt-2 text-left">
                {resendErrorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{resendErrorMsg}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    E-posta Adresi veya Kullanıcı Adı
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="deniz@ornek.com veya denizkaya"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-center mt-2">
                  <TurnstileWidget 
                    onVerify={(token) => setTurnstileToken(token)}
                    action="verify_resend_idle"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resendLoading}
                  className="w-full py-3 rounded-xl font-medium text-sm text-white bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {resendLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Doğrulama E-postası Gönder</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-gray-400">
          <Link href="/giris" className="text-purple-400 hover:text-purple-300 font-medium">
            ← Giriş Sayfasına Dön
          </Link>
          <Link href="/" className="text-gray-400 hover:text-gray-200">
            Ana Sayfa
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <Suspense
        fallback={
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>

      <Footer />
    </div>
  );
}
