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
  Plus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  codeSnippet?: string;
  timestamp: string;
  isMe: boolean;
}

interface ChatThread {
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

const INITIAL_THREADS: ChatThread[] = [
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
        text: "Selam! heycoderz v3.0 geliştirmeleri nasıl gidiyor? Yeni araçları denedin mi?",
        timestamp: "14:20",
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
        text: "Merhaba! Yeni Glassmorphism ve neon kart tasarımları vitrine eklendi. Göz atabilirsin.",
        codeSnippet: `<div className="glass-card hover:shadow-neon transition-all" />`,
        timestamp: "15:05",
        isMe: false,
      },
    ],
  },
];

interface DirectMessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetUsername?: string;
}

export const DirectMessageDrawer: React.FC<DirectMessageDrawerProps> = ({
  isOpen,
  onClose,
  targetUsername,
}) => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>("thread-siyah");
  const [inputMessage, setInputMessage] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threads, activeThreadId]);

  // If opened targeting a specific username
  useEffect(() => {
    if (targetUsername) {
      const match = threads.find((t) => t.user.username.toLowerCase() === targetUsername.toLowerCase());
      if (match) {
        setActiveThreadId(match.id);
      }
    }
  }, [targetUsername, threads]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !codeSnippet.trim()) return;

    const newMessage: MessageItem = {
      id: "msg-" + Date.now(),
      senderId: user?.id || "guest",
      senderName: user?.name || "Ben",
      text: inputMessage.trim(),
      codeSnippet: showCodeInput && codeSnippet.trim() ? codeSnippet.trim() : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== activeThreadId) return thread;
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
        };
      })
    );

    const sentText = inputMessage;
    setInputMessage("");
    setCodeSnippet("");
    setShowCodeInput(false);

    // Simulated quick reply from developer
    setTimeout(() => {
      const replyMessage: MessageItem = {
        id: "reply-" + Date.now(),
        senderId: activeThread.user.id,
        senderName: activeThread.user.name,
        text: `Harika bir mesaj! "${sentText.slice(0, 30)}..." konusunda haklısın, birlikte inceleyelim.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: false,
      };

      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id !== activeThreadId) return thread;
          return {
            ...thread,
            messages: [...thread.messages, replyMessage],
          };
        })
      );
    }, 1200);
  };

  const copySnippet = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#09090F] border-l border-purple-500/30 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Geliştirici Doğrudan Mesajlaşma (DM)</h3>
              <p className="text-[10px] text-gray-400 font-mono">heycoderz Anlık Sohbet</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Threads Selector Tabs */}
        <div className="flex items-center gap-2 p-3 bg-black/20 border-b border-white/5 overflow-x-auto">
          {threads.map((t) => {
            const isActive = t.id === activeThreadId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveThreadId(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
                    : "bg-white/[0.02] text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                <img src={t.user.avatar} alt={t.user.name} className="w-5 h-5 rounded-md object-cover" />
                <span>{t.user.name}</span>
                {t.user.online && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
              </button>
            );
          })}
        </div>

        {/* Active Conversation Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {activeThread.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] text-gray-400 font-mono">{msg.senderName}</span>
                <span className="text-[9px] text-gray-600 font-mono">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
                  msg.isMe
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 rounded-br-none"
                    : "bg-black/60 border border-white/10 text-gray-200 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>

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
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/40 space-y-3">
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
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
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
              placeholder={`@${activeThread.user.username} kullanıcısına mesaj yaz...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
