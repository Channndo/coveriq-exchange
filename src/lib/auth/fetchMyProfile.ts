import { createClient } from "@/lib/supabase/client";
import type { AccountStatus } from "@/types";

export interface MyProfileResult {
  email: string | null;
  accountStatus: AccountStatus | null;
  role: string | null;
  onboardingCompleted: boolean;
  missingProfile: boolean;
  error: string | null;
}

export async function fetchMyProfile(): Promise<MyProfileResult> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {
      email: null,
      accountStatus: null,
      role: null,
      onboardingCompleted: false,
      missingProfile: true,
      error: "Not signed in.",
    };
  }

  const res = await fetch("/api/me/profile", {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  const json = (await res.json()) as {
    email?: string;
    profile?: {
      account_status: AccountStatus;
      role: string;
      preferences?: { onboardingCompleted?: boolean };
      email?: string;
    } | null;
    error?: string;
  };

  if (!res.ok) {
    return {
      email: json.email ?? null,
      accountStatus: null,
      role: null,
      onboardingCompleted: false,
      missingProfile: true,
      error: json.error || "Could not load profile.",
    };
  }

  if (!json.profile) {
    return {
      email: json.email ?? null,
      accountStatus: null,
      role: null,
      onboardingCompleted: false,
      missingProfile: true,
      error: null,
    };
  }

  const prefs = json.profile.preferences;
  return {
    email: json.email ?? json.profile.email ?? null,
    accountStatus: json.profile.account_status,
    role: json.profile.role,
    onboardingCompleted: prefs?.onboardingCompleted === true,
    missingProfile: false,
    error: null,
  };
}
