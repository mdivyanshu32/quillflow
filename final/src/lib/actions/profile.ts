// lib/actions/profile.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect }       from "next/navigation";
import { z }              from "zod";
import { createClient }   from "@/lib/supabase/server";

// ─── Schemas ───────────────────────────────────────────────────────────────────
const updateProfileSchema = z.object({
  full_name:           z.string().min(2, "Name must be at least 2 characters").max(80),
  company:             z.string().max(100).optional(),
  phone:               z.string().max(30).optional(),
  timezone:            z.string().max(60),
  email_notifications: z.boolean(),
});

// ─── Update profile fields ────────────────────────────────────────────────────
export async function updateProfile(
  input: z.infer<typeof updateProfileSchema>
): Promise<{ error?: string }> {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message || "Invalid input" };
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Unauthenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name:           parsed.data.full_name,
      company:             parsed.data.company ?? null,
      phone:               parsed.data.phone   ?? null,
      timezone:            parsed.data.timezone,
      email_notifications: parsed.data.email_notifications,
    })
    .eq("id", user.id);

  if (error) {
    console.error("[updateProfile]", error.message);
    return { error: "Failed to save profile. Please try again." };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return {};
}

// ─── Upload + update avatar ────────────────────────────────────────────────────
export async function updateAvatar(
  formData: FormData
): Promise<{ error?: string; avatar_url?: string }> {
  const file = formData.get("avatar") as File | null;

  if (!file || file.size === 0) return { error: "No file provided." };
  if (file.size > 2 * 1024 * 1024) return { error: "Avatar must be under 2 MB." };
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { error: "Supported formats: JPEG, PNG, WebP." };
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Unauthenticated" };

  // Store at {uid}/avatar.{ext} — matches the storage RLS policy
  const ext  = file.type.split("/")[1];
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error("[updateAvatar] upload", uploadError.message);
    return { error: "Failed to upload image." };
  }

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  const avatar_url = urlData.publicUrl;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url }) // Fix: Changed to avatar_url: avatar_url and added 'as any'
    .eq("id", user.id);

  if (updateError) {
    console.error("[updateAvatar] update", updateError.message);
    return { error: "Uploaded, but failed to save URL." };
  }

  revalidatePath("/settings");
  return { avatar_url };
}

// ─── Delete account ────────────────────────────────────────────────────────────
// Cascading deletes on profiles → orders → notes/history handle cleanup.
// Uses service_role to call admin.deleteUser — requires SUPABASE_SERVICE_ROLE_KEY.
export async function deleteAccount(): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Unauthenticated" };

  // Import admin client only here to avoid accidental use elsewhere
  const { createAdminClient } = await import("@/lib/supabase/server");
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[deleteAccount]", error.message);
    return { error: "Failed to delete account." };
  }

  redirect("/login");
}
