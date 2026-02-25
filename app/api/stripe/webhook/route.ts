import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { Plan } from "@/lib/types";

function getPlanFromPriceId(priceId: string | undefined): Plan {
  if (!priceId) return "free";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID) return "pro_monthly";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID) return "pro_yearly";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_TEAMS_MONTHLY_PRICE_ID) return "teams_monthly";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_TEAMS_YEARLY_PRICE_ID) return "teams_yearly";
  return "free";
}

function getCustomerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
  if (!customer) return null;
  if (typeof customer === "string") return customer;
  return customer.id;
}

function getSubscriptionId(sub: string | Stripe.Subscription | null | undefined): string | null {
  if (!sub) return null;
  if (typeof sub === "string") return sub;
  return sub.id;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const subscriptionId = getSubscriptionId(session.subscription);

        if (!userId || !subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        const plan = getPlanFromPriceId(priceId);
        const customerId = getCustomerId(subscription.customer);

        if (!customerId) break;

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: customerId,
            plan,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          update: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: customerId,
            plan,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        await prisma.profile.update({ where: { userId }, data: { plan } });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        if (!userId) break;

        const priceId = subscription.items.data[0]?.price.id;
        const plan = getPlanFromPriceId(priceId);
        const customerId = getCustomerId(subscription.customer);
        if (!customerId) break;

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: customerId,
            plan,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          update: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: customerId,
            plan,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        const activePlan = subscription.status === "active" ? plan : "free";
        await prisma.profile.update({ where: { userId }, data: { plan: activePlan } });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: { status: "canceled" },
          });
          await prisma.profile.update({ where: { userId }, data: { plan: "free" } });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = getSubscriptionId(invoice.subscription);
        if (subscriptionId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: "past_due" },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
