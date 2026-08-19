"use client";

import React, { useState } from "react";
import { 
  Send, 
  Code2, 
  Check, 
  Copy, 
  Clock, 
  Database, 
  Sparkles, 
  Plus, 
  Trash2, 
  Layers, 
  FileJson,
  AlertCircle
} from "lucide-react";

interface HeaderItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

const PRESET_APIS = [
  { name: "heycoderz API Sync", method: "GET", url: "/api/sync", body: "" },
  { name: "JSONPlaceholder Users", method: "GET", url: "https://jsonplaceholder.typicode.com/users", body: "" },
  { name: "JSONPlaceholder Create Post", method: "POST", url: "https://jsonplaceholder.typicode.com/posts", body: JSON.stringify({ title: "heycoderz Dev Post", body: "Modern developer community", userId: 1 }, null, 2) },
  { name: "Mock Auth Token", method: "POST", url: "/api/auth/login", body: JSON.stringify({ emailOrUsername: "siyah", password: "siyah2026heycoderz!" }, null, 2) },
];

export const ApiMockTesterTool: React.FC = () => {
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE" | "PATCH">("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/users/1");
  const [requestTab, setRequestTab] = useState<"body" | "headers">("body");
  const [requestBody, setRequestBody] = useState("{\n  \"message\": \"Hello from heycoderz API tester!\"\n}");
  const [headers, setHeaders] = useState<HeaderItem[]>([
    { id: "1", key: "Content-Type", value: "application/json", enabled: true },
    { id: "2", key: "Accept", value: "application/json", enabled: true },
  ]);

  // Response state
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string>("");
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseBody, setResponseBody] = useState<string>("");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseSize, setResponseSize] = useState<string>("");
  const [responseTab, setResponseTab] = useState<"body" | "headers">("body");
  const [copied, setCopied] = useState(false);

  const addHeader = () => {
    setHeaders([...headers, { id: Date.now().toString(), key: "", value: "", enabled: true }]);
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((h) => h.id !== id));
  };

  const updateHeader = (id: string, field: "key" | "value" | "enabled", val: any) => {
    setHeaders(headers.map((h) => (h.id === id ? { ...h, [field]: val } : h)));
  };

  const handleSend = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResponseStatus(null);
    setResponseBody("");
    setResponseHeaders({});
    const startTime = performance.now();

    try {
      const headerObj: Record<string, string> = {};
      headers.filter((h) => h.enabled && h.key.trim()).forEach((h) => {
        headerObj[h.key.trim()] = h.value.trim();
      });

      const options: RequestInit = {
        method,
        headers: headerObj,
      };

      if (method !== "GET" && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);
      setResponseStatusText(res.statusText || (res.status === 200 ? "OK" : "Status"));

      const resHeaderMap: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaderMap[key] = val;
      });
      setResponseHeaders(resHeaderMap);

      const text = await res.text();
      setResponseSize(`${(new Blob([text]).size / 1024).toFixed(2)} KB`);

      try {
        const json = JSON.parse(text);
        setResponseBody(JSON.stringify(json, null, 2));
      } catch {
        setResponseBody(text);
      }
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(0);
      setResponseStatusText("Hata / CORS Engeli");
      setResponseBody(`Bağlantı Hatası: ${err.message || "İstek gönderilemedi."}\n\nİpucu: Eğer harici bir API test ediyorsanız sunucunun CORS (Cross-Origin) başlıklarına izin vermesi gerekebilir.`);
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(responseBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-purple-400" />
            Hızlı API & Webhook Test İstasyonu (Postman-lite)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Tarayıcı üzerinden REST API istekleri gönderin, mock yanıtları analiz edin ve yanıt sürelerini ölçün.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-400 font-mono">Örnek:</span>
          {PRESET_APIS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setMethod(preset.method as any);
                setUrl(preset.url);
                if (preset.body) setRequestBody(preset.body);
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/5 hover:bg-purple-500/20 text-gray-300 hover:text-purple-300 border border-white/10 transition-colors cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Request Bar */}
      <div className="p-3 rounded-2xl bg-[#09090F] border border-white/10 shadow-xl flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-bold font-mono focus:outline-none focus:border-purple-500 transition-colors cursor-pointer text-purple-400"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/v1/endpoint"
          className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition-colors"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Gönder
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Request Config (Left) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-[#09090F] border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRequestTab("body")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    requestTab === "body" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Body (JSON)
                </button>
                <button
                  type="button"
                  onClick={() => setRequestTab("headers")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    requestTab === "headers" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Headers ({headers.filter((h) => h.enabled && h.key).length})
                </button>
              </div>

              {requestTab === "body" && (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      setRequestBody(JSON.stringify(JSON.parse(requestBody), null, 2));
                    } catch {}
                  }}
                  className="text-[11px] text-gray-400 hover:text-purple-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  Formatla
                </button>
              )}
            </div>

            {requestTab === "body" ? (
              <div>
                <textarea
                  rows={12}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-purple-200 font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
                  placeholder='{"key": "value"}'
                />
              </div>
            ) : (
              <div className="space-y-2">
                {headers.map((h) => (
                  <div key={h.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={h.enabled}
                      onChange={(e) => updateHeader(h.id, "enabled", e.target.checked)}
                      className="rounded accent-purple-500 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Header Adı"
                      value={h.key}
                      onChange={(e) => updateHeader(h.id, "key", e.target.value)}
                      className="w-1/2 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Değer"
                      value={h.value}
                      onChange={(e) => updateHeader(h.id, "value", e.target.value)}
                      className="w-1/2 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeHeader(h.id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHeader}
                  className="w-full py-1.5 rounded-lg border border-dashed border-white/10 text-gray-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Header Ekle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Response Panel (Right) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-2xl bg-[#09090F] border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white font-mono">Yanıt (Response):</span>
                {responseStatus !== null && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                      responseStatus >= 200 && responseStatus < 300
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : responseStatus >= 400
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}
                  >
                    {responseStatus} {responseStatusText}
                  </span>
                )}
                {responseTime !== null && (
                  <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    {responseTime} ms
                  </span>
                )}
                {responseSize && (
                  <span className="text-[11px] text-gray-500 font-mono">{responseSize}</span>
                )}
              </div>

              {responseBody && (
                <button
                  type="button"
                  onClick={copyResponse}
                  className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Kopyala
                </button>
              )}
            </div>

            {/* Response Viewer */}
            <div className="relative">
              {responseBody ? (
                <pre className="p-4 rounded-xl bg-black/80 border border-white/5 text-gray-200 font-mono text-xs overflow-x-auto max-h-[350px] leading-relaxed select-text">
                  {responseBody}
                </pre>
              ) : (
                <div className="h-[300px] rounded-xl bg-black/40 border border-dashed border-white/5 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <Database className="w-8 h-8 text-gray-600" />
                  <p className="text-xs text-gray-400">Henüz istek gönderilmedi.</p>
                  <p className="text-[11px] text-gray-600 font-mono">Yukarıdaki &quot;Gönder&quot; butonuna basarak API sonucunu görüntüleyin.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
