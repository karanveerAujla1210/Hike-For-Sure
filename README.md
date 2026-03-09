# Hike For Sure - Production Recruitment Platform

Hike For Sure is a modular, production-ready recruitment platform designed for 100,000+ users using:

- Next.js 14 (App Router) + React + Tailwind CSS + TypeScript
- Supabase PostgreSQL + Supabase Auth + Supabase Storage + Supabase Realtime
- Razorpay subscriptions
- Resend transactional email
- PostgreSQL full-text search
- PostHog analytics

## Architecture

- Frontend deployment: Vercel
- Backend/data/auth/storage: Supabase Cloud
- Server logic:
  - Next.js API Routes (`app/api/*`)
  - Supabase Edge Functions (`supabase/functions/*`)

## Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
POSTHOG_KEY=
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database Setup (Supabase)

Apply migrations in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_policies.sql`
3. `supabase/migrations/003_production_upgrade.sql`

## Key Features Implemented

- Role-based auth (`candidate`, `recruiter`, `company_admin`, `platform_admin`)
- Profile management + resume upload
- Recruiter job posting with plan-aware limits
- Candidate application workflow with notifications
- Real-time messaging and read status tracking
- Razorpay subscription checkout + webhook sync
- Resend emails for signup, reset, application confirmation, interview invite
- Search filters (location, salary range, experience level, skills) via PostgreSQL FTS
- API rate limiting using PostgreSQL RPC (`check_rate_limit`)

## Deployment

See [Vercel + Supabase Deployment Guide](./docs/DEPLOYMENT_VERCEL_SUPABASE.md).
