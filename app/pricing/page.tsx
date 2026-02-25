"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PRICING_PLANS } from "@/lib/stripe/config";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function handleUpgrade(plan: typeof PRICING_PLANS[0]) {
    if (plan.id === "free") {
      router.push("/signup");
      return;
    }

    setLoading(plan.id);
    try {
      const priceId =
        billing === "monthly"
          ? plan.stripePriceIdMonthly
          : plan.stripePriceIdYearly;

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, billingInterval: billing }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error(data.error);
      }

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

  const yearlySavings = {
    pro: Math.round((1 - 4.99 / 6.99) * 100),
    teams: Math.round((1 - 13.99 / 15.99) * 100),
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Start free. Upgrade when you need more.
            </p>

            {/* Billing toggle */}
            <div className="mt-8 inline-flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200">
              <button
                onClick={() => setBilling("monthly")}
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-medium transition-all",
                  billing === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  billing === "yearly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Yearly
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                  Save {yearlySavings.pro}%
                </span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => {
              const price =
                billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const isPopular = plan.popular;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative rounded-2xl p-8 border transition-all",
                    isPopular
                      ? "border-violet-200 bg-gradient-to-b from-violet-50 to-white shadow-xl shadow-violet-100 scale-[1.02]"
                      : "border-gray-100 bg-white hover:shadow-md"
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        ${price}
                      </span>
                      {price > 0 && (
                        <span className="text-gray-400 text-sm mb-1">
                          /month
                        </span>
                      )}
                    </div>
                    {billing === "yearly" && price > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        Billed annually (${(price * 12).toFixed(2)}/year)
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full mb-6"
                    variant={isPopular ? "default" : "outline"}
                    loading={loading === plan.id}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-gray-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* FAQ note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              All plans include a 14-day money-back guarantee. Cancel anytime.{" "}
              <Link href="/login" className="text-violet-600 hover:underline">
                Already have an account?
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
