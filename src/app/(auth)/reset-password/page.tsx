import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Set New Password",
};

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Set new password" subtitle="Choose a new password for your producer account.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
