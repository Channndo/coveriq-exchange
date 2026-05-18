import { Lock, Sparkles, Store } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Lead Marketplace",
};

export default function MarketplacePage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <GlassCard className="max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-purple-500/20">
          <Store className="h-8 w-8 text-accent-bright" />
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-bright">
          <Sparkles className="h-3.5 w-3.5" />
          Premium — Coming Soon
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">Lead Marketplace</h1>
        <p className="mt-3 text-slate-400">
          Browse and purchase premium leads on demand. Available on Professional
          and Enterprise plans.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Lock className="h-4 w-4" />
          Upgrade required
        </div>
        <Link href="/billing" className="mt-6 inline-block">
          <Button>View Plans</Button>
        </Link>
      </GlassCard>
    </div>
  );
}
