// src/app/auth/callback/route.ts
// Handles the OAuth / magic-link redirect from Supabase.
// Supabase redirects here after email confirmation or OAuth sign-in.

import { NextRequest, NextResponse } from "next/server";
import { createClient }              from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code        = searchParams.get("code");
  const redirectTo  = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Something went wrong — redirect to login with error param
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
