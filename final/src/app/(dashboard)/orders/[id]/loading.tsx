// Shown instantly while the order detail page streams in
import { Skeleton } from "@/components/ui/Spinner";

export default function OrderDetailLoading() {
  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 space-y-3">
            <Skeleton className="h-4 w-20" />
            {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
            <Skeleton className="h-3 w-28" />
            {[1,2,3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
