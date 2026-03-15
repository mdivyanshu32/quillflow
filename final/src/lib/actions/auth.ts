// lib/actions/auth.ts
"use server";

import { redirect }       from "next/navigation";
import { revalidatePath } from "next/cache";
import { z }              from "zod";
import { createClient }   from "@/lib/supabase/server";

// ─── Schemas ───────────────────────────────────────────────────────────────────
const signInSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email:     z.string().email("Invalid email address"),
  password:  z.string().min(8, "Password must be at least 8 characters"),
});

// ─── Sign in ───────────────────────────────────────────────────────────────────
export async function signIn(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email:    formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Supabase returns "Invalid login credentials" — keep it generic for security
    return { error: "Invalid email or password. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// ─── Sign up ───────────────────────────────────────────────────────────────────
export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    full_name: formData.get("full_name"),
    email:     formData.get("email"),
    password:  formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email:    parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
      },
      // Uncomment after configuring Supabase Email Templates:
      // emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }

  // Profile is auto-created by the DB trigger — no manual insert needed
  return { success: "Account created! Check your email to verify." };
}

// ─── Sign out ──────────────────────────────────────────────────────────────────
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// ─── Reset password (sends magic link email) ──────────────────────────────────
export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  });

  // Always return success to avoid email enumeration
  if (error) console.error("[resetPassword]", error.message);
  return { success: "If that email exists, a reset link has been sent." };
}

// ─── Update password (after reset flow) ───────────────────────────────────────
export async function updatePassword(formData: FormData) {
  const newPassword = formData.get("new_password") as string;

  if (!newPassword || newPassword.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return { error: error.message };
  return { success: "Password updated successfully." };
}
