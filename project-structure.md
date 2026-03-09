# Hike For Sure - Production Architecture

## Complete Folder Structure

```
hike-for-sure/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── applications/
│   │   │   └── page.tsx
│   │   ├── company/
│   │   │   └── page.tsx
│   │   ├── messages/
│   │   │   └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   └── subscription/
│   │       └── page.tsx
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── razorpay/
│   │   │       └── route.ts
│   │   └── jobs/
│   │       └── search/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── badge.tsx
│   ├── forms/
│   │   ├── job-form.tsx
│   │   ├── profile-form.tsx
│   │   └── application-form.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── job-card.tsx
│   ├── message-box.tsx
│   └── subscription-plans.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── api/
│   │   ├── jobs.ts
│   │   ├── applications.ts
│   │   ├── messages.ts
│   │   └── subscriptions.ts
│   ├── auth/
│   │   ├── auth.ts
│   │   └── permissions.ts
│   ├── payments/
│   │   └── razorpay.ts
│   ├── email/
│   │   └── resend.ts
│   ├── validations/
│   │   └── schemas.ts
│   └── utils.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_indexes.sql
│   └── functions/
│       └── send-notification/
│           └── index.ts
├── types/
│   └── database.types.ts
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
