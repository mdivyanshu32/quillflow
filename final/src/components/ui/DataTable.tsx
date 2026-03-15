"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { TableColumn } from "@/lib/types";
import { Spinner } from "./Spinner";

interface DataTableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  keyField?: keyof T;
  className?: string;
}

type SortDir = "asc" | "desc" | null;

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No results found.",
  onRowClick,
  keyField = "id" as keyof T,
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey]   = useState<string | null>(null);
  const [sortDir, setSortDir]   = useState<SortDir>(null);

  // Toggle sort direction
  function handleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  // Client-side sort (server-sorted data skips this gracefully)
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div
      className={cn(
        "w-full border border-gray-200 rounded-xl overflow-hidden dark:border-gray-800",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
              {columns.map((col) => {
                const key = String(col.key);
                const isActive = sortKey === key;
                return (
                  <th
                    key={key}
                    style={col.width ? { width: col.width } : undefined}
                    onClick={() => !col.render && handleSort(key)}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400",
                      "select-none whitespace-nowrap",
                      !col.render && "cursor-pointer hover:text-gray-900 dark:hover:text-gray-200"
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {!col.render && (
                        <SortIcon active={isActive} dir={sortDir} />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <Spinner size="md" className="mx-auto" />
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, i) => (
                <tr
                  key={String(row[keyField] ?? i)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "bg-white dark:bg-gray-950 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                  )}
                >
                  {columns.map((col) => {
                    const key = String(col.key);
                    const value = row[col.key as string] as React.ReactNode;
                    return (
                      <td
                        key={key}
                        className="px-4 py-3 text-gray-700 dark:text-gray-300"
                      >
                        {col.render ? col.render(row) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Sort chevron icon ─────────────────────────────────────────────────────────
function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span
      className={cn(
        "opacity-30 transition-opacity",
        active && "opacity-100"
      )}
    >
      {active && dir === "desc" ? (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      ) : (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      )}
    </span>
  );
}
