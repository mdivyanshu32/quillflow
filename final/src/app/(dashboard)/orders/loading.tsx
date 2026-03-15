import { TableSkeleton, Skeleton } from "@/components/ui/Spinner";

export default function OrdersLoading() {
  return (
    <div className="flex-1 p-6 space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>
      <Skeleton className="h-3 w-32" />
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
}
