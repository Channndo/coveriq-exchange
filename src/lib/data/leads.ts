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
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("assigned_date", { ascending: false });

    if (error || !data?.length) {
      return MOCK_LEADS;
    }

    return data as Lead[];
  } catch {
    return MOCK_LEADS;
  }
}
