"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ─── Variant & size maps ───────────────────────────────────────────────────────
const variants = {
  primary:
    "bg-gray-900 text-white border-transparent hover:bg-gray-800 active:bg-gray-950 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
  secondary:
    "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 active:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800",
  ghost:
    "bg-transparent text-gray-600 border-transparent hover:bg-gray-100 active:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800",
  danger:
    "bg-white text-red-600 border-red-200 hover:bg-red-50 active:bg-red-100 dark:bg-gray-900 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950",
  outline:
    "bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800",
} as const;

const sizes = {
  sm: "h-7 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-sm gap-2",
} as const;

// ─── Props ─────────────────────────────────────────────────────────────────────
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base
          "inline-flex items-center justify-center font-medium",
          "border rounded-lg transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]",
          // Variant + size
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="animate-spin h-3.5 w-3.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {/* Left icon (hidden during loading) */}
        {!isLoading && leftIcon && (
          <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{leftIcon}</span>
        )}

        {children}

        {/* Right icon */}
        {rightIcon && (
          <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
