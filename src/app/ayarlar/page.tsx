"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import {
  Settings,
  User,
  Key,
  ShieldAlert,
  Save,
  CheckCircle2,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  Download,
  AlertTriangle,
  Sparkles,
  Globe,
  ArrowLeft,
  Sliders,
  Database,
  Check,
  Share2,
  Code2,
  Mail,
  ShieldCheck,
  ArrowRight,
  Edit2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile, updateEmail, resendVerification, changePassword, deleteAccount, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "avatar" | "security" | "data" | "danger">("profile");

  // Profile Form States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [skills, setSkills] = useState("");

  // Avatar States
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security / Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Danger Zone / Delete Account States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Email verification and update states
  const [emailResendLoading, setEmailResendLoading] = useState(false);
  const [emailActionFeedback, setEmailActionFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmailValue, setNewEmailValue] = useState("");
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);

  // Toast / Feedback States
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatar || "");
      setWebsite(user.website || "");
      setGithub(user.github || "");
      setTwitter(user.twitter || "");
      setInstagram(user.instagram || "https://instagram.com/heycoderz");
      setLinkedin(user.linkedin || "");
      setSkills(user.skills ? user.skills.join(", ") : "");
    }
  }, [user]);

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // If email changed in standard input, trigger email update flow
      if (email.trim() && email.trim().toLowerCase() !== (user.email || "").toLowerCase()) {
        const emailRes = await updateEmail(email.trim());
        if (!emailRes.success) {
          showToast(emailRes.message || "E-posta adresi güncellenemedi.", "error");
          return;
        }
      }

      await updateProfile({
        name,
        username,
        bio,
        website,
        github,
        twitter,
        instagram,
        linkedin,
        skills: skillsArray,
      });

      showToast("Profil bilgileriniz başarıyla kaydedildi!");
    } catch {
      showToast("Profil kaydedilirken bir hata oluştu.", "error");
    }
  };

  // Handle Resend Verification Email from Settings
  const handleResendEmail = async () => {
    if (!user?.email) return;
    setEmailResendLoading(true);
    setEmailActionFeedback(null);
    try {
      const res = await resendVerification(user.email);
      setEmailResendLoading(false);
      if (res.success) {
        setEmailActionFeedback({
          type: "success",
          text: res.message || "Doğrulama bağlantısı e-posta adresinize gönderildi.",
        });
        showToast("Doğrulama e-postası gönderildi!");
      } else {
        setEmailActionFeedback({
          type: "error",
          text: res.message || "E-posta gönderimi başarısız oldu.",
        });
        showToast(res.message || "E-posta gönderilemedi.", "error");
      }
    } catch {
      setEmailResendLoading(false);
      setEmailActionFeedback({ type: "error", text: "Sunucu bağlantı hatası oluştu." });
      showToast("Sunucu bağlantı hatası.", "error");
    }
  };

  // Handle Add/Change Email directly from Email Card
  const handleEmailCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailValue.trim()) return;
    setEmailUpdateLoading(true);
    setEmailActionFeedback(null);
    try {
      const res = await updateEmail(newEmailValue.trim());
      setEmailUpdateLoading(false);
      if (res.success) {
        setIsChangingEmail(false);
        setEmail(newEmailValue.trim().toLowerCase());
        setNewEmailValue("");
        setEmailActionFeedback({
          type: "success",
          text: res.message || "E-posta kaydedildi ve doğrulama e-postası gönderildi.",
        });
        showToast("E-posta güncellendi ve doğrulama e-postası gönderildi!");
      } else {
        setEmailActionFeedback({
          type: "error",
          text: res.message || "E-posta güncellenemedi.",
        });
        showToast(res.message || "E-posta güncellenemedi.", "error");
      }
    } catch {
      setEmailUpdateLoading(false);
      setEmailActionFeedback({ type: "error", text: "Sunucu hatası oluştu." });
      showToast("Sunucu hatası oluştu.", "error");
    }
  };

  // Handle Avatar Update
  const handleSaveAvatar = async () => {
    if (!user || !avatarUrl.trim()) return;
    await updateProfile({ avatar: avatarUrl.trim() });
    showToast("Profil fotoğrafınız güncellendi!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Görsel boyutu 2MB'den küçük olmalıdır.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setAvatarUrl(base64);
        await updateProfile({ avatar: base64 });
        showToast("Özel fotoğrafınız yüklendi!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast("Lütfen mevcut ve yeni şifrenizi girin.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Yeni şifreler birbiriyle eşleşmiyor!", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Yeni şifreniz en az 6 karakter olmalıdır.", "error");
      return;
    }

    setPasswordLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setPasswordLoading(false);

    if (result.success) {
      showToast(result.message || "Şifreniz başarıyla değiştirildi!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      showToast(result.message || "Şifre değiştirilemedi.", "error");
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showToast("Lütfen hesabınızı silmek için şifrenizi girin.", "error");
      return;
    }

    setDeleteLoading(true);
    const result = await deleteAccount(deletePassword);
    setDeleteLoading(false);

    if (result.success) {
      setDeleteModalOpen(false);
      router.push("/");
    } else {
      showToast(result.message || "Hesap silme işlemi başarısız.", "error");
    }
  };

  // Export JSON Backup
  const handleExportData = () => {
    const backupData = {
      user,
      exportDate: new Date().toISOString(),
      platform: "heycoderz",
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `heycoderz-backup-${user?.username || "user"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Verileriniz başarıyla JSON olarak indirildi.");
  };

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9!@#$%^&*()]/.test(pwd)) score += 25;
    return score;
  };

  const strength = getPasswordStrength(newPassword);

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#030303] text-white flex flex-col justify-between selection:bg-purple-500/30">
        <BackgroundEffects />
        <Navbar />
        <div className="max-w-md mx-auto my-auto px-4 text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Ayarlara Erişmek İçin Giriş Yapın</h1>
          <p className="text-gray-400 text-sm mb-6">
            Profilinizi düzenlemek, şifrenizi değiştirmek veya hesap ayarlarınızı yönetmek için lütfen hesabınıza giriş yapın.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/giris"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-purple-500/25"
            >
              Giriş Yap
            </Link>
            <Link
              href="/kayit"
              className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030303] text-white flex flex-col justify-between selection:bg-purple-500/30">
      <BackgroundEffects />
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50"
              : "bg-red-950/90 border-red-500/40 text-red-200 shadow-red-950/50"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2.5">
                <Settings className="w-6 h-6 text-purple-400" />
                <span>Hesap & Sistem Ayarları</span>
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Profil bilgilerinizi, şifrenizi, güvenlik ve veri ayarlarınızı yönetin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/@${user.username}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-500/60 text-xs font-medium transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Profilimi Görüntüle</span>
            </Link>
          </div>
        </div>

        {/* Settings Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profil Bilgileri</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("avatar")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "avatar"
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Avatar & Görsel</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Şifre & Güvenlik</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("data")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === "data"
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Veri & Yedekleme</span>
            </button>

            <div className="pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveTab("danger")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "danger"
                    ? "bg-red-500/20 text-red-300 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                    : "text-gray-400 hover:text-red-400 hover:bg-red-500/5 border border-transparent"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Tehlikeli Bölge</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {/* 1. TAB: Profil Bilgileri */}
            {activeTab === "profile" && (
              <div className="p-6 rounded-2xl bg-[#09090F]/80 border border-white/10 backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-lg font-bold">Profil Bilgilerini Düzenle</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Bu bilgiler heycoderz topluluğundaki herkese açık profilinizde görünür.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Ad Soyad</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="Adınız ve Soyadınız"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">Kullanıcı Adı</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="kullaniciadi"
                        required
                      />
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* EMAIL & VERIFICATION STATUS CARD (SCENARIOS A, B, C)      */}
                  {/* ========================================================= */}
                  <div className="p-5 rounded-2xl bg-[#0e0c18] border border-purple-500/25 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          E-posta &amp; Hesap Doğrulama
                        </span>
                      </div>
                      
                      {user.email && user.email_verified === true && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>E-posta Doğrulandı</span>
                        </span>
                      )}

                      {user.email && user.email_verified !== true && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[11px] font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Doğrulanmadı</span>
                        </span>
                      )}

                      {!user.email && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 text-[11px] font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Tanımlı E-posta Yok</span>
                        </span>
                      )}
                    </div>

                    {/* Scenario Feedback */}
                    {emailActionFeedback && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                          emailActionFeedback.type === "success"
                            ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                            : "bg-red-950/80 border border-red-500/40 text-red-300"
                        }`}
                      >
                        {emailActionFeedback.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{emailActionFeedback.text}</span>
                      </div>
                    )}

                    {/* PENDING EMAIL NOTIFICATION */}
                    {user.pendingEmail && (
                      <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-semibold text-purple-100">Doğrulama Bekleyen Yeni E-posta:</p>
                          <p className="text-[11px] text-gray-300 leading-relaxed">
                            <strong className="text-white font-mono">{user.pendingEmail}</strong> adresine onay bağlantısı gönderildi. Yeni e-postanız onaylanana kadar mevcut e-posta adresiniz ({user.email}) aktif kalacaktır.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* SCENARIO A: Email exists and is verified */}
                    {user.email && user.email_verified === true && !isChangingEmail && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <div>
                          <p className="text-xs text-gray-400">Kayıtlı E-posta:</p>
                          <p className="text-sm font-semibold text-white mt-0.5">{user.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangingEmail(true);
                            setNewEmailValue(user.email || "");
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all self-start sm:self-auto cursor-pointer"
                        >
                          E-postayı Değiştir
                        </button>
                      </div>
                    )}

                    {/* SCENARIO B: Email exists but NOT verified */}
                    {user.email && user.email_verified !== true && !isChangingEmail && (
                      <div className="space-y-3 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-gray-400">Kayıtlı E-posta:</p>
                            <p className="text-sm font-semibold text-white mt-0.5">{user.email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsChangingEmail(true);
                              setNewEmailValue(user.email || "");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-all self-start sm:self-auto cursor-pointer"
                          >
                            Düzelt / Değiştir
                          </button>
                        </div>
                        <p className="text-xs text-amber-200/80 leading-relaxed">
                          Hesabını güvence altına almak ve tüm platform özelliklerini kullanabilmek için e-posta adresini doğrula.
                        </p>
                        <button
                          type="button"
                          onClick={handleResendEmail}
                          disabled={emailResendLoading}
                          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all cursor-pointer disabled:opacity-50"
                        >
                          {emailResendLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Mail className="w-3.5 h-3.5" />
                          )}
                          <span>Doğrulama E-postasını Gönder</span>
                        </button>
                      </div>
                    )}

                    {/* SCENARIO C or Email Change Form */}
                    {(!user.email || isChangingEmail) && (
                      <div className="space-y-3 pt-1">
                        <p className="text-xs text-gray-300">
                          {!user.email
                            ? "Hesabınıza tanımlı bir e-posta adresi bulunmuyor. Lütfen geçerli bir e-posta adresi girin ve doğrulayın:"
                            : "Yeni e-posta adresinizi girin. Değişiklik yapıldığında yeni adresinize bir doğrulama bağlantısı gönderilecektir:"}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="email"
                            value={newEmailValue}
                            onChange={(e) => setNewEmailValue(e.target.value)}
                            placeholder="yeni.eposta@domain.com"
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-purple-500 focus:outline-none"
                            required
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleEmailCardSubmit}
                              disabled={emailUpdateLoading || !newEmailValue.trim()}
                              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              {emailUpdateLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                              <span>{!user.email ? "E-posta Ekle ve Doğrula" : "Kaydet ve Doğrula"}</span>
                            </button>
                            {isChangingEmail && (
                              <button
                                type="button"
                                onClick={() => setIsChangingEmail(false)}
                                className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-medium transition-all cursor-pointer"
                              >
                                İptal
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Biyografi & Hakkımda</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none transition-all resize-none"
                      placeholder="Kendinizden, projelerinizden ve ilgi alanlarınızdan bahsedin..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Yetenekler (Virgülle ayırın)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Next.js, TypeScript, Tailwind CSS, PostgreSQL"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/[0.08]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
                      Sosyal Medya & Web Bağlantıları
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" /> Web Sitesi
                        </label>
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                          placeholder="https://siteniz.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-purple-400" /> GitHub Profil Linki
                        </label>
                        <input
                          type="url"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                          placeholder="https://github.com/kullaniciadi"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                          <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Twitter / X
                        </label>
                        <input
                          type="url"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                          placeholder="https://twitter.com/kullaniciadi"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1.5">
                          <Share2 className="w-3.5 h-3.5 text-pink-400" /> Instagram
                        </label>
                        <input
                          type="url"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                          placeholder="https://instagram.com/heycoderz"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Değişiklikleri Kaydet</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. TAB: Avatar & Görsel */}
            {activeTab === "avatar" && (
              <div className="p-6 rounded-2xl bg-[#09090F]/80 border border-white/10 backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-lg font-bold">Avatar ve Profil Görseli</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Profil resminizi değiştirebilir, robotik DiceBear avatarlar üretebilir veya kendi görselinizi yükleyebilirsiniz.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                  <div className="relative group">
                    <img
                      src={avatarUrl || user.avatar}
                      alt="Avatar Önizleme"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-500/40 shadow-xl"
                    />
                  </div>

                  <div className="space-y-3 flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Fotoğraf Yükle</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const seed = Math.floor(Math.random() * 1000000);
                          const styles = ["shapes", "identicon", "lorelei", "avataaars", "micah"];
                          const randomStyle = styles[Math.floor(Math.random() * styles.length)];
                          setAvatarUrl(`https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Rastgele Modern Avatar Üret</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      PNG, JPG, WebP veya SVG formatı (Maks. 2MB).
                    </p>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-300">Önerilen Modern Avatarlar</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {[
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
                      "https://api.dicebear.com/7.x/shapes/svg?seed=heycoderz_siyah",
                      "https://api.dicebear.com/7.x/identicon/svg?seed=cyber_siyah",
                      "https://api.dicebear.com/7.x/lorelei/svg?seed=siyah_dev",
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=dark_coder"
                    ].map((presetUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(presetUrl)}
                        className={`p-1 rounded-xl border transition-all overflow-hidden ${
                          avatarUrl === presetUrl ? "border-purple-500 bg-purple-500/20 scale-105" : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img src={presetUrl} alt="Preset" className="w-full h-12 rounded-lg object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-medium text-gray-300">Özel Görsel URL'si</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                      placeholder="https://ornek.com/resim.jpg"
                    />
                    <button
                      type="button"
                      onClick={handleSaveAvatar}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all cursor-pointer"
                    >
                      Uygula
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. TAB: Şifre & Güvenlik */}
            {activeTab === "security" && (
              <div className="p-6 rounded-2xl bg-[#09090F]/80 border border-white/10 backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-lg font-bold">Şifre & Hesap Güvenliği</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Hesap şifrenizi güncelleyin. Güçlü bir şifre seçtiğinizden emin olun.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Mevcut Şifreniz</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none pr-10"
                        placeholder="Mevcut şifreniz"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Yeni Şifre</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none pr-10"
                        placeholder="En az 6 karakter"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              strength <= 25
                                ? "w-1/4 bg-red-500"
                                : strength <= 50
                                ? "w-2/4 bg-amber-500"
                                : strength <= 75
                                ? "w-3/4 bg-yellow-400"
                                : "w-full bg-emerald-500"
                            }`}
                          />
                        </div>
                        <p className="text-[11px] text-gray-400">
                          Şifre Gücü:{" "}
                          <span
                            className={
                              strength <= 25
                                ? "text-red-400"
                                : strength <= 50
                                ? "text-amber-400"
                                : strength <= 75
                                ? "text-yellow-400"
                                : "text-emerald-400 font-semibold"
                            }
                          >
                            {strength <= 25
                              ? "Zayıf"
                              : strength <= 50
                              ? "Orta"
                              : strength <= 75
                              ? "İyi"
                              : "Çok Güçlü 🛡️"}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">Yeni Şifre Tekrarı</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs focus:border-purple-500 focus:outline-none"
                      placeholder="Yeni şifrenizi tekrar yazın"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {passwordLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                      <span>Şifreyi Güncelle</span>
                    </button>
                  </div>
                </form>

                {/* Security Activity Log (Güvenlik Günlüğü) */}
                <div className="pt-6 border-t border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-400" />
                        <span>Hesap Güvenlik Günlüğü</span>
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Hesabınızda gerçekleşen son güvenlik ve kimlik doğrulama olayları (Gizlilik kurallarına uygun IP maskeleme uygulanır).
                      </p>
                    </div>
                  </div>

                  {user.securityLogs && user.securityLogs.length > 0 ? (
                    <div className="divide-y divide-white/[0.06] bg-black/40 border border-white/[0.08] rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                      {user.securityLogs.map((log) => (
                        <div key={log.id} className="p-3 sm:px-4 flex items-center justify-between text-xs hover:bg-white/[0.02] transition-colors">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-gray-200">
                              {log.type === "LOGIN_SUCCESS" && "Giriş Başarılı"}
                              {log.type === "LOGIN_FAILED" && "Başarısız Giriş Denemesi"}
                              {log.type === "EMAIL_VERIFIED" && "E-posta Doğrulandı"}
                              {log.type === "PASSWORD_CHANGED" && "Şifre Değiştirildi"}
                              {log.type === "PASSWORD_RESET_REQUESTED" && "Şifre Sıfırlama İstendi"}
                              {log.type === "PASSWORD_RESET_COMPLETED" && "Şifre Sıfırlama Tamamlandı"}
                              {log.type === "EMAIL_CHANGE_REQUESTED" && "E-posta Değişikliği İstendi"}
                              {log.type === "EMAIL_CHANGED" && "Yeni E-posta Onaylandı"}
                              {log.type === "LOGOUT" && "Çıkış Yapıldı"}
                              {log.type === "ACCOUNT_DELETED" && "Hesap Silindi"}
                            </p>
                            {log.details && (
                              <p className="text-[11px] text-gray-400">{log.details}</p>
                            )}
                          </div>
                          <div className="text-right text-[10px] text-gray-400 font-mono space-y-0.5 shrink-0 ml-4">
                            <p>{new Date(log.timestamp).toLocaleDateString("tr-TR")} {new Date(log.timestamp).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}</p>
                            {log.ip && <p className="text-purple-400/80">IP: {log.ip}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-xs text-gray-400">
                      Henüz kayıtlı güvenlik olayı bulunmuyor.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. TAB: Veri & Yedekleme */}
            {activeTab === "data" && (
              <div className="p-6 rounded-2xl bg-[#09090F]/80 border border-white/10 backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-lg font-bold">Veri Yönetimi & Yedekleme</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Platformdaki tüm profil ve kişisel verilerinizi dışa aktarın veya önbelleğinizi tazeleyin.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase">
                      <Download className="w-4 h-4" />
                      <span>Verileri Dışa Aktar (Export)</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Profil bilgilerinizi, sosyal bağlantılarınızı ve ayarlarınızı standart JSON formatında indirin.
                    </p>
                    <button
                      type="button"
                      onClick={handleExportData}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>JSON İndir</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
                      <RefreshCw className="w-4 h-4" />
                      <span>Önbelleği Senkronize Et</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Sunucu veritabanı ile tarayıcınız arasındaki önbelleği tazeleyin ve verileri eşitleyin.
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/sync");
                          const d = await res.json();
                          if (d.success) {
                            showToast("Veriler sunucu ile başarıyla eşitlendi!");
                          }
                        } catch {
                          showToast("Eşitleme hatası.", "error");
                        }
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Hemen Senkronize Et</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. TAB: Tehlikeli Bölge (Danger Zone) */}
            {activeTab === "danger" && (
              <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 backdrop-blur-xl space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-red-300 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    <span>Tehlikeli Bölge</span>
                  </h2>
                  <p className="text-xs text-red-300/70 mt-0.5">
                    Bu alandaki işlemler geri alınamaz. Lütfen dikkatli işlem yapın.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Reset Local Cache */}
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Tarayıcı Oturumunu & Önbelleği Temizle</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Bu cihazdaki oturumu kapatır ve yerel önbellek verilerini temizler.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all cursor-pointer shrink-0"
                    >
                      Oturumu Kapat
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-red-300">Hesabı Kalıcı Olarak Sil</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Hesabınız, profiliniz ve paylaşımlarınız heycoderz sisteminden kalıcı olarak kaldırılır.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-all shadow-lg shadow-red-500/25 cursor-pointer shrink-0"
                    >
                      Hesabı Sil
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal Confirmation */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#0F0A0A] border border-red-500/40 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Hesabınızı Silmek İstediğinize Emin Misiniz?</h3>
              <p className="text-xs text-gray-400">
                Bu işlem <strong className="text-red-400">geri alınamaz</strong>. Profiliniz ve kayıtlı verileriniz tamamen silinecektir.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-gray-300">İşlemi onaylamak için şifrenizi girin:</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Hesap şifreniz"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-red-500/30 text-white text-xs focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all cursor-pointer"
              >
                İptal Et
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                {deleteLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Evet, Hesabımı Sil</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
