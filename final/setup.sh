#!/usr/bin/env bash
# setup.sh — One-shot dev environment setup for Quillflow
# Run once after cloning: bash setup.sh
set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
RESET='\033[0m'

log()  { echo -e "${BOLD}$1${RESET}"; }
ok()   { echo -e "  ${GREEN}✓${RESET} $1"; }
warn() { echo -e "  ${YELLOW}⚠${RESET}  $1"; }
err()  { echo -e "  ${RED}✗${RESET} $1"; exit 1; }

echo ""
log "🖊  Quillflow — setup"
echo ""

# ── 1. Node version check ─────────────────────────────────────────────────────
log "Checking Node.js version..."
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$NODE_VERSION" ]; then
  err "Node.js not found. Install v20+ from https://nodejs.org"
fi
if [ "$NODE_VERSION" -lt 20 ]; then
  err "Node.js v20+ is required. Current: $(node -v)"
fi
ok "Node.js $(node -v)"

# ── 2. Install dependencies ───────────────────────────────────────────────────
log "Installing dependencies..."
npm install --silent
ok "node_modules installed"

# ── 3. Set up .env.local ──────────────────────────────────────────────────────
log "Setting up environment variables..."
if [ -f ".env.local" ]; then
  warn ".env.local already exists — skipping copy"
else
  cp .env.example .env.local
  ok ".env.local created from .env.example"
  echo ""
  warn "ACTION REQUIRED: Open .env.local and fill in your Supabase credentials."
  warn "  NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co"
  warn "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
  warn "  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
  warn "  NEXT_PUBLIC_SITE_URL=http://localhost:3000"
  echo ""
fi

# ── 4. Supabase schema reminder ────────────────────────────────────────────────
log "Database setup..."
echo ""
warn "ACTION REQUIRED: Apply the database schema to your Supabase project:"
warn "  1. Open https://supabase.com/dashboard"
warn "  2. Select your project → SQL Editor → New query"
warn "  3. Paste the contents of schema.sql and click Run"
warn "  4. Confirm all tables appear under Table Editor"
echo ""

# ── 5. Git hooks ──────────────────────────────────────────────────────────────
log "Setting up git hooks..."
if [ -d ".git" ]; then
  npx husky --silent 2>/dev/null || true
  ok "Husky hooks configured"
else
  warn "Not a git repo — skipping git hooks"
fi

# ── 6. TypeScript check ───────────────────────────────────────────────────────
log "Running TypeScript check..."
if grep -q "your-project-id" .env.local 2>/dev/null; then
  warn "Skipping type-check — .env.local still has placeholder values"
else
  npm run type-check && ok "TypeScript check passed" || warn "TypeScript errors found — fix before deploying"
fi

echo ""
log "Setup complete!"
echo ""
echo -e "  Next steps:"
echo -e "  ${BOLD}1.${RESET} Fill in .env.local with your Supabase credentials"
echo -e "  ${BOLD}2.${RESET} Apply schema.sql in the Supabase SQL Editor"
echo -e "  ${BOLD}3.${RESET} Run: ${BOLD}npm run db:types${RESET}"
echo -e "  ${BOLD}4.${RESET} Run: ${BOLD}npm run dev${RESET}"
echo -e "  ${BOLD}5.${RESET} Open: ${BOLD}http://localhost:3000${RESET}"
echo ""
