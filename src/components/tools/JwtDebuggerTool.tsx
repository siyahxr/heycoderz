"use client";

import React, { useState, useEffect } from "react";
import { Key, Copy, Check, Clock, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Trash2 } from "lucide-react";

const SAMPLE_JWTS = [
  {
    name: "Örnek Admin Token",
    // exp in future
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzk5ODgiLCJuYW1lIjoiRWZlIFRhxZ9rxLFuIiwiZW1haWwiOiJlZmVAaGV5Y29kZXJ6LmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDgwMDAwMDAwfQ.dFlF0t1JpX8x9Q_EXAMPLE_SIGNATURE_KEY_Z88",
  },
  {
    name: "Süresi Dolmuş Token",
    // exp in past
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkVza2kgT3R1cnVtIiwicm9sZSI6Imd1ZXN0IiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.4z_EXPIRED_SIGNATURE_EXAMPLE_9898234",
  },
];

export const JwtDebuggerTool: React.FC = () => {
  const [tokenInput, setTokenInput] = useState(SAMPLE_JWTS[0].token);
  const [headerDecoded, setHeaderDecoded] = useState("");
  const [payloadDecoded, setPayloadDecoded] = useState("");
  const [signatureRaw, setSignatureRaw] = useState("");
  const [isValidFormat, setIsValidFormat] = useState(true);
  const [claimsInfo, setClaimsInfo] = useState<{
    expDate?: string;
    isExpired?: boolean;
    iatDate?: string;
    nbfDate?: string;
    issuer?: string;
    subject?: string;
    algorithm?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const base64UrlDecode = (str: string): string => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (m) => m.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  useEffect(() => {
    if (!tokenInput.trim()) {
      setHeaderDecoded("");
      setPayloadDecoded("");
      setSignatureRaw("");
      setIsValidFormat(false);
      setClaimsInfo(null);
      return;
    }

    const parts = tokenInput.trim().split(".");
    if (parts.length < 2) {
      setHeaderDecoded("// Geçersiz JWT: 3 bölümden (Header.Payload.Signature) oluşmalıdır.");
      setPayloadDecoded("");
      setSignatureRaw("");
      setIsValidFormat(false);
      setClaimsInfo(null);
      return;
    }

    try {
      const headerStr = base64UrlDecode(parts[0]);
      const headerObj = JSON.parse(headerStr);
      setHeaderDecoded(JSON.stringify(headerObj, null, 2));

      const payloadStr = base64UrlDecode(parts[1]);
      const payloadObj = JSON.parse(payloadStr);
      setPayloadDecoded(JSON.stringify(payloadObj, null, 2));

      setSignatureRaw(parts[2] || "");
      setIsValidFormat(true);

      // Analyze Claims
      const now = Math.floor(Date.now() / 1000);
      const claims: typeof claimsInfo = {
        algorithm: headerObj.alg,
        subject: payloadObj.sub,
        issuer: payloadObj.iss,
      };

      if (payloadObj.exp) {
        const expNum = Number(payloadObj.exp);
        const date = new Date(expNum * 1000);
        claims.expDate = date.toLocaleString("tr-TR");
        claims.isExpired = expNum < now;
      }

      if (payloadObj.iat) {
        const iatNum = Number(payloadObj.iat);
        claims.iatDate = new Date(iatNum * 1000).toLocaleString("tr-TR");
      }

      if (payloadObj.nbf) {
        const nbfNum = Number(payloadObj.nbf);
        claims.nbfDate = new Date(nbfNum * 1000).toLocaleString("tr-TR");
      }

      setClaimsInfo(claims);
    } catch (err) {
      setHeaderDecoded("// JWT Decode Hatası: Base64 veya JSON formatı bozuk.");
      setPayloadDecoded("");
      setSignatureRaw("");
      setIsValidFormat(false);
      setClaimsInfo(null);
    }
  }, [tokenInput]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">JWT (JSON Web Token) Çözücü & İnceleyici</h2>
            <p className="text-xs text-gray-400">
              JWT tokenlarını istemci tarafında güvenli bir şekilde çözümleyin, talepleri ve son kullanma tarihini denetleyin.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {SAMPLE_JWTS.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => setTokenInput(sample.token)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input JWT Token Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono text-gray-400">Girdi JWT Token:</label>
          <div className="flex items-center gap-2">
            {isValidFormat ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Geçerli JWT Yapısı</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/40 border border-red-500/30 text-[11px] font-mono text-red-400">
                <AlertTriangle className="w-3 h-3" />
                <span>Geçersiz Format</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => setTokenInput("")}
              className="text-xs text-gray-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer ml-2"
            >
              <Trash2 className="w-3 h-3" />
              <span>Temizle</span>
            </button>
          </div>
        </div>
        <textarea
          rows={3}
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full font-mono text-xs p-3.5 rounded-2xl bg-black/70 border border-purple-500/30 focus:border-purple-500 text-purple-200 outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Expiration & Claims Insight Banner */}
      {claimsInfo && (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-gray-400">Algoritma (alg)</span>
            <div className="text-xs font-bold text-purple-300">{claimsInfo.algorithm || "Belirtilmemiş"}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-gray-400">Özne (sub)</span>
            <div className="text-xs font-mono text-gray-200 truncate">{claimsInfo.subject || "—"}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-gray-400">Oluşturulma (iat)</span>
            <div className="text-xs font-mono text-gray-300">{claimsInfo.iatDate || "—"}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-gray-400">Son Kullanma (exp)</span>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              {claimsInfo.expDate ? (
                claimsInfo.isExpired ? (
                  <span className="text-red-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Süresi Doldu ({claimsInfo.expDate})</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aktif ({claimsInfo.expDate})</span>
                  </span>
                )
              ) : (
                <span className="text-gray-500">exp tanımlanmamış</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decoded Sections: Header, Payload, Signature */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-pink-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              <span>HEADER (Başlık)</span>
            </span>
            {headerDecoded && (
              <button
                type="button"
                onClick={() => copyToClipboard(headerDecoded, "jwt-header")}
                className="text-[11px] text-pink-400 hover:text-pink-300 font-mono flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === "jwt-header" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === "jwt-header" ? "Kopyalandı" : "Kopyala"}</span>
              </button>
            )}
          </div>
          <pre className="w-full h-64 p-4 rounded-2xl bg-black/80 border border-pink-500/30 text-pink-300 font-mono text-xs overflow-auto leading-relaxed">
            {headerDecoded || "// Header çözümlenmedi"}
          </pre>
        </div>

        {/* Payload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-sky-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>PAYLOAD (Veri & Talepler)</span>
            </span>
            {payloadDecoded && (
              <button
                type="button"
                onClick={() => copyToClipboard(payloadDecoded, "jwt-payload")}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === "jwt-payload" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === "jwt-payload" ? "Kopyalandı" : "Kopyala"}</span>
              </button>
            )}
          </div>
          <pre className="w-full h-64 p-4 rounded-2xl bg-black/80 border border-sky-500/30 text-sky-300 font-mono text-xs overflow-auto leading-relaxed">
            {payloadDecoded || "// Payload çözümlenmedi"}
          </pre>
        </div>

        {/* Signature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-purple-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>SIGNATURE (İmza Bloğu)</span>
            </span>
            {signatureRaw && (
              <button
                type="button"
                onClick={() => copyToClipboard(signatureRaw, "jwt-sig")}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === "jwt-sig" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === "jwt-sig" ? "Kopyalandı" : "Kopyala"}</span>
              </button>
            )}
          </div>
          <div className="w-full h-64 p-4 rounded-2xl bg-black/80 border border-purple-500/30 text-purple-300 font-mono text-xs overflow-auto leading-relaxed flex flex-col justify-between">
            <div className="break-all">
              {signatureRaw ? signatureRaw : "// İmza verisi yok veya ayrıştırılamadı."}
            </div>
            <p className="text-[10px] text-gray-500 pt-3 border-t border-purple-500/20">
              Not: İmza doğrulaması gizli anahtarınız (secret key) ile sunucu tarafında doğrulanır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
