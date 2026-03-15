"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5" aria-hidden>*</span>
            )}
          </label>
        )}

        {/* Input wrapper (for icon positioning) */}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 [&>svg]:h-4 [&>svg]:w-4 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base
              "w-full h-9 rounded-lg border bg-white text-sm text-gray-900",
              "placeholder:text-gray-400 transition-colors",
              // Border & focus
              "border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 focus:border-transparent",
              // Dark mode
              "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:placeholder:text-gray-500",
              "dark:focus:ring-gray-100",
              // Error state
              error && "border-red-400 focus:ring-red-500 dark:border-red-600",
              // Icon padding
              leftIcon ? "pl-9" : "pl-3",
              rightIcon ? "pr-9" : "pr-3",
              // Disabled
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 [&>svg]:h-4 [&>svg]:w-4 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        {/* Helper text (only shown when no error) */}
        {!error && helperText && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
