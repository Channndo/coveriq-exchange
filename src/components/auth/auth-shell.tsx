import { Logo } from "@/components/ui/logo";
import { APP_TAGLINE } from "@/lib/constants";
import { Shield, Sparkles, Zap } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between border-r border-slate-700/40 bg-primary-medium/40 p-12 lg:flex">
        <Logo size="lg" />
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent-bright">
            <Sparkles className="h-3.5 w-3.5" />
            Producer Portal
          </div>
          <h1 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
            {APP_TAGLINE}
          </h1>
          <p className="mt-4 max-w-md text-slate-400">
            Secure access for licensed insurance professionals. NPN-verified
            accounts only.
          </p>
          <ul className="mt-10 space-y-4">
            {[
              { icon: Shield, text: "SOC2-ready security architecture" },
              { icon: Zap, text: "AI-powered lead routing" },
              { icon: Sparkles, text: "Real-time pipeline analytics" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-300">
                <Icon className="h-5 w-5 text-accent-cyan" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} CoverIQ Exchange
        </p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="mx-auto w-full max-w-md">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
