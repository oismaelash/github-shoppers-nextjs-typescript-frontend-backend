import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20",
  secondary:
    "border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/40 text-white",
  ghost: "hover:bg-white/[0.04] text-slate-200",
  danger:
    "border border-red-500/30 bg-red-500/10 hover:bg-red-500/15 text-red-200",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 text-sm rounded-lg",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  leftIcon,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  className,
  variant = "primary",
  size = "md",
  leftIcon,
  children,
}: {
  href: string;
  className?: string;
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold transition-all",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {leftIcon}
      {children}
    </Link>
  );
}

