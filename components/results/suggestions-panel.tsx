"use client";

import { AlertTriangle, ArrowUp, Info, Lightbulb } from "lucide-react";
import { Suggestion } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
}

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    containerClass: "bg-red-50/60 dark:bg-red-950/20 border-red-100 dark:border-red-900/40",
    badgeClass: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200/60 dark:border-red-800/40",
    iconClass: "text-red-500 dark:text-red-400",
    label: "High",
  },
  medium: {
    icon: ArrowUp,
    containerClass: "bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40",
    badgeClass: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/40",
    iconClass: "text-amber-500 dark:text-amber-400",
    label: "Medium",
  },
  low: {
    icon: Info,
    containerClass: "bg-blue-50/60 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40",
    badgeClass: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/40",
    iconClass: "text-blue-500 dark:text-blue-400",
    label: "Low",
  },
};

export function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  const sorted = [...suggestions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-3">
          <Lightbulb className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">No suggestions — great job!</p>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Your resume looks strong for this role.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((suggestion, i) => {
        const config = priorityConfig[suggestion.priority];
        const Icon = config.icon;
        return (
          <div
            key={i}
            className={cn(
              "rounded-xl border p-4 transition-colors",
              config.containerClass
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                <Icon className={cn("w-4 h-4", config.iconClass)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wide",
                      config.badgeClass
                    )}
                  >
                    {config.label}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                    {suggestion.category}
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-zinc-200 font-medium leading-relaxed">
                  {suggestion.suggestion}
                </p>
                {suggestion.example && (
                  <div className="mt-2.5 p-2.5 bg-white/70 dark:bg-zinc-800/50 rounded-lg border border-white dark:border-zinc-700">
                    <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Example
                    </p>
                    <p className="text-xs text-gray-700 dark:text-zinc-300 italic leading-relaxed">
                      {suggestion.example}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
