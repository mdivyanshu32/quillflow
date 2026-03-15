import { cn } from "@/lib/utils";

// ─── Spinner ───────────────────────────────────────────────────────────────────
const spinnerSizes = {
  sm: "h-3.5 w-3.5 border-[1.5px]",
  md: "h-5 w-5 border-2",
  lg: "h-7 w-7 border-2",
};

interface SpinnerProps {
  size?: keyof typeof spinnerSizes;
  className?: string;
  label?: string;
}

export function Spinner({ size = "md", className, label = "Loading…" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block rounded-full border-gray-300 border-t-gray-900",
        "dark:border-gray-700 dark:border-t-gray-100",
        "animate-spin",
        spinnerSizes[size],
        className
      )}
    />
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-800",
        className
      )}
    />
  );
}

// ─── StatsCard skeleton ────────────────────────────────────────────────────────
export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

// ─── Table row skeleton ────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden dark:border-gray-800">
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3 flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
        >
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              className={cn("h-3 flex-1", j === 0 && "flex-[2]")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
