import type { SubscriptionPlanId } from "@/types";

/**
 * Stripe integration architecture — checkout not wired yet.
 * Map plan IDs to Stripe Price IDs once products are created in Dashboard.
 */
export const STRIPE_PRICE_IDS: Record<SubscriptionPlanId, string | null> = {
  starter: process.env.STRIPE_PRICE_STARTER ?? null,
  professional: process.env.STRIPE_PRICE_PROFESSIONAL ?? null,
  enterprise: null, // custom sales — no self-serve price
};

export const STRIPE_WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
] as const;
