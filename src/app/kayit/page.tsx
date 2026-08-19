"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TurnstileWidget } from "@/components/TurnstileWidget";

export default function RegisterPage() {
  const { register, resendVerification } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
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
    setLoading(true);

    try {
      const res = await register(name, username, email, password, turnstileToken);
      setLoading(false);
      if (res.success) {
        setSubmittedEmail(email);
        setIsSubmitted(true);
      } else {
        setErrorMsg(res.message || "Kayıt işlemi başarısız.");
      }
    } catch {
      setLoading(false);
      setErrorMsg("Kayıt olunurken bir hata oluştu.");
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;
    if (!turnstileToken) {
      setResendStatus({ type: "error", text: "Lütfen güvenlik doğrulamasını tamamlayın." });
      return;
    }
    setResendLoading(true);
    setResendStatus(null);
    try {
      const res = await resendVerification(submittedEmail, turnstileToken);
      setResendLoading(false);
      if (res.success) {
        setResendStatus({
          type: "success",
          text: res.message || "Yeni doğrulama e-postası gönderildi!",
        });
      } else {
        setResendStatus({
          type: "error",
          text: res.message || "Doğrulama e-postası gönderilemedi.",
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
          
          {/* Logo Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center font-mono text-sm font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]">
                &lt;/&gt;
              </div>
            </Link>

            {isSubmitted ? (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Son Bir Adım</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  E-postanızı Doğrulayın
                </h1>
                <p className="text-xs sm:text-sm text-gray-400">
                  Hesabınızı aktifleştirmek için gelen kutunuzu kontrol edin.
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Aramıza Katıl
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">
                  Geliştirici profilini oluştur ve hemen üretmeye başla.
                </p>
              </>
            )}
          </div>

          {/* Success Screen After Form Submission */}
          {isSubmitted ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-300 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Doğrulama bağlantısı şu adrese gönderildi:</p>
                  <p className="text-sm font-semibold text-white mt-0.5 break-all font-mono">
                    {submittedEmail}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-[11px] text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Bağlantı 15 dakika geçerlidir</span>
                </div>
              </div>

              {resendStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
                    resendStatus.type === "success"
                      ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                      : "bg-red-950/60 border border-red-500/40 text-red-300"
                  }`}
                >
                  {resendStatus.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{resendStatus.text}</span>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <Link
                  href="/giris"
                  className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Giriş Yapmaya Git</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="w-full py-2.5 rounded-xl text-xs font-medium text-purple-300 hover:text-white bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {resendLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>E-posta gelmedi mi? Tekrar Gönder</span>
                    </>
                  )}
                </button>
                <div className="mt-4 flex justify-center">
                  <TurnstileWidget 
                    onVerify={(token) => setTurnstileToken(token)}
                    action="register_resend"
                  />
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-gray-400 hover:text-gray-200 underline cursor-pointer"
                >
                  Farklı bir e-posta ile kayıt ol
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Deniz Kaya"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Kullanıcı Adı (@username)
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    placeholder="denizkaya"
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 font-mono outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="deniz@ornek.com"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Şifre
                  </label>
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
                    action="register"
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
                      <span>Hesap Oluştur</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer link */}
              <p className="text-center text-xs text-gray-400 mt-6 pt-6 border-t border-white/[0.08]">
                Zaten hesabınız var mı?{" "}
                <Link href="/giris" className="text-purple-400 hover:text-purple-300 font-semibold">
                  Giriş Yap
                </Link>
              </p>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
