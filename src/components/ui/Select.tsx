import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-slate-100 outline-none focus:border-primary/40",
        className
      )}
      {...props}
    />
  );
}

