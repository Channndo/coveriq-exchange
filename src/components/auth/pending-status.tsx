"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, XCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { SUPPORT_EMAIL } from "@/lib/constants";
import type { AccountStatus } from "@/types";

export function PendingStatus() {
  const router = useRouter();
  const [status, setStatus] = useState<AccountStatus>("pending_verification");
  const [loading, setLoading] = useState(true);

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
      const { data: profile } = await supabase
        .from("agent_profiles")
        .select("account_status, preferences")
        .eq("user_id", user.id)
        .single();

      const accountStatus = (profile?.account_status as AccountStatus) ?? "pending_verification";
      setStatus(accountStatus);

      if (accountStatus === "active") {
        const prefs = profile?.preferences as { onboardingCompleted?: boolean } | null;
        router.replace(prefs?.onboardingCompleted ? "/dashboard" : "/onboarding");
        return;
      }
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
