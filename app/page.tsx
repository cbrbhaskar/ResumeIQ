import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { PricingSection } from "@/components/ui/pricing-section";

const features = [
  { icon: "⚡", title: "Instant ATS Score", description: "Get a precise compatibility score in seconds. Understand exactly where you stand before submitting." },
  { icon: "🎯", title: "Keyword Gap Analysis", description: "Surface every keyword the job requires that your resume is missing — with context on why each one matters." },
  { icon: "🔍", title: "Section-by-Section Review", description: "Pinpoint the specific sections and sentences holding your score down, not just a vague overall rating." },
  { icon: "✍️", title: "Tailored Suggestions", description: "Receive concrete rewrites tied to your actual resume content — actionable, not generic advice." },
  { icon: "📋", title: "Format Compliance Check", description: "Identify structural issues that cause ATS parsers to misread or discard your resume before scoring." },
  { icon: "📤", title: "Export & Share", description: "Download your full report as PDF or DOCX to guide revisions or share with a mentor or coach." },
];

const testimonials = [
  { name: "Sarah Chen", role: "Software Engineer", company: "Now at Google", text: "I had applied to 40 roles with no response. ResumeIQ showed me I was missing 14 keywords the JD required. Fixed them in an hour — six interviews the next week.", initials: "SC" },
  { name: "Marcus Williams", role: "Product Manager", company: "Now at Stripe", text: "The keyword gap report completely changed how I write tailored applications. I went from ghosted to three offers in six weeks.", initials: "MW" },
  { name: "Priya Patel", role: "Data Scientist", company: "Now at Meta", text: "What I appreciated most was the section-level feedback. It told me exactly which bullet points to rewrite, not just that something was 'wrong'.", initials: "PP" },
  { name: "James O'Brien", role: "UX Designer", company: "Now at Figma", text: "My ATS score went from 41 to 89 in a single session. The prioritised action list made it clear where to spend my time first.", initials: "JO" },
  { name: "Aisha Johnson", role: "Marketing Director", company: "Now at HubSpot", text: "Three months of silence, then two weeks after fixing what ResumeIQ flagged — three offers. The format checker caught things I would never have noticed.", initials: "AJ" },
  { name: "David Park", role: "DevOps Engineer", company: "Now at AWS", text: "Straightforward, detailed, honest. The report doesn't sugarcoat — it tells you exactly what's working and what's costing you interviews.", initials: "DP" },
];

const companies = ["Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Stripe", "Figma", "Shopify", "Airbnb", "Uber", "LinkedIn"];


export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user ?? null;

  return (
    <div style={{ minHeight: "100vh", color: "#0f172a", fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="glass-panel" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "64px", display: "flex", alignItems: "center", padding: "0 2rem", justifyContent: "space-between", borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "15px" }}>R</div>
          <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0f172a", letterSpacing: "-0.01em" }}>ResumeIQ</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {user ? (
            <Link href="/dashboard" className="btn-glow" style={{ padding: "0.5rem 1.125rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>Dashboard →</Link>
          ) : (
            <>
              <Link href="/login" className="btn-outline-gradient" style={{ padding: "0.5rem 1.125rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>Sign In</Link>
              <Link href="/signup" className="btn-glow" style={{ padding: "0.5rem 1.125rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>Get Started Free</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: "120px", paddingBottom: "80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", position: "relative" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.875rem", borderRadius: "100px", border: "1px solid rgba(124,58,237,0.2)", background: "rgba(245,243,255,0.8)", fontSize: "0.8rem", color: "#7c3aed", fontWeight: 600, marginBottom: "1.75rem", backdropFilter: "blur(8px)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
            ATS Optimisation for Serious Job Seekers
          </div>

          <h1 style={{ fontSize: "clamp(2.25rem, 5.5vw, 4rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.25rem", maxWidth: "820px", margin: "0 auto 1.25rem" }}>
            Your resume is screened by software{" "}
            <span className="gradient-text">before any human reads it</span>
          </h1>

          <p style={{ fontSize: "1.1rem", color: "#64748b", maxWidth: "580px", lineHeight: 1.7, margin: "0 auto 2rem" }}>
            75% of applications are eliminated by Applicant Tracking Systems before a recruiter ever opens them. ResumeIQ shows you exactly why — and how to fix it.
          </p>

          <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            <Link href={user ? "/upload" : "/signup"} className="btn-glow" style={{ padding: "0.8rem 1.75rem", borderRadius: "9px", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem" }}>
              Analyse My Resume Free →
            </Link>
            {!user && (
              <Link href="/login" className="btn-outline-gradient" style={{ padding: "0.8rem 1.75rem", borderRadius: "9px", textDecoration: "none", fontWeight: 500, fontSize: "0.95rem" }}>
                Sign In
              </Link>
            )}
          </div>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>No card required · 3 free scans · Results in under 30 seconds</p>

          {/* Score preview card */}
          <div className="glass-card" style={{ marginTop: "3.5rem", maxWidth: "500px", margin: "3.5rem auto 0", padding: "1.75rem", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>ATS Compatibility Score</div>
                <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "#f97316", lineHeight: 1 }}>47<span style={{ fontSize: "1.25rem", color: "#94a3b8", fontWeight: 500 }}>/100</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Issues Found</div>
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  <span style={{ padding: "0.2rem 0.6rem", borderRadius: "6px", background: "#fef2f2", border: "1px solid #fecaca", fontSize: "0.72rem", color: "#dc2626", fontWeight: 600 }}>8 Critical</span>
                  <span style={{ padding: "0.2rem 0.6rem", borderRadius: "6px", background: "#fffbeb", border: "1px solid #fde68a", fontSize: "0.72rem", color: "#d97706", fontWeight: 600 }}>12 Warnings</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { label: "Keyword Match", value: 38, color: "#ef4444" },
                { label: "Format Score", value: 62, color: "#f59e0b" },
                { label: "Skills Alignment", value: 45, color: "#ef4444" },
                { label: "Readability", value: 71, color: "#7c3aed" },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748b", marginBottom: "0.3rem" }}>
                    <span>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 600 }}>{item.value}%</span>
                  </div>
                  <div style={{ height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.4)" }}>
                    <div style={{ height: "100%", borderRadius: "3px", width: `${item.value}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.6)", padding: "0.875rem 0", overflow: "hidden", background: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)" }}>
        <div className="animate-ticker" style={{ display: "flex", gap: "3rem", whiteSpace: "nowrap" }}>
          {[...companies, ...companies].map((c, i) => (
            <span key={i} style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 500, flexShrink: 0 }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section style={{ padding: "6rem 0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ display: "inline-block", padding: "0.3rem 0.875rem", borderRadius: "100px", border: "1px solid rgba(124,58,237,0.2)", background: "rgba(245,243,255,0.8)", fontSize: "0.78rem", color: "#7c3aed", fontWeight: 600, marginBottom: "1rem" }}>Features</div>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>Precision, not guesswork</h2>
            <p style={{ fontSize: "1rem", color: "#64748b", maxWidth: "520px", margin: "0 auto" }}>
              Every feature is built around one question: exactly why is this resume underperforming?
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {features.map((f) => (
              <div key={f.title} className="glass-card" style={{ padding: "1.5rem" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem", color: "#0f172a" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.65 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5, #06b6d4)", padding: "3rem 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.06)" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "center", position: "relative" }}>
          {[
            { value: "75%", label: "of resumes never reach a recruiter" },
            { value: "6 sec", label: "average recruiter time per resume" },
            { value: "3×", label: "more interviews with an optimised resume" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "#fff", marginBottom: "0.375rem" }}>{stat.value}</div>
              <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "6rem 0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.625rem" }}>Results that speak for themselves</h2>
            <p style={{ color: "#64748b", fontSize: "1rem" }}>Job seekers who used ResumeIQ to land their next role</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#7c3aed", flexShrink: 0 }}>{t.initials}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>{t.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{t.role} · {t.company}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1px" }}>
                    {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#f59e0b", fontSize: "0.75rem" }}>★</span>)}
                  </div>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.65 }}>&quot;{t.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "6rem 0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.625rem" }}>Straightforward pricing</h2>
            <p style={{ color: "#64748b", fontSize: "1rem" }}>Start free. No card required.</p>
          </div>
          <PricingSection mode="landing" />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <div className="glass-card" style={{ maxWidth: "640px", margin: "0 auto", padding: "3.5rem 2rem" }}>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.875rem" }}>
              Ready to find out what&apos;s holding your resume back?
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem", marginBottom: "1.75rem" }}>Analyse your resume free. No card. Results in 30 seconds.</p>
            <Link href={user ? "/upload" : "/signup"} className="btn-glow" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 2rem", borderRadius: "9px", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem" }}>
              Start Free Analysis →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.6)", padding: "1.75rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "12px" }}>R</div>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>ResumeIQ</span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy", "Terms", "Contact"].map((item) => (
            <span key={item} style={{ fontSize: "0.8rem", color: "#94a3b8", cursor: "pointer" }}>{item}</span>
          ))}
        </div>
        <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>© 2025 ResumeIQ</div>
      </footer>
    </div>
  );
}
