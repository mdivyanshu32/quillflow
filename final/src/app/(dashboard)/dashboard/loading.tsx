import { StatsCardSkeleton, TableSkeleton } from "@/components/ui/Spinner";

export default function DashboardLoading() {
  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <StatsCardSkeleton key={i} />)}
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 h-52" />
      <TableSkeleton rows={5} cols={5} />
    </div>
  );
}
