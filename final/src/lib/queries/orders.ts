// lib/queries/orders.ts
// Pure read functions — called from Server Components only.
// Each function creates a fresh server client scoped to the request.

import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type {
  Order, OrderNote, OrderStatusHistory,
  PaginatedResponse, ClientStats, OrdersChartData,
} from "@/lib/types";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface GetOrdersOptions {
  status?:   string;
  search?:   string;
  page?:     number;
  sort?:     string;           // e.g. "created_at:desc"
  pageSize?: number;
}

// ─── Get paginated orders for the current user ─────────────────────────────────
export async function getOrders(
  opts: GetOrdersOptions = {}
): Promise<PaginatedResponse<Order>> {
  const supabase  = createClient();
  const {
    status   = "",
    search   = "",
    page     = 1,
    sort     = "created_at:desc",
    pageSize = DEFAULT_PAGE_SIZE,
  } = opts;

  const [sortField, sortDir] = sort.split(":");
  const from = (page - 1) * pageSize;
  const to   = from + pageSize - 1;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order(sortField || "created_at", { ascending: sortDir !== "desc" })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error, count } = await query;

  if (error) {
    console.error("[getOrders]", error.message);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  return {
    data:       (data as Order[]) ?? [],
    count:      count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

// ─── Get a single order by ID ──────────────────────────────────────────────────
export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[getOrderById]", error.message);
    return null;
  }
  return data as Order;
}

// ─── Get notes for an order ────────────────────────────────────────────────────
// Joins author profile for display name + avatar
export async function getOrderNotes(orderId: string): Promise<OrderNote[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("order_notes")
    .select(`
      *,
      author:profiles!order_notes_author_id_fkey (
        id, full_name, avatar_url
      )
    `)
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getOrderNotes]", error.message);
    return [];
  }
  return (data as OrderNote[]) ?? [];
}

// ─── Get status history for an order ──────────────────────────────────────────
export async function getOrderStatusHistory(
  orderId: string
): Promise<OrderStatusHistory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("order_status_history")
    .select("*")
    .eq("order_id", orderId)
    .order("changed_at", { ascending: true });

  if (error) {
    console.error("[getOrderStatusHistory]", error.message);
    return [];
  }
  return (data as OrderStatusHistory[]) ?? [];
}

// ─── Dashboard KPI stats (via RPC) ────────────────────────────────────────────
export async function getClientStats(): Promise<ClientStats> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_client_stats");

  if (error || !data) {
    console.error("[getClientStats]", error?.message);
    return {
      total_orders: 0, active_orders: 0,
      completed_orders: 0, total_spent: 0, pending_orders: 0,
    };
  }
  // RPC returns a single row as an array — take the first element
  const row = Array.isArray(data) ? data[0] : data;
  return row as ClientStats;
}

// ─── Orders per month for chart (via RPC) ─────────────────────────────────────
export async function getOrdersByMonth(): Promise<OrdersChartData[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_orders_by_month");

  if (error || !data) {
    console.error("[getOrdersByMonth]", error?.message);
    return [];
  }
  return (data as OrdersChartData[]) ?? [];
}
