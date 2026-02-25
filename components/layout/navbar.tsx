"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BarChart2, Menu, X, Zap, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

interface NavbarProps {
  user?: { email: string; id: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  async function handleSignOut() {
    await signOut({ callbackUrl: "/" });
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-violet-200 transition-shadow">
              <BarChart2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">ResumeIQ</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Button variant="soft" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Button size="sm" asChild>
                  <Link href="/signup">
                    <Zap className="w-4 h-4" />
                    Get Started
                  </Link>
                </Button>
              </>
            )}

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-zinc-400 hover:text-zinc-200" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                )}
              </button>
            )}
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-1">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 space-y-2">
          <Link
            href="/pricing"
            className="block py-2 text-sm text-gray-700 dark:text-zinc-300 font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block py-2 text-sm text-gray-700 dark:text-zinc-300 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left py-2 text-sm text-gray-700 dark:text-zinc-300 font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block py-2 text-sm text-gray-700 dark:text-zinc-300 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block py-2 text-sm font-medium text-violet-600 dark:text-violet-400"
                onClick={() => setMobileOpen(false)}
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
