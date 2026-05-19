import type { SupabaseClient, User } from "@supabase/supabase-js";

const DEFAULT_OWNER_EMAILS = [
  "chandler@cover-iq.com",
  "chandler.hill.24@gmail.com",
];

export function getOwnerBootstrapEmails(): string[] {
  const fromEnv = process.env.BOOTSTRAP_OWNER_EMAILS?.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_OWNER_EMAILS;
}

export function isOwnerBootstrapEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return getOwnerBootstrapEmails().includes(email.toLowerCase());
}

/** Creates or activates admin profile for owner emails (no manual SQL). */
export async function ensureOwnerProfile(admin: SupabaseClient, user: User): Promise<void> {
  if (!isOwnerBootstrapEmail(user.email)) return;

  const meta = user.user_metadata ?? {};
  const firstName = String(meta.first_name ?? "Chandler").trim() || "Chandler";
  const lastName = String(meta.last_name ?? "Hill").trim() || "Hill";
  const email = (user.email ?? "").toLowerCase();

  const { error } = await admin.from("agent_profiles").upsert(
    {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      agency_name: "CoverIQ",
      npn_number: "00000000",
      state: "TX",
      phone: "5555555550",
      account_status: "active",
      role: "admin",
      credit_balance: 0,
      mfa_enabled: false,
      preferences: { onboardingCompleted: true },
      verification_method: "manual",
      registry_matched: false,
      approved_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) throw new Error(error.message);
}
