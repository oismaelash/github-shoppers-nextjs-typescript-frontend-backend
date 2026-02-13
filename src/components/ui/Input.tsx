import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Input({
  className,
  leftSlot,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  leftSlot?: ReactNode;
}) {
  return (
    <div className={cn("relative flex items-center", className)}>
      {leftSlot ? (
        <div className="absolute left-3 text-slate-500">{leftSlot}</div>
      ) : null}
      <input
        className={cn(
          "w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-primary/40",
          leftSlot ? "pl-10" : ""
        )}
        {...props}
      />
    </div>
  );
}

