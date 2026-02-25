"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, CreditCard, Zap, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/lib/stripe/config";
import { UsageInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

function BillingContent() {
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success) {
      toast({
        title: "Subscription activated!",
        description: "Welcome to Pro. Enjoy unlimited scans.",
      });
    }
    if (canceled) {
      toast({
        title: "Checkout canceled",
        description: "Your subscription was not changed.",
      });
    }

    async function fetchUsage() {
      const res = await fetch("/api/usage");
      if (res.ok) {
        const data = await res.json();
        setUsage(data.usage);
      }
    }
    fetchUsage();
  }, [searchParams]);

  async function handleUpgrade(priceId: string, planId: string) {
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, billingInterval: billing }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
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
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  }

  const isOnPaidPlan = usage?.plan !== "free" && usage?.plan !== undefined;

  return (
    <div className="space-y-7 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
        <p className="text-gray-400 dark:text-zinc-500 text-sm mt-1">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current plan */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-50 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Current Plan</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
                <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">
                  {usage?.plan?.replace(/_/g, " ") || "Free"} Plan
                </p>
                {usage?.plan === "free" && (
                  <p className="text-sm text-gray-400 dark:text-zinc-500">
                    {usage.scans_limit - usage.scans_used} of {usage.scans_limit} scans remaining
                  </p>
                )}
                {isOnPaidPlan && (
                  <p className="text-sm text-gray-400 dark:text-zinc-500">Unlimited scans</p>
                )}
              </div>
            </div>
            {isOnPaidPlan && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageBilling}
                loading={portalLoading}
              >
                <ExternalLink className="w-4 h-4" />
                Manage Billing
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade section */}
      {!isOnPaidPlan && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Upgrade your plan</h2>
              <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5">
                Get unlimited scans and advanced features
              </p>
            </div>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <button
                onClick={() => setBilling("monthly")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  billing === "monthly"
                    ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                  billing === "yearly"
                    ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
                )}
              >
                Yearly
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">
                  -28%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRICING_PLANS.filter((p) => p.id !== "free").map((plan) => {
              const price =
                billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const priceId =
                billing === "monthly"
                  ? plan.stripePriceIdMonthly
                  : plan.stripePriceIdYearly;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm overflow-hidden",
                    plan.popular
                      ? "border-violet-200 dark:border-violet-800/50 shadow-violet-100/50 dark:shadow-violet-950/30"
                      : "border-gray-100 dark:border-zinc-800"
                  )}
                >
                  {plan.popular && (
                    <div className="gradient-brand px-4 py-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-white" />
                      <span className="text-xs font-semibold text-white">Most Popular</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 mb-4">{plan.description}</p>
                    <div className="flex items-end gap-1 mb-5">
                      <span className="text-3xl font-extrabold text-gray-900 dark:text-white">${price}</span>
                      <span className="text-gray-400 dark:text-zinc-500 text-sm mb-1">/month</span>
                    </div>
                    {billing === "yearly" && (
                      <p className="text-xs text-gray-400 dark:text-zinc-500 -mt-4 mb-4">Billed annually</p>
                    )}
                    <Button
                      className="w-full mb-5"
                      variant={plan.popular ? "default" : "outline"}
                      loading={loading === plan.id}
                      onClick={() => handleUpgrade(priceId, plan.id)}
                    >
                      Upgrade to {plan.name}
                    </Button>
                    <ul className="space-y-2">
                      {plan.features.slice(0, 4).map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-xs text-gray-600 dark:text-zinc-400"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Already on paid plan */}
      {isOnPaidPlan && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900 dark:text-emerald-300">You&apos;re on a paid plan</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mt-1">
                You have unlimited resume scans. Use the billing portal to manage, upgrade,
                downgrade, or cancel your subscription.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                onClick={handleManageBilling}
                loading={portalLoading}
              >
                <ExternalLink className="w-4 h-4" />
                Open Billing Portal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-100 dark:bg-zinc-800 rounded-xl w-32" />
          <div className="h-32 bg-gray-100 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-64 bg-gray-100 dark:bg-zinc-800 rounded-2xl" />
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}
