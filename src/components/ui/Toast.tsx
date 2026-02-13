"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

export function Toast({
  open,
  title,
  message,
  onClose,
  className,
  durationMs = 5000,
}: {
  open: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  className?: string;
  durationMs?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => onClose(), durationMs);
    return () => window.clearTimeout(t);
  }, [open, onClose, durationMs]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl border border-white/10 bg-background-dark p-4 shadow-2xl",
        className
      )}
      role="status"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-white font-bold">{title}</div>
          {message ? <div className="text-sm text-slate-400">{message}</div> : null}
        </div>
        <button
          type="button"
          aria-label="Close toast"
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          <Icon name="close" />
        </button>
      </div>
    </div>
  );
}

