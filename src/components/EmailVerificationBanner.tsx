"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Mail, RefreshCw, CheckCircle2, ArrowRight, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function EmailVerificationBanner() {
  const { user, isAuthenticated, resendVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // If not logged in, or user is verified, or user dismissed for this tab session, do not render
  if (!isAuthenticated || !user || user.email_verified === true || dismissed) {
    return null;
  }

  const hasEmail = Boolean(user.email && user.email.trim() !== "");

  const handleResend = async () => {
    if (!hasEmail) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await resendVerification(user.email);
      setLoading(false);
      if (res.success) {
        setFeedback({
          type: "success",
          text: res.message || "Doğrulama e-postası gönderildi. Lütfen gelen kutunuzu kontrol edin.",
        });
      } else {
        setFeedback({
          type: "error",
          text: res.message || "Gönderim başarısız oldu. Lütfen daha sonra tekrar deneyin.",
        });
      }
    } catch {
      setLoading(false);
      setFeedback({
        type: "error",
        text: "Sunucu bağlantı hatası oluştu.",
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-950/70 via-[#100b1e]/90 to-amber-950/50 border-b border-purple-500/30 text-white backdrop-blur-xl relative z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Icon & Text */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 sm:mt-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  E-posta Adresini Doğrulaman Gerekiyor
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Doğrulanmadı
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                {hasEmail ? (
                  <>
                    Hesabının tüm özelliklerini kullanabilmek için{" "}
                    <strong className="text-purple-300 font-medium">{user.email}</strong> adresini doğrula.
                  </>
                ) : (
                  "Hesabına henüz bir e-posta adresi tanımlanmamış. Hesabını aktifleştirmek için lütfen bir e-posta adresi ekle."
                )}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 flex-wrap pl-11 md:pl-0">
            {feedback && (
              <div
                className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium animate-in fade-in ${
                  feedback.type === "success"
                    ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                    : "bg-red-950/80 border border-red-500/40 text-red-300"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            {hasEmail ? (
              <>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                  )}
                  <span>Doğrulama E-postasını Tekrar Gönder</span>
                </button>

                <Link
                  href="/ayarlar"
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
                >
                  <span>E-postayı Doğrula</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <Link
                href="/ayarlar"
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
              >
                <span>E-posta Ekle ve Doğrula</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Kapat"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
