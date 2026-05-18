"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Settings,
  Store,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Store,
  CreditCard,
  Bot,
  User,
  Settings,
};

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-slate-700/40 bg-primary-medium/60 backdrop-blur-xl",
        className
      )}
    >
      <div className="border-b border-slate-700/40 p-5">
        <Logo href="/dashboard" size="sm" />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-accent-cyan/15 text-accent-bright"
                  : "text-slate-400 hover:bg-primary-light/50 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
