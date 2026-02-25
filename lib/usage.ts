import prisma from "./prisma";
import { Plan, UsageInfo } from "./types";
import { getScanLimit, isPaidPlan } from "./utils";

export async function getUserUsage(userId: string): Promise<UsageInfo> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { plan: true },
  });

  const plan: Plan = (profile?.plan as Plan) || "free";

  if (isPaidPlan(plan)) {
    return {
      scans_used: 0,
      scans_limit: Infinity,
      plan,
      can_scan: true,
    };
  }

  const usage = await prisma.usageCount.findUnique({
    where: { userId },
    select: { scansUsed: true },
  });

  const scansUsed = usage?.scansUsed || 0;
  const scansLimit = getScanLimit(plan);

  return {
    scans_used: scansUsed,
    scans_limit: scansLimit,
    plan,
    can_scan: scansUsed < scansLimit,
  };
}

export async function incrementUsage(userId: string): Promise<void> {
  await prisma.usageCount.upsert({
    where: { userId },
    update: { scansUsed: { increment: 1 } },
    create: { userId, scansUsed: 1 },
  });
}
