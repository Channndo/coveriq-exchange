import { createAdminClient } from "@/lib/supabase/admin";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";

export interface AdminStats {
  pendingVerifications: number;
  activeAgents: number;
  leadsThisWeek: number;
  mrr: number;
}

export interface PlanSubscriberCount {
  planId: string;
  count: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const admin = createAdminClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [pendingRes, activeRes, leadsRes, subsRes] = await Promise.all([
    admin
      .from("agent_profiles")
      .select("id", { count: "exact", head: true })
      .eq("account_status", "pending_verification"),
    admin
      .from("agent_profiles")
      .select("id", { count: "exact", head: true })
      .eq("account_status", "active"),
    admin
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo),
    admin
      .from("subscriptions")
      .select("plan_id, status")
      .in("status", ["active", "trialing"]),
  ]);

  let mrr = 0;
  for (const sub of subsRes.data ?? []) {
    const plan = SUBSCRIPTION_PLANS[sub.plan_id as keyof typeof SUBSCRIPTION_PLANS];
    if (plan?.price) mrr += plan.price;
  }

  return {
    pendingVerifications: pendingRes.count ?? 0,
    activeAgents: activeRes.count ?? 0,
    leadsThisWeek: leadsRes.count ?? 0,
    mrr,
  };
}

export async function fetchSubscriberCountsByPlan(): Promise<PlanSubscriberCount[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("plan_id")
    .in("status", ["active", "trialing"]);

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.plan_id, (counts.get(row.plan_id) ?? 0) + 1);
  }

  return Object.keys(SUBSCRIPTION_PLANS).map((planId) => ({
    planId,
    count: counts.get(planId) ?? 0,
  }));
}
