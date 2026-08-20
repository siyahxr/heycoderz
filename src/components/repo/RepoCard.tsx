"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Star, 
  GitFork, 
  FileCode2, 
  Copy, 
  Check, 
  Lock, 
  Globe2, 
  ExternalLink,
  Terminal,
  Clock
} from "lucide-react";
import { Repository, useRepo } from "@/context/RepoContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface RepoCardProps {
  repo: Repository;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const { toggleStar, forkRepository } = useRepo();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [copiedClone, setCopiedClone] = useState(false);
  const [forking, setForking] = useState(false);

  const isStarred = user ? repo.starredByUserIds.includes(user.id) : false;

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStar(repo.id, user);
  };

  const handleForkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setForking(true);
    setTimeout(() => {
      forkRepository(repo.id, user);
      setForking(false);
    }, 400);
  };

  const handleCopyClone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === "undefined") return;
    const cloneUrl = `https://heycoderz.com/depolar/${repo.id}.git`;
    navigator.clipboard.writeText(`git clone ${cloneUrl}`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const timeAgo = (() => {
    const diff = Date.now() - (typeof repo.updatedAt === "number" ? repo.updatedAt : Date.now());
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Az önce";
    if (hours < 24) return `${hours}s önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
  })();

  return (
    <div className="group relative rounded-2xl bg-[#09090F]/90 border border-white/[0.08] hover:border-purple-500/40 p-5 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(139,92,246,0.15)] flex flex-col justify-between backdrop-blur-sm">
      {/* Top Bar: Author & Visibility & Star */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={`/@${repo.author.username.replace(/^@/, "")}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={repo.author.avatar}
                alt={repo.author.name}
                className="w-6 h-6 rounded-md object-cover border border-purple-500/30"
              />
              <span className="text-xs font-mono text-gray-400 hover:text-purple-300 truncate">
                @{repo.author.username.replace(/^@/, "")}
              </span>
            </Link>
            <span className="text-gray-600">/</span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-gray-400 border border-white/[0.06]">
              {repo.isPublic ? (
                <>
                  <Globe2 className="w-3 h-3 text-emerald-400" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Private</span>
                </>
              )}
            </span>
          </div>

          {/* Star & Fork Quick Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleStarClick}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                isStarred
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                  : "bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-950/20"
              }`}
              title={isStarred ? t("repo.unstar") : t("repo.star")}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isStarred ? "fill-amber-400 text-amber-400 animate-pulse" : ""
                }`}
              />
              <span>{repo.stars}</span>
            </button>

            <button
              type="button"
              onClick={handleForkClick}
              disabled={forking}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/30 hover:bg-purple-950/20 transition-all cursor-pointer disabled:opacity-50"
              title={t("repo.fork")}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>{repo.forks}</span>
            </button>
          </div>
        </div>

        {/* Repository Title */}
        <Link href={`/depolar/${repo.id}`} className="block group-hover:translate-x-0.5 transition-transform">
          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">{repo.name}</span>
          </h3>
        </Link>

        {/* Forked Note if applicable */}
        {repo.forkedFrom && (
          <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1 font-mono">
            <GitFork className="w-3 h-3 text-purple-400" />
            <span>{t("repo.forkedFrom")}</span>
            <Link
              href={`/depolar/${repo.forkedFrom.repoId}`}
              className="text-purple-400 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              @{repo.forkedFrom.authorUsername}/{repo.forkedFrom.repoName}
            </Link>
          </p>
        )}

        {/* Description */}
        <p className="text-xs text-gray-400 mt-2.5 line-clamp-2 leading-relaxed">
          {repo.description || "Açıklama belirtilmemiş."}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {repo.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/30 text-purple-300 border border-purple-500/20"
            >
              #{tag}
            </span>
          ))}
          {repo.tags.length > 4 && (
            <span className="text-[10px] text-gray-500 self-center">
              +{repo.tags.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Metadata & Quick Clone */}
      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3">
          {/* Language Dot */}
          <div className="flex items-center gap-1.5 font-medium text-gray-300">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: repo.languageColor || "#a855f7" }}
            />
            <span>{repo.primaryLanguage}</span>
          </div>

          <span className="text-gray-600">•</span>

          {/* Files Count */}
          <span className="text-gray-400 font-mono text-[11px]">
            {repo.files.length} {t("repo.filesCount")}
          </span>

          <span className="text-gray-600 hidden sm:inline">•</span>

          {/* Updated time */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Quick Clone / Open */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyClone}
            className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-purple-950/40 border border-white/10 hover:border-purple-500/30 text-gray-400 hover:text-purple-300 transition-all cursor-pointer"
            title="git clone komutunu kopyala"
          >
            {copiedClone ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Terminal className="w-3.5 h-3.5" />
            )}
          </button>

          <Link
            href={`/depolar/${repo.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 hover:border-purple-500/50 text-xs font-medium transition-all"
          >
            <span>{t("common.details")}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
