import type { SupabaseClient } from "@supabase/supabase-js";

export interface ProducerRegistryEntry {
  id: string;
  npn: string;
  first_name: string | null;
  last_name: string | null;
  licensed_states: string[] | null;
  agency_name: string | null;
  active: boolean;
  source: string;
}

/** Normalize NPN to digits only for lookup. */
export function normalizeNpn(npn: string): string {
  return npn.replace(/\D/g, "");
}

/**
 * Check if NPN exists in the producer registry (active row).
 * Returns null if table is missing or RLS blocks — signup still works.
 */
export async function lookupProducerRegistry(
  supabase: SupabaseClient,
  npn: string
): Promise<ProducerRegistryEntry | null> {
  const normalized = normalizeNpn(npn);
  if (normalized.length < 4) return null;

  const { data, error } = await supabase
    .from("producer_registry")
    .select("id, npn, first_name, last_name, licensed_states, agency_name, active, source")
    .eq("npn", normalized)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    // Table may not exist yet — ignore
    return null;
  }
  return data;
}

/**
 * Future: auto-approve when registry match + env flag.
 * Keep false until registry data is loaded and policy is defined.
 */
export function shouldAutoApproveFromRegistry(
  _entry: ProducerRegistryEntry | null
): boolean {
  return false;
}
