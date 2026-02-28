import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, Zap, Target, FileText, Download, Shield, TrendingUp } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { MagicOrbs } from "@/components/ui/magic-orbs";
import { MarqueeRow } from "@/components/ui/marquee-row";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { PricingSection } from "@/components/ui/pricing-section";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const COMPANY_LOGOS = [
  "Google", "Meta", "Stripe", "Amazon", "Airbnb",
  "Notion", "Linear", "Figma", "Shopify", "Netflix", "Apple", "Microsoft",
];

const TESTIMONIALS = [
  { name: "Sarah K.", role: "Software Engineer", company: "Google", quote: "ResumeOps showed me I was missing 14 keywords. Fixed it and landed 3 interviews in one week.", stars: 5 },
  { name: "Marcus T.", role: "Product Manager", company: "Meta", quote: "My score went from 42 to 87 after following the suggestions. The specificity of the feedback is unmatched.", stars: 5 },
  { name: "Priya M.", role: "Data Scientist", company: "Stripe", quote: "Three months of silence. Two weeks after fixing what ResumeOps flagged — I had two offers.", stars: 5 },
  { name: "James L.", role: "UX Designer", company: "Airbnb", quote: "The keyword gap analysis alone is worth it. I genuinely had no idea how ATS systems worked.", stars: 5 },
  { name: "Aisha B.", role: "Marketing Lead", company: "Notion", quote: "Went from 0 callbacks to 5 interviews in 3 weeks. The formatting feedback was eye-opening.", stars: 5 },
  { name: "Chen W.", role: "Backend Engineer", company: "Linear", quote: "Caught formatting issues that were silently killing my chances. Now at Linear!", stars: 5 },
  { name: "Elena R.", role: "Finance Analyst", company: "Amazon", quote: "The suggestions rewrote my bullet points in a way that sounds like me — but sharper.", stars: 5 },
  { name: "David O.", role: "DevOps Engineer", company: "Netflix", quote: "Score jumped 35 points in one session. Landed my dream role within a month.", stars: 5 },
  { name: "Fatima H.", role: "ML Engineer", company: "Apple", quote: "Every suggestion was actionable and specific to the job I was applying for. Love it.", stars: 5 },
  { name: "Ryan M.", role: "Full Stack Dev", company: "Shopify", quote: "The ATS score correlation with interview callbacks is very real. Don't skip this step.", stars: 5 },
  { name: "Nina P.", role: "Sales Manager", company: "Figma", quote: "Extremely detailed feedback. I understood exactly what to change and why.", stars: 5 },
  { name: "Alex T.", role: "Cloud Architect", company: "Microsoft", quote: "Best investment in my job search. Saved me weeks of guessing what was wrong.", stars: 5 },
];

function TestimonialCard({ name, role, company, quote, stars }: {
  name: string; role: string; company: string; quote: string; stars: number;
}) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  return (
    <div className="flex-shrink-0 w-[300px] glass-card rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight">{name}</p>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium whitespace-nowrap shrink-0">
          Now at {company}
        </span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-slate-600 text-xs leading-relaxed">&quot;{quote}&quot;</p>
    </div>
  );
}

export default function LandingPage() {
  const mid = Math.ceil(TESTIMONIALS.length / 2);
  const row1 = TESTIMONIALS.slice(0, mid);
  const row2 = TESTIMONIALS.slice(mid);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24 overflow-hidden">
        <MagicOrbs />
        <div className="dot-grid absolute inset-0 opacity-[0.35]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-sm font-medium mb-8 shadow-sm">
            <Zap className="w-3.5 h-3.5" />
            Trusted by 10,000+ job seekers worldwide
          </div>

          {/* Headline — fear to empowerment */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6">
            75% of resumes never reach{" "}
            <span className="gradient-text">a human reviewer.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            ResumeOps analyses your resume against the job description and shows you exactly what&apos;s holding you back — with specific fixes ready in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
            <ShimmerButton className="text-base py-3.5 px-8 shadow-xl shadow-violet-200/60">
              <Link href="/signup" className="flex items-center gap-2">
                Analyse My Resume Free <ArrowRight className="w-4 h-4" />
              </Link>
            </ShimmerButton>
            <Link
              href="/#features"
              className="flex items-center gap-2 text-slate-600 font-semibold hover:text-violet-700 transition-colors text-sm px-4 py-3.5"
            >
              See How It Works <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Floating mock score card */}
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-4 bg-gradient-to-br from-violet-200/40 to-cyan-200/40 rounded-3xl blur-2xl" />
            <div className="relative glass-card rounded-2xl p-6 shadow-2xl shadow-violet-200/30 border border-white/70 text-left">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">ATS Match Score</p>
                  <p className="text-4xl font-extrabold text-slate-900">
                    <NumberTicker value={84} duration={1800} />
                    <span className="text-lg font-normal text-slate-400 ml-1">/100</span>
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Keyword Match", pct: 78, color: "from-violet-500 to-indigo-500" },
                  { label: "Skills Alignment", pct: 85, color: "from-indigo-500 to-cyan-500" },
                  { label: "Formatting", pct: 92, color: "from-emerald-500 to-teal-500" },
                  { label: "Role Fit", pct: 71, color: "from-violet-500 to-purple-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                      <span className="font-medium">{item.label}</span>
                      <span className="font-semibold">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        style={{ width: `${item.pct}%`, transition: "width 2s cubic-bezier(0.4,0,0.2,1)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <p className="text-xs text-slate-500">Analysis complete — 3 critical improvements found</p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row justify-center gap-10 mt-16">
            {[
              { value: 75, suffix: "%", label: "filtered before human review" },
              { value: 6, suffix: "s", label: "average recruiter scan time" },
              { value: 3, suffix: "×", label: "more interviews after optimising" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold gradient-text">
                  <NumberTicker value={s.value} suffix={s.suffix} duration={2200} />
                </p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY TICKER ────────────────────────────────── */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/60">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
          Candidates who landed roles at
        </p>
        <MarqueeRow speed="slow">
          {COMPANY_LOGOS.map((logo) => (
            <div
              key={logo}
              className="flex-shrink-0 px-7 py-2.5 bg-white border border-slate-200/80 rounded-full text-slate-600 font-semibold text-sm shadow-sm"
            >
              {logo}
            </div>
          ))}
        </MarqueeRow>
      </section>

      {/* ── BENTO FEATURES ────────────────────────────────── */}
      <section id="features" className="py-28 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-violet-600 uppercase tracking-widest mb-3">What we analyse</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Every reason your resume<br />
            <span className="gradient-text">gets rejected — found.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            One upload. Five scoring dimensions. Specific, prioritised improvements.
          </p>
        </div>

        <BentoGrid>
          {/* ATS Score — 2-col 2-row */}
          <BentoCard colSpan={2} rowSpan={2} className="bg-gradient-to-br from-violet-600 to-indigo-700 border-0 justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant ATS Score</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                A precise 0–100 score across keyword match, skills, formatting, role fit, and experience — in under 30 seconds.
              </p>
            </div>
            <div className="flex items-end gap-3 mt-6">
              <span className="text-7xl font-extrabold text-white leading-none">84</span>
              <span className="text-white/50 text-2xl mb-2">/100</span>
            </div>
          </BentoCard>

          {/* Keyword Gap */}
          <BentoCard colSpan={2} className="justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-cyan-600" />
              </div>
              <h3 className="font-bold text-slate-900">Keyword Gap Analysis</h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">Matches your resume against the job description word-for-word.</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { kw: "Python", match: true }, { kw: "AWS", match: true }, { kw: "Docker", match: true },
                { kw: "Kubernetes", match: false }, { kw: "Terraform", match: false },
              ].map(({ kw, match }) => (
                <span
                  key={kw}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                    match
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {match ? "✓" : "✗"} {kw}
                </span>
              ))}
            </div>
          </BentoCard>

          {/* Section Review */}
          <BentoCard>
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Section Review</h3>
            <div className="space-y-2">
              {["Summary", "Experience", "Skills", "Education"].map((s) => (
                <div key={s} className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Suggestions */}
          <BentoCard colSpan={2}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
                <FileText className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <h3 className="font-bold text-slate-900">Improvement Suggestions</h3>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <p className="text-xs text-slate-400 font-medium mb-1.5 uppercase tracking-wide">Before</p>
              <p className="text-xs text-slate-600 line-through">&quot;Responsible for growing revenue&quot;</p>
              <p className="text-xs text-slate-400 font-medium mb-1.5 mt-3 uppercase tracking-wide">After</p>
              <p className="text-xs text-slate-800 font-medium">&quot;Drove $2.3M revenue uplift by leading 4 cross-functional teams across 3 regions.&quot;</p>
            </div>
          </BentoCard>

          {/* Format Check */}
          <BentoCard>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
              <Shield className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Format Check</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Checks fonts, columns, tables, graphics — everything that confuses ATS parsers.</p>
          </BentoCard>

          {/* Export */}
          <BentoCard className="items-center justify-center text-center">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
              <Download className="w-5 h-5 text-slate-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Export Report</h3>
            <p className="text-xs text-slate-400 mt-1">PDF & DOCX</p>
          </BentoCard>
        </BentoGrid>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
            {[
              { value: 75, suffix: "%", label: "of resumes filtered before a human reads them" },
              { value: 6, suffix: "s", label: "average time a recruiter spends on your resume" },
              { value: 3, suffix: "×", label: "more interviews reported after optimising" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-5xl font-extrabold text-white mb-2">
                  <NumberTicker value={s.value} suffix={s.suffix} duration={2000} />
                </p>
                <p className="text-white/75 text-sm leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="py-24 overflow-hidden bg-slate-50/50">
        <div className="text-center mb-12 px-4">
          <p className="text-sm font-bold text-violet-600 uppercase tracking-widest mb-3">Results</p>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-3">What job seekers are saying</h2>
          <p className="text-slate-500">Real outcomes. No cherry-picking.</p>
        </div>
        <div className="space-y-4">
          <MarqueeRow pauseOnHover>
            {row1.map((t) => <TestimonialCard key={t.name} {...t} />)}
          </MarqueeRow>
          <MarqueeRow reverse pauseOnHover>
            {row2.map((t) => <TestimonialCard key={t.name} {...t} />)}
          </MarqueeRow>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-violet-600 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Simple, transparent pricing</h2>
          <p className="text-slate-500">Start free. Upgrade only when you need more.</p>
        </div>
        <PricingSection mode="landing" />
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50/50">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative inline-block w-full">
            <div className="absolute -inset-1 bg-gradient-to-br from-violet-400/30 to-cyan-400/30 rounded-3xl blur-2xl" />
            <div className="relative glass-card rounded-3xl p-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                Find out what&apos;s holding your resume back
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Free analysis. No credit card. Under 30 seconds.
              </p>
              <ShimmerButton className="text-base py-3.5 px-10 shadow-xl shadow-violet-200/60">
                <Link href="/signup" className="flex items-center gap-2">
                  Start Free Analysis <ArrowRight className="w-4 h-4" />
                </Link>
              </ShimmerButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
