"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { SelectOption } from "@/lib/types";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-0.5" aria-hidden>*</span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full h-9 pl-3 pr-8 rounded-lg border bg-white text-sm text-gray-900",
              "border-gray-200 transition-colors appearance-none cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent",
              "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700",
              "dark:focus:ring-gray-100",
              error && "border-red-400 focus:ring-red-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

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

Select.displayName = "Select";
