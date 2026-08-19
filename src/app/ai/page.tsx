"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Bot, 
  Sparkles, 
  Bug, 
  Zap, 
  Code2, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  FileCode, 
  Lightbulb, 
  CheckCircle2,
  Terminal,
  ArrowRight
} from "lucide-react";

type AIMode = "fix-bug" | "optimize" | "to-typescript" | "explain" | "chat";

export default function AIPage() {
  const [activeMode, setActiveMode] = useState<AIMode>("fix-bug");
  const [inputCode, setInputCode] = useState(`function fetchUserData(userId) {
  // Potansiyel null hatası ve async eksikliği
  let user = database.find(userId);
  return user.profile.name.toUpperCase();
}`);
  const [outputResult, setOutputResult] = useState<{
    explanation: string;
    fixedCode?: string;
    improvements: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string; code?: string }>>([
    {
      role: "assistant",
      text: "Merhaba! Ben heycoderz AI kodlama asistanınızım. Kodunuzdaki hataları ayıklayabilir, performansını artırabilir, TypeScript'e çevirebilir veya aklınızdaki mimari soruları yanıtlayabilirim.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleAnalyze = () => {
    if (!inputCode.trim()) return;
    setIsAnalyzing(true);
    setOutputResult(null);

    setTimeout(() => {
      if (activeMode === "fix-bug") {
        setOutputResult({
          explanation: "Analiz Edildi: 2 kritik hata tespit edildi: 1) Senkron çağrılan veritabanı aramasında 'await' eksik. 2) 'user' veya 'profile' null/undefined geldiğinde Uncaught TypeError oluşuyor (Optional Chaining eksik).",
          fixedCode: `// heycoderz AI Tarafından Güvenli Hale Getirildi
async function fetchUserData(userId: string): Promise<string | null> {
  try {
    const user = await database.find(userId);
    // Null safety ve optional chaining koruması
    return user?.profile?.name?.toUpperCase() ?? "Bilinmeyen Kullanıcı";
  } catch (error) {
    console.error(\`Kullanıcı verisi alınamadı (ID: \${userId}):\`, error);
    return null;
  }
}`,
          improvements: [
            "Async/Await ve Promise dönüş tipi eklendi.",
            "Optional chaining (?.) ile runtime crash engellendi.",
            "Try-Catch hata yakalama bloğu ile loglama sağlandı.",
          ],
        });
      } else if (activeMode === "optimize") {
        setOutputResult({
          explanation: "Analiz Edildi: Fonksiyondaki gereksiz döngü ve bellek tahsisleri optimize edildi. Zaman karmaşıklığı O(n²)'den O(n)'e indirildi.",
          fixedCode: `// Bellek & CPU Optimize Edilmiş Versiyon
const userLookupMap = new Map(cachedUsers.map(u => [u.id, u]));

function getOptimizedUser(userId: string) {
  // O(1) anlık arama
  return userLookupMap.get(userId) || null;
}`,
          improvements: [
            "Dizi taraması yerine O(1) Map Hash tablosu kullanıldı.",
            "Gereksiz render ve yeniden hesaplama engellendi.",
          ],
        });
      } else if (activeMode === "to-typescript") {
        setOutputResult({
          explanation: "Analiz Edildi: JavaScript fonksiyonu katı tip güvenli TypeScript interface ve generic yapısına dönüştürüldü.",
          fixedCode: `export interface UserProfile {
  name: string;
  avatarUrl?: string;
  email: string;
}

export interface UserEntity {
  id: string;
  profile: UserProfile;
  createdAt: Date;
}

export async function fetchUserData(userId: string): Promise<string> {
  const user: UserEntity | null = await database.find(userId);
  if (!user) throw new Error(\`User not found: \${userId}\`);
  return user.profile.name.toUpperCase();
}`,
          improvements: [
            "Açık veri modeli interface'leri tanımlandı.",
            "Strict null checking entegre edildi.",
          ],
        });
      } else {
        setOutputResult({
          explanation: "Kod Açıklaması: Bu kod bloğu verilen kullanıcı kimliğiyle (userId) veritabanında arama yapar ve kullanıcının profilindeki ismi büyük harflere çevirerek döndürür.",
          improvements: [
            "Adım 1: Veritabanı sorgusu başlatılır.",
            "Adım 2: İlgili nesnenin profile.name düğümüne ulaşılır.",
            "Adım 3: toUpperCase() fonksiyonu ile string normalize edilir.",
          ],
        });
      }
      setIsAnalyzing(false);
    }, 600);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newChat = [...chatMessages, { role: "user" as const, text: userText }];
    setChatMessages(newChat);
    setChatInput("");

    setTimeout(() => {
      setChatMessages([
        ...newChat,
        {
          role: "assistant",
          text: `"${userText}" ile ilgili en iyi yaklaşım: React 19 ve Next.js 16'da Server Actions ve useActionState kullanarak formları yönetmek hem performans hem de SEO açısından en temiz mimaridir.`,
          code: `// Örnek Çözüm:
export async function handleAction(prevState: any, formData: FormData) {
  'use server';
  const name = formData.get('name');
  return { success: true, name };
}`,
        },
      ]);
    }, 500);
  };

  const copyFixedCode = () => {
    if (outputResult?.fixedCode) {
      navigator.clipboard.writeText(outputResult.fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Bot className="w-3.5 h-3.5" />
            <span>heycoderz AI Developer Engine v1.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            AI Kod Asistanı &{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Hata Ayıklayıcı
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Hatalı kodlarınızı anında düzeltin, algoritmaları optimize edin, TypeScript&apos;e çevirin veya AI ile sohbet edin.
          </p>
        </div>

        {/* AI Modes Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {[
            { id: "fix-bug", label: "🐛 Hata / Bug Bul & Düzelt", icon: Bug },
            { id: "optimize", label: "⚡ Performans Optimize Et", icon: Zap },
            { id: "to-typescript", label: "🔄 TypeScript'e Dönüştür", icon: Code2 },
            { id: "explain", label: "💡 Kodu Adım Adım Açıkla", icon: Lightbulb },
            { id: "chat", label: "💬 Geliştirici AI Sohbeti", icon: MessageSquare },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setActiveMode(mode.id as AIMode);
                  setOutputResult(null);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    : "bg-[#08080E]/90 text-gray-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* MODE 1 to 4: CODE ANALYZER WORKSPACE */}
        {activeMode !== "chat" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Input Left Pane */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-[#09090F]/95 border border-purple-500/30 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono text-gray-300 font-semibold flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span>İncelenecek Kod:</span>
                  </label>
                  <span className="text-[10px] font-mono text-purple-400">JS / TS / React / SQL</span>
                </div>

                <textarea
                  rows={14}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="// Kodunuzu buraya yapıştırın..."
                  className="w-full bg-black/80 border border-white/10 focus:border-purple-500 rounded-2xl p-4 font-mono text-xs text-purple-200 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputCode.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAnalyzing ? "AI Kodu İnceliyor..." : "Yapay Zeka ile Analiz Et"}</span>
                </button>
              </div>
            </div>

            {/* Output Right Pane */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-[#09090F]/95 border border-purple-500/30 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Bot className="w-4 h-4" />
                    <span>AI Analiz Raporu & Çözüm:</span>
                  </span>
                  {outputResult?.fixedCode && (
                    <button
                      type="button"
                      onClick={copyFixedCode}
                      className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Kopyalandı!" : "Kodu Kopyala"}</span>
                    </button>
                  )}
                </div>

                {outputResult ? (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
                      {outputResult.explanation}
                    </div>

                    {outputResult.fixedCode && (
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-gray-400">Önerilen Düzeltilmiş Kod:</label>
                        <div className="p-4 rounded-2xl bg-black/80 border border-emerald-500/30 font-mono text-xs text-emerald-400 overflow-x-auto max-h-60">
                          <pre>{outputResult.fixedCode}</pre>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-gray-400">Yapılan İyileştirmeler:</label>
                      <div className="space-y-1">
                        {outputResult.improvements.map((imp, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{imp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500 space-y-2">
                    <Terminal className="w-8 h-8 text-gray-600" />
                    <p className="text-xs font-mono">
                      {isAnalyzing ? "AI modeli çalışıyor..." : "Kodunuzu yazıp 'Yapay Zeka ile Analiz Et' butonuna tıklayın."}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* MODE 5: INTERACTIVE AI CHAT */
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#09090F]/95 border border-purple-500/30 overflow-hidden shadow-2xl flex flex-col h-[540px]">
            {/* Chat Header */}
            <div className="p-4 bg-black/60 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">heycoderz AI DevBot</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">● Online & Hazır</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-lg p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white rounded-br-none shadow-md"
                        : "bg-black/60 border border-white/10 text-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.code && (
                      <div className="p-3 rounded-xl bg-black/80 border border-purple-500/20 font-mono text-xs text-emerald-400 overflow-x-auto">
                        <pre>{msg.code}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="p-4 bg-black/60 border-t border-white/10 flex items-center gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Yazılım veya mimariyle ilgili bir soru sorun..."
                className="flex-1 bg-white/[0.04] border border-white/10 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Gönder</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
