import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/auth";
import { fetchAgentsForReview, updateAgentAccountStatus } from "@/lib/admin/agentVerification";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AccountStatus } from "@/types";

export async function GET(request: Request) {
  try {
    await requireAdminUser(request);
    const admin = createAdminClient();
    const agents = await fetchAgentsForReview(admin);
    return NextResponse.json({ agents });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Forbidden";
    const status = message === "Not signed in." ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const adminUser = await requireAdminUser(request);
    const body = await request.json();
    const agentId = String(body.agentId ?? "");
    const status = body.status as AccountStatus;

    if (!agentId || !status) {
      return NextResponse.json({ error: "agentId and status are required." }, { status: 400 });
    }

    const admin = createAdminClient();
    const agents = await fetchAgentsForReview(admin);
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found." }, { status: 404 });
    }

    const result = await updateAgentAccountStatus(admin, agent, status, adminUser.id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error || "Update failed." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Forbidden";
    const status = message === "Not signed in." ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }
}
