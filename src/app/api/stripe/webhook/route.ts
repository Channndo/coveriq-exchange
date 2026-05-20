import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { STRIPE_WEBHOOK_EVENTS } from "@/lib/stripe/config";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { received: true, message: "Stripe webhook stub — not configured" },
      { status: 200 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (
    !STRIPE_WEBHOOK_EVENTS.includes(
      event.type as (typeof STRIPE_WEBHOOK_EVENTS)[number]
    )
  ) {
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    await syncStripeEvent(event);
  } catch (err) {
    console.error("[stripe webhook] sync failed", event.type, err);
    // Acknowledge to avoid endless retries; investigate logs / dead-letter
  }

  return NextResponse.json({ received: true });
}

async function syncStripeEvent(event: Stripe.Event) {
  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!customerId) {
      console.warn("[stripe webhook] checkout.session.completed missing customer");
      return;
    }

    const agentProfileId = session.metadata?.agent_profile_id;
    if (!agentProfileId) {
      console.warn(
        "[stripe webhook] TODO: map customer to agent_profiles — set metadata.agent_profile_id at checkout"
      );
      return;
    }

    await admin
      .from("agent_profiles")
      .update({
        stripe_customer_id: customerId,
        subscription_status: "active",
        subscription_plan: session.metadata?.plan_id ?? null,
      })
      .eq("id", agentProfileId);

    if (subscriptionId) {
      await upsertSubscription(admin, {
        agentProfileId,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
        planId: session.metadata?.plan_id ?? "unknown",
        status: "active",
      });
    }
    return;
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const customerId =
      typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
    if (!customerId) return;

    const { data: profile } = await admin
      .from("agent_profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    if (!profile?.id) {
      console.warn(
        "[stripe webhook] TODO: no agent_profiles row for stripe_customer_id",
        customerId
      );
      return;
    }

    const planId = sub.items.data[0]?.price?.id ?? sub.metadata?.plan_id ?? "unknown";
    const status = sub.status;

    await admin
      .from("agent_profiles")
      .update({
        subscription_status: status,
        subscription_plan: planId,
      })
      .eq("id", profile.id);

    const periodStart =
      "current_period_start" in sub && typeof sub.current_period_start === "number"
        ? new Date(sub.current_period_start * 1000).toISOString()
        : null;
    const periodEnd =
      "current_period_end" in sub && typeof sub.current_period_end === "number"
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;

    await upsertSubscription(admin, {
      agentProfileId: profile.id,
      stripeSubscriptionId: sub.id,
      stripeCustomerId: customerId,
      planId,
      status,
      periodStart,
      periodEnd,
    });
  }
}

async function upsertSubscription(
  admin: ReturnType<typeof createAdminClient>,
  input: {
    agentProfileId: string;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    planId: string;
    status: string;
    periodStart?: string | null;
    periodEnd?: string | null;
  }
) {
  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", input.stripeSubscriptionId)
    .maybeSingle();

  const row = {
    agent_profile_id: input.agentProfileId,
    stripe_subscription_id: input.stripeSubscriptionId,
    stripe_customer_id: input.stripeCustomerId,
    plan_id: input.planId,
    status: input.status,
    current_period_start: input.periodStart,
    current_period_end: input.periodEnd,
  };

  if (existing?.id) {
    await admin.from("subscriptions").update(row).eq("id", existing.id);
  } else {
    await admin.from("subscriptions").insert(row);
  }
}
