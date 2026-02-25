import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ScoreGauge } from "@/components/results/score-gauge";
import { ScoreBreakdown } from "@/components/results/score-breakdown";
import { KeywordTable } from "@/components/results/keyword-table";
import { SkillsTable } from "@/components/results/skills-table";
import { SuggestionsPanel } from "@/components/results/suggestions-panel";
import { FormattingIssues } from "@/components/results/formatting-issues";
import { Button } from "@/components/ui/button";
import { ExportAnalysisButton } from "@/components/results/export-analysis-button";
import {
  ArrowLeft,
  Upload,
  Clock,
  Briefcase,
  Target,
  BarChart2,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Code2,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Scan, ScanResult } from "@/lib/types";

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("scans")
    .select(`
      id, user_id, resume_url, resume_filename, job_description,
      job_title, ats_score, status, created_at,
      scan_results (
        id, scan_id, keyword_match_score, skills_match_score,
        experience_score, formatting_score, title_alignment_score,
        overall_score, keyword_matches, missing_keywords,
        hard_skills_matched, hard_skills_missing, soft_skills_matched,
        soft_skills_missing, formatting_issues, suggestions,
        section_quality, seniority_alignment, recruiter_readability, created_at
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) notFound();

  const scan = data as Scan & { scan_results: ScanResult[] };
  const result = Array.isArray(scan.scan_results)
    ? scan.scan_results[0]
    : scan.scan_results;

  if (!result || scan.status !== "completed") {
    const message =
      scan.status === "failed"
        ? "Analysis failed. The AI could not process your resume."
        : scan.status === "processing"
        ? "Analysis is still running. Please wait a moment and refresh."
        : "Analysis results were not saved. Please try again.";

    return (
      <div className="max-w-lg mx-auto text-center py-24 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analysis not available</h2>
        <p className="text-gray-500 dark:text-zinc-400 text-sm mb-6">{message}</p>
        <Button asChild>
          <Link href="/upload">
            <Upload className="w-4 h-4" /> Try Again
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back + header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:border-gray-200 dark:hover:border-zinc-700 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {scan.job_title ? (
                <>
                  <Briefcase className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                  {scan.job_title}
                </>
              ) : (
                "Resume Analysis"
              )}
            </h1>
            <p className="text-xs text-gray-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {formatDate(scan.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExportAnalysisButton scan={scan} result={result} />
          <Button variant="outline" size="sm" asChild>
            <Link href="/upload">
              <RefreshCw className="w-3.5 h-3.5" />
              Re-scan
            </Link>
          </Button>
        </div>
      </div>

      {/* Score hero */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-violet-50 via-indigo-50/40 to-white dark:from-violet-950/30 dark:via-indigo-950/20 dark:to-zinc-900 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0">
              <ScoreGauge score={result.overall_score} label="ATS Match Score" size="lg" />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                Score Breakdown
              </h2>
              <ScoreBreakdown result={result} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Keywords Matched",
            value: result.keyword_matches.length,
            total: result.keyword_matches.length + result.missing_keywords.length,
            icon: Target,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
          },
          {
            label: "Missing Keywords",
            value: result.missing_keywords.length,
            icon: AlertTriangle,
            color: "text-red-500 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-950/30",
          },
          {
            label: "Hard Skills",
            value: result.hard_skills_matched.length,
            total:
              result.hard_skills_matched.length + result.hard_skills_missing.length,
            icon: Code2,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/30",
          },
          {
            label: "Suggestions",
            value: result.suggestions.length,
            icon: Lightbulb,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-950/30",
          },
        ].map(({ label, value, total, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4"
          >
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-2xl font-extrabold tabular-nums ${color}`}>
              {value}
              {total !== undefined && (
                <span className="text-sm font-normal text-gray-400 dark:text-zinc-500">/{total}</span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Role alignment */}
      {result.seniority_alignment && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            Role Alignment
          </h3>
          <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
            {result.seniority_alignment}
          </p>
        </div>
      )}

      {/* Keyword analysis */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <Target className="w-4 h-4 text-violet-500 dark:text-violet-400" />
          Keyword Analysis
        </h3>
        <KeywordTable
          matched={result.keyword_matches}
          missing={result.missing_keywords}
        />
      </div>

      {/* Skills */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-violet-500 dark:text-violet-400" />
          Skills Match
        </h3>
        <SkillsTable
          hardSkillsMatched={result.hard_skills_matched}
          hardSkillsMissing={result.hard_skills_missing}
          softSkillsMatched={result.soft_skills_matched}
          softSkillsMissing={result.soft_skills_missing}
        />
      </div>

      {/* Formatting */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-violet-500 dark:text-violet-400" />
          Formatting & ATS Safety
        </h3>
        <FormattingIssues
          issues={result.formatting_issues}
          recruiterReadability={result.recruiter_readability}
        />
      </div>

      {/* Suggestions */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-violet-500 dark:text-violet-400" />
          Improvement Suggestions
        </h3>
        <SuggestionsPanel suggestions={result.suggestions} />
      </div>

      {/* Re-scan CTA */}
      <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 text-center">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          Made improvements to your resume?
        </p>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mb-4">
          Re-upload your updated resume to track your score improvement
        </p>
        <Button asChild size="sm">
          <Link href="/upload">
            <Upload className="w-4 h-4" />
            Re-scan Updated Resume
          </Link>
        </Button>
      </div>
    </div>
  );
}
