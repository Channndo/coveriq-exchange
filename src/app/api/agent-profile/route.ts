import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { defaultPreferences } from "@/lib/auth/profile";
import { lookupProducerRegistry, normalizeNpn } from "@/lib/producerRegistry";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    }

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return NextResponse.json(
        {
          error:
            "No active session after signup. In Supabase: Authentication → Providers → Email → turn OFF “Confirm email”, then try again.",
        },
        { status: 401 }
      );
    }

    const authClient = createClient(url, anonKey);
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: userError?.message || "Invalid session." }, { status: 401 });
    }

    const body = await request.json();
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? user.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const agencyName = String(body.agencyName ?? "").trim();
    const npn = normalizeNpn(String(body.npn ?? ""));
    const state = String(body.state ?? "").trim().toUpperCase();
    const carrier = String(body.carrier ?? "").trim();
    const producerType = body.producerType === "producer" ? "producer" : "agent";

    if (!firstName || !lastName || !email || !agencyName || !npn || !state || !phone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const admin = createAdminClient();
    const registryEntry = await lookupProducerRegistry(admin, npn);
    const registryMatched = Boolean(registryEntry);

    const preferences = {
      ...defaultPreferences(),
      carrier,
      producerType,
    };

    const { error: insertError } = await admin.from("agent_profiles").insert({
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      agency_name: agencyName,
      npn_number: npn,
      state,
      phone,
      account_status: "pending_verification",
      role: "agent",
      credit_balance: 0,
      mfa_enabled: false,
      preferences,
      registry_matched: registryMatched,
      verification_method: "pending",
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "An account with this email already exists. Try signing in." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, registryMatched });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        {
          error:
            "Add SUPABASE_SERVICE_ROLE_KEY to Vercel (Supabase → Settings → API → service_role), redeploy, then try again.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
