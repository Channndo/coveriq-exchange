import { createClient } from "@/lib/supabase/server";
import { MOCK_LEADS } from "@/lib/data/mock-leads";
import { isSupabaseConfigured } from "@/lib/utils";
import type { Lead } from "@/types";

export async function getLeadsForAgent(): Promise<Lead[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_LEADS;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return MOCK_LEADS;

    const { data: profile } = await supabase
      .from("agent_profiles")
      .select("id, role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile?.id) return MOCK_LEADS;

    let query = supabase.from("leads").select("*").order("assigned_date", { ascending: false });

    if (profile.role !== "admin") {
      query = query.eq("assigned_to", profile.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[leads]", error.message);
      return MOCK_LEADS;
    }

    return (data ?? []) as Lead[];
  } catch {
    return MOCK_LEADS;
  }
}
