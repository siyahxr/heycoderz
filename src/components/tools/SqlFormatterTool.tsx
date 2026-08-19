"use client";

import React, { useState, useEffect } from "react";
import { Database, Copy, Check, Sparkles, Download, Trash2, Minimize2, Wand2 } from "lucide-react";
import { formatSQLQuery, minifySQLQuery } from "@/lib/sqlBeautifier";

const SAMPLE_QUERIES = [
  {
    name: "Karmaşık JOIN & Raporlama",
    sql: "select u.id, u.username, u.email, count(o.id) as total_orders, sum(o.total_price) as gross_revenue from users u left join orders o on u.id = o.user_id inner join user_profiles p on u.id = p.user_id where u.is_active = 1 and u.created_at >= '2026-01-01' group by u.id, u.username, u.email having count(o.id) > 2 and sum(o.total_price) >= 1000 order by gross_revenue desc limit 50 offset 0;",
  },
  {
    name: "Alt Sorgu & CTE (WITH)",
    sql: "with top_customers as (select customer_id, sum(amount) as total_spent from payments where payment_date >= '2026-01-01' group by customer_id having sum(amount) > 5000) select c.name, c.email, tc.total_spent from customers c join top_customers tc on c.id = tc.customer_id order by tc.total_spent desc;",
  },
  {
    name: "Tablo Oluşturma (DDL)",
    sql: "create table users (id serial primary key, username varchar(50) unique not null, email varchar(255) unique not null, password_hash varchar(255) not null, role varchar(20) default 'member', is_active boolean default true, created_at timestamp default current_timestamp);",
  },
];

export const SqlFormatterTool: React.FC = () => {
  const [inputSql, setInputSql] = useState(SAMPLE_QUERIES[0].sql);
  const [outputSql, setOutputSql] = useState("");
  const [uppercase, setUppercase] = useState(true);
  const [indentOption, setIndentOption] = useState<"2" | "4" | "tab">("2");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputSql.trim()) {
      setOutputSql("");
      return;
    }
    const indent = indentOption === "tab" ? "\t" : " ".repeat(Number(indentOption));
    const res = formatSQLQuery(inputSql, { uppercase, indent });
    setOutputSql(res);
  }, [inputSql, uppercase, indentOption]);

  const handleMinify = () => {
    if (!inputSql.trim()) return;
    const minified = minifySQLQuery(inputSql);
    setOutputSql(minified);
  };

  const handleCopy = () => {
    if (!outputSql) return;
    navigator.clipboard.writeText(outputSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputSql) return;
    const blob = new Blob([outputSql], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query.sql";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">SQL Sorgu Güzelleştirici (Formatter)</h2>
            <p className="text-xs text-gray-400">
              Tek satır veya karmaşık SQL sorgularını standart girintiler ve büyük anahtar sözcüklerle biçimlendirin.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_QUERIES.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => setInputSql(sample.sql)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Options Toolbar */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setIndentOption("2")}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                indentOption === "2" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              2 Boşluk
            </button>
            <button
              type="button"
              onClick={() => setIndentOption("4")}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                indentOption === "4" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              4 Boşluk
            </button>
            <button
              type="button"
              onClick={() => setIndentOption("tab")}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                indentOption === "tab" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Tab
            </button>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded bg-black border-white/20 accent-purple-500 cursor-pointer"
            />
            <span>BÜYÜK HARF (UPPERCASE)</span>
          </label>

          <button
            type="button"
            onClick={handleMinify}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tek Satır Yap (Minify)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInputSql("")}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-red-500/20 border border-white/10 text-xs text-gray-400 hover:text-red-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Temizle</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!outputSql}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.sql İndir</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!outputSql}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-40 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Kopyalandı!" : "SQL Kopyala"}</span>
          </button>
        </div>
      </div>

      {/* Editor Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">Ham / Düzenlenecek SQL:</span>
          </div>
          <textarea
            rows={15}
            value={inputSql}
            onChange={(e) => setInputSql(e.target.value)}
            placeholder="SELECT * FROM users..."
            className="w-full font-mono text-xs p-4 rounded-2xl bg-black/70 border border-white/10 focus:border-purple-500 text-purple-200 outline-none resize-y leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">Biçimlendirilmiş SQL Çıktısı:</span>
          </div>
          <textarea
            readOnly
            rows={15}
            value={outputSql || "-- Biçimlendirilmiş sorgu..."}
            className="w-full font-mono text-xs p-4 rounded-2xl bg-black/85 border border-purple-500/30 text-emerald-400 outline-none resize-y leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
