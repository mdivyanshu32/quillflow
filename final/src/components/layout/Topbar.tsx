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
        "h-14 shrink-0 flex items-center justify-between px-6 z-20",
        "border-b border-white/5 bg-black/40 backdrop-blur-2xl",
        className
      )}
    >
      {/* Left: title + breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5 font-mono uppercase tracking-widest text-[11px]" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-gray-600">/</span>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-500 hover:text-cyan-400 transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-cyan-400 truncate drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest truncate drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            [ {title} ]
          </h1>
        )}
      </div>

      {/* Right: action buttons */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0 ml-4 font-mono">
          {actions}
        </div>
      )}
    </header>
  );
}
