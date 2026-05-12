import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/15 bg-white/5 p-5 shadow-[0_12px_34px_-20px_rgba(34,211,238,0.4)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

