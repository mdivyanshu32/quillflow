// app/api/webhooks/route.ts
// Receives external webhooks (e.g. payment provider callbacks).
// Verifies HMAC signature before touching any data.

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient }         from "@/lib/supabase/server";
import { errorResponse }             from "@/lib/errors";
import crypto                        from "crypto";

// ─── Signature verification ───────────────────────────────────────────────────
function verifySignature(
  payload:   string,
  signature: string,
  secret:    string
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex");
  // Constant-time comparison prevents timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody  = await request.text();
    const signature = request.headers.get("x-webhook-signature") ?? "";
    const secret    = process.env.WEBHOOK_SECRET;

    if (!secret) {
      console.error("[webhook] WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (!verifySignature(rawBody, signature, secret)) {
      console.warn("[webhook] Invalid signature from", request.headers.get("x-forwarded-for"));
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      type:    string;
      orderId: string;
      status?: string;
    };

    const supabase = createAdminClient();

    // Handle order status update from payment/fulfilment provider
    if (event.type === "order.status_updated" && event.orderId && event.status) {
      const { error } = await supabase
        .from("orders")
        .update({ status: event.status })
        .eq("id", event.orderId);

      if (error) throw error;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    return errorResponse(err);
  }
}

// Only accept POST
export function GET()    { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export function PUT()    { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export function DELETE() { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
