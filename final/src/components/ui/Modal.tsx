"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnBackdrop?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Focus first focusable element on open
  useEffect(() => {
    if (!isOpen) return;
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "relative w-full bg-white dark:bg-gray-950 rounded-2xl shadow-xl",
          "border border-gray-200 dark:border-gray-800",
          "animate-in zoom-in-95 fade-in duration-150",
          sizeClasses[size]
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 p-5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-base font-semibold text-gray-900 dark:text-gray-100"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close modal"
              className="shrink-0 -mr-1 -mt-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        )}

        {/* Body */}
        <div className="p-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 pb-5 pt-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
