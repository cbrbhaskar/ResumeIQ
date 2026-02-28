import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap, TrendingUp, Award, Plus, ArrowRight } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { MiniSparkline } from "@/components/ui/mini-sparkline";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function ScoreBadge({ score }: { score: number }) {
  const cfg =
    score >= 70
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 50
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-red-50 text-red-700 border-red-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg}`}>
      {score}/100
    </span>
  );
}

export default async function DashboardPage() {
  const user = await requireAuth();
  if (!user) redirect("/login");

  const [profile, usage, scans] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.usageCount.findUnique({ where: { userId: user.id } }),
    prisma.scan.findMany({
      where: { userId: user.id, status: "completed" },
      include: { result: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const scansUsed = usage?.scansUsed ?? 0;
  const scansLimit = usage?.scansLimit ?? 3;
  const isPro = profile?.plan !== "free";
  const scores = scans.map((s) => s.result?.overallScore ?? 0).filter(Boolean);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;
  const sparkData = [...scans].reverse().slice(-5).map((s) => ({ score: s.result?.overallScore ?? 0 }));
  const firstName = (user.name ?? "there").split(" ")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Here&apos;s your resume performance at a glance.</p>
        </div>
        <Link href="/upload">
          <ShimmerButton className="text-sm py-2.5 px-5">
            <Plus className="w-4 h-4" /> New Scan
          </ShimmerButton>
        </Link>
      </div>

      {/* Upgrade banner — free users near limit */}
      {!isPro && scansUsed >= scansLimit - 1 && (
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl px-5 py-4 shadow-lg shadow-violet-200/40">
          <div>
            <p className="font-semibold text-white text-sm">
              {scansLimit - scansUsed} free scan{scansLimit - scansUsed !== 1 ? "s" : ""} remaining
            </p>
            <p className="text-white/65 text-xs mt-0.5">Upgrade to Pro for unlimited scans</p>
          </div>
          <Link
            href="/billing"
            className="shrink-0 bg-white text-violet-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors flex items-center gap-1.5"
          >
            Upgrade to Pro <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Scans Used */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Scans Used</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {isPro ? (
              <NumberTicker value={scansUsed} duration={800} />
            ) : (
              <>
                <NumberTicker value={scansUsed} duration={800} />
                <span className="text-lg font-normal text-slate-300 ml-1">/ {scansLimit}</span>
              </>
            )}
          </p>
          {!isPro && (
            <div className="mt-3">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((scansUsed / scansLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">{scansLimit - scansUsed} remaining</p>
            </div>
          )}
          {isPro && <p className="text-xs text-violet-500 font-medium mt-1">Unlimited — Pro plan</p>}
        </div>

        {/* Avg Score */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Avg Score</span>
          </div>
          {avgScore > 0 ? (
            <p className={`text-3xl font-extrabold ${avgScore >= 70 ? "text-emerald-600" : avgScore >= 50 ? "text-amber-600" : "text-red-500"}`}>
              <NumberTicker value={avgScore} suffix="/100" duration={1200} />
            </p>
          ) : (
            <p className="text-2xl font-extrabold text-slate-300">—</p>
          )}
          <p className="text-xs text-slate-400 mt-1.5">across all completed scans</p>
        </div>

        {/* Best Score */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Best Score</span>
          </div>
          {bestScore > 0 ? (
            <p className="text-3xl font-extrabold text-slate-900">
              <NumberTicker value={bestScore} suffix="/100" duration={1200} />
            </p>
          ) : (
            <p className="text-2xl font-extrabold text-slate-300">—</p>
          )}
          <p className="text-xs text-slate-400 mt-1.5">your personal best</p>
        </div>
      </div>

      {/* Score sparkline */}
      {sparkData.length >= 2 && (
        <div className="glass-card rounded-2xl p-5 mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">ATS score over time</p>
          <MiniSparkline data={sparkData} />
        </div>
      )}

      {/* Recent scans */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Recent Scans</h2>
          {scans.length > 0 && (
            <Link href="/history" className="text-xs text-violet-600 font-semibold hover:underline">
              View all →
            </Link>
          )}
        </div>

        {scans.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-violet-400" />
            </div>
            <p className="text-slate-700 font-semibold mb-1">No scans yet</p>
            <p className="text-slate-400 text-sm mb-5">
              Upload your resume and a job description to get your first score.
            </p>
            <Link href="/upload">
              <ShimmerButton className="text-sm py-2.5 px-6">
                Analyse My Resume <ArrowRight className="w-3.5 h-3.5" />
              </ShimmerButton>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100/80">
            {scans.map((scan) => (
              <Link
                key={scan.id}
                href={`/results/${scan.id}`}
                className="flex items-center justify-between py-3.5 -mx-2 px-2 rounded-xl hover:bg-violet-50/60 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm group-hover:text-violet-700 transition-colors truncate">
                    {scan.jobTitle ?? "Untitled Position"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(scan.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {scan.result && <ScoreBadge score={scan.result.overallScore} />}
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
