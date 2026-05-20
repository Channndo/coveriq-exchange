import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { text: "text-lg", mark: 28 },
  md: { text: "text-xl", mark: 32 },
  lg: { text: "text-2xl", mark: 40 },
};

export function Logo({ className, href = "/", size = "md" }: LogoProps) {
  const { text, mark } = sizes[size];

  const content = (
    <span className={cn("inline-flex items-center gap-2 font-bold tracking-tight", className)}>
      <Image
        src="/coveriq-logo.svg"
        alt=""
        width={mark}
        height={mark}
        className="shrink-0"
        aria-hidden
      />
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
