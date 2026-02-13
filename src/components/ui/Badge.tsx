import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "neutral" | "primary" | "success" | "warning";

const variantClasses: Record<Variant, string> = {
  neutral: "bg-white/[0.04] text-slate-200 border border-white/10",
  primary: "bg-primary/10 text-primary border border-primary/20",
  success: "bg-green-500/10 text-green-300 border border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-200 border border-yellow-500/20",
};

export function Badge({
  className,
  variant = "neutral",
  children,
}: {
  className?: string;
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

