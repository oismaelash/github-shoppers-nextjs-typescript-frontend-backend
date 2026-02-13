import { cn } from "@/lib/cn";

export function Pagination({
  className,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  className?: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-slate-200 disabled:opacity-40"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-slate-200 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

