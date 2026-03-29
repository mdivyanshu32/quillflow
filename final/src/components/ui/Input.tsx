"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | undefined;
  error?: string | undefined;
  helperText?: string | undefined;
  leftIcon?: React.ReactNode | undefined;
  rightIcon?: React.ReactNode | undefined;
  containerClassName?: string | undefined;
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
              "w-full h-9 rounded-lg border text-sm transition-colors",
               // Cyber HUD styling overrides native inputs
              "bg-[#0a0f1c]/50 text-indigo-100 border-indigo-500/20 placeholder:text-indigo-400/30",
              "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50",
              "dark:bg-[#0a0f1c]/50 dark:text-indigo-100 dark:border-indigo-500/20 dark:placeholder:text-indigo-400/30",
              "dark:focus:ring-cyan-500/30",
              // Error state
              error && "border-red-500/50 focus:ring-red-500/30 dark:border-red-500/50",
              // Icon padding
              leftIcon ? "pl-9" : "pl-3",
              rightIcon ? "pr-9" : "pr-3",
              // Disabled
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-900/50",
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
