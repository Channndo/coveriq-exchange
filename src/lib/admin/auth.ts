import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { User } from "@supabase/supabase-js";

export async function getUserFromBearer(request: Request): Promise<User | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const authClient = createClient(url, anonKey);
  const {
    data: { user },
  } = await authClient.auth.getUser(token);
  return user ?? null;
}

export async function requireAdminUser(request: Request): Promise<User> {
  const user = await getUserFromBearer(request);
  if (!user) throw new Error("Not signed in.");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("agent_profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") throw new Error("Admin access required.");
  return user;
}
