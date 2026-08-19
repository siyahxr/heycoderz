"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import {
  User,
  ShieldCheck,
  Flame,
  Trophy,
  Code2,
  Wrench,
  Plus,
  Trash2,
  LogOut,
  Sparkles,
  CheckCircle2,
  Users,
  Settings,
  Globe,
  Save,
  Key,
  FolderCode,
  Upload,
  Image as ImageIcon,
  Camera,
  Sliders,
  ExternalLink,
  Edit2,
  Download,
  BookOpen,
  FileText,
  Database,
  Eye,
  RefreshCw,
  UserCheck,
  UserX
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBlog, BlogArticle } from "@/context/BlogContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "snippets" | "profile" | "admin">("overview");

  // Profile Edit Form State
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editTwitter, setEditTwitter] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real Snippets management (persisted in localStorage)
  const [snippets, setSnippets] = useState<Array<{ id: string; title: string; lang: string; date: string }>>([]);
  const [newSnippetTitle, setNewSnippetTitle] = useState("");
  const [newSnippetLang, setNewSnippetLang] = useState("TypeScript");

  // Real registered users for Admin panel
  const [realUsers, setRealUsers] = useState<any[]>([]);

  // Blog Management in Admin
  const { articles, addArticle, updateArticle, deleteArticle } = useBlog();
  const [adminSubTab, setAdminSubTab] = useState<"blog" | "users" | "backup">("blog");
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [adminBlogTitle, setAdminBlogTitle] = useState("");
  const [adminBlogTag, setAdminBlogTag] = useState("Next.js");
  const [adminBlogAuthor, setAdminBlogAuthor] = useState("Efe Taşkın (Kurucu)");
  const [adminBlogReadTime, setAdminBlogReadTime] = useState("5 dk okuma");
  const [adminBlogSummary, setAdminBlogSummary] = useState("");
  const [adminBlogContent, setAdminBlogContent] = useState("");
  const [adminSuccessToast, setAdminSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    // Load snippets
    const savedSnippets = localStorage.getItem("heycoderz_saved_snippets");
    if (savedSnippets) {
      try {
        setSnippets(JSON.parse(savedSnippets));
      } catch (e) { }
    }

    // Load registered users for Admin panel
    const regUsersStr = localStorage.getItem("heycoderz_registered_users");
    const regUsers = regUsersStr ? JSON.parse(regUsersStr) : [];

    // Include master founders
    const allUsers = [
      {
        id: "admin-master",
        name: "Efe Taşkın",
        username: "efe",
        email: "efe@heycoderz.com",
        role: "Kurucu & Admin",
        xp: "Kurucu",
      },
      {
        id: "admin-oyku",
        name: "Öykü",
        username: "oyku",
        email: "oyku@heycoderz.com",
        role: "Kurucu Ortak & Admin",
        xp: "Kurucu Ortak",
      },
      ...regUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        role: u.role === "admin" ? "Admin" : "Geliştirici",
        xp: `${u.xp || 100} XP`,
      })),
    ];
    setRealUsers(allUsers);
  }, []);

  // Sync edit form with user data
  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditUsername(user.username || "");
      setEditBio(user.bio || "");
      setEditAvatar(user.avatar || "");
      setEditWebsite(user.website || "");
      setEditGithub(user.github || "");
      setEditTwitter(user.twitter || "");
      setEditInstagram(user.instagram || "https://instagram.com/heycoderz");
      setEditLinkedin(user.linkedin || "");
      setEditSkills(user.skills ? user.skills.join(", ") : "");
    }
  }, [user]);

  // Handle direct image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Lütfen 5MB'den küçük bir görsel yükleyin.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        setEditAvatar(base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = editSkills.split(",").map((s) => s.trim()).filter(Boolean);
    updateProfile({
      name: editName,
      username: editUsername,
      bio: editBio,
      avatar: editAvatar,
      website: editWebsite,
      github: editGithub,
      twitter: editTwitter,
      instagram: editInstagram,
      linkedin: editLinkedin,
      skills: skillsArray,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnippetTitle.trim()) return;
    const item = {
      id: String(Date.now()),
      title: newSnippetTitle.trim(),
      lang: newSnippetLang,
      date: "Bugün",
    };
    const updated = [item, ...snippets];
    setSnippets(updated);
    localStorage.setItem("heycoderz_saved_snippets", JSON.stringify(updated));
    setNewSnippetTitle("");
  };

  const handleDeleteSnippet = (id: string) => {
    const updated = snippets.filter((s) => s.id !== id);
    setSnippets(updated);
    localStorage.setItem("heycoderz_saved_snippets", JSON.stringify(updated));
  };

  const handleLogout = () => {
    logout();
    router.push("/giris");
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">

        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#09090F]/95 border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.15)] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={user?.name || "Kullanıcı"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-black/60"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-purple-600 text-[10px] font-bold text-white shadow-md">
                {user?.role === "admin" ? "ADMIN" : "ÜYE"}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {user?.name || "Geliştirici"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user?.role === "admin" ? "Kurucu & Admin" : "Geliştirici"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                <span className="text-purple-300 font-semibold">@{user?.username || "dev"}</span>
              </div>

              {user?.bio && (
                <p className="text-xs text-gray-300 max-w-xl line-clamp-1 pt-0.5">
                  {user.bio}
                </p>
              )}

              {/* Badges & Social Links */}
              <div className="flex items-center gap-3 pt-1 text-xs">
                <span className="flex items-center gap-1 text-purple-300 font-mono">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  {user?.role === "admin" ? "Kurucu" : `${user?.xp || 100} XP`}
                </span>
                {user?.website && (
                  <a href={user.website} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-purple-300 ml-2">
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              href={`/@${user?.username || "efe"}`}
              target="_blank"
              className="flex-1 md:flex-none px-4 py-2.5 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.2)]"
            >
              <span>Kamuya Açık Profilim</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/ayarlar"
              className="flex-1 md:flex-none px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-200 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-purple-400" />
              <span>Ayarlar & Şifre</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2.5 bg-white/[0.04] hover:bg-red-950/40 border border-white/10 hover:border-red-500/30 text-gray-300 hover:text-red-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-white/[0.08] pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${activeTab === "overview"
                ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Genel Bakış & Araçlar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "profile"
                ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                : "text-gray-400 hover:text-white"
              }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Hızlı Profil Düzenleme</span>
          </button>
          <Link
            href="/ayarlar"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/30 flex items-center gap-1.5 transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Tüm Ayarlar & Şifre Değiştir</span>
          </Link>
          <button
            type="button"
            onClick={() => setActiveTab("snippets")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${activeTab === "snippets"
                ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                : "text-gray-400 hover:text-white"
              }`}
          >
            Kayıtlı Snippet&apos;larım ({snippets.length})
          </button>

          {/* Admin tab only visible if admin */}
          {user?.role === "admin" && (
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "admin"
                  ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                  : "text-purple-400 hover:text-purple-300 bg-purple-950/30 border border-purple-500/20"
                }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Paneli</span>
            </button>
          )}
        </div>

        {/* ================= 1. OVERVIEW TAB ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Tools Launcher */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-purple-400" />
                <span>Geliştirici Araçlarını Başlat</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Link
                  href="/araclar"
                  className="p-5 rounded-2xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all hover:-translate-y-1 group flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      JSON &rarr; TypeScript
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      JSON verisinden anında interface üretin.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/araclar"
                  className="p-5 rounded-2xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all hover:-translate-y-1 group flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      JWT Token Çözücü
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Payload claims ve signature incelemesi.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/araclar"
                  className="p-5 rounded-2xl bg-[#08080E]/90 border border-white/[0.08] hover:border-purple-500/40 transition-all hover:-translate-y-1 group flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      Glassmorphism Stüdyo
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Canlı cam ve gradient kodları üretin.
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Next Steps for New Users */}
            <div className="p-6 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>heycoderz&apos;da Neler Yapabilirsiniz?</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                  <h4 className="font-bold text-purple-300">1. Araçları Deneyin</h4>
                  <p className="text-gray-400">TypeScript oluşturucu, Regex tester ve SQL biçimlendirici ile kodlama işlerinizi hızlandırın.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                  <h4 className="font-bold text-purple-300">2. Toplulukta Soru Sorun</h4>
                  <p className="text-gray-400">Topluluk sayfasına gidip aklınıza takılan soruları veya projelerinizi paylaşın.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                  <h4 className="font-bold text-purple-300">3. Kod Parçacıkları Ekleyin</h4>
                  <p className="text-gray-400">Sık kullandığınız kodları Snippet sekmesine kaydedip her zaman elinizin altında tutun.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. PROFILE EDIT TAB ================= */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#08080E]/90 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    <span>Profil ve Hesap Bilgilerini Düzenle</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Biyografiniz, avatarınız, sosyal medya linkleriniz ve uzmanlık alanlarınız toplulukta diğer geliştiricilere gösterilir.
                  </p>
                </div>

                {saveSuccess && (
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profil Güncellendi!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* 1. DIRECT FILE UPLOAD AVATAR SECTION */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Profil Fotoğrafı
                  </label>

                  {/* Hidden native file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center gap-5">
                    {/* Avatar Preview */}
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <img
                        src={editAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                        alt="Avatar Preview"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-black/80"
                      />
                      <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Camera className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center gap-2 cursor-pointer transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Fotoğraf Yükle (Dosya Seç)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`)}
                          className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-gray-300 rounded-xl cursor-pointer"
                        >
                          🎲 Rastgele Avatar Üret
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        PNG, JPG, WebP veya SVG formatında doğrudan cihazınızdan yükleyebilirsiniz (Maksimum 5MB).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Adınız Soyadınız"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Kullanıcı Adı (@username)
                    </label>
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      placeholder="kullaniciadi"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Biyografi (Hakkımda)
                  </label>
                  <textarea
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Kendinizi, ilgi alanlarınızı ve geliştirdiğiniz teknolojileri anlatın..."
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl p-4 text-sm text-white outline-none resize-none"
                  />
                </div>

                {/* Social links grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-purple-400" />
                      <span>Web Sitesi URL</span>
                    </label>
                    <input
                      type="url"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      placeholder="https://websiteniz.com"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={editGithub}
                      onChange={(e) => setEditGithub(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={editInstagram}
                      onChange={(e) => setEditInstagram(e.target.value)}
                      placeholder="https://instagram.com/kullaniciadi"
                      className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Uzmanlık Becerileri (Virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    placeholder="React, Next.js, TypeScript, Tailwind CSS, Python"
                    className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none font-mono text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Değişiklikleri Kaydet</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= 3. SNIPPETS TAB ================= */}
        {activeTab === "snippets" && (
          <div className="space-y-6">
            <form onSubmit={handleAddSnippet} className="p-5 rounded-2xl bg-[#08080E]/90 border border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                placeholder="Yeni snippet başlığı (örn: Custom Hook useLocalStorage)..."
                value={newSnippetTitle}
                onChange={(e) => setNewSnippetTitle(e.target.value)}
                className="flex-1 bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none"
              />
              <select
                value={newSnippetLang}
                onChange={(e) => setNewSnippetLang(e.target.value)}
                className="bg-black/60 border border-white/10 text-xs text-purple-300 rounded-xl px-4 py-2.5 outline-none cursor-pointer"
              >
                <option value="TypeScript">TypeScript</option>
                <option value="JavaScript">JavaScript</option>
                <option value="CSS">CSS</option>
                <option value="Python">Python</option>
                <option value="SQL">SQL</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Snippet Ekle</span>
              </button>
            </form>

            {snippets.length === 0 ? (
              <div className="p-10 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] text-center space-y-2">
                <FolderCode className="w-10 h-10 text-gray-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">Henüz kayıtlı kod parçacığınız yok</h4>
                <p className="text-xs text-gray-400">Yukarıdaki formdan sık kullandığınız kodları kaydedebilirsiniz.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {snippets.map((snip) => (
                  <div
                    key={snip.id}
                    className="p-5 rounded-2xl bg-[#08080E]/90 border border-white/[0.08] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                          {snip.lang}
                        </span>
                        <span className="text-[11px] text-gray-500 font-mono">{snip.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2">{snip.title}</h4>
                    </div>

                    <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => alert("Snippet açılıyor...")}
                        className="text-xs text-purple-400 hover:text-purple-300 cursor-pointer"
                      >
                        Aç & İncele
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSnippet(snip.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= 4. ADMIN PANEL TAB ================= */}
        {activeTab === "admin" && user?.role === "admin" && (
          <div className="space-y-8">
            {/* Admin Header & Stats */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#0a0518] to-indigo-950/30 border border-purple-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-xs font-mono text-purple-300 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Master Admin Console v2.6</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  heycoderz Yönetim & İçerik Merkezi
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Blog dökümanlarını yönetin, yeni teknik rehberler ekleyin, kullanıcı yetkilerini denetleyin ve sistem yedeği alın.
                </p>
              </div>

              {/* Sub-tab Navigation */}
              <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setAdminSubTab("blog")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminSubTab === "blog"
                      ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)] font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Makaleler ({articles.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminSubTab("users")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminSubTab === "users"
                      ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)] font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Kullanıcılar ({realUsers.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminSubTab("backup")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminSubTab === "backup"
                      ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)] font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Yedekleme & Sistem</span>
                </button>
              </div>
            </div>

            {/* Admin Success Notification */}
            {adminSuccessToast && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{adminSuccessToast}</span>
              </div>
            )}

            {/* SUBTAB 1: BLOG & DOKÜMAN YÖNETİMİ */}
            {adminSubTab === "blog" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">Yayınlanan Belgeler & Makaleler</h4>
                    <p className="text-xs text-gray-400">Yeni içerik ekleyin veya mevcut blog yazılarını düzenleyin.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (blogFormOpen && !editingArticleId) {
                        setBlogFormOpen(false);
                      } else {
                        setEditingArticleId(null);
                        setAdminBlogTitle("");
                        setAdminBlogSummary("");
                        setAdminBlogContent("");
                        setAdminBlogTag("Next.js");
                        setAdminBlogAuthor(user.name || "Efe Taşkın (Kurucu)");
                        setAdminBlogReadTime("5 dk okuma");
                        setBlogFormOpen(true);
                      }
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{blogFormOpen ? "Formu Kapat" : "+ Yeni Makale / Belge Oluştur"}</span>
                  </button>
                </div>

                {/* Article Create/Edit Form */}
                {blogFormOpen && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!adminBlogTitle.trim() || !adminBlogContent.trim()) {
                        alert("Lütfen başlık ve içerik girin.");
                        return;
                      }

                      if (editingArticleId) {
                        updateArticle(editingArticleId, {
                          title: adminBlogTitle,
                          summary: adminBlogSummary,
                          content: adminBlogContent,
                          tag: adminBlogTag,
                          author: adminBlogAuthor,
                          readTime: adminBlogReadTime,
                        });
                        setAdminSuccessToast(`"${adminBlogTitle}" makalesi başarıyla güncellendi!`);
                      } else {
                        addArticle({
                          title: adminBlogTitle,
                          summary: adminBlogSummary,
                          content: adminBlogContent,
                          tag: adminBlogTag,
                          author: adminBlogAuthor,
                          readTime: adminBlogReadTime,
                        });
                        setAdminSuccessToast(`"${adminBlogTitle}" makalesi başarıyla yayınlandı!`);
                      }

                      setBlogFormOpen(false);
                      setEditingArticleId(null);
                      setTimeout(() => setAdminSuccessToast(null), 3000);
                    }}
                    className="p-6 sm:p-8 rounded-3xl bg-[#09090F] border border-purple-500/30 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span>{editingArticleId ? "Makaleyi Düzenle" : "Yeni Teknik Doküman & Makale Yaz"}</span>
                      </h4>
                      <span className="text-xs text-gray-500 font-mono">Markdown Desteği Aktif</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-gray-400 mb-1.5">Makale Başlığı:</label>
                        <input
                          type="text"
                          required
                          value={adminBlogTitle}
                          onChange={(e) => setAdminBlogTitle(e.target.value)}
                          placeholder="Örn: Next.js 16 ve React 19 ile Modern Web Mimarisi"
                          className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-mono text-gray-400 mb-1.5">Kategori / Tag:</label>
                          <select
                            value={adminBlogTag}
                            onChange={(e) => setAdminBlogTag(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-3 py-2.5 text-xs text-purple-300 outline-none cursor-pointer"
                          >
                            <option value="Next.js">Next.js</option>
                            <option value="TypeScript">TypeScript</option>
                            <option value="CSS">CSS</option>
                            <option value="AI">AI</option>
                            <option value="React">React</option>
                            <option value="Genel">Genel</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-gray-400 mb-1.5">Okuma Süresi:</label>
                          <input
                            type="text"
                            value={adminBlogReadTime}
                            onChange={(e) => setAdminBlogReadTime(e.target.value)}
                            placeholder="5 dk okuma"
                            className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-gray-400 mb-1.5">Yazar Adı:</label>
                          <input
                            type="text"
                            value={adminBlogAuthor}
                            onChange={(e) => setAdminBlogAuthor(e.target.value)}
                            placeholder="Yazar"
                            className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1.5">Kısa Özet (Kart Açıklaması):</label>
                      <textarea
                        rows={2}
                        required
                        value={adminBlogSummary}
                        onChange={(e) => setAdminBlogSummary(e.target.value)}
                        placeholder="Makalenin listeleme sayfalarında görünecek kısa özeti..."
                        className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl p-3 text-xs sm:text-sm text-white outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1.5">Makale İçeriği (Markdown Formatında):</label>
                      <textarea
                        rows={10}
                        required
                        value={adminBlogContent}
                        onChange={(e) => setAdminBlogContent(e.target.value)}
                        placeholder="# Başlık&#10;&#10;İçerik açıklaması ve detaylar...&#10;&#10;```typescript&#10;const test = true;&#10;```"
                        className="w-full bg-black/80 border border-purple-500/25 focus:border-purple-500 rounded-xl p-4 font-mono text-xs text-purple-200 outline-none resize-y leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBlogFormOpen(false);
                          setEditingArticleId(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-gray-400 hover:text-white border border-white/10 cursor-pointer"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingArticleId ? "Değişiklikleri Güncelle" : "Makaleyi Yayınla"}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Articles Table */}
                <div className="p-6 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="text-gray-500 border-b border-white/[0.06] font-mono">
                      <tr>
                        <th className="pb-3">Makale Başlığı</th>
                        <th className="pb-3">Kategori</th>
                        <th className="pb-3">Yazar</th>
                        <th className="pb-3">Tarih</th>
                        <th className="pb-3 text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {articles.map((art) => (
                        <tr key={art.id} className="hover:bg-white/[0.02]">
                          <td className="py-3.5 pr-4 font-semibold text-white max-w-xs truncate">
                            {art.title}
                          </td>
                          <td className="py-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                              {art.tag}
                            </span>
                          </td>
                          <td className="py-3.5 text-gray-400">{art.author}</td>
                          <td className="py-3.5 text-gray-500 font-mono">{art.date}</td>
                          <td className="py-3.5 text-right space-x-2">
                            <Link
                              href={`/blog?article=${art.id}`}
                              target="_blank"
                              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-purple-400 hover:text-purple-300 font-mono text-[11px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Görüntüle</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingArticleId(art.id);
                                setAdminBlogTitle(art.title);
                                setAdminBlogSummary(art.summary);
                                setAdminBlogContent(art.content);
                                setAdminBlogTag(art.tag);
                                setAdminBlogAuthor(art.author);
                                setAdminBlogReadTime(art.readTime);
                                setBlogFormOpen(true);
                                window.scrollTo({ top: 400, behavior: "smooth" });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-sky-400 hover:text-sky-300 font-mono text-[11px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Düzenle</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`"${art.title}" makalesini silmek istediğinize emin misiniz?`)) {
                                  deleteArticle(art.id);
                                  setAdminSuccessToast(`"${art.title}" silindi.`);
                                  setTimeout(() => setAdminSuccessToast(null), 3000);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 font-mono text-[11px] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Sil</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBTAB 2: KULLANICI YÖNETİMİ */}
            {adminSubTab === "users" && (
              <div className="p-6 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] overflow-x-auto space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Kayıtlı Geliştiriciler & Yöneticiler ({realUsers.length})</span>
                  </h4>
                  <span className="text-xs text-gray-500 font-mono">Platform Üye Listesi</span>
                </div>

                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="text-gray-500 border-b border-white/[0.06] font-mono">
                    <tr>
                      <th className="pb-3">Kullanıcı</th>
                      <th className="pb-3">Kullanıcı Adı</th>
                      <th className="pb-3">E-posta</th>
                      <th className="pb-3">Rol</th>
                      <th className="pb-3 text-right">Rol Değiştir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {realUsers.map((u) => {
                      const isFounder = u.id === "admin-master" || u.id === "admin-oyku";
                      return (
                        <tr key={u.id} className="hover:bg-white/[0.02]">
                          <td className="py-3.5">
                            <Link
                              href={`/@${u.username || "dev"}`}
                              target="_blank"
                              className="font-semibold text-white hover:text-purple-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>{u.name}</span>
                              <ExternalLink className="w-3 h-3 text-purple-400 opacity-60 hover:opacity-100" />
                            </Link>
                          </td>
                          <td className="py-3.5 font-mono text-purple-300">@{u.username || "dev"}</td>
                          <td className="py-3.5 font-mono text-gray-400">{u.email}</td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                              u.role.includes("Admin")
                                ? "bg-purple-950/60 text-purple-300 border-purple-500/30"
                                : "bg-white/[0.04] text-gray-400 border-white/10"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            {isFounder ? (
                              <span className="text-[11px] text-gray-500 font-mono">Kurucu (Korumalı)</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  const regUsersStr = localStorage.getItem("heycoderz_registered_users");
                                  const regUsers = regUsersStr ? JSON.parse(regUsersStr) : [];
                                  const updated = regUsers.map((item: any) => {
                                    if (item.id === u.id) {
                                      return {
                                        ...item,
                                        role: item.role === "admin" ? "member" : "admin",
                                      };
                                    }
                                    return item;
                                  });
                                  localStorage.setItem("heycoderz_registered_users", JSON.stringify(updated));
                                  
                                  // Update state
                                  setRealUsers((prev) =>
                                    prev.map((item) =>
                                      item.id === u.id
                                        ? { ...item, role: item.role === "Admin" ? "Geliştirici" : "Admin" }
                                        : item
                                    )
                                  );
                                  setAdminSuccessToast(`${u.name} kullanıcısının rolü güncellendi.`);
                                  setTimeout(() => setAdminSuccessToast(null), 3000);
                                }}
                                className="px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-purple-300 hover:text-white transition-all cursor-pointer"
                              >
                                {u.role === "Admin" ? "Üye Yap" : "Admin Yap"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* SUBTAB 3: YEDEKLEME & SİSTEM */}
            {adminSubTab === "backup" && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#08080E]/90 border border-white/[0.08] space-y-6">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span>Sistem Veritabanı & Platform Yedeği</span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Platform üzerindeki tüm kullanıcıları, blog makalelerini, snippetları ve topluluk gönderilerini tek tıkla JSON formatında yedekleyin.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-black/60 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-white">heycoderz_full_backup.json</div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                      İçerik: {realUsers.length} Kullanıcı • {articles.length} Makale • {snippets.length} Snippet
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const backupData = {
                        exportedAt: new Date().toISOString(),
                        platform: "heycoderz",
                        version: "2.6.0",
                        articles,
                        users: realUsers,
                        snippets,
                        communityPosts: localStorage.getItem("heycoderz_community_posts")
                          ? JSON.parse(localStorage.getItem("heycoderz_community_posts") || "[]")
                          : [],
                      };

                      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
                        type: "application/json;charset=utf-8;",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `heycoderz-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);

                      setAdminSuccessToast("Platform yedeği başarıyla indirildi!");
                      setTimeout(() => setAdminSuccessToast(null), 3000);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Yedeği İndir (.json)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

