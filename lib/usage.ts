import { createAdminClient } from "./supabase/server";
import { Plan, UsageInfo } from "./types";
import { getScanLimit, isPaidPlan } from "./utils";

export async function getUserUsage(userId: string): Promise<UsageInfo> {
  const supabase = createAdminClient();

  // Get user profile for plan info
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  const plan: Plan = profile?.plan || "free";

  if (isPaidPlan(plan)) {
    return {
      scans_used: 0,
      scans_limit: Infinity,
      plan,
      can_scan: true,
    };
  }

  // Get usage count for free users
  const { data: usage } = await supabase
    .from("usage_counts")
    .select("scans_used")
    .eq("user_id", userId)
    .single();

  const scansUsed = usage?.scans_used || 0;
  const scansLimit = getScanLimit(plan);

  return {
    scans_used: scansUsed,
    scans_limit: scansLimit,
    plan,
    can_scan: scansUsed < scansLimit,
  };
}

export async function incrementUsage(userId: string): Promise<void> {
  const supabase = createAdminClient();

  // Use RPC to atomically increment — prevents race conditions
  const { error } = await supabase.rpc("increment_usage", { p_user_id: userId });

  if (error) {
    // Fallback: read-then-upsert if RPC not available
    const { data: existing } = await supabase
      .from("usage_counts")
      .select("scans_used")
      .eq("user_id", userId)
      .single();

    await supabase.from("usage_counts").upsert({
      user_id: userId,
      scans_used: (existing?.scans_used ?? 0) + 1,
      updated_at: new Date().toISOString(),
    });
  }
}
