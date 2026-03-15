"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { cn, formatCurrency, calculateOrderPrice } from "@/lib/utils";
import {
  CONTENT_TYPE_OPTIONS,
  CONTENT_TONE_OPTIONS,
} from "@/lib/constants";
import { Input }    from "@/components/ui/Input";
import { Select }   from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button }   from "@/components/ui/Button";
import { Badge }    from "@/components/ui/Badge";
import { toast }    from "@/components/ui/Toaster";
import type { CreateOrderInput } from "@/lib/types";

// ─── Zod schema ────────────────────────────────────────────────────────────────
const createOrderSchema = z.object({
  title: z
    .string()
    .min(5,  "Title must be at least 5 characters")
    .max(120, "Title must be under 120 characters"),
  description: z.string().min(20, "Please provide at least 20 characters of description"),
  word_count: z
    .number({ invalid_type_error: "Word count must be a number" })
    .min(100,   "Minimum 100 words")
    .max(50000, "Maximum 50,000 words per order"),
  content_type: z.enum(["blog_post","website_copy","product_description","social_media","email_sequence","whitepaper","case_study","other"]),
  tone: z.enum(["professional","conversational","persuasive","informative","humorous","inspirational"]),
  target_audience: z.string().max(200).optional(),
  special_instructions: z.string().max(1000).optional(),
  deadline: z.string().optional(),
});

type FormValues = z.infer<typeof createOrderSchema>;

// ─── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6" role="list" aria-label="Form steps">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
              i < current
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : i === current
                  ? "border-2 border-gray-900 text-gray-900 dark:border-white dark:text-white"
                  : "border border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-600"
            )}
          >
            {i < current ? (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < total - 1 && (
            <div className={cn(
              "h-px w-10 transition-colors",
              i < current ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-800"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────
interface OrderFormProps {
  onSubmit: (data: CreateOrderInput) => Promise<{ error?: string }>;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function OrderForm({ onSubmit }: OrderFormProps) {
  const router    = useRouter();
  const [step, setStep]         = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      word_count:   1000,
      content_type: "blog_post",
      tone:         "professional",
    },
  });

  // Live price preview
  const watchedWordCount    = watch("word_count");
  const watchedContentType  = watch("content_type");
  const estimatedPrice      = calculateOrderPrice(watchedWordCount ?? 0, watchedContentType ?? "blog_post");

  // Step field map — validate only the fields on the current step
  const STEP_FIELDS: (keyof FormValues)[][] = [
    ["title", "content_type", "word_count"],
    ["description", "tone", "target_audience", "special_instructions", "deadline"],
  ];

  async function handleNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  }

  async function handleFormSubmit(data: FormValues) {
    setIsSubmitting(true);
    const result = await onSubmit({
      ...data,
      target_audience:      data.target_audience ?? "",
      special_instructions: data.special_instructions ?? "",
      deadline:             data.deadline ?? "",
    });
    setIsSubmitting(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Order placed successfully!");
      router.push("/orders");
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-xl">
      <StepIndicator current={step} total={3} />

      {/* ── STEP 0: Basics ── */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Order basics
          </h2>
          <Input
            label="Order title"
            placeholder="e.g. Homepage & About Us Website Copy"
            error={errors.title?.message}
            required
            {...register("title")}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Content type"
              options={CONTENT_TYPE_OPTIONS}
              error={errors.content_type?.message}
              required
              {...register("content_type")}
            />
            <Input
              label="Word count"
              type="number"
              min={100}
              max={50000}
              error={errors.word_count?.message}
              required
              {...register("word_count", { valueAsNumber: true })}
            />
          </div>
          {/* Live price preview */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <span className="text-sm text-gray-600 dark:text-gray-400">Estimated price</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(estimatedPrice)}
            </span>
          </div>
        </div>
      )}

      {/* ── STEP 1: Details ── */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Content brief
          </h2>
          <Textarea
            label="Description"
            placeholder="Describe what you need, key points to cover, any references…"
            autoResize
            error={errors.description?.message}
            required
            {...register("description")}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Tone"
              options={CONTENT_TONE_OPTIONS}
              error={errors.tone?.message}
              required
              {...register("tone")}
            />
            <Input
              label="Deadline"
              type="date"
              error={errors.deadline?.message}
              {...register("deadline")}
            />
          </div>
          <Input
            label="Target audience"
            placeholder="e.g. SaaS buyers aged 25–45"
            error={errors.target_audience?.message}
            {...register("target_audience")}
          />
          <Textarea
            label="Special instructions"
            placeholder="Brand voice notes, things to avoid, competitor examples…"
            autoResize
            error={errors.special_instructions?.message}
            {...register("special_instructions")}
          />
        </div>
      )}

      {/* ── STEP 2: Review ── */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Review & confirm
          </h2>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            {[
              ["Title",         watch("title")],
              ["Type",          CONTENT_TYPE_OPTIONS.find(o => o.value === watch("content_type"))?.label],
              ["Words",         `${watch("word_count").toLocaleString()} words`],
              ["Tone",          CONTENT_TONE_OPTIONS.find(o => o.value === watch("tone"))?.label],
              ["Deadline",      watch("deadline") || "Not specified"],
              ["Target audience", watch("target_audience") || "—"],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex justify-between items-center px-4 py-2.5 text-sm">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 text-right max-w-[60%] truncate">
                  {value}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-900">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(estimatedPrice)}
              </span>
            </div>
          </div>
          <Badge variant="info" className="text-xs">
            Payment is due on delivery. We will confirm your order within 24 hours.
          </Badge>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => step === 0 ? router.back() : setStep((s) => s - 1)}
        >
          {step === 0 ? "Cancel" : "Back"}
        </Button>

        {step < 2 ? (
          <Button type="button" variant="primary" size="md" onClick={handleNext}>
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
          >
            Place order
          </Button>
        )}
      </div>
    </form>
  );
}
