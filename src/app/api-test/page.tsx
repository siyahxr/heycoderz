"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { 
  Send, 
  Copy, 
  Check, 
  Globe, 
  Terminal, 
  Clock, 
  Sliders, 
  Database,
  Layers,
  Sparkles,
  Play
} from "lucide-react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export default function ApiTestPage() {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [requestHeaders, setRequestHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [requestBody, setRequestBody] = useState('{\n  "title": "heycoderz API Test",\n  "body": "Modern geliştirici ekosistemi",\n  "userId": 1\n}');
  const [activeReqTab, setActiveReqTab] = useState<"body" | "headers">("body");

  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<string>("");
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setStatusCode(null);
    setResponseBody("");
    const startTime = performance.now();

    try {
      let parsedHeaders = {};
      try {
        parsedHeaders = JSON.parse(requestHeaders);
      } catch (e) {}

      const options: RequestInit = {
        method,
        headers: parsedHeaders,
      };

      if (method !== "GET" && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setStatusCode(res.status);
      setStatusText(res.statusText || (res.status === 200 ? "OK" : "Status"));

      const headersObj: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        headersObj[key] = val;
      });
      setResponseHeaders(headersObj);

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setResponseBody(JSON.stringify(data, null, 2));
      } else {
        const text = await res.text();
        setResponseBody(text);
      }
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setStatusCode(0);
      setStatusText("CORS / Ağ Hatası");
      setResponseBody(`// İstek Gönderilemedi:\n// ${err.message}\n\n// Not: Tarayıcı CORS politikası nedeniyle harici bazı API'ler engellenebilir.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (responseBody) {
      navigator.clipboard.writeText(responseBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      <BackgroundEffects />
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-medium text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Globe className="w-3.5 h-3.5" />
            <span>heycoderz REST API & HTTP Client</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            İnteraktif{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              API Test Aracı
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Tarayıcınızdan GET, POST, PUT, DELETE istekleri gönderin, yanıtları ve süreleri anında test edin.
          </p>
        </div>

        {/* API Tester Main Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#09090F]/95 border border-purple-500/30 shadow-2xl space-y-6">
          
          {/* URL & Method Bar */}
          <form onSubmit={handleSendRequest} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className="bg-black/80 border border-purple-500/40 text-purple-300 font-mono font-bold text-xs sm:text-sm rounded-2xl px-4 py-3 outline-none cursor-pointer"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>

            <div className="relative flex-1">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/v1/users"
                className="w-full bg-black/80 border border-white/10 focus:border-purple-500 rounded-2xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-gray-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Gönderiliyor..." : "İsteği Gönder"}</span>
            </button>
          </form>

          {/* Request Payload Dual Panes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Request Params & Body */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveReqTab("body")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      activeReqTab === "body" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    JSON Body
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveReqTab("headers")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      activeReqTab === "headers" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Headers
                  </button>
                </div>
                <span className="text-[11px] font-mono text-gray-500">Request Configuration</span>
              </div>

              {activeReqTab === "body" ? (
                <textarea
                  rows={12}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder="{\n  'key': 'value'\n}"
                  className="w-full bg-black/80 border border-white/10 focus:border-purple-500 rounded-2xl p-4 font-mono text-xs text-purple-200 outline-none resize-none leading-relaxed"
                />
              ) : (
                <textarea
                  rows={12}
                  value={requestHeaders}
                  onChange={(e) => setRequestHeaders(e.target.value)}
                  placeholder="{\n  'Authorization': 'Bearer ...'\n}"
                  className="w-full bg-black/80 border border-white/10 focus:border-purple-500 rounded-2xl p-4 font-mono text-xs text-purple-200 outline-none resize-none leading-relaxed"
                />
              )}
            </div>

            {/* Right: Response Output */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400">HTTP Yanıtı:</span>
                  {statusCode !== null && (
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold ${
                      statusCode >= 200 && statusCode < 300
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                        : "bg-red-950/60 text-red-300 border border-red-500/40"
                    }`}>
                      {statusCode} {statusText}
                    </span>
                  )}
                  {responseTime !== null && (
                    <span className="text-xs font-mono text-purple-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-400" />
                      {responseTime} ms
                    </span>
                  )}
                </div>

                {responseBody && (
                  <button
                    type="button"
                    onClick={handleCopyResponse}
                    className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Kopyalandı!" : "Yanıtı Kopyala"}</span>
                  </button>
                )}
              </div>

              <textarea
                readOnly
                rows={12}
                value={responseBody || "// API yanıtı burada JSON olarak görüntülenecektir..."}
                className="w-full bg-black/80 border border-purple-500/20 rounded-2xl p-4 font-mono text-xs text-emerald-400 outline-none resize-none leading-relaxed"
              />
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
