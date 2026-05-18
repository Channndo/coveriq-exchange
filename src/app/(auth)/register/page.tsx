import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Apply",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Apply for Access"
      subtitle="Licensed producers only. Verification typically completes within 48 hours."
    >
      <RegisterForm />
    </AuthShell>
  );
}
