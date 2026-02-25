"use client";

import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { FormattingIssue } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FormattingIssuesProps {
  issues: FormattingIssue[];
  recruiterReadability: number;
}

const severityConfig = {
  high: {
    icon: AlertCircle,
    containerClass: "border-red-100 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/20",
    iconClass: "text-red-500 dark:text-red-400",
    label: "Critical",
  },
  medium: {
    icon: AlertTriangle,
    containerClass: "border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20",
    iconClass: "text-amber-500 dark:text-amber-400",
    label: "Warning",
  },
  low: {
    icon: Info,
    containerClass: "border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20",
    iconClass: "text-blue-500 dark:text-blue-400",
    label: "Note",
  },
};

function getReadabilityColor(score: number) {
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-yellow-500 dark:text-yellow-400";
  return "text-red-500 dark:text-red-400";
}

function getReadabilityBarColor(score: number) {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 50) return "bg-yellow-400";
  return "bg-red-500";
}

export function FormattingIssues({
  issues,
  recruiterReadability,
}: FormattingIssuesProps) {
  return (
    <div className="space-y-4">
      {/* Readability score */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700">
        <div className="flex-1 mr-6">
          <p className="text-sm font-medium text-gray-800 dark:text-zinc-200">Recruiter Readability</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
            How easy your resume is to scan visually
          </p>
          <div className="mt-3 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${getReadabilityBarColor(
                recruiterReadability
              )}`}
              style={{ width: `${recruiterReadability}%` }}
            />
          </div>
        </div>
        <div className="flex items-baseline gap-0.5 shrink-0">
          <span
            className={`text-3xl font-extrabold tabular-nums ${getReadabilityColor(
              recruiterReadability
            )}`}
          >
            {recruiterReadability}
          </span>
          <span className="text-gray-400 dark:text-zinc-500 text-sm">/100</span>
        </div>
      </div>

      {/* Issues list */}
      {issues.length > 0 ? (
        <div className="space-y-2">
          {issues.map((issue, i) => {
            const config = severityConfig[issue.severity];
            const Icon = config.icon;
            return (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 p-3.5 rounded-xl border",
                  config.containerClass
                )}
              >
                <Icon
                  className={cn("w-4 h-4 mt-0.5 shrink-0", config.iconClass)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-zinc-200">{issue.issue}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                    <span className="font-medium text-gray-600 dark:text-zinc-300">Fix: </span>
                    {issue.fix}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              No formatting issues detected
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400/80 mt-0.5">
              Your resume is ATS-friendly
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
