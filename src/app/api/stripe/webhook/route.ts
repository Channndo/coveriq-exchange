import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { STRIPE_WEBHOOK_EVENTS } from "@/lib/stripe/config";

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

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (
      STRIPE_WEBHOOK_EVENTS.includes(
        event.type as (typeof STRIPE_WEBHOOK_EVENTS)[number]
      )
    ) {
      // Future: sync subscription status to agent_profiles / subscriptions table
      console.log("[stripe webhook]", event.type, event.id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
