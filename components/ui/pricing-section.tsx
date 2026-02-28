"use client";

import { useState } from "react";
import Link from "next/link";
import { PRICING_PLANS } from "@/lib/stripe/config";

interface PricingSectionProps {
  mode?: "landing" | "billing";
  onUpgrade?: (priceId: string, planId: string, billing: "monthly" | "yearly") => Promise<void>;
  loadingPlan?: string | null;
  currentPlan?: string;
}

export function PricingSection({
  mode = "landing",
  onUpgrade,
  loadingPlan,
  currentPlan,
}: PricingSectionProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = mode === "billing"
    ? PRICING_PLANS.filter((p) => p.id !== "free")
    : PRICING_PLANS;

  return (
    <div>
      {/* Monthly / Annual toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.75rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "3px",
          padding: "4px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: "0.45rem 1.125rem",
                borderRadius: "9px",
                fontSize: "0.84rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "all 0.18s",
                background: billing === b ? "#fff" : "transparent",
                color: billing === b ? "#0f172a" : "#94a3b8",
                boxShadow: billing === b ? "0 1px 6px rgba(0,0,0,0.09)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              {b === "monthly" ? "Monthly" : "Annual"}
              {b === "yearly" && (
                <span style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "100px",
                  background: billing === "yearly"
                    ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                    : "rgba(124,58,237,0.12)",
                  color: billing === "yearly" ? "#fff" : "#7c3aed",
                  letterSpacing: "0.02em",
                  transition: "all 0.18s",
                }}>
                  −28%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(270px, 1fr))`,
        gap: "1.5rem",
        alignItems: "start",
      }}>
        {plans.map((plan) => {
          const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const priceId = billing === "monthly" ? plan.stripePriceIdMonthly : plan.stripePriceIdYearly;
          const isFree = plan.id === "free";
          const isCurrentPlan = currentPlan
            ? plan.id.startsWith(currentPlan.replace(/_monthly|_yearly/, ""))
            : false;

          return (
            <div
              key={plan.id}
              style={{
                position: "relative",
                borderRadius: "18px",
                padding: "2rem",
                background: plan.popular
                  ? "rgba(124,58,237,0.05)"
                  : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: plan.popular
                  ? "1.5px solid rgba(124,58,237,0.28)"
                  : "1px solid rgba(255,255,255,0.85)",
                boxShadow: plan.popular
                  ? "0 12px 48px rgba(124,58,237,0.13), 0 2px 10px rgba(0,0,0,0.05)"
                  : "0 4px 24px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.03)",
                marginTop: plan.popular ? "0" : "0",
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "0.28rem 1.1rem",
                  borderRadius: "100px",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5, #06b6d4)",
                  color: "#fff",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.07em",
                  boxShadow: "0 4px 14px rgba(124,58,237,0.38)",
                }}>
                  ✦ MOST POPULAR
                </div>
              )}

              {/* Plan label */}
              <div style={{ marginBottom: "1.375rem" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.09em",
                  color: plan.popular ? "#7c3aed" : "#94a3b8",
                  marginBottom: "0.625rem",
                }}>
                  {plan.popular && (
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
                  )}
                  {plan.name}
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.15rem", marginBottom: "0.3rem" }}>
                  {!isFree && (
                    <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#374151", lineHeight: 1, paddingBottom: "0.45rem" }}>$</span>
                  )}
                  <span style={{
                    fontSize: isFree ? "2.75rem" : "3.5rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}>
                    {isFree ? "0" : price}
                  </span>
                  {!isFree && (
                    <span style={{ fontSize: "0.875rem", color: "#94a3b8", paddingBottom: "0.45rem", lineHeight: 1 }}>/mo</span>
                  )}
                </div>

                {isFree ? (
                  <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Free forever · no card needed</p>
                ) : billing === "yearly" ? (
                  <p style={{ fontSize: "0.78rem", color: "#7c3aed", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Billed annually · save 28%
                  </p>
                ) : (
                  <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "0.5rem" }}>
                    or ${plan.yearlyPrice}/mo billed annually
                  </p>
                )}

                <p style={{ fontSize: "0.825rem", color: "#64748b", lineHeight: 1.55 }}>{plan.description}</p>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: plan.popular ? "rgba(124,58,237,0.12)" : "rgba(0,0,0,0.05)", marginBottom: "1.375rem" }} />

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.625rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.855rem", color: "#374151", lineHeight: 1.45 }}>
                    <span style={{
                      width: "17px",
                      height: "17px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      marginTop: "1px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      background: plan.popular
                        ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                        : "rgba(124,58,237,0.1)",
                      color: plan.popular ? "#fff" : "#7c3aed",
                    }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {mode === "landing" ? (
                <Link
                  href="/signup"
                  className={plan.popular ? "btn-glow" : "btn-outline-gradient"}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => !isFree && !isCurrentPlan && onUpgrade?.(priceId, plan.id, billing)}
                  disabled={isCurrentPlan || !!loadingPlan || isFree}
                  className={isCurrentPlan || isFree ? "" : plan.popular ? "btn-glow" : "btn-outline-gradient"}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: isCurrentPlan || isFree ? "default" : "pointer",
                    border: isCurrentPlan ? "1px solid #e2e8f0" : "none",
                    background: isCurrentPlan ? "#f8fafc" : isFree ? "#f1f5f9" : undefined,
                    color: isCurrentPlan ? "#94a3b8" : isFree ? "#94a3b8" : undefined,
                    opacity: loadingPlan && loadingPlan !== plan.id ? 0.6 : 1,
                  }}
                >
                  {isCurrentPlan ? "✓ Current Plan" : loadingPlan === plan.id ? "Processing…" : plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}