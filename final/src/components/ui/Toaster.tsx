"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--tw-bg-white, #fff)",
          color: "#111827",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "14px",
          fontFamily: "inherit",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)",
          maxWidth: "380px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#16a34a", secondary: "#fff" },
        },
        error: {
          duration: 5000,
          iconTheme: { primary: "#dc2626", secondary: "#fff" },
        },
      }}
    />
  );
}

// ─── Typed helpers so you never import toast directly ──────────────────────────
export { toast } from "react-hot-toast";
