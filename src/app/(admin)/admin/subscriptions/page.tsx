import { GlassCard } from "@/components/ui/glass-card";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { fetchSubscriberCountsByPlan } from "@/lib/admin/stats";

export const metadata = {
  title: "Subscriptions",
};

export default async function AdminSubscriptionsPage() {
  const plans = Object.values(SUBSCRIPTION_PLANS);
  let countsByPlan: Record<string, number> = {};

  try {
    const counts = await fetchSubscriberCountsByPlan();
    countsByPlan = Object.fromEntries(counts.map((c) => [c.planId, c.count]));
  } catch {
    // show zero counts if subscriptions table unavailable
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p className="text-slate-400">Plan configuration and subscriber overview.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const count = countsByPlan[plan.id] ?? 0;
          return (
            <GlassCard key={plan.id}>
              <h3 className="font-semibold text-white">{plan.name}</h3>
              <p className="mt-2 text-2xl font-bold text-accent-bright">
                {plan.price != null ? `$${plan.price}/mo` : "Custom"}
              </p>
              <p className="mt-4 text-sm text-slate-500">
                {count === 1 ? "1 active subscriber" : `${count} active subscribers`}
              </p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
