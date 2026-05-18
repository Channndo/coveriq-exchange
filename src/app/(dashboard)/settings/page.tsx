"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { PRODUCT_TYPES, US_STATES } from "@/lib/constants";

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400">Routing preferences and notifications.</p>
      </div>

      <GlassCard className="space-y-4">
        <h2 className="font-semibold text-white">Lead Preferences</h2>
        <div className="space-y-1.5">
          <label className="text-sm text-slate-300">Coverage types</label>
          <select className="input-field" multiple size={4} defaultValue={["Auto", "Home"]}>
            {PRODUCT_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-slate-300">Licensed states</label>
          <select className="input-field" multiple size={4} defaultValue={["TX"]}>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <Button>Save Preferences</Button>
      </GlassCard>

      <GlassCard className="space-y-4">
        <h2 className="font-semibold text-white">Notifications</h2>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Email notifications</span>
          <input
            type="checkbox"
            checked={emailNotif}
            onChange={(e) => setEmailNotif(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-primary-medium accent-cyan-500"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-300">SMS notifications</span>
          <input
            type="checkbox"
            checked={smsNotif}
            onChange={(e) => setSmsNotif(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-primary-medium accent-cyan-500"
          />
        </label>
      </GlassCard>
    </div>
  );
}
