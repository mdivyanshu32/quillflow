import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopbarProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function Topbar({ title, breadcrumbs, actions, className }: TopbarProps) {
  return (
    <header
      className={cn(
        "h-14 shrink-0 flex items-center justify-between px-6",
        "border-b border-gray-200 dark:border-gray-800",
        "bg-white dark:bg-gray-950",
        className
      )}
    >
      {/* Left: title + breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Right: action buttons */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {actions}
        </div>
      )}
    </header>
  );
}
