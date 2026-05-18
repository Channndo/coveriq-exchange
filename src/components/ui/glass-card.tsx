import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-card p-6",
        hover && "glass-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
