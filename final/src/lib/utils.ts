import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Tailwind class merger ────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency formatter ────────────────────────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─── Date formatter ────────────────────────────────────────────────────────────
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diff = now.getTime() - target.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return formatDate(date, { month: "short", day: "numeric" });
}

// ─── String helpers ────────────────────────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Price calculator ──────────────────────────────────────────────────────────
export const PRICE_PER_WORD: Record<string, number> = {
  blog_post: 0.03,
  website_copy: 0.06,
  product_description: 0.05,
  social_media: 0.08,
  email_sequence: 0.05,
  whitepaper: 0.04,
  case_study: 0.04,
  other: 0.03,
};

export function calculateOrderPrice(
  wordCount: number,
  contentType: string
): number {
  const rate = PRICE_PER_WORD[contentType] ?? 0.03;
  return parseFloat((wordCount * rate).toFixed(2));
}

// ─── Audio Helpers ─────────────────────────────────────────────────────────────
export function playCyberSwoosh() {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio("/fahhh.mp3.mp3");
    audio.play().catch(e => console.error("Audio playback blocked:", e));
  } catch (e) {
    // Ignore audio initialization errors
  }
}

export function playErrorBuzzer() {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio("/error.mp3.mp3");
    audio.play().catch(e => console.error("Audio error blocked:", e));
  } catch (e) {}
}
