"use client";

import React, { useState, useMemo } from "react";
import { 
  Clock, 
  Code2, 
  Copy, 
  Check, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Play
} from "lucide-react";

interface CronPreset {
  name: string;
  expression: string;
  desc: string;
}

const CRON_PRESETS: CronPreset[] = [
  { name: "Her Dakika", expression: "* * * * *", desc: "Her dakika başında tetiklenir." },
  { name: "Her 5 Dakikada Bir", expression: "*/5 * * * *", desc: "Her 5 dakikada bir çalışır." },
  { name: "Her 15 Dakikada Bir", expression: "*/15 * * * *", desc: "Her 15 dakikada bir çalışır." },
  { name: "Her Saat Başı", expression: "0 * * * *", desc: "Her saatin ilk dakikasında (xx:00) çalışır." },
  { name: "Her Gece Yarısı", expression: "0 0 * * *", desc: "Her gün 00:00'da çalışır." },
  { name: "Hafta İçi Sabah 09:00", expression: "0 9 * * 1-5", desc: "Pazartesi-Cuma günleri 09:00'da çalışır." },
  { name: "Her Pazar Gece 03:00", expression: "0 3 * * 0", desc: "Pazar günleri gece saat 03:00'te çalışır." },
  { name: "Ayın 1'i Gece Yarısı", expression: "0 0 1 * *", desc: "Her ayın 1. günü 00:00'da çalışır." },
];

const REGEX_LIBRARY = [
  { name: "E-Posta (Email)", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", sample: "siyah@heycoderz.com", desc: "Standart e-posta adresi doğrulaması" },
  { name: "Türkiye Telefon No (+90)", pattern: "^(\\+90|0)?5\\d{9}$", sample: "+905551234567", desc: "+90 veya 05XX ile başlayan Türkiye GSM numarası" },
  { name: "Güçlü Şifre", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", sample: "Heycoderz2026!", desc: "Min 8 karakter, 1 büyük, 1 küçük harf, 1 rakam, 1 sembol" },
  { name: "URL / Web Sitesi", pattern: "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$", sample: "https://heycoderz.com", desc: "HTTP / HTTPS standart web bağlantısı" },
  { name: "Hex Renk Kodu", pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", sample: "#8b5cf6", desc: "#RGB veya #RRGGBB formatı" },
  { name: "Slug / URL Dostu Metin", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", sample: "nextjs-16-mimari-rehber", desc: "Küçük harf, rakam ve tirelerden oluşan metin" },
  { name: "IPv4 Adresi", pattern: "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$", sample: "192.168.1.1", desc: "Standart IPv4 adresi" },
];

export const CronRegexBuilderTool: React.FC = () => {
  const [activeMode, setActiveMode] = useState<"cron" | "regex">("cron");

  // Cron state
  const [cronExpr, setCronExpr] = useState("0 9 * * 1-5");
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("1-5");
  const [cronCopied, setCronCopied] = useState(false);

  // Regex state
  const [regexPattern, setRegexPattern] = useState(REGEX_LIBRARY[0].pattern);
  const [regexFlags, setRegexFlags] = useState("g");
  const [testText, setTestText] = useState("siyah@heycoderz.com\ninfo@example.com\ngecersiz-mail@\ntest@domain.org");
  const [regexCopied, setRegexCopied] = useState(false);

  const applyCustomCron = (m: string, h: string, dom: string, mon: string, dow: string) => {
    setMinute(m);
    setHour(h);
    setDayOfMonth(dom);
    setMonth(mon);
    setDayOfWeek(dow);
    setCronExpr(`${m} ${h} ${dom} ${mon} ${dow}`);
  };

  const cronExplanation = useMemo(() => {
    const parts = cronExpr.trim().split(/\s+/);
    if (parts.length !== 5) return "Geçersiz Cron formatı (5 parça olmalı: dakika saat gün ay haftanın-günü)";
    const [m, h, dom, mon, dow] = parts;

    let desc = "";
    if (m === "*" && h === "*") desc = "Her dakika çalışır.";
    else if (m.startsWith("*/")) desc = `Her ${m.replace("*/", "")} dakikada bir çalışır.`;
    else if (m === "0" && h === "*") desc = "Her saatin başında çalışır.";
    else if (h !== "*" && m !== "*") desc = `Saat ${h.padStart(2, "0")}:${m.padStart(2, "0")} zamanında`;

    if (dow === "1-5") desc += " (Pazartesi - Cuma hafta içi günlerinde)";
    else if (dow === "0" || dow === "7") desc += " (Pazar günleri)";
    else if (dow === "*") desc += " (Her gün)";
    else desc += ` (Haftanın ${dow}. gününde)`;

    if (dom !== "*") desc += `, ayın ${dom}. gününde`;
    if (mon !== "*") desc += `, ${mon}. ayda`;

    return desc;
  }, [cronExpr]);

  const regexResults = useMemo(() => {
    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches: { match: string; index: number }[] = [];
      
      const lines = testText.split("\n");
      const matchedLines = lines.map((line) => {
        try {
          const testRe = new RegExp(regexPattern, regexFlags.replace("g", ""));
          return { line, matched: testRe.test(line) };
        } catch {
          return { line, matched: false };
        }
      });

      return { valid: true, error: null, matchedLines };
    } catch (err: any) {
      return { valid: false, error: err.message, matchedLines: [] };
    }
  }, [regexPattern, regexFlags, testText]);

  return (
    <div className="space-y-8">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Cron Expression & Regex Sihirbazı
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Zamanlanmış görevler (Cron Job) için ifade üretin veya düzenli ifadeleri (Regex) anında test edin.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveMode("cron")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "cron"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Cron Zamanlayıcı
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("regex")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === "regex"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Regex Üreteci & Test
          </button>
        </div>
      </div>

      {activeMode === "cron" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cron Builder (Left) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 rounded-2xl bg-[#09090F] border border-white/10 space-y-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Görsel Cron Yapılandırıcı
              </h3>

              {/* 5 Input Grid */}
              <div className="grid grid-cols-5 gap-2.5">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-mono text-center">Dakika</label>
                  <input
                    type="text"
                    value={minute}
                    onChange={(e) => applyCustomCron(e.target.value, hour, dayOfMonth, month, dayOfWeek)}
                    className="w-full text-center px-2 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    placeholder="*"
                  />
                  <span className="text-[9px] text-gray-500 block text-center mt-1">0 - 59</span>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-mono text-center">Saat</label>
                  <input
                    type="text"
                    value={hour}
                    onChange={(e) => applyCustomCron(minute, e.target.value, dayOfMonth, month, dayOfWeek)}
                    className="w-full text-center px-2 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    placeholder="*"
                  />
                  <span className="text-[9px] text-gray-500 block text-center mt-1">0 - 23</span>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-mono text-center">Gün (Ay)</label>
                  <input
                    type="text"
                    value={dayOfMonth}
                    onChange={(e) => applyCustomCron(minute, hour, e.target.value, month, dayOfWeek)}
                    className="w-full text-center px-2 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    placeholder="*"
                  />
                  <span className="text-[9px] text-gray-500 block text-center mt-1">1 - 31</span>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-mono text-center">Ay</label>
                  <input
                    type="text"
                    value={month}
                    onChange={(e) => applyCustomCron(minute, hour, dayOfMonth, e.target.value, dayOfWeek)}
                    className="w-full text-center px-2 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    placeholder="*"
                  />
                  <span className="text-[9px] text-gray-500 block text-center mt-1">1 - 12</span>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1 font-mono text-center">Hafta Günü</label>
                  <input
                    type="text"
                    value={dayOfWeek}
                    onChange={(e) => applyCustomCron(minute, hour, dayOfMonth, month, e.target.value)}
                    className="w-full text-center px-2 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    placeholder="*"
                  />
                  <span className="text-[9px] text-gray-500 block text-center mt-1">0 - 6 (Paz-Cts)</span>
                </div>
              </div>

              {/* Expression Banner */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-purple-300 font-mono block">Oluşturulan Cron İfadesi:</span>
                  <span className="text-xl font-mono font-bold text-white tracking-widest">{cronExpr}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(cronExpr);
                    setCronCopied(true);
                    setTimeout(() => setCronCopied(false), 2000);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/30 transition-all"
                >
                  {cronCopied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                  Kopyala
                </button>
              </div>

              {/* Human Readable Explanation */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] text-gray-400 font-medium">Türkçe Anlamı:</span>
                <p className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  {cronExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* Presets (Right) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-5 rounded-2xl bg-[#09090F] border border-white/10 space-y-3">
              <h3 className="text-sm font-semibold text-white">Sık Kullanılan Cron Şablonları</h3>
              <div className="space-y-2">
                {CRON_PRESETS.map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => {
                      const parts = preset.expression.split(" ");
                      applyCustomCron(parts[0], parts[1], parts[2], parts[3], parts[4]);
                    }}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-purple-300">
                        {preset.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {preset.expression}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">{preset.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Regex Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-5">
            <div className="p-5 rounded-2xl bg-[#09090F] border border-white/10 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                Regex İfadesi & Bayraklar
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-mono text-lg">/</span>
                <input
                  type="text"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  placeholder="Regex desenini yazın..."
                  className="flex-1 px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-500"
                />
                <span className="text-gray-500 font-mono text-lg">/</span>
                <input
                  type="text"
                  value={regexFlags}
                  onChange={(e) => setRegexFlags(e.target.value)}
                  placeholder="gmi"
                  className="w-16 px-2 py-2.5 rounded-xl bg-black/60 border border-white/10 text-indigo-300 font-mono text-xs text-center focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`/${regexPattern}/${regexFlags}`);
                    setRegexCopied(true);
                    setTimeout(() => setRegexCopied(false), 2000);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {regexCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Test Text Area */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-mono">Test Edilecek Metin (Satır Satır)</label>
                <textarea
                  rows={6}
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-gray-200 font-mono text-xs focus:outline-none focus:border-purple-500 leading-relaxed resize-none"
                  placeholder="Test dizgilerini buraya yazın..."
                />
              </div>

              {/* Validation Results */}
              <div className="space-y-2">
                <span className="text-xs text-gray-400 font-mono">Eşleşme Sonuçları:</span>
                {!regexResults.valid ? (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    Hatalı Regex: {regexResults.error}
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                    {regexResults.matchedLines.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between border ${
                          item.matched
                            ? "bg-green-500/10 border-green-500/30 text-green-300"
                            : "bg-red-500/5 border-red-500/20 text-gray-500"
                        }`}
                      >
                        <span className="truncate max-w-[400px]">{item.line || "(Boş Satır)"}</span>
                        <span className="flex items-center gap-1 shrink-0 font-bold">
                          {item.matched ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Eşleşti
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-red-400" /> Eşleşmedi
                            </>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Regex Library (Right) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-5 rounded-2xl bg-[#09090F] border border-white/10 space-y-3">
              <h3 className="text-sm font-semibold text-white">Hazır Regex Kütüphanesi</h3>
              <div className="space-y-2">
                {REGEX_LIBRARY.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setRegexPattern(item.pattern);
                      setTestText(item.sample + "\ngecersiz-test-degeri");
                    }}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white group-hover:text-indigo-300">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">Seç ve Dene</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                    <code className="block text-[10px] text-indigo-400 font-mono truncate mt-1 bg-black/40 px-2 py-0.5 rounded">
                      {item.pattern}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
