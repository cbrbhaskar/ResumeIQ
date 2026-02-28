"use client";

import { useState, useEffect, Suspense } from "react";
import { CreditCard, Zap, ExternalLink, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { getPlanDisplayName } from "@/lib/utils";
import { UsageInfo } from "@/lib/types";
import { PricingSection } from "@/components/ui/pricing-section";

function BillingContent() {
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (success) toast({ title: "Subscription activated!", description: "Welcome to Pro. Enjoy unlimited scans." });
    if (canceled) toast({ title: "Checkout canceled", description: "Your subscription was not changed." });

    fetch("/api/usage")
      .then((r) => r.json())
      .then((d) => setUsage(d.usage));
  }, [searchParams]);

  async function handleUpgrade(priceId: string, planId: string) {
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Something went wrong", variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Something went wrong", variant: "destructive" });
    } finally {
      setPortalLoading(false);
    }
  }

  const isOnPaidPlan = usage?.plan && usage.plan !== "free";
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.65)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.8)",
    borderRadius: "14px",
    boxShadow: "0 8px 32px rgba(124,58,237,0.07), 0 2px 8px rgba(0,0,0,0.05)",
  };

  return (
    <div style={{ color: "#0f172a", fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Page header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>Billing</h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Manage your subscription and billing details</p>
      </div>

      {/* Current plan card */}
      <div style={{ ...card, marginBottom: "2rem" }}>
        <div style={{ padding: "1rem 1.375rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard style={{ width: "14px", height: "14px", color: "#7c3aed" }} />
          </div>
          <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>Current Plan</span>
        </div>

        <div style={{ padding: "1.375rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: isOnPaidPlan ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap style={{ width: "18px", height: "18px", color: isOnPaidPlan ? "#fff" : "#7c3aed" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: "0.125rem" }}>
                {usage ? getPlanDisplayName(usage.plan) : "—"} Plan
              </p>
              {usage?.plan === "free" ? (
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  {usage.scans_limit - usage.scans_used} of {usage.scans_limit} scans remaining
                </p>
              ) : (
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Unlimited scans · active</p>
              )}
            </div>
          </div>

          {isOnPaidPlan && (
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.425rem", padding: "0.55rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: "0.825rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <ExternalLink style={{ width: "13px", height: "13px" }} />
              {portalLoading ? "Loading…" : "Manage Billing"}
            </button>
          )}
        </div>

        {/* Free usage bar */}
        {usage?.plan === "free" && (
          <div style={{ padding: "0 1.375rem 1.375rem" }}>
            <div style={{ height: "5px", borderRadius: "3px", background: "#f1f5f9", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "3px", width: `${(usage.scans_used / usage.scans_limit) * 100}%`, background: usage.scans_used >= usage.scans_limit ? "#ef4444" : "linear-gradient(90deg, #7c3aed, #4f46e5)", transition: "width 0.4s" }} />
            </div>
            <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.375rem" }}>
              {usage.scans_used} / {usage.scans_limit} scans used
            </p>
          </div>
        )}
      </div>

      {/* Already on paid plan */}
      {isOnPaidPlan && (
        <div style={{ ...card, padding: "1.375rem", display: "flex", alignItems: "flex-start", gap: "0.875rem", background: "rgba(240,253,244,0.8)", border: "1px solid rgba(187,247,208,0.8)" }}>
          <CheckCircle2 style={{ width: "18px", height: "18px", color: "#16a34a", flexShrink: 0, marginTop: "1px" }} />
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#15803d", marginBottom: "0.25rem" }}>You&apos;re on a paid plan</p>
            <p style={{ fontSize: "0.825rem", color: "#166534", lineHeight: 1.55, marginBottom: "0.875rem" }}>
              You have unlimited resume scans. Use the billing portal to manage, upgrade, downgrade, or cancel your subscription.
            </p>
            <button
              onClick={handleManageBilling}
              disabled={portalLoading}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.425rem", padding: "0.55rem 1rem", borderRadius: "8px", border: "1px solid rgba(187,247,208,0.9)", background: "#fff", color: "#15803d", fontSize: "0.825rem", fontWeight: 600, cursor: "pointer" }}
            >
              <ExternalLink style={{ width: "13px", height: "13px" }} />
              {portalLoading ? "Loading…" : "Open Billing Portal"}
            </button>
          </div>
        </div>
      )}

      {/* Upgrade section */}
      {!isOnPaidPlan && (
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem" }}>Upgrade your plan</h2>
            <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Unlock unlimited scans and the full AI analysis report</p>
          </div>
          <PricingSection
            mode="billing"
            onUpgrade={handleUpgrade}
            loadingPlan={loadingPlan}
            currentPlan={usage?.plan}
          />
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[80, 160, 360].map((h) => (
          <div key={h} style={{ height: `${h}px`, borderRadius: "14px", background: "rgba(255,255,255,0.5)" }} />
        ))}
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}