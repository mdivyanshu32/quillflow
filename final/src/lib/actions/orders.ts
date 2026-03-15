// lib/actions/orders.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect }       from "next/navigation";
import { z }              from "zod";
import { createClient }   from "@/lib/supabase/server";
import { calculateOrderPrice } from "@/lib/utils";

// ─── Schemas ───────────────────────────────────────────────────────────────────
const createOrderSchema = z.object({
  title: z
    .string()
    .min(5,   "Title must be at least 5 characters")
    .max(120, "Title must be under 120 characters"),
  description: z
    .string()
    .min(20, "Please provide at least 20 characters of description"),
  word_count: z
    .number()
    .min(100,   "Minimum 100 words")
    .max(50000, "Maximum 50,000 words"),
  content_type: z.enum([
    "blog_post","website_copy","product_description",
    "social_media","email_sequence","whitepaper","case_study","other",
  ]),
  tone: z.enum([
    "professional","conversational","persuasive",
    "informative","humorous","inspirational",
  ]),
  target_audience:      z.string().max(200).optional(),
  special_instructions: z.string().max(1000).optional(),
  deadline:             z.string().optional(),
});

const addNoteSchema = z.object({
  order_id: z.string().uuid(),
  content:  z.string().min(1, "Note cannot be empty").max(2000),
});

// ─── Helpers ───────────────────────────────────────────────────────────────────
async function getAuthenticatedUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthenticated");
  return { supabase, user };
}

// ─── Create order ──────────────────────────────────────────────────────────────
export async function createOrder(
  input: z.infer<typeof createOrderSchema>
): Promise<{ error?: string; orderId?: string }> {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    const { supabase, user } = await getAuthenticatedUser();
    const total_price = calculateOrderPrice(
      parsed.data.word_count,
      parsed.data.content_type
    );

    const { data, error } = await supabase
      .from("orders")
      .insert({
        client_id:            user.id,
        title:                parsed.data.title,
        description:          parsed.data.description,
        word_count:           parsed.data.word_count,
        content_type:         parsed.data.content_type,
        tone:                 parsed.data.tone,
        target_audience:      parsed.data.target_audience ?? null,
        special_instructions: parsed.data.special_instructions ?? null,
        deadline:             parsed.data.deadline || null,
        total_price,
      })
      .select("id")
      .single();

    if (error) throw error;

    revalidatePath("/orders");
    revalidatePath("/dashboard");
    return { orderId: data.id };
  } catch (err) {
    console.error("[createOrder]", err);
    return { error: "Failed to place order. Please try again." };
  }
}

// ─── Update order (client-editable fields only) ────────────────────────────────
const updateOrderSchema = createOrderSchema.partial().extend({
  id: z.string().uuid(),
});

export async function updateOrder(
  input: z.infer<typeof updateOrderSchema>
): Promise<{ error?: string }> {
  const parsed = updateOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    const { supabase, user } = await getAuthenticatedUser();
    const { id, ...fields } = parsed.data;

    // Recalculate price if word_count or content_type changed
    const updates: Record<string, unknown> = { ...fields };
    if (fields.word_count && fields.content_type) {
      updates.total_price = calculateOrderPrice(
        fields.word_count,
        fields.content_type
      );
    }

    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .eq("client_id", user.id)   // extra safety on top of RLS
      .in("status", ["pending"]);  // only allow edits on pending orders

    if (error) throw error;

    revalidatePath(`/orders/${id}`);
    revalidatePath("/orders");
    return {};
  } catch (err) {
    console.error("[updateOrder]", err);
    return { error: "Failed to update order." };
  }
}

// ─── Delete order (pending only) ───────────────────────────────────────────────
export async function deleteOrder(
  orderId: string
): Promise<{ error?: string }> {
  if (!orderId) return { error: "Order ID is required." };

  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId)
      .eq("client_id", user.id)
      .eq("status", "pending");   // RLS also enforces this; belt + suspenders

    if (error) throw error;

    revalidatePath("/orders");
    revalidatePath("/dashboard");
    return {};
  } catch (err) {
    console.error("[deleteOrder]", err);
    return { error: "Failed to delete order." };
  }
}

// ─── Request revision ─────────────────────────────────────────────────────────
export async function requestRevision(
  orderId: string,
  reason: string
): Promise<{ error?: string }> {
  if (!orderId || !reason.trim()) {
    return { error: "A reason for the revision is required." };
  }

  try {
    const { supabase, user } = await getAuthenticatedUser();

    // 1. Add a note explaining the revision
    await supabase.from("order_notes").insert({
      order_id:  orderId,
      author_id: user.id,
      content:   `Revision requested: ${reason.trim()}`,
    });

    // 2. Update status to revision
    const { error } = await supabase
      .from("orders")
      .update({ status: "revision" })
      .eq("id", orderId)
      .eq("client_id", user.id)
      .eq("status", "in_progress");

    if (error) throw error;

    revalidatePath(`/orders/${orderId}`);
    return {};
  } catch (err) {
    console.error("[requestRevision]", err);
    return { error: "Failed to submit revision request." };
  }
}

// ─── Add note ──────────────────────────────────────────────────────────────────
export async function addNote(
  input: { order_id: string; content: string }
): Promise<{ error?: string }> {
  const parsed = addNoteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    const { supabase, user } = await getAuthenticatedUser();

    const { error } = await supabase.from("order_notes").insert({
      order_id:  parsed.data.order_id,
      author_id: user.id,
      content:   parsed.data.content,
    });

    if (error) throw error;

    revalidatePath(`/orders/${parsed.data.order_id}`);
    return {};
  } catch (err) {
    console.error("[addNote]", err);
    return { error: "Failed to send note." };
  }
}
