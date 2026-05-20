import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/ui/logo";
import { ADMIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r border-slate-700/40 bg-primary-medium/60 p-4">
        <Logo href="/admin" size="sm" />
        <p className="mt-1 text-xs text-slate-500">Admin Console</p>
        <nav className="mt-8 flex-1 space-y-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-primary-light/50 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <SignOutButton className="w-full justify-start px-3" />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
