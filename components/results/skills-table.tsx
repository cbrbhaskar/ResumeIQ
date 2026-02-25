"use client";

import { CheckCircle2, XCircle, Code2, Heart } from "lucide-react";

interface SkillsTableProps {
  hardSkillsMatched: string[];
  hardSkillsMissing: string[];
  softSkillsMatched: string[];
  softSkillsMissing: string[];
}

function SkillBadge({ label, variant }: { label: string; variant: "matched" | "missing" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variant === "matched"
          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/40"
          : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200/60 dark:border-red-800/40"
      }`}
    >
      {label}
    </span>
  );
}

export function SkillsTable({
  hardSkillsMatched,
  hardSkillsMissing,
  softSkillsMatched,
  softSkillsMissing,
}: SkillsTableProps) {
  return (
    <div className="space-y-6">
      {/* Hard Skills */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-4 h-4 text-violet-500 dark:text-violet-400" />
          <h4 className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Hard Skills</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-2.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Matched ({hardSkillsMatched.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hardSkillsMatched.map((s) => (
                <SkillBadge key={s} label={s} variant="matched" />
              ))}
              {hardSkillsMatched.length === 0 && (
                <span className="text-xs text-gray-400 dark:text-zinc-500">None matched</span>
              )}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2.5 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Missing ({hardSkillsMissing.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hardSkillsMissing.map((s) => (
                <SkillBadge key={s} label={s} variant="missing" />
              ))}
              {hardSkillsMissing.length === 0 && (
                <span className="text-xs text-gray-400 dark:text-zinc-500">None missing</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-pink-400 dark:text-pink-500" />
          <h4 className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Soft Skills</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-2.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Matched ({softSkillsMatched.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {softSkillsMatched.map((s) => (
                <SkillBadge key={s} label={s} variant="matched" />
              ))}
              {softSkillsMatched.length === 0 && (
                <span className="text-xs text-gray-400 dark:text-zinc-500">None matched</span>
              )}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2.5 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Missing ({softSkillsMissing.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {softSkillsMissing.map((s) => (
                <SkillBadge key={s} label={s} variant="missing" />
              ))}
              {softSkillsMissing.length === 0 && (
                <span className="text-xs text-gray-400 dark:text-zinc-500">None missing</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
