// components/orders/RealtimeNotesThread.tsx
// Bridge component: receives SSR-fetched initial notes as props,
// then activates the Realtime subscription on the client.
// The parent Server Component never needs to be re-rendered for new notes.

"use client";

import { useRealtimeNotes } from "@/hooks/useRealtimeNotes";
import { NotesThread }      from "@/components/orders/OrderComponents";
import type { OrderNote }   from "@/lib/types";

interface RealtimeNotesThreadProps {
  orderId:       string;
  initialNotes:  OrderNote[];
  currentUserId: string;
  onAddNote:     (content: string) => Promise<{ error?: string }>;
}

export function RealtimeNotesThread({
  orderId,
  initialNotes,
  currentUserId,
  onAddNote,
}: RealtimeNotesThreadProps) {
  const { notes, setNotes } = useRealtimeNotes(orderId, initialNotes);

  // Optimistic insert: add the note locally before the server confirms,
  // so the UI updates instantly. The Realtime event deduplicates it.
  async function handleAddNote(content: string) {
    const optimistic: OrderNote = {
      id:          `optimistic-${Date.now()}`,
      order_id:    orderId,
      author_id:   currentUserId,
      content,
      is_internal: false,
      created_at:  new Date().toISOString(),
    };
    setNotes((prev) => [...prev, optimistic]);

    const result = await onAddNote(content);
    if (result?.error) {
      // Roll back optimistic note on failure
      setNotes((prev) => prev.filter((n) => n.id !== optimistic.id));
    }
    return result ?? {};
  }

  return (
    <NotesThread
      notes={notes}
      currentUserId={currentUserId}
      onAddNote={handleAddNote}
    />
  );
}
