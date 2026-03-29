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
          <Button variant="primary" size="sm" asChild className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono uppercase tracking-wider text-[10px] shadow-[0_0_15px_rgba(79,70,229,0.3)] border-transparent">
            <Link href="/orders/new">INIT_NEW_ORDER</Link>
          </Button>
        }
      />
      <main className="flex-1 p-6 space-y-8 font-mono relative z-10">
        
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs text-indigo-400 font-bold tracking-widest uppercase">
            [ Telemetry Overview ]
          </h2>
          <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-indigo-500/20 to-transparent"></div>
        </div>

        {/* KPI stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard label="Total Ops"  value={stats.total_orders} />
          <StatsCard label="Active Syncs"        value={stats.active_orders}    deltaType="neutral" />
          <StatsCard label="Verified"     value={stats.completed_orders} />
          <StatsCard label="Credit Yield"   value={formatCurrency(stats.total_spent)} deltaType="positive" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs text-indigo-400 font-bold tracking-widest uppercase">
                [ Active Data Streams ]
              </h2>
              <Link href="/orders" className="text-[10px] text-cyan-500 hover:text-cyan-300 uppercase tracking-widest transition-colors">
                View All Sequences -{">"}
              </Link>
            </div>
            
            <div className="rounded bg-black/40 backdrop-blur-2xl border border-white/5 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <table className="w-full text-[11px] text-left">
                <thead>
                  <tr className="bg-indigo-500/10 border-b border-indigo-500/20 text-indigo-300 tracking-widest">
                    {["Process Identifier","Vector","Status","Credits","Timestamp"].map(h => (
                      <th key={h} className="px-4 py-3 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-12 text-center text-indigo-400/50 uppercase tracking-widest">
                      [ NO ACTIVE STREAMS DETECTED ]<br/>
                      <Link href="/orders/new" className="text-cyan-500 hover:text-cyan-300 mt-2 inline-block">INITIATE FIRST SEQUENCE</Link>
                    </td></tr>
                  )}
                  {recentOrders.map(order => (
                    <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/orders/${order.id}`} className="font-bold text-gray-200 group-hover:text-cyan-400 transition-colors uppercase tracking-wider line-clamp-1">
                          {order.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500 tracking-widest uppercase">{order.content_type.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3 text-cyan-400 tabular-nums">{formatCurrency(order.total_price)}</td>
                      <td className="px-4 py-3 text-indigo-500/80 tracking-widest whitespace-nowrap">
                        {formatDate(order.created_at, { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs text-indigo-400 font-bold tracking-widest uppercase">
              [ Analytics Sub-core ]
            </h2>
            <section className="rounded bg-black/40 backdrop-blur-2xl border border-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <h3 className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Output over T-6 months</h3>
              <div className="opacity-80 mix-blend-screen filter grayscale contrast-200">
                <OrdersBarChart data={chartData} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
