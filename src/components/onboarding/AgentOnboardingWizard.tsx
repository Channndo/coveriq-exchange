"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BubbleSelect } from "@/components/onboarding/BubbleSelect";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { AGENT_ONBOARDING_STEPS } from "@/lib/leadFilters";
import { submitAgentLeadFilters } from "@/lib/submitAgentAccount";
import type { AgentPreferences } from "@/types";

function mapSelectionsToPreferences(
  selections: Record<string, string | string[]>,
  existing: AgentPreferences
): AgentPreferences {
  const arr = (key: string) => {
    const v = selections[key];
    if (Array.isArray(v)) return v;
    return v ? [v] : [];
  };
  const single = (key: string) => {
    const v = selections[key];
    return Array.isArray(v) ? v[0] || "" : v || "";
  };

  return {
    ...existing,
    onboardingCompleted: true,
    wantWalkthrough: single("wantWalkthrough") === "yes",
    coverageTypes: arr("productLines"),
    productLines: arr("productLines"),
    states: arr("states"),
    zipCodes: [],
    leadTypes: arr("leadTypes"),
    homeownerStatus: arr("homeownerStatus"),
    creditTiers: arr("creditTiers"),
    vehicleCounts: arr("vehicleCount"),
    demographics: arr("demographics"),
    devices: arr("devices"),
    budgetTier: single("budget"),
    maxLeadPrice: 0,
    dailyBudget: 0,
    maxLeadsPerDay: 25,
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    emailNotifications: true,
    smsNotifications: false,
  };
}

interface AgentOnboardingWizardProps {
  profile: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    agency_name: string;
    npn_number: string;
    state: string;
    preferences: AgentPreferences;
  };
}

export function AgentOnboardingWizard({ profile }: AgentOnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});
  const [saving, setSaving] = useState(false);

  const current = AGENT_ONBOARDING_STEPS[step];
  const isLast = step === AGENT_ONBOARDING_STEPS.length - 1;
  const selectedRaw = selections[current.id];
  const selectedArr = Array.isArray(selectedRaw)
    ? selectedRaw
    : selectedRaw
      ? [selectedRaw]
      : [];
  const canNext = current.multi ? selectedArr.length > 0 : selectedArr.length === 1;

  const finish = async (finalSelections: Record<string, string | string[]>) => {
    setSaving(true);
    const preferences = mapSelectionsToPreferences(finalSelections, profile.preferences);
    const supabase = createClient();
    await supabase
      .from("agent_profiles")
      .update({ preferences })
      .eq("user_id", profile.user_id);

    void submitAgentLeadFilters({
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      agencyName: profile.agency_name,
      npn: profile.npn_number,
      licensedStates: profile.state,
      carrier: profile.preferences.carrier || preferences.carrier || "",
      producerType: profile.preferences.producerType || preferences.producerType || "agent",
      securityQuestion1: "",
      securityAnswer1: "",
      securityQuestion2: "",
      securityAnswer2: "",
      wantWalkthrough: preferences.wantWalkthrough ? "yes" : "no",
      leadFilters: finalSelections,
    });

    setSaving(false);
    router.push("/dashboard");
    router.refresh();
  };

  const next = () => {
    if (!canNext) return;
    const value = current.multi ? selectedArr : selectedArr[0];
    const nextSelections = { ...selections, [current.id]: value };
    setSelections(nextSelections);
    if (isLast) {
      void finish(nextSelections);
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="mb-2 text-center font-mono text-xs uppercase tracking-wider text-cyan-400">
        Step {step + 1} of {AGENT_ONBOARDING_STEPS.length}
      </p>
      <h1 className="mb-2 text-center font-display text-2xl font-bold text-white">{current.title}</h1>
      {current.subtitle && (
        <p className="mb-6 text-center text-sm text-slate-400">{current.subtitle}</p>
      )}
      <BubbleSelect
        options={current.options}
        selected={selectedArr}
        multi={current.multi}
        onChange={(ids) =>
          setSelections((prev) => ({
            ...prev,
            [current.id]: current.multi ? ids : ids[0],
          }))
        }
      />
      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        <Button type="button" className="flex-1" disabled={!canNext || saving} onClick={next}>
          {saving ? "Saving…" : isLast ? "Go to dashboard" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
