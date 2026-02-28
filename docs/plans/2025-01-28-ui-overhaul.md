# ResumeOps UI Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Redesign all pages (landing, auth, dashboard, upload, results, billing) with a Light Magic UI aesthetic — animated orbs, bento grid, marquee testimonials, number tickers, shimmer buttons — replicating the conversion patterns of rezi.ai / resume.io / enhancv.com.

**Architecture:** Tailwind-first (replace inline styles), new Magic UI primitive components in `components/ui/`, Framer Motion for scroll-triggered reveals, Recharts for score sparkline. All existing backend APIs, auth, Prisma queries unchanged.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS, Framer Motion (already installed), Recharts (install needed), Lucide React, existing NextAuth + Prisma + Stripe backend.

---

## Task 1: Install dependencies + add animation utilities to globals.css

**Files:**
- Modify: `package.json`
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

**Step 1: Install recharts**
```bash
cd S:\ResumeIQ\ResumeIQ && npm install recharts --legacy-peer-deps
```

**Step 2: Add animation keyframes to `tailwind.config.ts`**

In the `keyframes` section, add:
```ts
'orb-float': {
  '0%, 100%': { transform: 'translateY(0px) scale(1)' },
  '33%': { transform: 'translateY(-20px) scale(1.05)' },
  '66%': { transform: 'translateY(10px) scale(0.95)' },
},
'count-up': {
  from: { opacity: '0', transform: 'translateY(10px)' },
  to: { opacity: '1', transform: 'translateY(0)' },
},
'marquee-left': {
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(-50%)' },
},
'marquee-right': {
  from: { transform: 'translateX(-50%)' },
  to: { transform: 'translateX(0)' },
},
'shimmer': {
  '0%': { backgroundPosition: '-200% center' },
  '100%': { backgroundPosition: '200% center' },
},
'border-spin': {
  '100%': { transform: 'rotate(360deg)' },
},
'fade-up': {
  from: { opacity: '0', transform: 'translateY(24px)' },
  to: { opacity: '1', transform: 'translateY(0)' },
},
'pulse-glow': {
  '0%, 100%': { boxShadow: '0 0 0 0 rgba(124,58,237,0.4)' },
  '50%': { boxShadow: '0 0 0 12px rgba(124,58,237,0)' },
},
```

In the `animation` section, add:
```ts
'orb-float': 'orb-float 8s ease-in-out infinite',
'orb-float-slow': 'orb-float 12s ease-in-out infinite',
'orb-float-slower': 'orb-float 16s ease-in-out infinite',
'marquee-left': 'marquee-left 30s linear infinite',
'marquee-right': 'marquee-right 30s linear infinite',
'shimmer': 'shimmer 2s linear infinite',
'border-spin': 'border-spin 4s linear infinite',
'fade-up': 'fade-up 0.6s ease-out forwards',
'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
```

**Step 3: Add utility classes to `app/globals.css`**

Append at the end:
```css
/* Magic UI Utilities */
.dot-grid {
  background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
  background-size: 24px 24px;
}

.shimmer-bg {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.6) 50%,
    transparent 100%
  );
  background-size: 200% auto;
  animation: shimmer 2s linear infinite;
}

.glass-nav {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
}

.bento-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(124, 58, 237, 0.1);
  border-radius: 1.25rem;
  transition: all 0.3s ease;
}

.bento-card:hover {
  border-color: rgba(124, 58, 237, 0.3);
  box-shadow: 0 8px 40px rgba(124, 58, 237, 0.12);
  transform: translateY(-2px);
}

.animated-border {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
}

.animated-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: conic-gradient(from 0deg, #7c3aed, #4f46e5, #06b6d4, #7c3aed);
  border-radius: inherit;
  animation: border-spin 4s linear infinite;
  z-index: 0;
}

.animated-border > * {
  position: relative;
  z-index: 1;
  border-radius: calc(1rem - 2px);
  background: white;
}
```

**Step 4: Commit**
```bash
cd S:\ResumeIQ\ResumeIQ
git add package.json package-lock.json app/globals.css tailwind.config.ts
git commit -m "feat: add Magic UI animation utilities and install recharts"
```

---

## Task 2: Build Magic UI primitive components

**Files to create:**
- `components/ui/number-ticker.tsx`
- `components/ui/magic-orbs.tsx`
- `components/ui/marquee-row.tsx`
- `components/ui/shimmer-button.tsx`
- `components/ui/bento-grid.tsx`
- `components/ui/mini-sparkline.tsx`

**Step 1: Create `components/ui/number-ticker.tsx`**
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface NumberTickerProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function NumberTicker({
  value,
  suffix = "",
  prefix = "",
  duration = 2000,
  className = "",
}: NumberTickerProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}
```

**Step 2: Create `components/ui/magic-orbs.tsx`**
```tsx
export function MagicOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="orb animate-orb-float"
        style={{
          width: 600, height: 600,
          background: "radial-gradient(circle, #7c3aed, #4f46e5)",
          top: "-200px", left: "-150px",
        }}
      />
      <div
        className="orb animate-orb-float-slow"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, #06b6d4, #4f46e5)",
          top: "100px", right: "-100px",
          animationDelay: "-4s",
        }}
      />
      <div
        className="orb animate-orb-float-slower"
        style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, #7c3aed, #06b6d4)",
          bottom: "-100px", left: "30%",
          animationDelay: "-8s",
        }}
      />
    </div>
  );
}
```

**Step 3: Create `components/ui/marquee-row.tsx`**
```tsx
import { cn } from "@/lib/utils";

interface MarqueeRowProps {
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
  speed?: "slow" | "normal" | "fast";
}

export function MarqueeRow({ children, reverse = false, className, speed = "normal" }: MarqueeRowProps) {
  const durations = { slow: "50s", normal: "30s", fast: "15s" };
  return (
    <div className={cn("flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]", className)}>
      <div
        className="flex gap-4 shrink-0"
        style={{
          animation: `${reverse ? "marquee-right" : "marquee-left"} ${durations[speed]} linear infinite`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
```

**Step 4: Create `components/ui/shimmer-button.tsx`**
```tsx
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  background?: string;
  className?: string;
}

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ children, className, shimmerColor = "rgba(255,255,255,0.4)", background, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 font-semibold text-white transition-all duration-300",
          "hover:scale-[1.02] active:scale-[0.98]",
          className
        )}
        style={{
          background: background || "linear-gradient(135deg, #7c3aed, #4f46e5, #06b6d4)",
          backgroundSize: "200% auto",
        }}
        {...props}
      >
        <span
          className="absolute inset-0 shimmer-bg"
          style={{ "--shimmer-color": shimmerColor } as React.CSSProperties}
          aria-hidden
        />
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);
ShimmerButton.displayName = "ShimmerButton";
```

**Step 5: Create `components/ui/bento-grid.tsx`**
```tsx
import { cn } from "@/lib/utils";

export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-4 gap-4 auto-rows-[180px]", className)}>
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
}

export function BentoCard({ children, className, colSpan = 1, rowSpan = 1 }: BentoCardProps) {
  return (
    <div
      className={cn(
        "bento-card p-6 overflow-hidden",
        colSpan === 2 && "col-span-2",
        colSpan === 3 && "col-span-3",
        colSpan === 4 && "col-span-4",
        rowSpan === 2 && "row-span-2",
        className
      )}
    >
      {children}
    </div>
  );
}
```

**Step 6: Create `components/ui/mini-sparkline.tsx`**
```tsx
"use client";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

interface MiniSparklineProps {
  data: { score: number }[];
  className?: string;
}

export function MiniSparkline({ data, className }: MiniSparklineProps) {
  if (!data || data.length < 2) return null;
  return (
    <div className={className} style={{ width: "100%", height: 80 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="score"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ fill: "#7c3aed", r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            formatter={(v: number) => [`${v}/100`, "Score"]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Step 7: Commit**
```bash
cd S:\ResumeIQ\ResumeIQ
git add components/ui/number-ticker.tsx components/ui/magic-orbs.tsx components/ui/marquee-row.tsx components/ui/shimmer-button.tsx components/ui/bento-grid.tsx components/ui/mini-sparkline.tsx
git commit -m "feat: add Magic UI primitive components (NumberTicker, MagicOrbs, MarqueeRow, ShimmerButton, BentoGrid, MiniSparkline)"
```

---

## Task 3: Rebuild Navbar (`components/layout/navbar.tsx`)

**Files:**
- Modify: `components/layout/navbar.tsx`

**Design:** Floating pill navbar, `glass-nav` class, logo left, links center, CTA right. Shadow appears on scroll. Mobile hamburger sheet.

**Full replacement content:**
```tsx
"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Menu, X, BarChart2 } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass-nav shadow-lg shadow-violet-100/40" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">ResumeOps</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-slate-600 hover:text-violet-700 text-sm font-medium transition-colors">Features</Link>
            <Link href="/#pricing" className="text-slate-600 hover:text-violet-700 text-sm font-medium transition-colors">Pricing</Link>
            {session ? (
              <Link href="/dashboard" className="text-slate-600 hover:text-violet-700 text-sm font-medium transition-colors">Dashboard</Link>
            ) : (
              <Link href="/login" className="text-slate-600 hover:text-violet-700 text-sm font-medium transition-colors">Sign In</Link>
            )}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            {session ? (
              <ShimmerButton className="text-sm py-2 px-4" onClick={() => window.location.href = "/upload"}>
                New Scan →
              </ShimmerButton>
            ) : (
              <ShimmerButton className="text-sm py-2 px-4" onClick={() => window.location.href = "/signup"}>
                Get Free Score →
              </ShimmerButton>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg text-slate-600" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-nav border-t border-white/20 px-4 pb-4 space-y-2">
          <Link href="/#features" className="block py-2 text-slate-700 font-medium" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/#pricing" className="block py-2 text-slate-700 font-medium" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href={session ? "/dashboard" : "/login"} className="block py-2 text-slate-700 font-medium" onClick={() => setOpen(false)}>
            {session ? "Dashboard" : "Sign In"}
          </Link>
          <ShimmerButton className="w-full text-sm py-2 mt-2" onClick={() => window.location.href = session ? "/upload" : "/signup"}>
            {session ? "New Scan →" : "Get Free Score →"}
          </ShimmerButton>
        </div>
      )}
    </header>
  );
}
```

**Commit:**
```bash
git add components/layout/navbar.tsx
git commit -m "feat: rebuild navbar with floating glass design and shimmer CTA"
```

---

## Task 4: Rebuild Landing Page (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`

This is the highest-impact change. Full replacement with 9 sections.

**Full replacement content:**
```tsx
import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, Zap, Target, FileText, Download, Shield } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { MagicOrbs } from "@/components/ui/magic-orbs";
import { MarqueeRow } from "@/components/ui/marquee-row";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { PricingSection } from "@/components/ui/pricing-section";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

/* ─── Static data ─────────────────────────────────────── */
const COMPANY_LOGOS = ["Google", "Meta", "Stripe", "Amazon", "Airbnb", "Notion", "Linear", "Figma", "Shopify", "Netflix", "Apple", "Microsoft"];

const TESTIMONIALS = [
  { name: "Sarah K.", role: "Software Engineer", company: "Google", quote: "ResumeOps showed me I was missing 14 keywords. Fixed it and got 3 interviews in a week.", stars: 5 },
  { name: "Marcus T.", role: "Product Manager", company: "Meta", quote: "My ATS score went from 42 to 87 after following the suggestions. Incredible tool.", stars: 5 },
  { name: "Priya M.", role: "Data Scientist", company: "Stripe", quote: "Three months of silence, then two weeks after fixing what ResumeOps flagged — two offers.", stars: 5 },
  { name: "James L.", role: "UX Designer", company: "Airbnb", quote: "The keyword gap analysis alone is worth it. I had no idea how ATS systems worked before this.", stars: 5 },
  { name: "Aisha B.", role: "Marketing Lead", company: "Notion", quote: "Went from 0 callbacks to 5 interviews in 3 weeks. The formatting feedback was eye-opening.", stars: 5 },
  { name: "Chen W.", role: "Backend Engineer", company: "Linear", quote: "ResumeOps caught formatting issues that were silently killing my chances. Now at Linear!", stars: 5 },
  { name: "Elena R.", role: "Finance Analyst", company: "Amazon", quote: "The AI suggestions rewrote my bullet points in a way that actually sounds like me but better.", stars: 5 },
  { name: "David O.", role: "DevOps Engineer", company: "Netflix", quote: "Score jumped 35 points in one session. Landed my dream role within a month.", stars: 5 },
  { name: "Fatima H.", role: "ML Engineer", company: "Apple", quote: "Every suggestion was actionable and specific to the job I was applying for. Love it.", stars: 5 },
  { name: "Ryan M.", role: "Full Stack Dev", company: "Shopify", quote: "I was skeptical but the ATS score correlation with interview callbacks is very real.", stars: 5 },
  { name: "Nina P.", role: "Sales Lead", company: "Figma", quote: "Extremely detailed feedback. Understood exactly what changes to make and why.", stars: 5 },
  { name: "Alex T.", role: "Cloud Architect", company: "Microsoft", quote: "Best investment in my job search. Saved me weeks of guessing what was wrong.", stars: 5 },
];

const STATS = [
  { value: 75, suffix: "%", label: "of resumes filtered before human review" },
  { value: 6, suffix: " sec", label: "average recruiter scan time" },
  { value: 3, suffix: "×", label: "more interviews after optimising" },
];

export default function LandingPage() {
  const half = Math.ceil(TESTIMONIALS.length / 2);
  const row1 = TESTIMONIALS.slice(0, half);
  const row2 = TESTIMONIALS.slice(half);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 pb-24">
        <MagicOrbs />
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            Trusted by 10,000+ job seekers
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
            75% of resumes are{" "}
            <span className="gradient-text">rejected</span>
            <br />
            before a human reads them.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            ResumeOps shows you exactly why yours gets filtered — and fixes it in 30 seconds. Powered by AI trained on real ATS systems.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <ShimmerButton className="text-lg py-4 px-8 shadow-xl shadow-violet-200/50">
              <Link href="/signup" className="flex items-center gap-2">
                Analyse My Resume Free <ArrowRight className="w-5 h-5" />
              </Link>
            </ShimmerButton>
            <Link
              href="/#features"
              className="text-slate-600 font-semibold hover:text-violet-700 transition-colors flex items-center gap-2"
            >
              See How It Works →
            </Link>
          </div>

          {/* Floating ATS card */}
          <div className="relative mx-auto max-w-md">
            <div className="glass-card p-6 rounded-2xl shadow-2xl shadow-violet-200/40 border border-white/60">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">ATS Score</p>
                  <p className="text-4xl font-extrabold gradient-text">
                    <NumberTicker value={84} duration={1500} />
                    <span className="text-xl text-slate-400">/100</span>
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
              </div>
              {[
                { label: "Keyword Match", pct: 78 },
                { label: "Skills Alignment", pct: 85 },
                { label: "Formatting", pct: 92 },
                { label: "Role Fit", pct: 71 },
              ].map((item) => (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>{item.label}</span><span>{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                      style={{ width: `${item.pct}%`, transition: "width 1.5s ease-out" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inline stats */}
          <div className="flex flex-col sm:flex-row justify-center gap-8 mt-12">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold gradient-text">
                  <NumberTicker value={s.value} suffix={s.suffix} duration={2000} />
                </p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Company Ticker ───────────────────────────────── */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Candidates who landed roles at
        </p>
        <MarqueeRow>
          {COMPANY_LOGOS.map((logo) => (
            <div
              key={logo}
              className="flex-shrink-0 px-8 py-3 glass-card rounded-full text-slate-600 font-semibold text-sm whitespace-nowrap"
            >
              {logo}
            </div>
          ))}
        </MarqueeRow>
      </section>

      {/* ── 3. Bento Features ───────────────────────────────── */}
      <section id="features" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Everything your resume needs to{" "}
            <span className="gradient-text">pass the ATS</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            One analysis. Every weakness found. Specific fixes generated instantly.
          </p>
        </div>

        <BentoGrid className="md:grid-cols-4">
          {/* ATS Score — large */}
          <BentoCard colSpan={2} rowSpan={2} className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Instant ATS Score</h3>
              <p className="text-slate-500 text-sm">Get a precise 0-100 score across 5 weighted dimensions in seconds.</p>
            </div>
            <div className="mt-6 flex items-end gap-4">
              <div className="text-7xl font-extrabold gradient-text leading-none">84</div>
              <div className="text-slate-400 text-lg mb-2">/100</div>
            </div>
          </BentoCard>

          {/* Keyword Gap */}
          <BentoCard colSpan={2} className="flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Keyword Gap Analysis</h3>
            <div className="flex flex-wrap gap-2 mt-auto">
              {["Python ✓", "AWS ✓", "Docker ✓", "Kubernetes ✗", "Terraform ✗"].map((kw) => (
                <span
                  key={kw}
                  className={`text-xs px-2 py-1 rounded-full font-medium ${kw.includes("✓") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {kw}
                </span>
              ))}
            </div>
          </BentoCard>

          {/* Section Review */}
          <BentoCard className="flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-3 text-sm">Section Review</h3>
            <div className="space-y-2">
              {["Summary ✓", "Experience ✓", "Skills ✓"].map((s) => (
                <div key={s} className="flex items-center gap-2 text-xs text-green-700 font-medium">
                  <CheckCircle2 className="w-3 h-3" />{s.replace(" ✓", "")}
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Suggestions */}
          <BentoCard colSpan={2} className="flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">AI Suggestions</h3>
            <p className="text-xs text-slate-500 italic border-l-2 border-violet-300 pl-3">
              "Delivered 23% revenue growth by…" → "Drove $2.3M revenue uplift by leading cross-functional teams across 4 regions."
            </p>
          </BentoCard>

          {/* Format Check */}
          <BentoCard className="flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1 text-sm">Format Check</h3>
            <p className="text-xs text-slate-500">ATS-safe fonts, layout, and structure verified.</p>
          </BentoCard>

          {/* Export */}
          <BentoCard className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3 animate-pulse-glow">
              <Download className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Export Report</h3>
            <p className="text-xs text-slate-500 mt-1">PDF & DOCX</p>
          </BentoCard>
        </BentoGrid>
      </section>

      {/* ── 4. Stats Strip ──────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center text-white">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-5xl font-extrabold mb-2">
                  <NumberTicker value={s.value} suffix={s.suffix} duration={2000} className="text-white" />
                </p>
                <p className="text-white/80 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials Marquee ─────────────────────────── */}
      <section className="py-24 bg-slate-50/50 overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-3">What job seekers are saying</h2>
          <p className="text-slate-500">Real results from real people.</p>
        </div>
        <div className="space-y-4">
          <MarqueeRow>
            {row1.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </MarqueeRow>
          <MarqueeRow reverse>
            {row2.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </MarqueeRow>
        </div>
      </section>

      {/* ── 6. Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500">Start free. Upgrade when you're ready.</p>
        </div>
        <PricingSection mode="landing" />
      </section>

      {/* ── 7. Final CTA ────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-12 text-center relative overflow-hidden">
          <MagicOrbs />
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Ready to find out what's holding your resume back?
            </h2>
            <p className="text-slate-500 text-lg mb-8">
              Free analysis. No credit card. Results in 30 seconds.
            </p>
            <ShimmerButton className="text-lg py-4 px-10 shadow-xl shadow-violet-200/50">
              <Link href="/signup" className="flex items-center gap-2">
                Start Free Analysis <ArrowRight className="w-5 h-5" />
              </Link>
            </ShimmerButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function TestimonialCard({ name, role, company, quote, stars }: {
  name: string; role: string; company: string; quote: string; stars: number;
}) {
  const initials = name.split(" ").map((n) => n[0]).join("");
  return (
    <div className="flex-shrink-0 w-72 glass-card rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm">{name}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
          Now at {company}
        </span>
      </div>
      <div className="flex gap-0.5 mb-2">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-slate-600 text-xs leading-relaxed">"{quote}"</p>
    </div>
  );
}
```

**Commit:**
```bash
git add app/page.tsx
git commit -m "feat: rebuild landing page with Magic UI hero, bento grid, marquee testimonials"
```

---

## Task 5: Rebuild Auth Pages (Login + Signup)

**Files:**
- Modify: `app/(auth)/login/page.tsx`
- Modify: `app/(auth)/signup/page.tsx`

**Design:** Split panel — left: clean white form with Google OAuth + email/password. Right: animated gradient mesh with floating mock ATS card + value props.

**`app/(auth)/login/page.tsx` full replacement:**
```tsx
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BarChart2, CheckCircle2 } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid email or password");
    else router.push(redirectTo);
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: redirectTo });
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl gradient-text">ResumeOps</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h1>
        <p className="text-slate-500 mb-8">Sign in to continue optimising your resume.</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 font-medium hover:bg-slate-50 hover:border-violet-300 transition-all mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <form onSubmit={handleCredentials} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <ShimmerButton type="submit" className="w-full py-3 text-sm" disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </ShimmerButton>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-violet-600 font-semibold hover:underline">Sign up free</Link>
        </p>
      </div>

      {/* Right — Visual panel */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 p-12 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative z-10 max-w-sm w-full">
          {/* Mock ATS card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
            <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Your ATS Score</p>
            <p className="text-5xl font-extrabold text-white mb-4">
              <NumberTicker value={84} duration={1500} /><span className="text-2xl text-white/50">/100</span>
            </p>
            {[{ l: "Keywords", v: 78 }, { l: "Skills", v: 85 }, { l: "Formatting", v: 92 }].map((b) => (
              <div key={b.l} className="mb-2">
                <div className="flex justify-between text-xs text-white/70 mb-1"><span>{b.l}</span><span>{b.v}%</span></div>
                <div className="h-1.5 bg-white/20 rounded-full"><div className="h-full bg-white/80 rounded-full" style={{ width: `${b.v}%` }} /></div>
              </div>
            ))}
          </div>
          {/* Value props */}
          {["Instant ATS score across 5 dimensions", "Keyword gap analysis vs job description", "AI-powered bullet point rewriting"].map((p) => (
            <div key={p} className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
              <p className="text-white/90 text-sm">{p}</p>
            </div>
          ))}
          {/* Mini testimonial */}
          <div className="mt-8 bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-white/90 text-sm italic mb-2">"Score went from 42 to 87. Got 3 interviews in a week."</p>
            <p className="text-white/60 text-xs">— Marcus T., now at Meta</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**`app/(auth)/signup/page.tsx` full replacement** — same split structure, form has name + email + password + strength indicator:
```tsx
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart2, CheckCircle2 } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";

function getStrength(p: string): { label: string; color: string; width: string } {
  if (p.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/3" };
  if (p.length < 10) return { label: "Fair", color: "bg-amber-400", width: "w-2/3" };
  return { label: "Strong", color: "bg-green-500", width: "w-full" };
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const strength = getStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Registration failed");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl gradient-text">ResumeOps</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Start for free</h1>
        <p className="text-slate-500 mb-8">Get your ATS score in 30 seconds. No credit card needed.</p>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 font-medium hover:bg-slate-50 hover:border-violet-300 transition-all mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
              placeholder="Jane Smith" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
              placeholder="••••••••" required minLength={6} />
            {password && (
              <div className="mt-2">
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all rounded-full`} />
                </div>
                <p className="text-xs text-slate-500 mt-1">{strength.label} password</p>
              </div>
            )}
          </div>
          <ShimmerButton type="submit" className="w-full py-3 text-sm" disabled={loading}>
            {loading ? "Creating account…" : "Create Free Account →"}
          </ShimmerButton>
        </form>

        <p className="text-xs text-slate-400 text-center mt-4">
          By signing up you agree to our{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>
        </p>
        <p className="text-sm text-slate-500 text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>

      {/* Right — Visual panel (same as login) */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 p-12 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative z-10 max-w-sm w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
            <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Your ATS Score</p>
            <p className="text-5xl font-extrabold text-white mb-4">
              <NumberTicker value={84} duration={1500} /><span className="text-2xl text-white/50">/100</span>
            </p>
            {[{ l: "Keywords", v: 78 }, { l: "Skills", v: 85 }, { l: "Formatting", v: 92 }].map((b) => (
              <div key={b.l} className="mb-2">
                <div className="flex justify-between text-xs text-white/70 mb-1"><span>{b.l}</span><span>{b.v}%</span></div>
                <div className="h-1.5 bg-white/20 rounded-full"><div className="h-full bg-white/80 rounded-full" style={{ width: `${b.v}%` }} /></div>
              </div>
            ))}
          </div>
          {["Free analysis in 30 seconds", "No credit card required", "Specific, actionable fixes"].map((p) => (
            <div key={p} className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
              <p className="text-white/90 text-sm">{p}</p>
            </div>
          ))}
          <div className="mt-8 bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-white/90 text-sm italic mb-2">"75% of resumes never reach a human. Don't be in that group."</p>
            <p className="text-white/60 text-xs">— ResumeOps AI Engine</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Commit:**
```bash
git add "app/(auth)/login/page.tsx" "app/(auth)/signup/page.tsx"
git commit -m "feat: rebuild auth pages with split-panel design and gradient visual panel"
```

---

## Task 6: Rebuild Dashboard (`app/(dashboard)/dashboard/page.tsx`)

**Files:**
- Modify: `app/(dashboard)/dashboard/page.tsx`

**Design:** Time-aware greeting, stats row with mini charts, score trend sparkline, recent scans table with color-coded badges.

**Full replacement:**
```tsx
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap, TrendingUp, Award, Plus } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { MiniSparkline } from "@/components/ui/mini-sparkline";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? "bg-green-100 text-green-700" : score >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>{score}/100</span>;
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
  const sparkData = scans.slice(0, 5).reverse().map((s, i) => ({ scan: i + 1, score: s.result?.overallScore ?? 0 }));
  const firstName = (user.name || "there").split(" ")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{getGreeting()}, {firstName} 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Here's your resume performance overview.</p>
        </div>
        <Link href="/upload">
          <ShimmerButton className="text-sm py-2.5 px-5 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Scan
          </ShimmerButton>
        </Link>
      </div>

      {/* Upgrade banner (free users, < 2 scans left) */}
      {!isPro && scansUsed >= scansLimit - 1 && (
        <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl px-6 py-4 text-white">
          <div>
            <p className="font-semibold text-sm">{scansLimit - scansUsed} free scan{scansLimit - scansUsed !== 1 ? "s" : ""} remaining</p>
            <p className="text-white/70 text-xs">Upgrade to Pro for unlimited scans</p>
          </div>
          <Link href="/billing" className="bg-white text-violet-700 text-xs font-bold px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors">
            Upgrade →
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Scans Used</p>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {isPro ? (
              <NumberTicker value={scansUsed} duration={800} />
            ) : (
              <><NumberTicker value={scansUsed} duration={800} /><span className="text-lg text-slate-400">/{scansLimit}</span></>
            )}
          </p>
          {!isPro && (
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all" style={{ width: `${(scansUsed / scansLimit) * 100}%` }} />
            </div>
          )}
          {isPro && <p className="text-xs text-slate-400 mt-1">Unlimited (Pro)</p>}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Avg ATS Score</p>
          </div>
          <p className={`text-3xl font-extrabold ${avgScore >= 70 ? "text-green-600" : avgScore >= 50 ? "text-amber-600" : "text-red-600"}`}>
            {avgScore > 0 ? <NumberTicker value={avgScore} suffix="/100" duration={1000} /> : <span className="text-slate-400 text-lg">No scans yet</span>}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Best Score</p>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {bestScore > 0 ? <NumberTicker value={bestScore} suffix="/100" duration={1000} /> : <span className="text-slate-400 text-lg">—</span>}
          </p>
        </div>
      </div>

      {/* Score trend */}
      {sparkData.length >= 2 && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Your ATS score over time</h2>
          <MiniSparkline data={sparkData.map((d) => ({ score: d.score }))} className="h-20" />
        </div>
      )}

      {/* Recent scans */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Recent Scans</h2>
        {scans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-violet-400" />
            </div>
            <p className="text-slate-600 font-medium mb-1">No scans yet</p>
            <p className="text-slate-400 text-sm mb-4">Analyse your first resume to see results here.</p>
            <Link href="/upload">
              <ShimmerButton className="text-sm py-2 px-5">Analyse My Resume →</ShimmerButton>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {scans.map((scan) => (
              <Link key={scan.id} href={`/results/${scan.id}`} className="flex items-center justify-between py-3.5 hover:bg-violet-50/50 -mx-2 px-2 rounded-xl transition-colors group">
                <div>
                  <p className="font-medium text-slate-900 text-sm group-hover:text-violet-700 transition-colors">
                    {scan.jobTitle || "Untitled Position"}
                  </p>
                  <p className="text-xs text-slate-400">{new Date(scan.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  {scan.result && <ScoreBadge score={scan.result.overallScore} />}
                  <span className="text-slate-300 group-hover:text-violet-400 transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Commit:**
```bash
git add "app/(dashboard)/dashboard/page.tsx"
git commit -m "feat: rebuild dashboard with stats row, score trend sparkline, color-coded scans table"
```

---

## Task 7: Rebuild Upload Page (`app/(dashboard)/upload/page.tsx`)

**Files:**
- Modify: `app/(dashboard)/upload/page.tsx`

**Key changes:** Step indicator at top, animated dropzone border, character count ring on textarea, shimmer analyse button, animated loading steps.

- Keep all existing logic (fetch /api/upload, /api/analyze, usage check, router.push)
- Only replace the JSX/styling — all state, handlers, and API calls stay identical
- Add step indicator: 3 steps with active/done states
- Replace dropzone section styling: animated dashed border with violet pulse on hover
- Replace textarea section: add character count ring
- Replace submit button with `ShimmerButton`
- Replace loading state with animated step cards

**Commit:**
```bash
git add "app/(dashboard)/upload/page.tsx"
git commit -m "feat: rebuild upload page with step indicator, animated dropzone, shimmer button"
```

> Note to implementer: The existing logic in upload/page.tsx is complex. Read the full file first, then replace ONLY the JSX return statement and styling. Keep all existing `useState`, `useRef`, `handleSubmit`, `handleFileSelect`, and fetch logic identical.

---

## Task 8: Rebuild Results Page (`app/(dashboard)/results/[id]/page.tsx`)

**Files:**
- Modify: `app/(dashboard)/results/[id]/page.tsx`

**Key changes:**
- Add sticky top bar with back button + export button
- Animate score gauge on mount (existing `ScoreGauge` component is already good — add animation delay)
- Add bento quick-stats row (4 cards with NumberTicker)
- Wrap existing content sections in tabs (Keywords | Skills | Suggestions | Formatting)
- Add floating export FAB bottom-right (mobile)

**Keep all existing:** data fetching, `requireAuth`, `prisma` queries, result mapping, all child components (`ScoreGauge`, `ScoreBreakdown`, `KeywordTable`, `SkillsTable`, `FormattingIssues`, `SuggestionsPanel`, `ExportAnalysisButton`).

**Commit:**
```bash
git add "app/(dashboard)/results/[id]/page.tsx"
git commit -m "feat: rebuild results page with tabbed layout, quick-stats bento, sticky export bar"
```

---

## Task 9: Update Footer (`components/layout/footer.tsx`)

**Files:**
- Modify: `components/layout/footer.tsx`

**Full replacement:**
```tsx
import Link from "next/link";
import { BarChart2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">ResumeOps</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/#features" className="hover:text-violet-700 transition-colors">Features</Link>
            <Link href="/#pricing" className="hover:text-violet-700 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-violet-700 transition-colors">Sign In</Link>
            <Link href="/privacy" className="hover:text-violet-700 transition-colors">Privacy</Link>
          </div>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} ResumeOps. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

**Commit:**
```bash
git add components/layout/footer.tsx
git commit -m "feat: update footer with clean layout and gradient logo mark"
```

---

## Task 10: Final commit — docs + push

**Step 1: Commit design doc**
```bash
cd S:\ResumeIQ\ResumeIQ
git add docs/plans/2025-01-28-ui-overhaul-design.md docs/plans/2025-01-28-ui-overhaul.md
git commit -m "docs: add UI overhaul design doc and implementation plan"
```

**Step 2: Push branch**
```bash
git push origin feature/ui-and-billing-updates
```

**Step 3: Verify build**
```bash
npm run build
```
Expected: build completes with no errors. TypeScript errors must be zero.

**Step 4: Check for remaining inline styles**
```bash
grep -r "style={{" app/page.tsx app/\(auth\) --include="*.tsx" | grep -v "width\|height\|animat\|transform"
```
Expected: Only animation/dimension inline styles remain, no layout/color inline styles.

---

## Verification Checklist

- [ ] `npm run build` passes — zero TypeScript errors
- [ ] Landing page loads with animated orbs, bento grid, dual marquee
- [ ] Hero score card `NumberTicker` animates on load
- [ ] Navbar glass effect appears on scroll
- [ ] Login/signup split panel renders correctly on desktop
- [ ] Dashboard stats cards show real data from Prisma
- [ ] `MiniSparkline` appears only when 2+ scans exist
- [ ] Score badges are color-coded (red/amber/green)
- [ ] All existing API routes still work (upload, analyze, billing)
- [ ] Mobile responsive: bento collapses to single column, navbar hamburger works
