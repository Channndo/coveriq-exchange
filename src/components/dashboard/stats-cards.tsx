import { Activity, DollarSign, TrendingUp, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Leads",
      value: stats.totalLeads.toString(),
      icon: Users,
      sub: `${stats.activeLeads} active`,
    },
    {
      label: "Conversion Rate",
      value: formatPercent(stats.conversionRate),
      icon: TrendingUp,
      sub: "Last 30 days",
    },
    {
      label: "This Month",
      value: stats.thisMonth.toString(),
      icon: Activity,
      sub: stats.subscriptionStatus,
    },
    {
      label: "Total Spent",
      value: formatCurrency(stats.totalSpent),
      icon: DollarSign,
      sub: "Lifetime",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <GlassCard key={card.label} className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
          </div>
          <card.icon className="h-8 w-8 text-accent-cyan/60" />
        </GlassCard>
      ))}
    </div>
  );
}
