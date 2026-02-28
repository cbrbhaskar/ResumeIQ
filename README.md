# ResumeOps

AI-powered ATS resume optimizer. Upload your resume, paste a job description, and get a detailed score with keyword gaps, skill analysis, and actionable suggestions — powered by Google Gemini.

**Live:** https://resumeops.in

---

## Features

- ATS score (0–100) with breakdown across 5 dimensions: keywords, skills, experience, formatting, title alignment
- Keyword gap analysis — what's missing vs. what matches
- Hard skills / soft skills match
- Seniority alignment feedback
- Formatting issues with fix suggestions
- Scan history with result details
- Free tier: 3 scans total; Pro/Teams: unlimited
- Google OAuth + email/password login
- PDF and DOCX resume support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Auth | NextAuth v4 — CredentialsProvider + GoogleProvider |
| Database | MySQL via Prisma v5 (hosted on Railway) |
| AI | Google Gemini (`@google/genai`) |
| File Storage | Cloudinary |
| Payments | Stripe |
| Styling | Tailwind CSS + Framer Motion |
| Deployment | Vercel |

---

## Project Structure

```
app/
  (auth)/           # login, signup pages
  (dashboard)/      # dashboard, upload, results/[id], history,
                    # settings, billing, export, linkedin-import
  api/
    analyze/        # POST — runs Gemini ATS analysis
    upload/         # POST — parses + uploads resume to Cloudinary
    auth/[...nextauth]/  # NextAuth handler
    register/       # POST — email/password signup
    scans/          # GET scans, GET/DELETE scan by id
    settings/       # GET/PATCH user settings
    stripe/         # checkout, portal, webhook
    usage/          # GET usage count
    linkedin/       # LinkedIn import

components/
  layout/           # navbar, footer, dashboard-sidebar
  results/          # score-gauge, score-breakdown, keyword-table,
                    # skills-table, suggestions-panel, formatting-issues
  upload/           # file-dropzone
  landing/          # hero
  ui/               # shadcn components, aurora-background

lib/
  ats/
    analyzer.ts     # Gemini API call + ATS scoring
    parser.ts       # PDF/DOCX text extraction
  auth-options.ts   # NextAuth config
  auth.ts           # requireAuth() server helper
  prisma.ts         # Prisma client singleton
  stripe/
    client.ts       # Stripe client
    config.ts       # PRICING_PLANS (source of truth)
  usage.ts          # scan usage tracking
  types.ts          # shared TypeScript types

prisma/
  schema.prisma     # DB schema

proxy.ts            # Next.js 16 middleware (route protection)
vercel.json         # { "framework": "nextjs" }
```

---

## Database Schema

**Models:** `User`, `Account`, `Session`, `VerificationToken` (NextAuth standard) + `Profile`, `Scan`, `ScanResult`, `UsageCount`, `Subscription`

Key relationships:
- `User` → `Profile` (plan, stripeCustomerId)
- `User` → `Scan[]` → `ScanResult` (all ATS scores + JSON arrays)
- `User` → `UsageCount` (scansUsed / scansLimit)
- `User` → `Subscription` (Stripe subscription details)

---

## Pricing

Defined in [lib/stripe/config.ts](lib/stripe/config.ts):

| Plan | Monthly | Annual |
|---|---|---|
| Free | $0 | — |
| Pro | $6.99/mo | $4.99/mo |
| Teams | $15.99/mo | $13.99/mo |

Free plan: 3 scans total lifetime.

---

## Local Development

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in all values (see Environment Variables section below).

Also create a `.env` file (used by Prisma CLI):
```
DATABASE_URL=mysql://...
```

### 3. Push database schema

```bash
npx prisma db push
```

### 4. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

Create `.env.local` in the project root:

```env
# Database (Railway MySQL or any MySQL host)
DATABASE_URL=mysql://user:password@host:port/dbname

# NextAuth
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (https://console.cloud.google.com → APIs & Services → Credentials)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary (https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Google Gemini AI (https://aistudio.google.com/apikey)
GEMINI_API_KEY=

# Stripe (https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create in Stripe dashboard)
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_TEAMS_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_TEAMS_YEARLY_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Deployment (Vercel + Railway)

### Database — Railway

1. Create a Railway project → add **MySQL** service
2. Go to **Connect** tab → copy the **Public URL** (format: `host:port`)
3. Set `DATABASE_URL` in Vercel env vars using the public URL (not the internal `.railway.internal` one)

### Deploy to Vercel

```bash
# First deploy / link project
npx vercel

# Production deploys
npx vercel --prod --force
```

**Required Vercel environment variables** (Settings → Environment Variables):
- All variables from `.env.local` above
- `NEXTAUTH_URL` must be your production URL (e.g. `https://resumeops.in`)
- `NEXT_PUBLIC_APP_URL` must also be your production URL

### Google OAuth redirect URI

In Google Cloud Console → OAuth 2.0 client → Authorized redirect URIs, add:
```
https://resumeops.in/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### Stripe webhook

In Stripe Dashboard → Webhooks → Add endpoint:
```
https://resumeops.in/api/stripe/webhook
```
Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## Known Gotchas

- **`proxy.ts` not `middleware.ts`** — Next.js 16 uses `proxy.ts` as the middleware file. Do not create `middleware.ts`.
- **`@google/genai` dynamic import** — The GoogleGenAI constructor throws if the API key is missing at module load time. The analyzer uses `await import("@google/genai")` inside the async function to avoid bundling it into shared chunks.
- **Prisma CLI needs `.env`** — `prisma db push` reads from `.env`, not `.env.local`. Keep both files in sync for DATABASE_URL.
- **MySQL JSON columns** — Prisma's `Json` fields on MySQL cannot have `@default` values. Use `Json?` (nullable) instead.
- **`vercel.json`** — Must contain `{"framework": "nextjs"}` for Vercel CLI to detect the project as Next.js. Without it, deployment fails with "No Output Directory named public found".
- **Delete `.next` before deploying** — Run `rm -rf .next` before `vercel --prod --force` to ensure a clean remote build.
