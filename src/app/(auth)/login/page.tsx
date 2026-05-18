import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Agent Login"
      subtitle="Sign in to access your producer dashboard."
    >
      <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
