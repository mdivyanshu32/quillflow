// lib/queries/profile.ts
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

// ─── Get the current user's profile ───────────────────────────────────────────
export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();

  // Get user from session first — avoids extra round-trip
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[getProfile]", error.message);
    return null;
  }
  return data as Profile;
}

// ─── Get profile by user ID (admin use only — uses service_role) ──────────────
export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as Profile;
}
