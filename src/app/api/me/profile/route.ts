import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ensureOwnerProfile } from "@/lib/auth/ownerBootstrap";
import { createAdminClient } from "@/lib/supabase/admin";

/** Returns the signed-in user's agent profile (bypasses RLS). */
export async function GET(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    }

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    const authClient = createClient(url, anonKey);
    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: userError?.message || "Invalid session." }, { status: 401 });
    }

    const admin = createAdminClient();
    await ensureOwnerProfile(admin, user);

    const { data: profile, error: profileError } = await admin
      .from("agent_profiles")
      .select("account_status, role, preferences, email")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      profile: profile ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        { error: "Add SUPABASE_SERVICE_ROLE_KEY on Vercel and redeploy." },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
