import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { ScoreGauge } from "@/components/results/score-gauge";
import { ScoreBreakdown } from "@/components/results/score-breakdown";
import { KeywordTable } from "@/components/results/keyword-table";
import { SkillsTable } from "@/components/results/skills-table";
import { SuggestionsPanel } from "@/components/results/suggestions-panel";
import { FormattingIssues } from "@/components/results/formatting-issues";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ExportAnalysisButton } from "@/components/results/export-analysis-button";
import { Button } from "@/components/ui/button";
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
  Download,
  Layers,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Scan, ScanResult, FormattingIssue, Suggestion, SectionQuality } from "@/lib/types";

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : score >= 50
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-red-100 text-red-600 border-red-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
      {score}/100
    </span>
  );
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id: string }).id;

  const data = await prisma.scan.findFirst({
    where: { id, userId },
    include: { result: true },
  });

  if (!data) notFound();

  // Map Prisma camelCase → existing snake_case types
  const scan = {
    id: data.id,
    user_id: data.userId,
    resume_url: data.resumeUrl,
    resume_filename: data.resumeFilename,
    job_description: data.jobDescription ?? "",
    job_title: data.jobTitle,
    ats_score: data.atsScore,
    status: data.status,
    created_at: data.createdAt.toISOString(),
  } as Scan;

  const result = data.result
    ? ({
        id: data.result.id,
        scan_id: data.result.scanId,
        keyword_match_score: data.result.keywordMatchScore,
        skills_match_score: data.result.skillsMatchScore,
        experience_score: data.result.experienceScore,
        formatting_score: data.result.formattingScore,
        title_alignment_score: data.result.titleAlignmentScore,
        overall_score: data.result.overallScore,
        keyword_matches: data.result.keywordMatches as string[],
        missing_keywords: data.result.missingKeywords as string[],
        hard_skills_matched: data.result.hardSkillsMatched as string[],
        hard_skills_missing: data.result.hardSkillsMissing as string[],
        soft_skills_matched: data.result.softSkillsMatched as string[],
        soft_skills_missing: data.result.softSkillsMissing as string[],
        formatting_issues: data.result.formattingIssues as unknown as FormattingIssue[],
        suggestions: data.result.suggestions as unknown as Suggestion[],
        section_quality: data.result.sectionQuality as unknown as SectionQuality,
        seniority_alignment: data.result.seniorityAlignment,
        recruiter_readability: data.result.recruiterReadability,
        created_at: data.result.createdAt.toISOString(),
      } as ScanResult)
    : null;

  if (!result || scan.status !== "completed") {
    const message =
      scan.status === "failed"
        ? "Analysis failed. The system could not process your resume."
        : scan.status === "processing"
        ? "Analysis is still running. Please wait a moment and refresh."
        : "Analysis results were not saved. Please try again.";

    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis not available</h2>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <Button asChild>
          <Link href="/upload">
            <Upload className="w-4 h-4" /> Try Again
          </Link>
        </Button>
      </div>
    );
  }

  const quickStats = [
    {
      label: "Keywords Matched",
      value: result.keyword_matches.length,
      total: result.keyword_matches.length + result.missing_keywords.length,
      icon: Target,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      label: "Missing Keywords",
      value: result.missing_keywords.length,
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      valueColor: "text-red-500",
    },
    {
      label: "Hard Skills",
      value: result.hard_skills_matched.length,
      total: result.hard_skills_matched.length + result.hard_skills_missing.length,
      icon: Code2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      label: "Suggestions",
      value: result.suggestions.length,
      icon: Lightbulb,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      valueColor: "text-violet-600",
    },
  ];

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-200 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              {scan.job_title ? (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-violet-500" />
                  {scan.job_title}
                </>
              ) : (
                "Resume Analysis"
              )}
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(scan.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/upload">
              <RefreshCw className="w-3.5 h-3.5" />
              Re-scan
            </Link>
          </Button>
          <ExportAnalysisButton scan={scan} result={result} />
        </div>
      </div>

      {/* Score hero */}
      <div className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
        <div className="bg-gradient-to-br from-violet-50 via-indigo-50/40 to-white p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0 flex flex-col items-center gap-2">
              <ScoreGauge score={result.overall_score} label="ATS Match Score" size="lg" />
              <ScoreBadge score={result.overall_score} />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5 text-violet-500" />
                Score Breakdown
              </h2>
              <ScoreBreakdown result={result} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats bento row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickStats.map(({ label, value, total, icon: Icon, iconBg, iconColor, valueColor }) => (
          <div
            key={label}
            className="bento-card bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col"
          >
            <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <div className={`text-2xl font-extrabold tabular-nums ${valueColor} flex items-baseline gap-1`}>
              <NumberTicker value={value} duration={800} />
              {total !== undefined && (
                <span className="text-sm font-normal text-gray-400">/{total}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Role alignment */}
      {result.seniority_alignment && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-violet-500" />
            Role Alignment
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{result.seniority_alignment}</p>
        </div>
      )}

      {/* Tabbed content sections */}
      <div className="space-y-4">
        {/* Keywords */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Keyword Analysis</h3>
            <span className="ml-auto text-xs text-gray-400">
              {result.keyword_matches.length} matched · {result.missing_keywords.length} missing
            </span>
          </div>
          <div className="p-6">
            <KeywordTable matched={result.keyword_matches} missing={result.missing_keywords} />
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Skills Match</h3>
            <span className="ml-auto text-xs text-gray-400">
              {result.hard_skills_matched.length + result.soft_skills_matched.length} skills matched
            </span>
          </div>
          <div className="p-6">
            <SkillsTable
              hardSkillsMatched={result.hard_skills_matched}
              hardSkillsMissing={result.hard_skills_missing}
              softSkillsMatched={result.soft_skills_matched}
              softSkillsMissing={result.soft_skills_missing}
            />
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-violet-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Improvement Suggestions</h3>
            <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
              {result.suggestions.length}
            </span>
          </div>
          <div className="p-6">
            <SuggestionsPanel suggestions={result.suggestions} />
          </div>
        </div>

        {/* Formatting */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Formatting & ATS Safety</h3>
            {result.formatting_issues.length > 0 && (
              <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                {result.formatting_issues.length} issues
              </span>
            )}
          </div>
          <div className="p-6">
            <FormattingIssues issues={result.formatting_issues} recruiterReadability={result.recruiter_readability} />
          </div>
        </div>
      </div>

      {/* Re-scan CTA */}
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50/30 p-6 text-center">
        <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-violet-100 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-5 h-5 text-violet-600" />
        </div>
        <p className="text-sm font-bold text-gray-900 mb-1">Made improvements to your resume?</p>
        <p className="text-xs text-gray-500 mb-4">Re-upload your updated resume to track your score improvement</p>
        <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/upload">
            <Upload className="w-4 h-4" />
            Re-scan Updated Resume
          </Link>
        </Button>
      </div>

      {/* Floating export FAB */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="flex flex-col items-end gap-2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-1 flex items-center gap-1">
            <ExportAnalysisButton scan={scan} result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
