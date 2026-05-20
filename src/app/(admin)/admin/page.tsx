import { GlassCard } from "@/components/ui/glass-card";
import { fetchAdminStats } from "@/lib/admin/stats";

export const metadata = {
  title: "Admin Overview",
};

function formatMrr(amount: number): string {
  if (amount === 0) return "$0";
  if (amount >= 1000) return `$${Math.round(amount / 1000)}K`;
  return `$${amount}`;
}

export default async function AdminOverviewPage() {
  let stats = {
    pendingVerifications: 0,
    activeAgents: 0,
    leadsThisWeek: 0,
    mrr: 0,
  };
  let statsError: string | null = null;

  try {
    stats = await fetchAdminStats();
  } catch (err) {
    statsError = err instanceof Error ? err.message : "Could not load stats.";
  }

  const metrics = [
    { label: "Pending verifications", value: String(stats.pendingVerifications) },
    { label: "Active agents", value: String(stats.activeAgents) },
    { label: "Leads this week", value: String(stats.leadsThisWeek) },
    { label: "MRR", value: formatMrr(stats.mrr) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-slate-400">Platform health and operations.</p>
      </div>
      {statsError && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {statsError}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <GlassCard key={m.label}>
            <p className="text-sm text-slate-500">{m.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{m.value}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
