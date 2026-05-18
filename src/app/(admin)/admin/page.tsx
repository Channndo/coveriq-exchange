import { GlassCard } from "@/components/ui/glass-card";

export const metadata = {
  title: "Admin Overview",
};

export default function AdminOverviewPage() {
  const metrics = [
    { label: "Pending verifications", value: "12" },
    { label: "Active agents", value: "2,412" },
    { label: "Leads this week", value: "1,847" },
    { label: "MRR", value: "$284K" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-slate-400">Platform health and operations.</p>
      </div>
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
