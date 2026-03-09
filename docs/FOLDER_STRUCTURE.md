# Hike For Sure - Folder Structure

```text
.
|- app/
|  |- api/
|  |  |- analytics/track/route.ts
|  |  |- applications/[id]/status/route.ts
|  |  |- auth/reset-password/route.ts
|  |  |- auth/welcome/route.ts
|  |  |- jobs/route.ts
|  |  |- jobs/[id]/apply/route.ts
|  |  |- jobs/[id]/applications/route.ts
|  |  |- messages/route.ts
|  |  |- profile/route.ts
|  |  |- subscriptions/create-checkout/route.ts
|  |  |- uploads/company-logo/route.ts
|  |  |- uploads/profile-image/route.ts
|  |  |- uploads/resume/route.ts
|  |  |- webhooks/razorpay/route.ts
|  |- apply/page.tsx
|  |- company/page.tsx
|  |- dashboard/page.tsx
|  |- jobs/page.tsx
|  |- jobs/[id]/page.tsx
|  |- login/page.tsx
|  |- messages/page.tsx
|  |- notifications/page.tsx
|  |- profile/page.tsx
|  |- signup/page.tsx
|  |- subscription/page.tsx
|  |- globals.css
|  |- layout.tsx
|  |- page.tsx
|- components/
|  |- forms/
|  |  |- ApplicationForm.tsx
|  |  |- JobPostForm.tsx
|  |  |- JobSearchForm.tsx
|  |  |- LoginForm.tsx
|  |  |- ProfileForm.tsx
|  |  |- SignupForm.tsx
|  |  |- SubscriptionPlans.tsx
|  |- jobCard/JobCard.tsx
|  |- layout/
|  |  |- ClientProviders.tsx
|  |  |- PageShell.tsx
|  |- messageBox/MessageBox.tsx
|  |- navbar/MainNavbar.tsx
|  |- ui/
|     |- Button.tsx
|     |- Input.tsx
|     |- Textarea.tsx
|- lib/
|  |- api/
|  |  |- analytics.ts
|  |  |- auth.ts
|  |  |- client.ts
|  |  |- jobs.ts
|  |  |- messages.ts
|  |  |- subscriptions.ts
|  |- auth/
|  |  |- roles.ts
|  |  |- server.ts
|  |- db/queries.ts
|  |- supabase/
|  |  |- client.ts
|  |  |- middleware.ts
|  |  |- server.ts
|  |- utils/
|     |- analytics.ts
|     |- cn.ts
|     |- email.ts
|     |- env.ts
|     |- rate-limit.ts
|     |- razorpay.ts
|     |- storage.ts
|     |- validation.ts
|- supabase/
|  |- functions/
|  |  |- application-workflow/index.ts
|  |  |- razorpay-webhook/index.ts
|  |  |- send-email/index.ts
|  |- migrations/
|     |- 001_initial_schema.sql
|     |- 002_rls_policies.sql
|     |- 003_production_upgrade.sql
|- types/platform.ts
|- docs/
|  |- DEPLOYMENT_VERCEL_SUPABASE.md
|  |- FOLDER_STRUCTURE.md
|- middleware.ts
|- next.config.js
|- tsconfig.json
|- .env.example
|- README.md
```
