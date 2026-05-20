import Link from "next/link";
import { CoverIqLogoSvg } from "@/components/ui/cover-iq-logo-svg";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { text: "text-lg", mark: "h-7 w-7" },
  md: { text: "text-xl", mark: "h-8 w-8" },
  lg: { text: "text-2xl", mark: "h-10 w-10" },
};

export function Logo({ className, href = "/", size = "md" }: LogoProps) {
  const { text, mark } = sizes[size];

  const content = (
    <span className={cn("inline-flex items-center gap-2 font-bold tracking-tight", className)}>
      <CoverIqLogoSvg className={cn("shrink-0", mark)} />
      <span className={text}>
        <span className="text-gradient">CoverIQ</span>
        <span className="text-slate-300"> Exchange</span>
      </span>
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
