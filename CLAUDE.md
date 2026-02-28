# ResumeOps — Agent Instructions

## Project
Next.js 16 SaaS — ATS resume optimizer. Supabase auth/db, Gemini AI analysis, Stripe billing.

## Stack
- **Framework**: Next.js 16 App Router (Turbopack)
- **Auth & DB**: Supabase (SSR client via `@supabase/ssr`)
- **AI**: Google Gemini (`@google/generative-ai`)
- **Payments**: Stripe (checkout, portal, webhooks)
- **Styling**: Tailwind CSS + inline styles, Instrument Sans font
- **UI**: Custom glassmorphism design system (see `app/globals.css`)

## Key Conventions
- All pages use **inline styles** (not Tailwind classes) for component-level styling
- CSS utility classes (`glass-card`, `glass-panel`, `btn-glow`, `btn-outline-gradient`, `gradient-text`) are defined in `app/globals.css`
- Route params in Next.js 16: `params: Promise<{ id: string }>` → must `await params`
- Middleware equivalent: `proxy.ts` (not `middleware.ts`)
- Install packages: `npm install <pkg> --legacy-peer-deps` (eslint peer dep conflict)

## Design System (Glassmorphism)
- Body bg: `linear-gradient(135deg, #f0f4ff, #faf5ff, #f0f9ff)`
- Primary: violet `#7c3aed` / indigo `#4f46e5`
- `.glass-card`: frosted white card with violet shadow
- `.btn-glow`: violet→indigo→cyan gradient with multi-colour glow
- `.btn-outline-gradient`: gradient border via `::before` pseudo-element
- Headings: `#0f172a`, body text: `#374151`, muted: `#64748b`

## Pricing (source of truth: `lib/stripe/config.ts`)
- Free: $0 — 3 scans total
- Pro: $6.99/mo ($4.99/mo annual) — unlimited scans
- Teams: $15.99/mo ($13.99/mo annual) — team features

## Supabase
- Server client: `import { createClient } from "@/lib/supabase/server"`
- Browser client: `import { createClient } from "@/lib/supabase/client"`
- Auth callback route: `app/api/auth/callback/route.ts`
- Email redirect: `${window.location.origin}/api/auth/callback?next=/dashboard`
