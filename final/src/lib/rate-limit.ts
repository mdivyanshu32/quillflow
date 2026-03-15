// lib/rate-limit.ts
// Simple in-memory rate limiter for Edge/Node.js runtime.
// For production at scale, replace the Map store with an Upstash Redis client.
//
// Usage in a Route Handler:
//   const limit = await rateLimit(request, { max: 5, windowMs: 60_000 })
//   if (!limit.ok) return limit.response

import { NextRequest, NextResponse } from "next/server";

interface RateLimitOptions {
  max:      number;   // max requests per window
  windowMs: number;   // window size in ms
  keyFn?:   (req: NextRequest) => string;
}

interface RateLimitStore {
  count:     number;
  resetTime: number;
}

// In-memory store — resets on cold start / serverless reuse
// Replace with: import { Redis } from "@upstash/redis"
const store = new Map<string, RateLimitStore>();

export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const { max, windowMs, keyFn } = options;

  // Default key: IP address (Netlify/Vercel set x-forwarded-for)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const key = keyFn ? keyFn(request) : `rate:${ip}:${request.nextUrl.pathname}`;

  const now   = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    // First request in this window
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= max) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        {
          status:  429,
          headers: {
            "Retry-After":       String(retryAfter),
            "X-RateLimit-Limit": String(max),
            "X-RateLimit-Reset": String(Math.ceil(entry.resetTime / 1000)),
          },
        }
      ),
    };
  }

  entry.count += 1;
  return { ok: true };
}

// ─── Pre-configured limiters ───────────────────────────────────────────────────
// Tight limit for auth endpoints (prevent brute-force)
export const authRateLimit = (req: NextRequest) =>
  rateLimit(req, { max: 5, windowMs: 60_000 });

// Looser limit for general API use
export const apiRateLimit = (req: NextRequest) =>
  rateLimit(req, { max: 60, windowMs: 60_000 });
