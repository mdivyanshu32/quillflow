// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // ─── Scan all source files for class names ──────────────────────────────
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],

  // ─── Dark mode via class (toggled by next-themes or manual class) ───────
  darkMode: "class",

  theme: {
    extend: {
      // ── Brand colours ────────────────────────────────────────────────────
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#dbe4ff",
          200: "#bac8ff",
          300: "#91a7ff",
          400: "#748ffc",
          500: "#5c7cfa",
          600: "#4c6ef5",
          700: "#4263eb",
          800: "#3b5bdb",
          900: "#364fc7",
        },
      },

      // ── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans:  ["var(--font-sans)", "system-ui", "sans-serif"],
        mono:  ["var(--font-mono)", "monospace"],
      },

      // ── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        "xl":  "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      // ── Animation utilities ───────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)"   },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 15px 0px rgba(99, 102, 241, 0.4)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 25px 5px rgba(99, 102, 241, 0.7)" },
        },
      },
      animation: {
        "fade-in":  "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.25s ease-out",
        "shimmer":  "shimmer 1.5s infinite linear",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
      },

      // ── Safelist dynamic classes (status badge colours) ───────────────────
      // Tailwind purges classes that are constructed dynamically at runtime.
      // These are the status badge bg/text classes built in ORDER_STATUS_CONFIG.
    },
  },

  // ─── Plugins ──────────────────────────────────────────────────────────────
  plugins: [],

  // ─── Safelist — dynamic classes that must not be purged ───────────────────
  safelist: [
    // Status badge classes (constructed from ORDER_STATUS_CONFIG at runtime)
    "bg-gray-100",   "text-gray-600",   "bg-gray-400",
    "bg-amber-50",   "text-amber-700",  "bg-amber-400",
    "bg-blue-50",    "text-blue-700",   "bg-blue-400",
    "bg-pink-50",    "text-pink-700",   "bg-pink-400",
    "bg-green-50",   "text-green-700",  "bg-green-400",
    "bg-red-50",     "text-red-600",    "bg-red-400",
    // Delta colours in StatsCard
    "text-green-600", "text-red-500", "text-gray-500",
    "dark:text-green-400", "dark:text-red-400",
  ],
};

export default config;
