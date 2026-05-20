import { GlassCard } from "@/components/ui/glass-card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { LeadChart } from "@/components/dashboard/lead-chart";
import { getDashboardStats } from "@/lib/data/dashboard";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Overview of your lead pipeline and activity.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h2 className="mb-4 font-semibold text-white">Lead Volume</h2>
          <LeadChart />
        </GlassCard>
        <GlassCard>
          <h2 className="mb-4 font-semibold text-white">Recent Activity</h2>
          <ul className="space-y-4">
            {stats.recentActivity.map((item) => (
              <li key={item.id} className="border-b border-slate-800/50 pb-3 last:border-0">
                <p className="text-sm font-medium text-slate-200">{item.type}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {formatDate(item.date)}
                </p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
