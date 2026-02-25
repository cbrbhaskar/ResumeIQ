"use client";

import { ScanResult } from "@/lib/types";
import { getScoreColor } from "@/lib/utils";

interface ScoreBreakdownProps {
  result: ScanResult;
}

const BREAKDOWN_ITEMS = [
  { key: "keyword_match_score", label: "Keyword Match", weight: "30%" },
  { key: "skills_match_score", label: "Skills Match", weight: "25%" },
  { key: "experience_score", label: "Experience", weight: "20%" },
  { key: "formatting_score", label: "Formatting", weight: "15%" },
  { key: "title_alignment_score", label: "Title Alignment", weight: "10%" },
] as const;

function getBarColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-yellow-400";
  if (score >= 40) return "bg-orange-400";
  return "bg-red-500";
}

export function ScoreBreakdown({ result }: ScoreBreakdownProps) {
  return (
    <div className="space-y-3.5">
      {BREAKDOWN_ITEMS.map(({ key, label, weight }) => {
        const score = result[key] as number;
        return (
          <div key={key}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-gray-700 dark:text-zinc-300">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 dark:text-zinc-500">{weight}</span>
                <span
                  className={`font-bold tabular-nums w-6 text-right ${getScoreColor(score)}`}
                >
                  {score}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getBarColor(score)}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
