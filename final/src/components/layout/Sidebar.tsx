"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import type { Profile } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/Toaster";

// ─── Icons (inline SVG to avoid heavy icon dep) ────────────────────────────────
function DashboardIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25A2.25 2.25 0 018.25 10.5H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

const ICON_MAP = { DashboardIcon, FileText: OrdersIcon, Settings: SettingsIcon };

// ─── Props ─────────────────────────────────────────────────────────────────────
interface SidebarProps {
  profile: Profile | null;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function Sidebar({ profile }: SidebarProps) {
  const pathname  = usePathname();
  const router    = useRouter();
  const supabase  = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className={cn(
      "flex flex-col w-56 shrink-0 h-screen sticky top-0",
      "bg-gray-50 border-r border-gray-200",
      "dark:bg-gray-950 dark:border-gray-800",
    )}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center shrink-0">
            <svg className="h-4 w-4 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-700 transition-colors">
            Quillflow
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          const Icon = ICON_MAP[icon as keyof typeof ICON_MAP];
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-white text-gray-900 shadow-sm font-medium dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  : "text-gray-600 hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200"
              )}
            >
              {Icon && <Icon />}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <Link href="/settings" className="flex items-center gap-2.5 mb-2 px-1 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors group">
          {/* Avatar */}
          <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-medium text-blue-700 dark:text-blue-300 shrink-0">
            {profile?.full_name ? getInitials(profile.full_name) : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
              {profile?.full_name ?? "My Account"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
              {profile?.company ?? "Settings"}
            </p>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start text-gray-500 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign out
        </Button>
      </div>
    </aside>
  );
}
