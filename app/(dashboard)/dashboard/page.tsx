import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserUsage } from "@/lib/usage";
import { formatDate, getScoreLabel, getPlanDisplayName } from "@/lib/utils";
import { Scan } from "@/lib/types";

export const dynamic = "force-dynamic";

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [usage, { data: recentScans }, { data: profile }] = await Promise.all([
    getUserUsage(user.id),
    supabase.from("scans").select("id, job_title, ats_score, status, created_at, resume_filename").eq("user_id", user.id).eq("status", "completed").order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("full_name, plan").eq("id", user.id).single(),
  ]);

  const scans = (recentScans || []) as Scan[];
  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const avgScore = scans.length > 0 ? Math.round(scans.reduce((a, s) => a + (s.ats_score || 0), 0) / scans.length) : null;
  const bestScore = scans.length > 0 ? Math.max(...scans.map((s) => s.ats_score || 0)) : null;

  const card = { background: "rgba(255,255,255,0.65)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: "14px", padding: "1.375rem", boxShadow: "0 8px 32px rgba(124,58,237,0.07), 0 2px 8px rgba(0,0,0,0.05)" } as React.CSSProperties;

  return (
    <div style={{ color: "#0f172a", fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.2rem" }}>Good to see you, {firstName}</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Here&apos;s your scan activity at a glance</p>
        </div>
        <Link href="/upload" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.6rem 1.125rem", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", boxShadow: "0 4px 12px rgba(124,58,237,0.2)" }}>
          + New Scan
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📊</div>
            <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.575rem", borderRadius: "100px", background: usage.plan === "free" ? "#f1f5f9" : "#f5f3ff", border: usage.plan === "free" ? "1px solid #e2e8f0" : "1px solid #ede9fe", color: usage.plan === "free" ? "#64748b" : "#7c3aed", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
              {getPlanDisplayName(usage.plan)}
            </span>
          </div>
          <p style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.2rem", lineHeight: 1 }}>
            {usage.plan === "free" ? usage.scans_limit - usage.scans_used : "∞"}
          </p>
          <p style={{ fontSize: "0.775rem", color: "#64748b" }}>Scans remaining</p>
          {usage.plan === "free" && (
            <div style={{ marginTop: "0.75rem" }}>
              <div style={{ height: "4px", borderRadius: "2px", background: "#f1f5f9", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${(usage.scans_used / usage.scans_limit) * 100}%`, background: usage.scans_used >= usage.scans_limit ? "#ef4444" : "#7c3aed" }} />
              </div>
              <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.3rem" }}>{usage.scans_used}/{usage.scans_limit} used</p>
            </div>
          )}
        </div>

        <div style={card}>
          <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", marginBottom: "0.875rem" }}>📄</div>
          <p style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.2rem", lineHeight: 1 }}>{scans.length}</p>
          <p style={{ fontSize: "0.775rem", color: "#64748b" }}>Total scans</p>
        </div>

        <div style={card}>
          <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", marginBottom: "0.875rem" }}>📈</div>
          <p style={{ fontSize: "1.9rem", fontWeight: 800, marginBottom: "0.2rem", lineHeight: 1, color: avgScore ? getScoreColor(avgScore) : "#e2e8f0" }}>
            {avgScore ?? "—"}
          </p>
          <p style={{ fontSize: "0.775rem", color: "#64748b" }}>
            Avg ATS score
            {bestScore && bestScore !== avgScore && <span style={{ color: "#94a3b8", marginLeft: "0.25rem" }}>· best {bestScore}</span>}
          </p>
        </div>
      </div>

      {/* Recent scans */}
      <div style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.8)", borderRadius: "14px", overflow: "hidden", marginBottom: "1.5rem", boxShadow: "0 8px 32px rgba(124,58,237,0.07), 0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.375rem", borderBottom: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>Recent Scans</h2>
          <Link href="/history" style={{ fontSize: "0.775rem", color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
        </div>

        {scans.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", border: "2px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem", fontSize: "1.25rem" }}>📄</div>
            <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a", marginBottom: "0.375rem" }}>No scans yet</p>
            <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1.125rem" }}>Upload your resume and a job description to get your first ATS score</p>
            <Link href="/upload" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.575rem 1rem", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", fontWeight: 700, fontSize: "0.8rem", textDecoration: "none" }}>
              Start first scan
            </Link>
          </div>
        ) : (
          <div>
            {scans.map((scan, i) => (
              <Link
                key={scan.id}
                href={`/results/${scan.id}`}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1.375rem", borderBottom: i < scans.length - 1 ? "1px solid #f8fafc" : "none", textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#f5f3ff", border: "1px solid #ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", flexShrink: 0 }}>📄</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {scan.job_title || scan.resume_filename || "Resume Scan"}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.1rem" }}>{formatDate(scan.created_at)}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                  {scan.ats_score !== null && (
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "1.1rem", fontWeight: 800, color: getScoreColor(scan.ats_score), lineHeight: 1 }}>{scan.ats_score}</p>
                      <p style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "0.1rem" }}>{getScoreLabel(scan.ats_score)}</p>
                    </div>
                  )}
                  <span style={{ color: "#d1d5db", fontSize: "0.875rem" }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade CTA */}
      {usage.plan === "free" && usage.scans_used >= 2 && (
        <div style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: "14px", padding: "1.375rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", boxShadow: "0 4px 16px rgba(124,58,237,0.2)" }}>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
              {usage.scans_used >= 3 ? "Limit reached" : "Running low"}
            </div>
            <p style={{ fontWeight: 700, fontSize: "0.975rem", color: "#fff", marginBottom: "0.2rem" }}>
              {usage.scans_used >= 3 ? "You've used all 3 free scans" : "Only 1 free scan remaining"}
            </p>
            <p style={{ fontSize: "0.825rem", color: "rgba(255,255,255,0.7)" }}>Upgrade to Professional for unlimited scans and full reports</p>
          </div>
          <Link href="/billing" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.6rem 1.125rem", borderRadius: "8px", background: "#fff", color: "#7c3aed", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none", flexShrink: 0 }}>
            Upgrade →
          </Link>
        </div>
      )}
    </div>
  );
}
