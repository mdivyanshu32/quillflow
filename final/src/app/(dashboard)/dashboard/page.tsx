// src/app/(dashboard)/dashboard/page.tsx
import Link                  from "next/link";
import type { Metadata }     from "next";
import { Topbar }            from "@/components/layout/Topbar";
import { StatsCard }         from "@/components/dashboard/StatsCard";
import { OrdersBarChart }    from "@/components/dashboard/OrdersChart";
import { StatusBadge }       from "@/components/ui/Badge";
import { Button }            from "@/components/ui/Button";

import { getClientStats, getOrders, getOrdersByMonth } from "@/lib/queries/orders";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [stats, { data: recentOrders }, chartData] = await Promise.all([
    getClientStats(),
    getOrders({ pageSize: 5, sort: "created_at:desc" }),
    getOrdersByMonth(),
  ]);

  return (
    <>
      <Topbar
        title="Dashboard"
        actions={
          <Button variant="primary" size="sm" asChild>
            <Link href="/orders/new">+ New order</Link>
          </Button>
        }
      />
      <main className="flex-1 p-6 space-y-6">
        {/* KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatsCard label="Total orders"  value={stats.total_orders} />
          <StatsCard label="Active"        value={stats.active_orders}    deltaType="neutral" />
          <StatsCard label="Completed"     value={stats.completed_orders} />
          <StatsCard label="Total spent"   value={formatCurrency(stats.total_spent)} deltaType="positive" />
        </div>

        {/* Chart */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Orders — last 6 months</h2>
          <OrdersBarChart data={chartData} />
        </section>

        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent orders</h2>
            <Link href="/orders" className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">View all →</Link>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  {["Title","Type","Status","Price","Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentOrders.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                    No orders yet.{" "}
                    <Link href="/orders/new" className="text-blue-600 hover:underline">Place your first order →</Link>
                  </td></tr>
                )}
                {recentOrders.map(order => (
                  <tr key={order.id} className="group bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/orders/${order.id}`} className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {order.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 capitalize">{order.content_type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 tabular-nums">{formatCurrency(order.total_price)}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(order.created_at, { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
