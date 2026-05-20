"use client";

import { Menu } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getDisplayName } from "@/lib/auth/profile";
import type { AgentProfile } from "@/types";

interface TopNavProps {
  profile?: Partial<AgentProfile> | null;
  onMenuClick?: () => void;
  title?: string;
}

export function TopNav({ profile, onMenuClick, title }: TopNavProps) {
  const displayName = profile ? getDisplayName(profile as AgentProfile) : "Agent";

  return (
    <header className="flex items-center justify-between border-b border-slate-700/40 bg-primary-dark/60 px-4 py-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 hover:bg-primary-light/50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-400 sm:inline">
          {displayName}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-cyan/20 text-sm font-semibold text-accent-bright">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <SignOutButton showLabel={false} />
      </div>
    </header>
  );
}
