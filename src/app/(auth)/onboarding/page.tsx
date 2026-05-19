import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AgentOnboardingWizard } from "@/components/onboarding/AgentOnboardingWizard";
import type { AgentPreferences } from "@/types";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("agent_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    redirect("/register");
  }

  const prefs = (profile.preferences || {}) as AgentPreferences;
  if (prefs.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <AgentOnboardingWizard
      profile={{
        user_id: profile.user_id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        agency_name: profile.agency_name,
        npn_number: profile.npn_number,
        state: profile.state,
        preferences: prefs,
      }}
    />
  );
}
