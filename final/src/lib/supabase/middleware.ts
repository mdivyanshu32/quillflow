// lib/supabase/middleware.ts
// Called once per request in middleware.ts to refresh the session cookie
// before any page or route handler runs.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies to both the request (for downstream) and the response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — do NOT remove this call.
  // It re-runs on every request to keep the JWT fresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ─── Route protection ─────────────────────────────────────────────────────
  const path = request.nextUrl.pathname;
  const isProtected = path.startsWith("/dashboard") ||
                      path.startsWith("/orders")    ||
                      path.startsWith("/settings");
  const isAuthRoute  = path.startsWith("/login") || path.startsWith("/register");

  if (isProtected && !user) {
    // Unauthenticated → redirect to login, preserve intended destination
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && user) {
    // Already logged in → redirect away from auth pages
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
