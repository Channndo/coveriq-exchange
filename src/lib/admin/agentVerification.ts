import type { SupabaseClient } from "@supabase/supabase-js";
import type { AccountStatus } from "@/types";
import { submitAgentSignup } from "@/lib/submitAgentAccount";
import { lookupProducerRegistry, shouldAutoApproveFromRegistry } from "@/lib/producerRegistry";

export interface AgentForReview {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  agency_name: string;
  npn_number: string;
  state: string;
  phone: string;
  account_status: AccountStatus;
  registry_matched: boolean;
  verification_method: string | null;
  created_at: string;
  preferences: Record<string, unknown>;
}

export async function fetchAgentsForReview(
  supabase: SupabaseClient
): Promise<AgentForReview[]> {
  const { data, error } = await supabase
    .from("agent_profiles")
    .select(
      "id, user_id, first_name, last_name, email, agency_name, npn_number, state, phone, account_status, registry_matched, verification_method, created_at, preferences"
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as AgentForReview[];
}

export async function updateAgentAccountStatus(
  supabase: SupabaseClient,
  agent: AgentForReview,
  newStatus: AccountStatus,
  adminUserId: string
): Promise<{ ok: boolean; error?: string }> {
  const verificationMethod =
    newStatus === "active" && agent.registry_matched ? "registry" : "manual";

  const { error: updateError } = await supabase
    .from("agent_profiles")
    .update({
      account_status: newStatus,
      verification_method: newStatus === "active" ? verificationMethod : "pending",
      approved_at: newStatus === "active" ? new Date().toISOString() : null,
    })
    .eq("id", agent.id);

  if (updateError) return { ok: false, error: updateError.message };

  const { error: auditError } = await supabase.from("admin_actions").insert({
    admin_user_id: adminUserId,
    target_agent_id: agent.id,
    action_type: `status_${newStatus}`,
    previous_status: agent.account_status,
    new_status: newStatus,
    metadata: { npn: agent.npn_number, email: agent.email },
  });

  if (auditError) {
    console.error("[admin] audit insert failed", auditError.message);
  }

  if (newStatus === "active") {
    const prefs = agent.preferences as { carrier?: string; producerType?: string };
    void submitAgentSignup({
      firstName: agent.first_name,
      lastName: agent.last_name,
      email: agent.email,
      phone: agent.phone,
      agencyName: agent.agency_name,
      npn: agent.npn_number,
      licensedStates: agent.state,
      carrier: prefs.carrier || "",
      producerType: (prefs.producerType as "producer" | "agent") || "agent",
      securityQuestion1: "",
      securityAnswer1: "",
      securityQuestion2: "",
      securityAnswer2: "",
      action: "approved",
      status: "active",
    });
  }

  return { ok: true };
}

/** Run on signup — stores whether NPN matched registry (does not auto-approve yet). */
export async function checkRegistryOnSignup(
  supabase: SupabaseClient,
  npn: string
): Promise<{ matched: boolean; entry: Awaited<ReturnType<typeof lookupProducerRegistry>> }> {
  const entry = await lookupProducerRegistry(supabase, npn);
  return { matched: Boolean(entry), entry };
}

export { shouldAutoApproveFromRegistry };
