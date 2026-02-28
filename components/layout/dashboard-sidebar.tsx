"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  History,
  CreditCard,
  Settings,
  LogOut,
  Download,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/upload", label: "New Scan", Icon: Upload },
  { href: "/history", label: "History", Icon: History },
  { href: "/export", label: "Export", Icon: Download },
  { href: "/billing", label: "Billing", Icon: CreditCard },
  { href: "/settings", label: "Settings", Icon: Settings },
];

interface DashboardSidebarProps {
  userEmail?: string;
}

function getInitials(email?: string) {
  if (!email) return "?";
  return email.slice(0, 2).toUpperCase();
}

function SidebarContent({ userEmail }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { open, animate } = useSidebar();

  async function handleSignOut() {
    await signOut({ callbackUrl: "/" });
    router.refresh();
  }

  return (
    <SidebarBody
      className="justify-between gap-10"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.8)",
        boxShadow: "2px 0 16px rgba(124,58,237,0.04)",
      }}
    >
      {/* Top: logo + nav */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Logo */}
        <div style={{ height: "64px", display: "flex", alignItems: "center", borderBottom: "1px solid #f1f5f9", marginBottom: "0.5rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "13px", flexShrink: 0 }}>
              R
            </div>
            <motion.span
              animate={{
                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
              style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}
            >
              ResumeIQ
            </motion.span>
          </Link>
        </div>

        {/* Nav links */}
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === href
                : pathname === href || pathname.startsWith(href + "/");
            return (
              <SidebarLink
                key={href}
                active={active}
                link={{
                  href,
                  label,
                  icon: (
                    <Icon
                      style={{
                        width: "17px",
                        height: "17px",
                        flexShrink: 0,
                        color: active ? "#7c3aed" : "#94a3b8",
                        transition: "color 0.15s",
                      }}
                    />
                  ),
                }}
                className={cn(
                  "rounded-lg px-3 py-2.5 transition-colors",
                  active ? "bg-violet-50" : "hover:bg-slate-50/80"
                )}
                style={{
                  borderLeft: active ? "2px solid #7c3aed" : "2px solid transparent",
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom: user + sign out */}
      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem" }}>
        {userEmail && (
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 mb-1",
              !open && "justify-center"
            )}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#f5f3ff",
                border: "1px solid #ede9fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "#7c3aed",
                flexShrink: 0,
              }}
            >
              {getInitials(userEmail)}
            </div>
            <motion.span
              animate={{
                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userEmail}
            </motion.span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-2 w-full rounded-lg px-3 py-2.5 hover:bg-slate-50/80 transition-colors",
            !open && "justify-center"
          )}
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#94a3b8",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <LogOut style={{ width: "17px", height: "17px", flexShrink: 0 }} />
          <motion.span
            animate={{
              display: animate ? (open ? "inline-block" : "none") : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            style={{ whiteSpace: "nowrap" }}
          >
            Sign Out
          </motion.span>
        </button>
      </div>
    </SidebarBody>
  );
}

export function DashboardSidebar({ userEmail }: DashboardSidebarProps) {
  const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarContent userEmail={userEmail} />
    </Sidebar>
  );
}