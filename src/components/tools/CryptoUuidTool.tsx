"use client";

import React, { useState, useEffect } from "react";
import { Binary, Copy, Check, RefreshCw, Sparkles, Key, Download, Layers, ShieldCheck, FileText } from "lucide-react";
import {
  computeMD5,
  computeDigest,
  generateUUIDs,
  base64Encode,
  base64Decode,
  textToHex,
  hexToText,
  textToBinary,
} from "@/lib/cryptoStudio";

export const CryptoUuidTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"uuid" | "hasher" | "encode">("uuid");

  // ================= UUID State =================
  const [uuidCount, setUuidCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const handleGenerateUuids = () => {
    const list = generateUUIDs({ count: uuidCount, uppercase, hyphens, braces });
    setUuids(list);
  };

  useEffect(() => {
    handleGenerateUuids();
  }, [uuidCount, uppercase, hyphens, braces]);

  // ================= Hasher State =================
  const [hashInput, setHashInput] = useState("heycoderz_secure_2026");
  const [hashes, setHashes] = useState<{
    md5: string;
    sha1: string;
    sha256: string;
    sha384: string;
    sha512: string;
  }>({
    md5: "",
    sha1: "",
    sha256: "",
    sha384: "",
    sha512: "",
  });

  useEffect(() => {
    const computeAll = async () => {
      const md5 = computeMD5(hashInput);
      const sha1 = await computeDigest("SHA-1", hashInput);
      const sha256 = await computeDigest("SHA-256", hashInput);
      const sha384 = await computeDigest("SHA-384", hashInput);
      const sha512 = await computeDigest("SHA-512", hashInput);

      setHashes({ md5, sha1, sha256, sha384, sha512 });
    };
    computeAll();
  }, [hashInput]);

  // ================= Encoding State =================
  const [encodeInput, setEncodeInput] = useState("Merhaba Heycoderz!");
  const [encodeMode, setEncodeMode] = useState<"base64" | "url" | "hex" | "binary">("base64");
  const [encodeOutput, setEncodeOutput] = useState("");

  useEffect(() => {
    if (encodeMode === "base64") {
      setEncodeOutput(base64Encode(encodeInput));
    } else if (encodeMode === "url") {
      setEncodeOutput(encodeURIComponent(encodeInput));
    } else if (encodeMode === "hex") {
      setEncodeOutput(textToHex(encodeInput));
    } else if (encodeMode === "binary") {
      setEncodeOutput(textToBinary(encodeInput));
    }
  }, [encodeInput, encodeMode]);

  const handleDecodeAction = () => {
    if (encodeMode === "base64") {
      setEncodeInput(base64Decode(encodeOutput));
    } else if (encodeMode === "url") {
      try {
        setEncodeInput(decodeURIComponent(encodeOutput));
      } catch { }
    } else if (encodeMode === "hex") {
      setEncodeInput(hexToText(encodeOutput));
    }
  };

  // ================= Clipboard =================
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadUuids = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">UUID & Kriptografik Hash Stüdyosu</h2>
            <p className="text-xs text-gray-400">
              Kriptografik güvenli UUID v4 üretin, MD5 / SHA özetleri hesaplayın ve metinleri kodlayın.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("uuid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "uuid" ? "bg-purple-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            UUID v4 Üretici
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hasher")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "hasher" ? "bg-purple-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            Hash Hesaplayıcı (SHA / MD5)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("encode")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "encode" ? "bg-purple-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            Metin Kodlayıcı (Base64 / Hex)
          </button>
        </div>
      </div>

      {/* ================= TAB 1: UUID GENERATOR ================= */}
      {activeTab === "uuid" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">Adet:</span>
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                  {[1, 5, 10, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setUuidCount(num)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                        uuidCount === num ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded bg-black border-white/20 accent-purple-500 cursor-pointer"
                />
                <span>BÜYÜK HARF</span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hyphens}
                  onChange={(e) => setHyphens(e.target.checked)}
                  className="rounded bg-black border-white/20 accent-purple-500 cursor-pointer"
                />
                <span>Tire İşaretli (-)</span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={braces}
                  onChange={(e) => setBraces(e.target.checked)}
                  className="rounded bg-black border-white/20 accent-purple-500 cursor-pointer"
                />
                <span>Süslü Parantez &#123;...&#125;</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateUuids}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                <span>Yeniden Üret</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadUuids}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.txt İndir</span>
              </button>
              <button
                type="button"
                onClick={() => copyToClipboard(uuids.join("\n"), "all-uuids")}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
              >
                {copiedKey === "all-uuids" ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === "all-uuids" ? "Tümü Kopyalandı!" : "Hepsini Kopyala"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {uuids.map((u, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-black/70 border border-purple-500/20 hover:border-purple-500/40 transition-colors font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-500 w-6">#{i + 1}</span>
                  <span className="text-purple-200 select-all font-semibold tracking-wider">{u}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(u, `uuid-${i}`)}
                  className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedKey === `uuid-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: CRYPTO HASHER ================= */}
      {activeTab === "hasher" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono text-gray-400">Hashlenecek Metin (Input):</label>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Hash hesaplanacak metni buraya yazın..."
              className="w-full p-4 rounded-2xl bg-black/70 border border-purple-500/30 focus:border-purple-500 text-purple-200 outline-none font-mono text-xs"
            />
          </div>

          <div className="space-y-3">
            {[
              { label: "SHA-256 (Önerilen)", value: hashes.sha256, color: "text-emerald-400" },
              { label: "SHA-512 (Ultra Güvenli)", value: hashes.sha512, color: "text-sky-400" },
              { label: "SHA-384", value: hashes.sha384, color: "text-indigo-400" },
              { label: "SHA-1 (Eski / Legacy)", value: hashes.sha1, color: "text-amber-400" },
              { label: "MD5 (Hızlı Sağlama)", value: hashes.md5, color: "text-purple-400" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-2xl bg-black/80 border border-white/[0.08] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-300">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.value, item.label)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === item.label ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === item.label ? "Kopyalandı!" : "Kopyala"}</span>
                  </button>
                </div>
                <div className={`font-mono text-xs break-all ${item.color}`}>{item.value || "Hesaplanıyor..."}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: ENCODING STUDIO ================= */}
      {activeTab === "encode" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white/[0.02] p-3 rounded-2xl border border-white/[0.06]">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {[
                { id: "base64", label: "Base64" },
                { id: "url", label: "URL Encode" },
                { id: "hex", label: "HEX (Onaltılık)" },
                { id: "binary", label: "Binary (İkili)" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setEncodeMode(m.id as any)}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                    encodeMode === m.id ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleDecodeAction}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-purple-300 hover:text-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tersine Çöz (Decode)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-gray-400">Ham Metin:</label>
              <textarea
                rows={10}
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.target.value)}
                placeholder="Metin girin..."
                className="w-full font-mono text-xs p-4 rounded-2xl bg-black/70 border border-white/10 focus:border-purple-500 text-purple-200 outline-none resize-y leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-gray-400">Kodlanmış Çıktı ({encodeMode}):</label>
                <button
                  type="button"
                  onClick={() => copyToClipboard(encodeOutput, "encoded-val")}
                  className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "encoded-val" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "encoded-val" ? "Kopyalandı!" : "Kopyala"}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={10}
                value={encodeOutput}
                className="w-full font-mono text-xs p-4 rounded-2xl bg-black/85 border border-purple-500/30 text-emerald-400 outline-none resize-y leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
