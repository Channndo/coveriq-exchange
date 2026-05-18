import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-slate-400">Your producer account details.</p>
      </div>
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Account</h2>
          <Badge status="active">Active</Badge>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            ["Agency", "Hill Insurance Group"],
            ["Email", "agent@example.com"],
            ["NPN", "12345678"],
            ["State", "TX"],
            ["Phone", "(512) 555-0100"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-slate-500">{label}</dt>
              <dd className="text-slate-200">{value}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>
    </div>
  );
}
