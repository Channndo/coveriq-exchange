"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import { createClient } from "@/lib/supabase/client";
import { US_STATES } from "@/lib/constants";
import { CARRIER_OPTIONS, SECURITY_QUESTIONS } from "@/lib/leadFilters";
import { AGENT_PASSWORD_HINT, validateAgentPassword } from "@/lib/passwordRules";
import { submitAgentSignup } from "@/lib/submitAgentAccount";
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
  const [carrier, setCarrier] = useState("");
  const [producerType, setProducerType] = useState<"producer" | "agent">("agent");
  const [securityQuestion1, setSecurityQuestion1] = useState<string>(SECURITY_QUESTIONS[0]);
  const [securityAnswer1, setSecurityAnswer1] = useState("");
  const [securityQuestion2, setSecurityQuestion2] = useState<string>(SECURITY_QUESTIONS[1]);
  const [securityAnswer2, setSecurityAnswer2] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const passwordError = validateAgentPassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }

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
        const msg = signUpError.message.toLowerCase();
        if (msg.includes("confirm") || msg.includes("verified")) {
          setError(
            "Supabase is waiting for email confirmation, but no email was sent. Fix: Supabase → Authentication → Providers → Email → turn OFF “Confirm email” → Save → register again."
          );
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (!authData.user) {
        setError("Registration failed. Please try again.");
        return;
      }

      const accessToken = authData.session?.access_token;
      if (!accessToken) {
        setError(
          "Account created but not signed in yet. In Supabase: Authentication → Providers → Email → turn OFF “Confirm email”, then register again (or check your inbox to confirm first)."
        );
        return;
      }

      const profileRes = await fetch("/api/agent-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          agencyName: agency,
          npn,
          state,
          carrier,
          producerType,
        }),
      });

      const profileJson = (await profileRes.json()) as { error?: string };
      if (!profileRes.ok) {
        setError(profileJson.error || "Could not save your producer profile.");
        return;
      }

      void submitAgentSignup({
        firstName,
        lastName,
        email,
        phone,
        agencyName: agency,
        npn,
        licensedStates: state,
        carrier,
        producerType,
        securityQuestion1,
        securityAnswer1,
        securityQuestion2,
        securityAnswer2,
        status: "pending_verification",
        action: "signup",
      });

      router.push("/pending");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      if (msg === "Failed to fetch" || msg.includes("fetch")) {
        setError(
          "Cannot reach Supabase. In Supabase dashboard: (1) confirm project is not Paused, (2) Settings → API → copy Project URL into Vercel as NEXT_PUBLIC_SUPABASE_URL, (3) redeploy Production, (4) hard-refresh this page."
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  const selectClass = "input-field w-full";

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
        minLength={12}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p className="text-xs text-slate-500">{AGENT_PASSWORD_HINT}</p>

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
            className={selectClass}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="carrier" className="block text-sm font-medium text-slate-200">
            Primary carrier
          </label>
          <select
            id="carrier"
            name="carrier"
            required
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className={selectClass}
          >
            <option value="">Select carrier</option>
            {CARRIER_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="producerType" className="block text-sm font-medium text-slate-200">
            Role
          </label>
          <select
            id="producerType"
            name="producerType"
            required
            value={producerType}
            onChange={(e) => setProducerType(e.target.value as "producer" | "agent")}
            className={selectClass}
          >
            <option value="agent">Licensed agent</option>
            <option value="producer">Producer</option>
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

      <div className="space-y-1.5">
        <label htmlFor="sq1" className="block text-sm font-medium text-slate-200">
          Security question 1
        </label>
        <select
          id="sq1"
          value={securityQuestion1}
          onChange={(e) => setSecurityQuestion1(e.target.value)}
          className={selectClass}
        >
          {SECURITY_QUESTIONS.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
        <Input
          label="Answer"
          name="securityAnswer1"
          required
          value={securityAnswer1}
          onChange={(e) => setSecurityAnswer1(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sq2" className="block text-sm font-medium text-slate-200">
          Security question 2
        </label>
        <select
          id="sq2"
          value={securityQuestion2}
          onChange={(e) => setSecurityQuestion2(e.target.value)}
          className={selectClass}
        >
          {SECURITY_QUESTIONS.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
        <Input
          label="Answer"
          name="securityAnswer2"
          required
          value={securityAnswer2}
          onChange={(e) => setSecurityAnswer2(e.target.value)}
        />
      </div>

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Submitting application…" : "Submit application"}
      </Button>

      <p className="text-center text-xs text-slate-500">
        Applications are reviewed manually. You&apos;ll get dashboard access after approval.
      </p>

      <p className="text-center text-sm text-slate-500">
        Already registered?{" "}
        <Link href="/login" className="text-accent-cyan hover:text-accent-bright">
          Sign in
        </Link>
      </p>
    </form>
  );
}
