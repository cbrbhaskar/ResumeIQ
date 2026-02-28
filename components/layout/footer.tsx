import Link from "next/link";
import { BarChart2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">ResumeOps</span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-zinc-400">
            <Link href="/pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Sign In
            </Link>
          </div>

          <p className="text-xs text-gray-400 dark:text-zinc-500">
            © {new Date().getFullYear()} ResumeOps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
