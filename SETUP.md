# ResumeOps — Setup Guide

## Tech Stack
- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **NextAuth v4** (CredentialsProvider + GoogleProvider)
- **MySQL via Prisma v5** (hosted on Railway)
- **Cloudinary** (file storage)
- **Stripe** (billing)
- **Google Gemini AI** (ATS analysis)
- **Vercel** (deployment)

---

## Prerequisites
- Node.js 18+
- A Railway account (MySQL database)
- A Cloudinary account
- A Google Cloud project (OAuth)
- A Google AI Studio API key
- A Stripe account

---

## Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

---

## Step 2: Configure Environment Variables

Create `.env.local` in the project root:

```env
# Database (Railway MySQL)
DATABASE_URL=mysql://user:password@host:port/dbname

# NextAuth
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
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

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Also create a `.env` file (used by Prisma CLI):
```env
DATABASE_URL=mysql://user:password@host:port/dbname
```

---

## Step 3: Set Up Database (Railway MySQL)

1. Create a Railway project → add **MySQL** service
2. Go to **Connect** tab → copy the **Public URL**
3. Set `DATABASE_URL` in both `.env` and `.env.local`
4. Push the Prisma schema:

```bash
npx prisma db push
```

---

## Step 4: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services → Credentials**
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://resumeops.in/api/auth/callback/google` (production)
4. Copy Client ID and Secret → add to `.env.local`

---

## Step 5: Set Up Stripe Products & Prices

In Stripe Dashboard → Products → Add Product:

1. **ResumeOps Pro - Monthly**: $6.99/month → copy Price ID
2. **ResumeOps Pro - Yearly**: $59.88/year ($4.99/month) → copy Price ID
3. **ResumeOps Teams - Monthly**: $15.99/month → copy Price ID
4. **ResumeOps Teams - Yearly**: $167.88/year ($13.99/month) → copy Price ID

Add all four Price IDs to `.env.local`.

---

## Step 6: Set Up Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://resumeops.in/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

For local testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Step 7: Enable Stripe Customer Portal

Stripe Dashboard → Settings → Billing → Customer Portal → **Activate**.

---

## Step 8: Run Locally

```bash
npm run dev
```

Open http://localhost:3000

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project to Vercel
3. Add all environment variables (Settings → Environment Variables)
   - Set `NEXTAUTH_URL` → `https://resumeops.in`
   - Set `NEXT_PUBLIC_APP_URL` → `https://resumeops.in`
   - Use live Stripe keys (`sk_live_`, `pk_live_`)
4. Add custom domain `resumeops.in` in Vercel → Settings → Domains
5. Deploy

---

## ATS Score Weights

| Category | Weight |
|---|---|
| Keyword Match | 30% |
| Skills Match | 25% |
| Experience Relevance | 20% |
| Formatting Safety | 15% |
| Title Alignment | 10% |

Powered by Google Gemini 2.5 Flash.
