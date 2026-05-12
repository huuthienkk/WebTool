import { cn } from "../../lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-slate-100 outline-none ring-cyan-400/60 placeholder:text-slate-400 focus:ring-2",
        className,
      )}
      {...props}
    />
  );
}

