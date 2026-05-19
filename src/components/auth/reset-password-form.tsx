"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import { createClient } from "@/lib/supabase/client";
import { AGENT_PASSWORD_HINT, validateAgentPassword } from "@/lib/passwordRules";
import { isSupabaseConfigured } from "@/lib/utils";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(Boolean(session));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const passwordError = validateAgentPassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured.");
        return;
      }

      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(
          updateError.message.toLowerCase().includes("session")
            ? "This reset link expired or was already used. Request a new link from Forgot password."
            : updateError.message
        );
        return;
      }

      router.push("/login?reset=success");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
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


      <p className="text-sm text-slate-400">{AGENT_PASSWORD_HINT}</p>

      <PasswordInput
        label="New password"
        name="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <PasswordInput
        label="Confirm password"
        name="confirmPassword"
        autoComplete="new-password"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Saving…" : "Set new password"}
      </Button>

      {!hasSession && (
        <p className="text-center text-xs text-amber-300/90">
          Open the link from your email on agents.cover-iq.com. If the link went to the wrong site,
          fix Supabase Site URL (see supabase/FIX_PASSWORD_RESET.md).
        </p>
      )}

      <p className="text-center text-sm text-slate-500">
        <Link href="/forgot-password" className="text-accent-cyan hover:text-accent-bright">
          Send another reset link
        </Link>
      </p>
    </form>
  );
}
