"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Upload, History, CreditCard, Settings, LogOut, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useMemo } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "New Scan", icon: Upload },
  { href: "/history", label: "History", icon: History },
  { href: "/export", label: "Export", icon: Download },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
  userEmail?: string;
}

function getInitials(email?: string) {
  if (!email) return "?";
  return email.slice(0, 2).toUpperCase();
}

export function DashboardSidebar({ userEmail }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="glass-panel" style={{ width: "220px", minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0, borderRadius: 0, borderTop: "none", borderBottom: "none", borderLeft: "none" }}>
      {/* Logo */}
      <div style={{ height: "64px", display: "flex", alignItems: "center", padding: "0 1.25rem", borderBottom: "1px solid #e2e8f0" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "13px" }}>R</div>
          <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a", letterSpacing: "-0.01em" }}>ResumeIQ</span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.875rem 0.75rem", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.575rem 0.75rem",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: active ? 600 : 500,
                textDecoration: "none",
                color: active ? "#7c3aed" : "#64748b",
                background: active ? "#f5f3ff" : "transparent",
                borderLeft: active ? "2px solid #7c3aed" : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <Icon style={{ width: "15px", height: "15px", flexShrink: 0, color: active ? "#7c3aed" : "#94a3b8" }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid #e2e8f0" }}>
        {userEmail && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.75rem", marginBottom: "2px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#f5f3ff", border: "1px solid #ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#7c3aed", flexShrink: 0 }}>
              {getInitials(userEmail)}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{userEmail}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.575rem 0.75rem", borderRadius: "8px", fontSize: "0.875rem", fontWeight: 500, color: "#94a3b8", background: "transparent", border: "none", cursor: "pointer", width: "100%" }}
        >
          <LogOut style={{ width: "15px", height: "15px", flexShrink: 0 }} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
