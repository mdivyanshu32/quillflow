// lib/errors.ts
// Centralised error handling so Server Actions never leak stack traces
// or Supabase internals to the client.

// ─── Custom error classes ─────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = "UNKNOWN",
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(message = "You must be signed in to do that.") {
    super(message, "UNAUTHENTICATED", 401);
    this.name = "AuthError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found.`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You don't have permission to do that.") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 422);
    this.name = "ValidationError";
  }
}

// ─── Safe error message extractor ─────────────────────────────────────────────
// Converts any thrown value into a user-safe string.
// Never exposes stack traces, Supabase internals, or raw Postgres errors.

const SAFE_SUPABASE_ERRORS: Record<string, string> = {
  "23505": "A record with that value already exists.",
  "23503": "Related record not found.",
  "42501": "You don't have permission to do that.",
  "PGRST116": "Record not found.",
};

export function toSafeError(err: unknown): string {
  if (err instanceof AppError) return err.message;

  if (err instanceof Error) {
    // Supabase Postgres error codes are in the message
    for (const [code, msg] of Object.entries(SAFE_SUPABASE_ERRORS)) {
      if (err.message.includes(code)) return msg;
    }
    // Auth-specific Supabase messages that are safe to show
    if (err.message.includes("Invalid login credentials")) {
      return "Invalid email or password.";
    }
    if (err.message.includes("Email not confirmed")) {
      return "Please verify your email address first.";
    }
    if (err.message.includes("already registered")) {
      return "An account with this email already exists.";
    }
    if (err.message.includes("JWT")) {
      return "Your session has expired. Please sign in again.";
    }
  }

  // Fallback — never expose the raw error
  return "Something went wrong. Please try again.";
}

// ─── Server Action result wrapper ─────────────────────────────────────────────
// Wrap every async Server Action body so errors never propagate unhandled.

export type ActionResult<T = void> =
  | { ok: true;  data: T }
  | { ok: false; error: string };

export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    // Log full error server-side for debugging
    console.error("[ActionError]", err);
    return { ok: false, error: toSafeError(err) };
  }
}

// ─── Route handler error response helper ─────────────────────────────────────
import { NextResponse } from "next/server";

export function errorResponse(err: unknown, defaultStatus = 500): NextResponse {
  const message = toSafeError(err);
  const status  = err instanceof AppError ? err.statusCode : defaultStatus;
  return NextResponse.json({ error: message }, { status });
}
