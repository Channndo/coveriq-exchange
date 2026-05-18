import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  new: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  contacted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  quoted: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  closed: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  lost: "bg-red-500/20 text-red-300 border-red-500/30",
  pending_verification: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  suspended: "bg-red-500/20 text-red-300 border-red-500/30",
};

export function Badge({
  children,
  status,
  className,
}: {
  children: React.ReactNode;
  status?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        status && variants[status],
        className
      )}
    >
      {children}
    </span>
  );
}
