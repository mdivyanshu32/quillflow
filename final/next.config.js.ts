// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Output ────────────────────────────────────────────────────────────────
  // "standalone" bundles only what's needed for deployment.
  // @netlify/plugin-nextjs handles this automatically — leave as default.
  // output: "standalone",

  // ─── React strict mode ─────────────────────────────────────────────────────
  reactStrictMode: true,

  // ─── Image optimisation ────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        // Supabase Storage avatars and deliverables
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // If you allow Google OAuth avatars
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    // Limit image sizes to what the UI actually needs
    deviceSizes:    [640, 768, 1024, 1280, 1536],
    imageSizes:     [16, 32, 48, 64, 96, 128, 256],
    formats:        ["image/webp"],
    minimumCacheTTL: 86400, // 1 day
  },

  // ─── Experimental ──────────────────────────────────────────────────────────
  experimental: {
    // Server Actions are stable in Next 14+ — no flag needed
    // typedRoutes: true,  // enable for fully typed <Link href> (beta)
  },

  // ─── Environment variable validation ──────────────────────────────────────
  // Crash at build time if required env vars are missing.
  // This prevents silent runtime failures on Netlify.
  env: {
    NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    NEXT_PUBLIC_SITE_URL:          process.env.NEXT_PUBLIC_SITE_URL ?? "",
  },

  // ─── Redirects ─────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Redirect root to dashboard (middleware will redirect to /login if unauthed)
      {
        source:      "/",
        destination: "/dashboard",
        permanent:   false,
      },
    ];
  },

  // ─── Headers (applied by Next.js, not Netlify edge) ───────────────────────
  // Note: middleware.ts also sets these — Next.js headers are a fallback.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control",  value: "on"                              },
          { key: "X-Frame-Options",          value: "DENY"                            },
          { key: "X-Content-Type-Options",   value: "nosniff"                         },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // ─── Webpack (suppress Supabase Realtime ws warning in Edge runtime) ───────
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs:  false,
      };
    }
    return config;
  },
};

// ─── Build-time env validation ────────────────────────────────────────────────
const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    throw new Error(
      `\n\n❌ Missing required environment variable: ${key}\n` +
      `   Add it to .env.local (dev) or Netlify Environment Variables (prod).\n`
    );
  }
}

export default nextConfig;
