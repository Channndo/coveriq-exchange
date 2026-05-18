"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import { createClient } from "@/lib/supabase/client";
import { legacyApi } from "@/lib/api/legacy-client";
import { isSupabaseConfigured } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [showMfa, setShowMfa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setError(
          "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
        );
        return;
      }

      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (process.env.NEXT_PUBLIC_LEGACY_APPS_SCRIPT_URL) {
          const legacy = await legacyApi.login(email, password, mfaCode);
          if (legacy.mfaRequired && !mfaCode) {
            setShowMfa(true);
            setError("Enter your MFA code to continue.");
            return;
          }
          if (!legacy.success) {
            setError(legacy.error ?? legacy.message ?? "Invalid credentials");
            return;
          }
        } else {
          setError(signInError.message);
          return;
        }
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("agent_profiles")
          .select("account_status")
          .eq("user_id", data.user.id)
          .single();

        if (profile?.account_status === "pending_verification") {
          router.push("/pending");
          router.refresh();
          return;
        }
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@agency.com"
      />

      <PasswordInput
        label="Password"
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {showMfa && (
        <Input
          label="MFA Code"
          name="mfa"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
          placeholder="6-digit code"
          autoComplete="one-time-code"
        />
      )}

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-accent-cyan hover:text-accent-bright"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        New producer?{" "}
        <Link href="/register" className="text-accent-cyan hover:text-accent-bright">
          Apply for access
        </Link>
      </p>
    </form>
  );
}
