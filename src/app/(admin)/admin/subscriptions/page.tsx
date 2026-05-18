import { GlassCard } from "@/components/ui/glass-card";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export const metadata = {
  title: "Subscriptions",
};

export default function AdminSubscriptionsPage() {
  const plans = Object.values(SUBSCRIPTION_PLANS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p className="text-slate-400">Plan configuration and subscriber overview.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <GlassCard key={plan.id}>
            <h3 className="font-semibold text-white">{plan.name}</h3>
            <p className="mt-2 text-2xl font-bold text-accent-bright">
              {plan.price != null ? `$${plan.price}/mo` : "Custom"}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Mock: 142 active subscribers
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
