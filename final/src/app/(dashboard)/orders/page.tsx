// src/app/(dashboard)/orders/page.tsx
import Link             from "next/link";
import type { Metadata } from "next";
import { Topbar }        from "@/components/layout/Topbar";
import { Button }        from "@/components/ui/Button";
import { StatusBadge }   from "@/components/ui/Badge";
import { DataTable }     from "@/components/ui/DataTable";
import { OrderFilters }  from "@/components/orders/OrderComponents";
import { getOrders }     from "@/lib/queries/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CONTENT_TYPE_OPTIONS } from "@/lib/constants";
import type { PageProps, TableColumn } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage({ searchParams }: PageProps) {
  const params   = searchParams as Record<string, string>;
  const status   = params.status   ?? "";
  const search   = params.search   ?? "";
  const page     = parseInt(params.page ?? "1", 10);
  const sort     = params.sort     ?? "created_at:desc";

  const { data, count, totalPages } = await getOrders({ status, search, page, sort });

  const columns: TableColumn<any>[] = [
    { key: "title",        header: "Title",    width: "40%",
      render: r => <Link href={`/orders/${r.id}`} className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1">{r.title}</Link> },
    { key: "content_type", header: "Type",
      render: r => CONTENT_TYPE_OPTIONS.find(o => o.value === r.content_type)?.label ?? r.content_type },
    { key: "status",       header: "Status",   render: r => <StatusBadge status={r.status} /> },
    { key: "total_price",  header: "Price",    render: r => <span className="tabular-nums">{formatCurrency(r.total_price)}</span> },
    { key: "deadline",     header: "Deadline", render: r => r.deadline ? formatDate(r.deadline, { month: "short", day: "numeric" }) : "—" },
    { key: "created_at",   header: "Created",  render: r => formatDate(r.created_at, { month: "short", day: "numeric" }) },
  ];

  function pageHref(p: number) {
    const ps = new URLSearchParams(params); ps.set("page", String(p));
    return `/orders?${ps.toString()}`;
  }

  return (
    <>
      <Topbar title="My Orders" actions={<Button variant="primary" size="sm" asChild><Link href="/orders/new">+ New order</Link></Button>} />
      <main className="flex-1 p-6 space-y-4">
        <OrderFilters />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {count === 0 ? "No orders found" : `Showing ${data.length} of ${count} order${count !== 1 ? "s" : ""}`}
        </p>
        <DataTable columns={columns} data={data} keyField="id"
          emptyMessage={search || status ? "No orders match your filters." : "You haven't placed any orders yet."} />
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              {page > 1
                ? <Link href={pageHref(page - 1)} className="inline-flex items-center px-3 h-8 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">← Previous</Link>
                : <span className="inline-flex items-center px-3 h-8 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed">← Previous</span>}
              {page < totalPages
                ? <Link href={pageHref(page + 1)} className="inline-flex items-center px-3 h-8 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">Next →</Link>
                : <span className="inline-flex items-center px-3 h-8 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed">Next →</span>}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
