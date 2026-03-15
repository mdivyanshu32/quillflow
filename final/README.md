# Quillflow — SaaS Client Dashboard

A production-grade content writing SaaS dashboard built with Next.js 14 (App Router), Supabase, TailwindCSS, and deployed on Netlify.

---

## Tech stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Framework    | Next.js 14 — App Router, React Server Components |
| Auth + DB    | Supabase (Postgres, Auth, Realtime, Storage)    |
| Styling      | TailwindCSS 3                                   |
| Validation   | Zod + react-hook-form                           |
| Charts       | Recharts                                        |
| Toasts       | react-hot-toast                                 |
| Deployment   | Netlify + @netlify/plugin-nextjs                |

---

## Quick start

```bash
# 1. Clone and install
git clone https://github.com/your-org/quillflow.git
cd quillflow
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, anon key, service role key, and site URL

# 3. Apply the database schema
# Open Supabase → SQL Editor → paste schema.sql → Run

# 4. Regenerate TypeScript types from your live schema
npm run db:types

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
quillflow/
├── middleware.ts                   # Edge: session refresh + route protection + security headers
├── schema.sql                      # Full Supabase schema (run once in SQL Editor)
├── next.config.ts                  # Next.js config + build-time env validation
├── netlify.toml                    # Netlify deployment config
├── tailwind.config.ts
├── tsconfig.json
└── src/
    ├── app/
    │   ├── layout.tsx              # Root layout — fonts, metadata, Toaster
    │   ├── globals.css
    │   ├── error.tsx               # Global error boundary
    │   ├── not-found.tsx           # 404 page
    │   ├── (auth)/
    │   │   ├── layout.tsx          # Centered card shell
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── (dashboard)/
    │   │   ├── layout.tsx          # Sidebar + auth guard
    │   │   ├── dashboard/page.tsx  # KPI stats + chart + recent orders
    │   │   ├── orders/
    │   │   │   ├── page.tsx        # Paginated, filterable orders table
    │   │   │   ├── new/page.tsx    # 3-step order creation wizard
    │   │   │   └── [id]/page.tsx   # Order detail + realtime notes
    │   │   └── settings/page.tsx   # Profile, notifications, password, danger zone
    │   └── api/
    │       └── webhooks/route.ts   # HMAC-verified webhook handler
    ├── components/
    │   ├── ui/                     # Button, Input, Select, Textarea, Badge,
    │   │                           # DataTable, Modal, Spinner, Toaster
    │   ├── layout/                 # Sidebar, Topbar
    │   ├── dashboard/              # StatsCard, OrdersChart
    │   └── orders/                 # OrderForm, OrderComponents, RealtimeNotesThread
    ├── lib/
    │   ├── supabase/               # client.ts, server.ts, middleware.ts, database.types.ts
    │   ├── actions/                # auth.ts, orders.ts, profile.ts (Server Actions)
    │   ├── queries/                # orders.ts, profile.ts (read-only, RSC)
    │   ├── validations.ts          # All Zod schemas (shared client + server)
    │   ├── errors.ts               # Typed error classes + safe error messages
    │   ├── rate-limit.ts           # Edge-compatible rate limiter
    │   ├── utils.ts                # cn(), formatCurrency(), formatDate(), etc.
    │   ├── types.ts                # All TypeScript interfaces
    │   └── constants.ts            # Nav links, status config, select options
    └── hooks/
        ├── useRealtimeNotes.ts     # Supabase Realtime subscription for order notes
        └── useSession.ts           # Client-side session + auth state listener
```

---

## Database

The full schema is in `schema.sql`. Apply it once via the Supabase SQL Editor.

**Tables:** `profiles`, `orders`, `order_notes`, `order_status_history`

**Key design decisions:**
- Row Level Security on all tables — `client_id = auth.uid()` enforced at Postgres level
- `order_status_history` is append-only via triggers; RLS blocks direct inserts
- `profiles` row auto-created via trigger on `auth.users` insert
- `updated_at` managed by trigger — never touch it in application code
- Two RPC functions: `get_client_stats()` and `get_orders_by_month()` for dashboard

After any schema change, regenerate types:
```bash
npm run db:types
```

---

## Environment variables

| Variable                          | Scope        | Required |
|-----------------------------------|--------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL`        | Browser-safe | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Browser-safe | Yes      |
| `SUPABASE_SERVICE_ROLE_KEY`       | Server only  | Yes      |
| `NEXT_PUBLIC_SITE_URL`            | Browser-safe | Yes      |
| `WEBHOOK_SECRET`                  | Server only  | Optional |

`next.config.ts` throws at build time if any required variable is missing.

---

## Security

Seven independent layers:

1. **Edge (Netlify + middleware)** — CSP, HSTS, X-Frame-Options, blocked path patterns
2. **Middleware** — session refresh, route protection, auth-page redirect
3. **Server Actions** — Zod validation + `getUser()` verification on every mutation
4. **Database (RLS)** — Postgres-level row ownership, cannot be bypassed by application code
5. **Storage** — avatar bucket scoped to `uid/`, deliverables bucket private
6. **Webhook** — HMAC-SHA256 signature with `crypto.timingSafeEqual`
7. **Rate limiting** — 5 req/min for auth routes, 60 req/min for API

For production, replace the in-memory rate limiter with Upstash Redis:
```bash
npm install @upstash/redis @upstash/ratelimit
```

---

## Deployment (Netlify)

1. Push to GitHub
2. Connect repo to a new Netlify site
3. Set all environment variables in **Site Settings → Environment Variables**
4. Netlify auto-detects Next.js and installs `@netlify/plugin-nextjs`
5. Add your production domain to **Supabase → Auth → URL Configuration**

The `netlify.toml` configures build command, caching headers, and security headers.

---

## Scripts

| Script            | Description                                     |
|-------------------|-------------------------------------------------|
| `npm run dev`     | Start dev server with Turbopack                 |
| `npm run build`   | Production build (validates env vars)           |
| `npm run type-check` | TypeScript check without emitting            |
| `npm run lint`    | ESLint                                          |
| `npm run db:types`| Regenerate Supabase TypeScript types            |
| `npm run db:reset`| Reset local Supabase database                   |

---

## Adding a new page

1. Create `src/app/(dashboard)/your-route/page.tsx`
2. Add a nav link to `src/lib/constants.ts` → `NAV_LINKS`
3. Add the corresponding icon to `Sidebar.tsx` `ICON_MAP`
4. Create a query function in `src/lib/queries/` if data is needed
5. Create a Server Action in `src/lib/actions/` if mutations are needed
6. Add Zod schemas to `src/lib/validations.ts`

---

## License

MIT
