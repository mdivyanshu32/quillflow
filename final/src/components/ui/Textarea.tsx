"use client";

import { forwardRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | undefined;
  error?: string | undefined;
  helperText?: string | undefined;
  autoResize?: boolean | undefined;
  containerClassName?: string | undefined;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      autoResize = false,
      className,
      containerClassName,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    // Sync internal + forwarded ref
    function setRef(el: HTMLTextAreaElement | null) {
      internalRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
    }

    // Auto-resize logic
    function resize() {
      const el = internalRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }

    useEffect(() => { resize(); }, []);

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      resize();
      onChange?.(e);
    }

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5" aria-hidden>*</span>
            )}
          </label>
        )}

        <textarea
          ref={setRef}
          id={textareaId}
          onChange={handleChange}
          className={cn(
            "w-full min-h-[88px] px-3 py-2.5 rounded-lg border bg-white text-sm text-gray-900",
            "placeholder:text-gray-400 transition-colors resize-none",
            "border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent",
            "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700",
            "dark:focus:ring-gray-100",
            error && "border-red-400 focus:ring-red-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            autoResize && "overflow-hidden",
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
