"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import { createClient } from "@/lib/supabase/client";
import { defaultPreferences } from "@/lib/auth/profile";
import { US_STATES } from "@/lib/constants";
import { formatPhone, isSupabaseConfigured } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agency, setAgency] = useState("");
  const [npn, setNpn] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setError(
          "Supabase is not configured. Add environment variables to enable registration."
        );
        return;
      }

      const supabase = createClient();

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!authData.user) {
        setError("Registration failed. Please try again.");
        return;
      }

      const { error: profileError } = await supabase.from("agent_profiles").insert({
        user_id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        agency_name: agency,
        npn_number: npn,
        state,
        phone,
        account_status: "pending_verification",
        role: "agent",
        credit_balance: 0,
        mfa_enabled: false,
        preferences: defaultPreferences(),
      });

      if (profileError) {
        setError(profileError.message);
        return;
      }

      router.push("/pending");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="First name"
          name="firstName"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          label="Last name"
          name="lastName"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <PasswordInput
        label="Password"
        name="password"
        autoComplete="new-password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        label="Agency name"
        name="agency"
        required
        value={agency}
        onChange={(e) => setAgency(e.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="NPN number"
          name="npn"
          required
          value={npn}
          onChange={(e) => setNpn(e.target.value)}
          placeholder="12345678"
        />
        <div className="space-y-1.5">
          <label htmlFor="state" className="block text-sm font-medium text-slate-200">
            License state
          </label>
          <select
            id="state"
            name="state"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="input-field"
          >
            <option value="">Select state</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Phone"
        name="phone"
        type="tel"
        required
        value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
        placeholder="(555) 555-5555"
      />

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Submitting…" : "Submit Application"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already registered?{" "}
        <Link href="/login" className="text-accent-cyan hover:text-accent-bright">
          Sign in
        </Link>
      </p>
    </form>
  );
}
