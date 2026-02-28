"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart2, CheckCircle2, ArrowRight } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function getStrength(p: string): { label: string; color: string; pct: number } {
  if (p.length === 0) return { label: "", color: "", pct: 0 };
  if (p.length < 6) return { label: "Weak", color: "bg-red-400", pct: 33 };
  if (p.length < 10 || !/[^a-zA-Z0-9]/.test(p)) return { label: "Fair", color: "bg-amber-400", pct: 66 };
  return { label: "Strong", color: "bg-emerald-500", pct: 100 };
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
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Something went wrong. Please try again.");
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
      {/* ── Left: Form ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-28 bg-white">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">
              Resume<span className="gradient-text">Ops</span>
            </span>
          </Link>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-1.5">Start for free</h1>
          <p className="text-slate-500 mb-8">Get your ATS score in 30 seconds. No credit card needed.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2.5 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 text-sm font-semibold hover:border-violet-300 hover:bg-violet-50/50 active:scale-[0.99] transition-all duration-150 mb-5"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or with email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Smith"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-100 transition-all"
              />
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">{strength.label} password</p>
                </div>
              )}
            </div>
            <ShimmerButton type="submit" className="w-full py-3 justify-center text-sm" disabled={loading}>
              {loading ? "Creating account…" : <><span>Create Free Account</span><ArrowRight className="w-4 h-4" /></>}
            </ShimmerButton>
          </form>

          <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
            By signing up you agree to our{" "}
            <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>
          </p>
          <p className="text-sm text-slate-500 text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* ── Right: Visual ──────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-center items-center flex-1 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-600 p-14 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-[0.15]" />
        <div className="relative z-10 max-w-sm w-full space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">ATS Match Score</p>
            <p className="text-5xl font-extrabold text-white mb-5">
              <NumberTicker value={84} duration={1600} />
              <span className="text-xl text-white/40 font-normal"> /100</span>
            </p>
            {[
              { l: "Keyword Match", v: 78 },
              { l: "Skills Alignment", v: 85 },
              { l: "Formatting", v: 92 },
            ].map((b) => (
              <div key={b.l} className="mb-2.5">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>{b.l}</span><span className="font-semibold">{b.v}%</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/80 rounded-full" style={{ width: `${b.v}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[
              "Free analysis — no credit card required",
              "Results in under 30 seconds",
              "Specific improvements, not generic advice",
            ].map((prop) => (
              <div key={prop} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white/90 shrink-0" />
                <p className="text-white/85 text-sm">{prop}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/15">
            <p className="text-white/85 text-sm italic leading-relaxed mb-2">
              &quot;Three months of silence. Two weeks after using ResumeOps — two offers.&quot;
            </p>
            <p className="text-white/50 text-xs">— Priya M., now at Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
}
