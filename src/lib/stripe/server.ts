import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;

  if (!stripeInstance) {
    stripeInstance = new Stripe(key, { typescript: true });
  }

  return stripeInstance;
}

/**
 * Future: create checkout session for subscription upgrade.
 */
export async function createCheckoutSessionPlaceholder(_params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string | null; message: string }> {
  return {
    url: null,
    message:
      "Stripe checkout is not enabled yet. Configure STRIPE_SECRET_KEY and price IDs.",
  };
}
