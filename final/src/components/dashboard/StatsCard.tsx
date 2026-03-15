import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  icon,
  className,
}: StatsCardProps) {
  const deltaColors = {
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-500 dark:text-red-400",
    neutral:  "text-gray-500 dark:text-gray-400",
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 dark:border-gray-800",
        "bg-white dark:bg-gray-950 p-4",
        className
      )}
    >
      {/* Icon + label row */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        {icon && (
          <div className="h-7 w-7 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
        {value}
      </p>

      {/* Delta */}
      {delta && (
        <p className={cn("mt-1 text-xs", deltaColors[deltaType])}>
          {delta}
        </p>
      )}
    </div>
  );
}
