# ResumeOps — Setup Guide

## Tech Stack
- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Supabase** (Auth + Database + Storage)
- **Stripe** (Billing)
- **Google Gemini AI** (ATS Analysis Engine)

---

## Prerequisites
- Node.js 18+
- A Supabase project
- A Stripe account
- A Google AI Studio API key

---

## Step 1: Install Dependencies

```bash
npm install
```

---

## Step 2: Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

### Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — from your Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase → Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase → Settings → API (keep secret!)
- `GEMINI_API_KEY` — from https://aistudio.google.com/app/apikey
- `STRIPE_SECRET_KEY` — from Stripe Dashboard → Developers → API Keys
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — from Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET` — from Stripe Dashboard → Webhooks (after creating endpoint)

---

## Step 3: Set Up Supabase Database

1. Open your Supabase project → SQL Editor
2. Copy and run the contents of `supabase/migrations/001_initial.sql`
3. This creates all tables, RLS policies, storage bucket, and triggers

---

## Step 4: Set Up Supabase Storage

The SQL migration creates the `resumes` bucket automatically. If it doesn't:
1. Supabase Dashboard → Storage
2. Create bucket named `resumes`
3. Set to Public

---

## Step 5: Configure Supabase Auth

1. Supabase → Authentication → Providers
2. Enable **Email** (enabled by default)
3. Enable **Google** OAuth:
   - Create OAuth app in Google Cloud Console
   - Add Client ID + Secret to Supabase

4. Supabase → Authentication → URL Configuration:
   - Site URL: `http://localhost:3000` (dev) or your production URL
   - Redirect URL: `http://localhost:3000/api/auth/callback`

---

## Step 6: Create Stripe Products & Prices

In Stripe Dashboard → Products → Add Product:

1. **Pro Monthly**: $6.99/month → copy Price ID → `STRIPE_PRO_MONTHLY_PRICE_ID`
2. **Pro Yearly**: $59.88/year ($4.99/month) → copy Price ID → `STRIPE_PRO_YEARLY_PRICE_ID`
3. **Teams Monthly**: $15.99/month → copy Price ID → `STRIPE_TEAMS_MONTHLY_PRICE_ID`
4. **Teams Yearly**: $167.88/year ($13.99/month) → copy Price ID → `STRIPE_TEAMS_YEARLY_PRICE_ID`

---

## Step 7: Set Up Stripe Webhook (for subscription management)

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

For local testing, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Step 8: Set Up Stripe Customer Portal

Stripe Dashboard → Settings → Billing → Customer Portal → Enable it.

---

## Step 9: Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

---

## Project Structure

```
app/
  page.tsx                    # Landing page
  pricing/                    # Pricing page
  (auth)/
    login/                    # Login
    signup/                   # Sign up
  (dashboard)/
    layout.tsx                # Dashboard sidebar layout
    dashboard/                # Main dashboard
    upload/                   # Upload + analyze
    results/[id]/             # Analysis results
    history/                  # Scan history
    billing/                  # Subscription management
    settings/                 # Account settings
  api/
    upload/                   # File upload + text extraction
    analyze/                  # ATS analysis (Gemini AI)
    scans/                    # Fetch scan data
    stripe/
      checkout/               # Create checkout session
      portal/                 # Open billing portal
      webhook/                # Handle Stripe events
    auth/callback/            # OAuth callback
    usage/                    # Get usage info

lib/
  ats/analyzer.ts             # Gemini AI analysis engine
  ats/parser.ts               # PDF/DOCX text extraction
  supabase/                   # Supabase clients
  stripe/                     # Stripe client + pricing config
  types.ts                    # TypeScript types
  utils.ts                    # Helpers
  usage.ts                    # Usage tracking

components/
  ui/                         # Reusable UI components
  layout/                     # Navbar, Footer, Sidebar
  upload/                     # File dropzone
  results/                    # Score gauge, keyword table, etc.

supabase/
  migrations/001_initial.sql  # Full DB schema
```

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Deploy

### Important for deployment:
- Update `NEXT_PUBLIC_APP_URL` to your production URL
- Update Supabase redirect URLs to production URL
- Switch Stripe to live keys
- Update Stripe webhook URL to production

---

## Free Plan Limits

Free users get **3 total scans**. After that, a paywall appears directing them to `/pricing`.

This is tracked in the `usage_counts` table. The `analyze` API route checks this before running.

---

## ATS Score Weights

| Category | Weight |
|---|---|
| Keyword Match | 30% |
| Skills Match | 25% |
| Experience Relevance | 20% |
| Formatting Safety | 15% |
| Title Alignment | 10% |

Powered by Google Gemini 1.5 Flash.
