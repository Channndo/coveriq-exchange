"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  className?: string;
  showLabel?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function SignOutButton({
  className,
  showLabel = true,
  variant = "ghost",
  size = "sm",
}: SignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(showLabel && "gap-2", className)}
      onClick={() => void handleSignOut()}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {showLabel ? "Sign out" : <span className="sr-only">Sign out</span>}
    </Button>
  );
}
