// lib/supabase/server.ts
// Used in Server Components, Server Actions, and Route Handlers.
// Reads/writes cookies via next/headers — must NOT be imported in "use client" files.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component read context — safe to ignore.
            // The middleware refreshes the session cookie.
          }
        },
      },
    }
  );
}

// ─── Admin client — uses service_role key, bypasses RLS ─────────────────────
// Only import this in trusted server-side code (webhooks, admin actions).
// NEVER expose to the browser.
export function createAdminClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession:   false,
      },
    }
  );
}
