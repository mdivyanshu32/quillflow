// lib/validations.ts
// Single source of truth for all input schemas.
// Imported by both react-hook-form (client) and Server Actions (server)
// so validation rules can never drift apart between the two layers.

import { z } from "zod";

// ─── Re-usable field atoms ────────────────────────────────────────────────────
const uuidField    = z.string().uuid("Invalid ID format");
const emailField   = z.string().email("Please enter a valid email address");
const passwordField = z
  .string()
  .min(8,   "Password must be at least 8 characters")
  .max(128, "Password must be under 128 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number");

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const signInSchema = z.object({
  email:    emailField,
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    full_name:        z.string().min(2, "Name must be at least 2 characters").max(80),
    email:            emailField,
    password:         passwordField,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path:    ["confirm_password"],
  });

export const resetPasswordSchema = z.object({
  email: emailField,
});

export const updatePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password:     passwordField,
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path:    ["confirm_password"],
  })
  .refine((d) => d.current_password !== d.new_password, {
    message: "New password must be different from current password",
    path:    ["new_password"],
  });

// ─── Order ────────────────────────────────────────────────────────────────────
export const createOrderSchema = z.object({
  title: z
    .string()
    .min(5,   "Title must be at least 5 characters")
    .max(120, "Title must be under 120 characters")
    .regex(/^[^<>{}[\]\\]*$/, "Title contains invalid characters"),

  description: z
    .string()
    .min(20,   "Please provide at least 20 characters of description")
    .max(5000, "Description must be under 5,000 characters"),

  word_count: z
    .number({ invalid_type_error: "Word count must be a number" })
    .int("Word count must be a whole number")
    .min(100,   "Minimum order is 100 words")
    .max(50000, "Maximum order is 50,000 words per submission"),

  content_type: z.enum(
    ["blog_post","website_copy","product_description","social_media",
     "email_sequence","whitepaper","case_study","other"],
    { errorMap: () => ({ message: "Please select a content type" }) }
  ),

  tone: z.enum(
    ["professional","conversational","persuasive","informative","humorous","inspirational"],
    { errorMap: () => ({ message: "Please select a tone" }) }
  ),

  target_audience: z
    .string()
    .max(200, "Target audience must be under 200 characters")
    .optional()
    .or(z.literal("")),

  special_instructions: z
    .string()
    .max(1000, "Special instructions must be under 1,000 characters")
    .optional()
    .or(z.literal("")),

  deadline: z
    .string()
    .optional()
    .refine(
      (val) => !val || new Date(val) > new Date(),
      "Deadline must be in the future"
    ),
});

export const updateOrderSchema = createOrderSchema
  .partial()
  .extend({ id: uuidField });

// ─── Note ─────────────────────────────────────────────────────────────────────
export const addNoteSchema = z.object({
  order_id: uuidField,
  content: z
    .string()
    .min(1,    "Note cannot be empty")
    .max(2000, "Note must be under 2,000 characters")
    .transform((s) => s.trim()),
});

// ─── Profile ──────────────────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be under 80 characters"),

  company: z
    .string()
    .max(100, "Company name must be under 100 characters")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .max(30, "Phone must be under 30 characters")
    .regex(/^[+\d\s\-().]*$/, "Phone contains invalid characters")
    .optional()
    .or(z.literal("")),

  timezone: z.string().min(1, "Please select a timezone"),

  email_notifications: z.boolean(),
});

// ─── Avatar upload ─────────────────────────────────────────────────────────────
export const avatarSchema = z.object({
  size:     z.number().max(2 * 1024 * 1024, "Avatar must be under 2 MB"),
  type:     z.enum(
    ["image/jpeg", "image/png", "image/webp"],
    { errorMap: () => ({ message: "Supported formats: JPEG, PNG, WebP" }) }
  ),
});

// ─── Inferred types ────────────────────────────────────────────────────────────
export type SignInInput         = z.infer<typeof signInSchema>;
export type SignUpInput          = z.infer<typeof signUpSchema>;
export type CreateOrderInput    = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput    = z.infer<typeof updateOrderSchema>;
export type AddNoteInput        = z.infer<typeof addNoteSchema>;
export type UpdateProfileInput  = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
