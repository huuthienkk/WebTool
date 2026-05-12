import { cn } from "../../lib/utils";

export function Badge({ className, children, tone = "neutral" }) {
  const toneClasses = {
    neutral: "bg-white/10 text-slate-200",
    premium: "bg-amber-400/20 text-amber-300",
    free: "bg-emerald-400/20 text-emerald-300",
  };

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", toneClasses[tone], className)}>
      {children}
    </span>
  );
}

