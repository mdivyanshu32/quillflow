// middleware.ts  (project root)
// ─────────────────────────────────────────────────────────────────────────────
// Runs on EVERY matching request at the Edge, before any page renders.
// Responsibilities:
//   1. Refresh Supabase session cookie (keeps JWT alive)
//   2. Protect dashboard/orders/settings routes → redirect to /login
//   3. Redirect already-authenticated users away from /login and /register
//   4. Inject security headers on every response
//   5. Block obvious malicious path patterns
// ─────────────────────────────────────────────────────────────────────────────

import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// ─── Paths that require an authenticated session ──────────────────────────────
const PROTECTED_PREFIXES = ["/dashboard", "/orders", "/settings"];

// ─── Paths only for unauthenticated users ─────────────────────────────────────
const AUTH_ONLY_PATHS = ["/login", "/register", "/forgot-password"];

// ─── Blocked path patterns (basic WAF layer) ─────────────────────────────────
const BLOCKED_PATTERNS = [
  /\/\.env/,
  /\/\.git/,
  /\/wp-admin/,
  /\/phpMyAdmin/i,
  /\.(php|asp|aspx|jsp)$/i,
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Block malicious path patterns immediately ──────────────────────────
  if (BLOCKED_PATTERNS.some((p) => p.test(pathname))) {
    return new NextResponse("Not found", { status: 404 });
  }

  // ── 2. Run Supabase session refresh + route protection ────────────────────
  const response = await updateSession(request);

  // ── 3. Attach security headers to every response ─────────────────────────
  const headers = response.headers;

  // Prevent clickjacking
  headers.set("X-Frame-Options", "DENY");

  // Prevent MIME-type sniffing
  headers.set("X-Content-Type-Options", "nosniff");

  // Force HTTPS for 1 year, include subdomains
  headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Disable referrer for cross-origin requests
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Limit browser features
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // Content-Security-Policy
  // Adjust script-src / connect-src if you add third-party scripts
  const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
    : "*.supabase.co";

  const csp = [
    "default-src 'self'",
    // Next.js inlines scripts; unsafe-inline is required unless using nonces
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}`,
    "img-src 'self' blob: data: https://*.supabase.co",
    "font-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  headers.set("Content-Security-Policy", csp);

  // Remove fingerprinting headers set by some hosting platforms
  headers.delete("X-Powered-By");
  headers.delete("Server");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
