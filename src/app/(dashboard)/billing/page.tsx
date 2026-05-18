"use client";

import { useState } from "react";
import { CheckCircle2, Coins } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function BillingPage() {
  const [credits, setCredits] = useState(250);
  const plans = Object.values(SUBSCRIPTION_PLANS);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-slate-400">
          Manage your subscription and lead credits.
        </p>
      </div>

      <GlassCard className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-cyan/20">
            <Coins className="h-6 w-6 text-accent-cyan" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Credit balance</p>
            <p className="text-2xl font-bold text-white">{credits} credits</p>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() => setCredits((c) => c + 50)}
        >
          Add Credits (Demo)
        </Button>
      </GlassCard>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Subscription Plans</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <GlassCard
              key={plan.id}
              className={
                "popular" in plan && plan.popular
                  ? "border-accent-cyan/50"
                  : ""
              }
            >
              {"popular" in plan && plan.popular && (
                <span className="mb-3 inline-block text-xs font-semibold uppercase text-accent-bright">
                  Recommended
                </span>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold text-white">
                {plan.price != null ? (
                  <>
                    {formatCurrency(plan.price)}
                    <span className="text-sm font-normal text-slate-500">/mo</span>
                  </>
                ) : (
                  "Contact sales"
                )}
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-cyan" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={"popular" in plan && plan.popular ? "primary" : "secondary"}
                disabled={plan.id === "enterprise"}
              >
                {plan.id === "enterprise" ? "Contact Sales" : "Upgrade"}
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
