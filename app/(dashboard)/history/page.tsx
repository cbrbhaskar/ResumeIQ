import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ArrowRight,
  Upload,
  Clock,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { formatDate, getScoreColor, getScoreLabel } from "@/lib/utils";
import { Scan } from "@/lib/types";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: scans } = await supabase
    .from("scans")
    .select(
      "id, job_title, ats_score, status, created_at, resume_filename, job_description"
    )
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false });

  const allScans = (scans || []) as Scan[];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scan History</h1>
          <p className="text-gray-400 dark:text-zinc-500 text-sm mt-0.5">
            {allScans.length} scan{allScans.length !== 1 ? "s" : ""} completed
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/upload">
            <Upload className="w-4 h-4" />
            New Scan
          </Link>
        </Button>
      </div>

      {allScans.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm py-16 text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-gray-300 dark:text-zinc-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">No scans yet</h3>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mb-6">
            Upload your resume to get your first ATS score
          </p>
          <Button asChild size="sm">
            <Link href="/upload">
              <Upload className="w-4 h-4" />
              Start First Scan
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">All Scans</h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800">
            {allScans.map((scan, i) => {
              const prevScan = allScans[i + 1];
              const scoreDiff =
                prevScan?.ats_score && scan.ats_score
                  ? scan.ats_score - prevScan.ats_score
                  : null;

              return (
                <Link
                  key={scan.id}
                  href={`/results/${scan.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-zinc-800/60 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate flex items-center gap-1.5">
                        {scan.job_title ? (
                          <>
                            <Briefcase className="w-3 h-3 text-gray-400 dark:text-zinc-500 shrink-0" />
                            {scan.job_title}
                          </>
                        ) : (
                          scan.resume_filename || "Resume Scan"
                        )}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatDate(scan.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 ml-3">
                    {/* Score trend */}
                    {scoreDiff !== null && (
                      <div
                        className={`flex items-center gap-0.5 text-xs font-semibold ${
                          scoreDiff > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : scoreDiff < 0
                            ? "text-red-500 dark:text-red-400"
                            : "text-gray-400 dark:text-zinc-500"
                        }`}
                      >
                        {scoreDiff > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : scoreDiff < 0 ? (
                          <TrendingDown className="w-3.5 h-3.5" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                        {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
                      </div>
                    )}

                    {scan.ats_score !== null && (
                      <div className="text-right">
                        <p
                          className={`text-xl font-extrabold tabular-nums ${getScoreColor(
                            scan.ats_score
                          )}`}
                        >
                          {scan.ats_score}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 leading-tight">
                          {getScoreLabel(scan.ats_score)}
                        </p>
                      </div>
                    )}

                    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-zinc-600 group-hover:text-gray-500 dark:group-hover:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
