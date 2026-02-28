"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Menu, X, BarChart2, ArrowRight } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-nav shadow-sm shadow-violet-100/50 border-b border-slate-100/80"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Resume<span className="gradient-text">Ops</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/#features"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-all"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-all"
            >
              Pricing
            </Link>
            {session ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-all"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <ShimmerButton
                className="text-sm py-2 px-5"
                onClick={() => { window.location.href = "/upload"; }}
              >
                New Scan <ArrowRight className="w-3.5 h-3.5" />
              </ShimmerButton>
            ) : (
              <ShimmerButton
                className="text-sm py-2 px-5"
                onClick={() => { window.location.href = "/signup"; }}
              >
                Get Free Score <ArrowRight className="w-3.5 h-3.5" />
              </ShimmerButton>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1">
          <Link
            href="/#features"
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            onClick={() => setOpen(false)}
          >
            {session ? "Dashboard" : "Sign In"}
          </Link>
          <div className="pt-2">
            <ShimmerButton
              className="w-full text-sm py-2.5 justify-center"
              onClick={() => { window.location.href = session ? "/upload" : "/signup"; }}
            >
              {session ? "New Scan" : "Get Free Score"} <ArrowRight className="w-3.5 h-3.5" />
            </ShimmerButton>
          </div>
        </div>
      )}
    </header>
  );
}
