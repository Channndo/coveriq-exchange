import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter your email and we'll send a reset link."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
