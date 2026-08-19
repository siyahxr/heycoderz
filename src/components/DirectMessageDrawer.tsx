"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Code2, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Copy,
  Plus,
  CheckCheck
} from "lucide-react";
import { useAuth, BASE_MAIN_USER, BASE_OYKU } from "@/context/AuthContext";

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  codeSnippet?: string;
  timestamp: string;
  isMe: boolean;
}

export interface ChatThread {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role: string;
    online: boolean;
  };
  messages: MessageItem[];
}

const DEFAULT_THREADS: ChatThread[] = [
  {
    id: "thread-siyah",
    user: {
      id: "admin-master",
      name: "$",
      username: "siyah",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
      role: "Kurucu & Admin",
      online: true,
    },
    messages: [
      {
        id: "m-1",
        senderId: "admin-master",
        senderName: "$",
        text: "Selam! heycoderz platformuna hoş geldin. Herhangi bir sorunda veya proje önerinde buradan yazabilirsin.",
        timestamp: "Dün 14:20",
        isMe: false,
      },
    ],
  },
  {
    id: "thread-oyku",
    user: {
      id: "admin-oyku",
      name: "Öykü",
      username: "oyku",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      role: "Kurucu Ortak & UI",
      online: true,
    },
    messages: [
      {
        id: "m-2",
        senderId: "admin-oyku",
        senderName: "Öykü",
        text: "Merhaba! Yeni Glassmorphism ve neon UI bileşenleri vitrine eklendi. Göz atabilirsin.",
        codeSnippet: `<div className="glass-card hover:shadow-neon transition-all" />`,
        timestamp: "Dün 15:05",
        isMe: false,
      },
    ],
  },
  {
    id: "thread-caner",
    user: {
      id: "user-caner",
      name: "Caner",
      username: "caner_dev",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      role: "Developer",
      online: true,
    },
    messages: [
      {
        id: "m-3",
        senderId: "user-caner",
        senderName: "Caner",
        text: "Selamlar! Docker multi-stage build snippet'ı gerçekten çok işe yaradı, teşekkürler!",
        timestamp: "12:30",
        isMe: false,
      },
    ],
  },
];

interface DirectMessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetUsername?: string;
  targetUser?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    role?: string;
  };
}

export const DirectMessageDrawer: React.FC<DirectMessageDrawerProps> = ({
  isOpen,
  onClose,
  targetUsername,
  targetUser,
}) => {
  const { user: currentUser } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>(DEFAULT_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>("thread-siyah");
  const [inputMessage, setInputMessage] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load persisted threads from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("heycoderz_dm_threads_v3");
      if (saved) {
        setThreads(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveThreads = (updated: ChatThread[]) => {
    setThreads(updated);
    try {
      localStorage.setItem("heycoderz_dm_threads_v3", JSON.stringify(updated));
    } catch {}
  };

  // If opened targeting a specific username, select or create that thread
  useEffect(() => {
    const rawTarget = targetUsername ? targetUsername.replace(/^@/, "").toLowerCase() : targetUser?.username?.toLowerCase();
    if (!rawTarget) return;

    // Don't chat with self if current user is the target
    if (currentUser && currentUser.username.toLowerCase() === rawTarget) {
      const otherThread = threads.find((t) => t.user.username.toLowerCase() !== rawTarget);
      if (otherThread) setActiveThreadId(otherThread.id);
      return;
    }

    const existing = threads.find((t) => t.user.username.toLowerCase() === rawTarget);
    if (existing) {
      setActiveThreadId(existing.id);
    } else {
      // Create new thread
      const newThread: ChatThread = {
        id: `thread-${rawTarget}-${Date.now()}`,
        user: {
          id: targetUser?.id || `user-${rawTarget}`,
          name: targetUser?.name || targetUsername || rawTarget,
          username: rawTarget,
          avatar: targetUser?.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${rawTarget}`,
          role: targetUser?.role || "Developer",
          online: true,
        },
        messages: [],
      };
      const updated = [newThread, ...threads];
      saveThreads(updated);
      setActiveThreadId(newThread.id);
    }
  }, [targetUsername, targetUser, currentUser]);

  // Filter out thread with self
  const displayThreads = threads.filter((t) => {
    if (!currentUser) return true;
    return t.user.username.toLowerCase() !== currentUser.username.toLowerCase();
  });

  // Ensure activeThreadId is valid
  useEffect(() => {
    if (displayThreads.length > 0 && !displayThreads.some((t) => t.id === activeThreadId)) {
      setActiveThreadId(displayThreads[0].id);
    }
  }, [displayThreads, activeThreadId]);

  const activeThread = displayThreads.find((t) => t.id === activeThreadId) || displayThreads[0];

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, threads, activeThreadId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !codeSnippet.trim()) return;
    if (!activeThread) return;

    const newMessage: MessageItem = {
      id: "msg-" + Date.now(),
      senderId: currentUser?.id || "guest-user",
      senderName: currentUser?.name || "Ben",
      text: inputMessage.trim(),
      codeSnippet: showCodeInput && codeSnippet.trim() ? codeSnippet.trim() : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    const updated = threads.map((thread) => {
      if (thread.id !== activeThread.id) return thread;
      return {
        ...thread,
        messages: [...thread.messages, newMessage],
      };
    });

    saveThreads(updated);
    setInputMessage("");
    setCodeSnippet("");
    setShowCodeInput(false);
  };

  const copySnippet = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end isolate">
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      />

      {/* Solid Drawer Container */}
      <div className="relative z-10 w-full max-w-xl bg-[#09090F] border-l border-purple-500/30 h-full flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-200">
        
        {/* Top Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#06060A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Geliştirici Doğrudan Mesajlaşma (DM)</h3>
              <p className="text-[10px] text-gray-400 font-mono">heycoderz Anlık ve Güvenli İletişim</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Conversation Tabs */}
        <div className="flex items-center gap-2 p-3 bg-[#08080E] border-b border-white/5 overflow-x-auto shrink-0 scrollbar-none">
          {displayThreads.map((t) => {
            const isActive = t.id === activeThread?.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveThreadId(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-600/20"
                    : "bg-white/[0.02] text-gray-400 hover:text-white border border-white/5 hover:border-white/20"
                }`}
              >
                <div className="relative">
                  <img src={t.user.avatar} alt={t.user.name} className="w-5 h-5 rounded-md object-cover" />
                  {t.user.online && <span className="w-2 h-2 rounded-full bg-green-500 absolute -bottom-0.5 -right-0.5 ring-1 ring-black" />}
                </div>
                <span>{t.user.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Conversation Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#09090F]">
          {activeThread ? (
            <>
              {/* Partner Profile Badge */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activeThread.user.avatar}
                    alt={activeThread.user.name}
                    className="w-10 h-10 rounded-xl object-cover border border-purple-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{activeThread.user.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                        {activeThread.user.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono">@{activeThread.user.username}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Çevrimiçi
                </span>
              </div>

              {activeThread.messages.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 font-mono space-y-1">
                  <MessageSquare className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p>Henüz bir mesaj yok.</p>
                  <p className="text-[11px] text-gray-600">İlk mesajı yazarak sohbeti başlatın.</p>
                </div>
              ) : (
                activeThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] text-gray-400 font-mono">{msg.senderName}</span>
                      <span className="text-[9px] text-gray-600 font-mono">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
                        msg.isMe
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 rounded-br-none"
                          : "bg-[#121218] border border-white/10 text-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {msg.codeSnippet && (
                        <div className="rounded-xl overflow-hidden bg-black/90 border border-white/10 mt-2">
                          <div className="px-3 py-1 bg-white/5 border-b border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                            <span>Kod Parçacığı</span>
                            <button
                              type="button"
                              onClick={() => copySnippet(msg.id, msg.codeSnippet!)}
                              className="hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedCodeId === msg.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <pre className="p-3 text-[11px] font-mono text-purple-200 overflow-x-auto">
                            {msg.codeSnippet}
                          </pre>
                        </div>
                      )}
                    </div>

                    {msg.isMe && (
                      <div className="flex items-center gap-1 text-[9px] text-gray-500 font-mono mt-0.5 px-1">
                        <CheckCheck className="w-3 h-3 text-purple-400" />
                        <span>İletildi</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          ) : (
            <div className="py-12 text-center text-xs text-gray-500 font-mono">
              Sohbet bulunamadı.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-[#06060A] space-y-3 shrink-0">
          {showCodeInput && (
            <div className="rounded-xl bg-black/80 border border-purple-500/30 p-2.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-purple-300 font-mono">
                <span>Eklemek İstediğiniz Kod Bloğu</span>
                <button
                  type="button"
                  onClick={() => setShowCodeInput(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="// Kodunuzu buraya yapıştırın..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full p-2 bg-transparent text-purple-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCodeInput(!showCodeInput)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                showCodeInput
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-white/5 text-gray-400 hover:text-white border-white/10"
              }`}
              title="Kod Parçacığı Ekle"
            >
              <Code2 className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={activeThread ? `@${activeThread.user.username} kullanıcısına mesaj yaz...` : "Mesaj yaz..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() && !codeSnippet.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white shadow-lg shadow-purple-600/30 cursor-pointer shrink-0 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
