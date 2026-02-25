"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface KeywordTableProps {
  matched: string[];
  missing: string[];
}

export function KeywordTable({ matched, missing }: KeywordTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Matched */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <h4 className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
            Matched
            <span className="ml-1.5 text-gray-400 dark:text-zinc-500 font-normal">({matched.length})</span>
          </h4>
        </div>
        <div className="min-h-[80px] p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex flex-wrap gap-1.5 content-start">
          {matched.length > 0 ? (
            matched.map((kw, i) => (
              <span
                key={`${kw}-${i}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
              >
                {kw}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-400 dark:text-zinc-500 self-center">No keywords matched</p>
          )}
        </div>
      </div>

      {/* Missing */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-4 h-4 text-red-400 dark:text-red-500" />
          <h4 className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
            Missing
            <span className="ml-1.5 text-gray-400 dark:text-zinc-500 font-normal">({missing.length})</span>
          </h4>
        </div>
        <div className="min-h-[80px] p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 flex flex-wrap gap-1.5 content-start">
          {missing.length > 0 ? (
            missing.map((kw, i) => (
              <span
                key={`${kw}-${i}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200/60 dark:border-red-800/40"
              >
                {kw}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-400 dark:text-zinc-500 self-center">No missing keywords</p>
          )}
        </div>
      </div>
    </div>
  );
}
