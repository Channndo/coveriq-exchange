import Link from "next/link";
import { Clock } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata = {
  title: "Pending Verification",
};

export default function PendingPage() {
  return (
    <AuthShell title="Application Under Review">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
        <Clock className="mx-auto h-12 w-12 text-amber-400" />
        <p className="mt-4 text-slate-300">
          Your producer application is being reviewed. We verify NPN and license
          credentials before granting dashboard access.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Most applications are processed within 48 hours. Questions?{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-accent-cyan hover:text-accent-bright"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
        <Link href="/login" className="mt-6 inline-block">
          <Button variant="secondary">Back to Login</Button>
        </Link>
      </div>
    </AuthShell>
  );
}
