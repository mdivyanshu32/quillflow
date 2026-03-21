// ─── OrderStatusTimeline.tsx ────────────────────────────────────────────────────
"use client";

import { cn, formatDate } from "@/lib/utils";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import type { OrderStatusHistory } from "@/lib/types";

interface OrderStatusTimelineProps {
  history: OrderStatusHistory[];
}

export function OrderStatusTimeline({ history }: OrderStatusTimelineProps) {
  return (
    <ol className="space-y-0">
      {history.map((entry, i) => {
        const cfg = ORDER_STATUS_CONFIG[entry.to_status];
        const isLast = i === history.length - 1;

        return (
          <li key={entry.id} className="flex gap-3">
            {/* Dot + connecting line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full mt-1 shrink-0 ring-2 ring-white dark:ring-gray-950",
                  cfg.dotColor
                )}
              />
              {!isLast && (
                <div className="w-px flex-1 bg-gray-200 dark:bg-gray-800 my-1" />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-4", isLast && "pb-0")}>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {cfg.label}
              </p>
              {entry.note && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {entry.note}
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {formatDate(entry.changed_at, {
                  month: "short", day: "numeric",
                  hour: "numeric", minute: "2-digit",
                })}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}


// ─── NotesThread.tsx ────────────────────────────────────────────────────────────


import { useState } from "react";
import { getInitials, formatRelativeDate } from "@/lib/utils";
import type { OrderNote } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

interface NotesThreadProps {
  notes: OrderNote[];
  currentUserId: string;
  orderId: string;
  onAddNote: (content: string) => Promise<any>;
}

export function NotesThread({
  notes,
  currentUserId,
  onAddNote,
}: Omit<NotesThreadProps, "orderId">) {
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setIsPending(true);
    try {
      await onAddNote(content.trim());
      setContent("");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Note list */}
      <ul className="space-y-4">
        {notes.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No notes yet — be the first to leave one.
          </p>
        )}
        {notes.map((note) => {
          const isOwn = note.author_id === currentUserId;
          const name  = note.author?.full_name ?? "Unknown";
          return (
            <li
              key={note.id}
              className={cn(
                "flex gap-3",
                isOwn && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-medium text-blue-700 dark:text-blue-300 shrink-0">
                {getInitials(name)}
              </div>

              {/* Bubble */}
              <div className={cn("max-w-[80%]", isOwn && "items-end flex flex-col")}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatRelativeDate(note.created_at)}
                  </span>
                </div>
                <div
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm",
                    isOwn
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-tr-sm"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-tl-sm"
                  )}
                >
                  {note.content}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Compose */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note…"
          autoResize
          className="flex-1 min-h-[60px] max-h-40"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isPending}
          disabled={!content.trim()}
          className="shrink-0"
        >
          Send
        </Button>
      </form>
    </div>
  );
}


// ─── OrderFilters.tsx ───────────────────────────────────────────────────────────


import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

import { STATUS_FILTER_OPTIONS, SORT_OPTIONS } from "@/lib/constants";

export function OrderFilters() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page"); // reset to page 1 on filter change
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  function handleReset() {
    router.replace(pathname, { scroll: false });
  }

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("status") ||
    searchParams.has("sort");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search orders…"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => updateParam("search", e.target.value)}
        className="w-48"
        leftIcon={
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
          </svg>
        }
      />

      <Select
        options={STATUS_FILTER_OPTIONS}
        value={searchParams.get("status") ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
        className="w-36"
      />

      <Select
        options={SORT_OPTIONS}
        value={searchParams.get("sort") ?? "created_at:desc"}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="w-36"
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
