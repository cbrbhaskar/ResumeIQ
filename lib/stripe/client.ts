import Stripe from "stripe";

// Lazy-init: only instantiate when first used at runtime (not at build time).
// This prevents build failures when STRIPE_SECRET_KEY is absent during
// Next.js static page-data collection on Vercel.
let _stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

// Named export used by checkout / portal / webhook routes.
// Accessing any property triggers lazy initialisation at request time.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    return getStripeClient()[prop as keyof Stripe];
  },
});
