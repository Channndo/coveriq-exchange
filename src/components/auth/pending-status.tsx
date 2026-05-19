"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, XCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { fetchMyProfile } from "@/lib/auth/fetchMyProfile";
import { createClient } from "@/lib/supabase/client";
import { SUPPORT_EMAIL } from "@/lib/constants";
import type { AccountStatus } from "@/types";

export function PendingStatus() {
  const router = useRouter();
  const [status, setStatus] = useState<AccountStatus>("pending_verification");
  const [loading, setLoading] = useState(true);
  const [missingProfile, setMissingProfile] = useState(false);
  const [authEmail, setAuthEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const me = await fetchMyProfile();

      if (me.missingProfile) {
        setStatus("pending_verification");
        setMissingProfile(true);
        setAuthEmail(me.email ?? user.email ?? "");
        setLoading(false);
        return;
      }

      setMissingProfile(false);
      const accountStatus = me.accountStatus ?? "pending_verification";
      setStatus(accountStatus);

      if (accountStatus === "active") {
        router.replace(me.onboardingCompleted ? "/dashboard" : "/onboarding");
        return;
      }

      setAuthEmail(me.email ?? user.email ?? "");
      setLoading(false);
    }

    void load();
    const interval = setInterval(() => void load(), 30_000);
    return () => clearInterval(interval);
  }, [router]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <AuthShell title="Checking application status">
        <p className="mt-4 text-center text-slate-400">One moment…</p>
      </AuthShell>
    );
  }

  if (missingProfile) {
    return (
      <AuthShell title="Complete your producer profile">
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-6 text-center">
          <p className="text-slate-300">
            You&apos;re signed in, but your producer profile wasn&apos;t saved during registration
            (often a missing server config). An admin must run{" "}
            <strong className="text-white">BLOCK C</strong> in{" "}
            <code className="text-cyan-300">ACTIVATE_MY_ACCOUNT.sql</code> in Supabase, or register
            again after <code className="text-cyan-300">SUPABASE_SERVICE_ROLE_KEY</code> is set on
            Vercel.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            SQL that only updates <code className="text-slate-400">agent_profiles</code> by email
            will show <strong>0 rows</strong> until a profile row exists.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button variant="secondary" onClick={() => router.refresh()}>
              Check again
            </Button>
            <Button variant="ghost" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  if (status === "rejected") {
    return (
      <AuthShell title="Application not approved">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />
          <p className="mt-4 text-slate-300">
            We couldn&apos;t approve this application with the information provided. Contact us if
            you believe this is an error.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-2 inline-block text-sm text-accent-cyan hover:text-accent-bright"
          >
            {SUPPORT_EMAIL}
          </a>
          <div className="mt-6 flex flex-col gap-2">
            <Button variant="secondary" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Application under review">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <Clock className="mx-auto h-12 w-12 text-amber-400" />
        <p className="mt-4 text-slate-300">
          Thanks for applying. A CoverIQ admin will verify your NPN and producer details before
          you can access the dashboard and lead marketplace.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Most applications are reviewed within 48 hours. This page refreshes automatically when
          you&apos;re approved.
        </p>
        {authEmail && (
          <p className="mt-2 text-xs text-slate-500">
            Signed in as <span className="text-slate-300">{authEmail}</span> — must match an
            activated email in Supabase.
          </p>
        )}
        <p className="mt-3 text-sm text-slate-500">
          Already active in SQL?{" "}
          <Link href="/dashboard" className="text-accent-cyan hover:text-accent-bright">
            Go to dashboard
          </Link>
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Questions?{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent-cyan hover:text-accent-bright">
            {SUPPORT_EMAIL}
          </a>
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button variant="secondary" onClick={() => router.refresh()}>
            Check status now
          </Button>
          <Button variant="ghost" onClick={() => void signOut()}>
            Sign out
          </Button>
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-300">
            Back to login
          </Link>
      </div>
      </div>
    </AuthShell>
  );
}
