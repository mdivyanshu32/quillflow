import { cn } from "@/lib/utils";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import type { OrderStatus } from "@/lib/types";

// ─── StatusBadge — maps OrderStatus to a colored pill ─────────────────────────
interface StatusBadgeProps {
  status: OrderStatus;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  const cfg = ORDER_STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
        cfg.bgColor,
        cfg.color,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", cfg.dotColor)}
          aria-hidden
        />
      )}
      {cfg.label}
    </span>
  );
}

// ─── Generic Badge — for content types, tags, counts ──────────────────────────
type BadgeVariant = "default" | "info" | "success" | "warning" | "danger" | "outline";

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  info:    "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  success: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  danger:  "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  outline: "bg-transparent text-gray-600 border border-gray-200 dark:text-gray-400 dark:border-gray-700",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
