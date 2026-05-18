import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function Logo({ className, href = "/", size = "md" }: LogoProps) {
  const content = (
    <span className={cn("font-bold tracking-tight", sizes[size], className)}>
      <span className="text-gradient">CoverIQ</span>
      <span className="text-slate-300"> Exchange</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
