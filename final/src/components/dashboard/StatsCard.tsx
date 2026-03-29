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
    positive: "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]",
    negative: "text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]",
    neutral:  "text-indigo-300 drop-shadow-[0_0_5px_rgba(165,180,252,0.5)]",
  };

  return (
    <div
      className={cn(
        "relative rounded border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.05)]",
        "bg-[#0a0f1c]/60 backdrop-blur-md p-4 flex flex-col font-mono overflow-hidden group",
        className
      )}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon + label row */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <p className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest">
          [ {label} ]
        </p>
        {icon && (
          <div className="h-7 w-7 rounded bg-indigo-500/10 flex items-center justify-center text-cyan-400 [&>svg]:h-4 [&>svg]:w-4 border border-indigo-500/20">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-gray-100 tabular-nums tracking-wider relative z-10">
        {value}
      </p>

      {/* Delta */}
      {delta && (
        <p className={cn("mt-2 text-[10px] uppercase font-bold tracking-widest relative z-10", deltaColors[deltaType])}>
          {deltaType === "positive" ? "▲ " : deltaType === "negative" ? "▼ " : "• "}
          {delta}
        </p>
      )}
    </div>
  );
}
