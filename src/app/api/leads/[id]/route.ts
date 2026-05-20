import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/types";

const VALID: LeadStatus[] = ["new", "contacted", "quoted", "closed", "lost"];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  const status = body.status as LeadStatus;

  if (!id || !status || !VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid lead id or status." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("agent_profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Agent profile not found." }, { status: 403 });
  }

  let query = supabase.from("leads").update({ status }).eq("id", id);

  if (profile.role !== "admin") {
    query = query.eq("assigned_to", profile.id);
  }

  const { data, error } = await query.select("id, status").maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ error: "Lead not found or not assigned to you." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead: data });
}
