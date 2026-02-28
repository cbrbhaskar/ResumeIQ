# ResumeOps — Agent Instructions

## Project
Next.js 16 SaaS — ATS resume optimizer. NextAuth + Prisma/MySQL auth/db, Gemini AI analysis, Stripe billing.

## Stack
- **Framework**: Next.js 16 App Router (Turbopack)
- **Auth**: NextAuth v4 — CredentialsProvider + GoogleProvider (`lib/auth-options.ts`)
- **Database**: MySQL via Prisma v5 (hosted on Railway) — client at `lib/prisma.ts`
- **AI**: Google Gemini (`@google/genai`)
- **Payments**: Stripe (checkout, portal, webhooks)
- **File Storage**: Cloudinary
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

## Auth & Database
- Session helper: `import { requireAuth } from "@/lib/auth"` — returns user or null
- Prisma client: `import prisma from "@/lib/prisma"`
- Auth handler: `app/api/auth/[...nextauth]/route.ts`
- NextAuth config: `lib/auth-options.ts`
- Domain: `https://resumeops.in`
