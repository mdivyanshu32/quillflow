// hooks/useRealtimeNotes.ts
"use client";

import { useEffect, useState } from "react";
import { createClient }        from "@/lib/supabase/client";
import type { OrderNote }      from "@/lib/types";

// Subscribes to INSERT events on order_notes for a given order_id.
// Merges new notes from the Realtime channel into the initial SSR-fetched list,
// so the first paint is instant (from RSC) and updates are live without polling.

export function useRealtimeNotes(
  orderId: string,
  initialNotes: OrderNote[]
) {
  const [notes, setNotes] = useState<OrderNote[]>(initialNotes);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`order-notes:${orderId}`)
      .on(
        "postgres_changes",
        {
          event:  "INSERT",
          schema: "public",
          table:  "order_notes",
          filter: `order_id=eq.${orderId}`,
        },
        async (payload) => {
          const newNote = payload.new as OrderNote;

          // Skip if this note is already in the list (optimistic insert case)
          if (notes.some((n) => n.id === newNote.id)) return;

          // Fetch the author profile to populate the display name + avatar
          const { data: author } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .eq("id", newNote.author_id)
            .single();

          setNotes((prev) => [
            ...prev,
            { ...newNote, author: author ?? undefined },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { notes, setNotes };
}
