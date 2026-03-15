// src/app/(dashboard)/orders/new/page.tsx
import type { Metadata }  from "next";
import { Topbar }         from "@/components/layout/Topbar";
import { OrderForm }      from "@/components/orders/OrderForm";
import { createOrder }    from "@/lib/actions/orders";
import type { CreateOrderInput } from "@/lib/types";

export const metadata: Metadata = { title: "New order" };

export default function NewOrderPage() {
  async function handleCreateOrder(data: CreateOrderInput) {
    "use server";
    const result = await createOrder(data);
    if (result.error) return { error: result.error };
    return {};
  }

  return (
    <>
      <Topbar
        title="New order"
        breadcrumbs={[{ label: "My Orders", href: "/orders" }, { label: "New order" }]}
      />
      <main className="flex-1 p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xl">
          Fill in the details below and we'll confirm your order within 24 hours.
        </p>
        <OrderForm onSubmit={handleCreateOrder} />
      </main>
    </>
  );
}
