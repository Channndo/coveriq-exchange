import { createClient } from "@/lib/supabase/server";
import { MOCK_STATS } from "@/lib/data/mock-leads";
import { isSupabaseConfigured } from "@/lib/utils";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured()) {
    return MOCK_STATS;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return MOCK_STATS;

    const { data: profile } = await supabase
      .from("agent_profiles")
      .select("id, subscription_plan, subscription_status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile?.id) return MOCK_STATS;

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { data: leads, error } = await supabase
      .from("leads")
      .select("id, status, assigned_date, created_at")
      .eq("assigned_to", profile.id);

    if (error || !leads) return MOCK_STATS;

    const totalLeads = leads.length;
    const activeLeads = leads.filter((l) => l.status === "new" || l.status === "contacted").length;
    const closed = leads.filter((l) => l.status === "closed").length;
    const conversionRate =
      totalLeads > 0 ? Math.round((closed / totalLeads) * 1000) / 10 : 0;
    const thisMonth = leads.filter(
      (l) => new Date(l.assigned_date) >= monthStart
    ).length;

    const recentActivity = leads
      .slice()
      .sort(
        (a, b) =>
          new Date(b.assigned_date).getTime() - new Date(a.assigned_date).getTime()
      )
      .slice(0, 5)
      .map((l) => ({
        id: l.id,
        type: `Lead · ${l.status}`,
        description: `Assigned ${new Date(l.assigned_date).toLocaleDateString()}`,
        date: l.assigned_date,
      }));

    return {
      totalLeads,
      activeLeads,
      conversionRate,
      subscriptionStatus: profile.subscription_plan || profile.subscription_status || "—",
      thisMonth,
      totalSpent: 0,
      recentActivity,
    };
  } catch {
    return MOCK_STATS;
  }
}
