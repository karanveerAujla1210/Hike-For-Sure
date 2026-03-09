# Deployment Guide: Vercel + Supabase

## 1. Supabase Project Setup

1. Create a Supabase project.
2. Run SQL migrations from `supabase/migrations/` in order.
3. In Storage, verify buckets:
   - `resumes` (private)
   - `profile-images` (public)
   - `company-logos` (public)
4. Enable Realtime on `messages` table.

## 2. Razorpay Setup

1. Create API keys in Razorpay dashboard.
2. Configure webhook URL:
   - `https://<your-domain>/api/webhooks/razorpay`
3. Use secret from webhook settings as `RAZORPAY_WEBHOOK_SECRET`.

## 3. Resend Setup

1. Add and verify your sending domain in Resend.
2. Set `RESEND_API_KEY`.
3. Update sender email in:
   - `lib/utils/email.ts`
   - `supabase/functions/send-email/index.ts`

## 4. Vercel Deployment

1. Import repository into Vercel.
2. Set framework preset to `Next.js`.
3. Add all env vars from `.env.example`.
4. Deploy.

## 5. Supabase Edge Functions Deployment

Deploy required functions:

```bash
supabase functions deploy application-workflow
supabase functions deploy razorpay-webhook
supabase functions deploy send-email
```

Set function secrets:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set RESEND_API_KEY=...
supabase secrets set RAZORPAY_WEBHOOK_SECRET=...
```

## 6. Post-Deployment Validation

1. Sign up candidate and recruiter users.
2. Verify profile creation + free subscription row.
3. Post jobs on free plan (limit 3/month).
4. Apply as candidate with resume upload.
5. Confirm recruiter notification and status update flow.
6. Validate real-time messaging.
7. Complete Razorpay Pro checkout and confirm webhook activation.
