import Link from "next/link";
import { BarChart2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">
              Resume<span className="gradient-text">Ops</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/#features" className="hover:text-violet-700 transition-colors">Features</Link>
            <Link href="/#pricing" className="hover:text-violet-700 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-violet-700 transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-violet-700 transition-colors">Sign Up</Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} ResumeOps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
