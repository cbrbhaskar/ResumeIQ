# Hostinger Deployment (ResumeIQ)

Last updated: February 24, 2026

## 1. What Hostinger should handle

Use Hostinger for:
- Domain and SSL
- Node.js app hosting (or VPS)
- DNS records
- Uptime monitoring

Keep these managed services external:
- Supabase (database, auth, storage)
- Stripe (payments)
- Gemini API (AI analysis)

## 2. Hosting plan choice

For this app (Next.js + API routes), use a Hostinger plan that supports:
- Node.js app runtime
- Custom build/start commands
- Environment variables

Recommended runtime:
- Node.js `22.x` (or `20.x` minimum)

## 3. Build and start commands

Set in Hostinger app settings:
- Install command: `npm ci`
- Build command: `npm run build`
- Start command: `npm run start`

## 4. Required environment variables

Copy all keys from `.env.local.example` into Hostinger environment variables:
- Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- Gemini key (`GEMINI_API_KEY`)
- Stripe keys + price IDs
- App URL (`NEXT_PUBLIC_APP_URL=https://your-domain.com`)
- LinkedIn keys (`LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`)
- LinkedIn provider slug (`NEXT_PUBLIC_LINKEDIN_SUPABASE_PROVIDER=linkedin_oidc`)

Optional:
- `LINKEDIN_REDIRECT_URI=https://your-domain.com/api/linkedin`

## 5. OAuth callback URLs you must register

In Supabase Auth providers:
- Google callback:
  - `https://your-domain.com/api/auth/callback`
- LinkedIn callback (if using Supabase OAuth):
  - `https://your-domain.com/api/auth/callback`

In LinkedIn developer app (for direct profile sync route):
- Redirect URL:
  - `https://your-domain.com/api/linkedin`

## 6. Database migration

Run these migrations in Supabase SQL editor or CLI:
- `supabase/migrations/001_initial.sql`
- `supabase/migrations/002_profile_linkedin_fields.sql`

## 7. Post-deploy verification checklist

1. Email signup/login works
2. Google OAuth works
3. LinkedIn OAuth login works (via Supabase)
4. LinkedIn profile sync works from `/linkedin-import`
5. Resume upload + ATS analysis works
6. Stripe checkout + webhook updates plan
7. Protected routes redirect unauthenticated users to `/login`

## 8. Known production note

If LinkedIn API app permissions are limited, sync may only return:
- name
- email
- profile photo

Skills/headline/location may require additional LinkedIn permissions not available by default.
