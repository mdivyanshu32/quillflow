// src/app/(dashboard)/orders/[id]/page.tsx
import { notFound }               from "next/navigation";
import type { Metadata }          from "next";
import { Topbar }                 from "@/components/layout/Topbar";
import { StatusBadge, Badge }     from "@/components/ui/Badge";
import { Button }                 from "@/components/ui/Button";
import { RealtimeNotesThread }    from "@/components/orders/RealtimeNotesThread";
import { OrderStatusTimeline }    from "@/components/orders/OrderComponents";
import { getOrderById, getOrderNotes, getOrderStatusHistory } from "@/lib/queries/orders";
import { addNote }                from "@/lib/actions/orders";
import { createClient }           from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CONTENT_TYPE_OPTIONS, CONTENT_TONE_OPTIONS } from "@/lib/constants";
import type { PageProps }         from "@/lib/types";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const order = await getOrderById(params.id as string);
  return { title: order?.title ?? "Order detail" };
}

export default async function OrderDetailPage({ params }: PageProps) {
  const [order, notes, history, { data: { user } }] = await Promise.all([
    getOrderById(params.id as string),
    getOrderNotes(params.id as string),
    getOrderStatusHistory(params.id as string),
    createClient().auth.getUser(),
  ]);

  if (!order) notFound();

  const typeName = CONTENT_TYPE_OPTIONS.find(o => o.value === order.content_type)?.label;
  const toneName = CONTENT_TONE_OPTIONS.find(o => o.value === order.tone)?.label;

  async function handleAddNote(content: string) {
    "use server";
    return addNote({ order_id: order!.id, content });
  }

  return (
    <>
      <Topbar
        title={order.title}
        breadcrumbs={[{ label: "My Orders", href: "/orders" }, { label: order.title }]}
        actions={
          <div className="flex gap-2">
            {(order.status === "in_progress" || order.status === "revision") && (
              <Button variant="secondary" size="sm">Request revision</Button>
            )}
            {order.delivered_file_url && (
              <Button variant="primary" size="sm" asChild>
                <a href={order.delivered_file_url} download>Download file</a>
              </Button>
            )}
          </div>
        }
      />
      <main className="flex-1 p-6">
        <div className="flex items-center gap-3 mb-6">
          <StatusBadge status={order.status} />
          {order.deadline && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Deadline: {formatDate(order.deadline, { month: "long", day: "numeric", year: "numeric" })}
            </span>
          )}
          {order.status === "completed" && order.delivered_file_url && (
            <Badge variant="success">File ready</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-5">
            <section className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Brief</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {order.description ?? "No description provided."}
              </p>
              {order.special_instructions && (
                <>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-4 mb-1 uppercase tracking-wide">Special instructions</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{order.special_instructions}</p>
                </>
              )}
              {order.target_audience && (
                <>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-4 mb-1 uppercase tracking-wide">Target audience</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{order.target_audience}</p>
                </>
              )}
            </section>
            <section className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Notes{notes.length > 0 && ` (${notes.length})`}
              </h2>
              <RealtimeNotesThread
                orderId={order.id}
                initialNotes={notes}
                currentUserId={user?.id ?? ""}
                onAddNote={handleAddNote}
              />
            </section>
          </div>

          <div className="space-y-4">
            <section className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Order details</h2>
              </div>
              <dl className="divide-y divide-gray-100 dark:divide-gray-800">
                {([
                  ["Word count",   `${order.word_count.toLocaleString()} words`],
                  ["Content type", typeName],
                  ["Tone",         toneName],
                  ["Price",        formatCurrency(order.total_price)],
                  ["Placed",       formatDate(order.created_at, { month: "short", day: "numeric", year: "numeric" })],
                  ["Updated",      formatDate(order.updated_at, { month: "short", day: "numeric" })],
                ] as [string, string | undefined][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center px-4 py-2.5">
                    <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
                    <dd className="text-xs font-medium text-gray-900 dark:text-gray-100 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">Status history</h2>
              <OrderStatusTimeline history={history} />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
