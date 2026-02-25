import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { stripe } from "@/lib/stripe/client";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { stripeCustomerId: true },
    });

    if (!profile?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "Failed to open billing portal" },
      { status: 500 }
    );
  }
}
