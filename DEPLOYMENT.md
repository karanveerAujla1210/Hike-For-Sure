# Hike For Sure - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Vercel account
- Razorpay account
- Resend account

## 1. Supabase Setup

### Create Project
1. Go to https://supabase.com
2. Create new project
3. Note your project URL and anon key

### Run Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Setup Storage Buckets
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('resumes', 'resumes', false),
  ('profile-images', 'profile-images', true),
  ('company-logos', 'company-logos', true);

-- Set storage policies
CREATE POLICY "Users can upload own resume" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own resume" ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload own profile image" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Enable Realtime
```sql
-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

## 2. Razorpay Setup

1. Create account at https://razorpay.com
2. Get API keys from Dashboard
3. Create subscription plans:
   - Pro Plan: ₹999/month

4. Setup webhook:
   - URL: `https://your-domain.com/api/webhooks/razorpay`
   - Events: `subscription.activated`, `subscription.cancelled`, `subscription.charged`

## 3. Resend Setup

1. Create account at https://resend.com
2. Verify your domain
3. Get API key from dashboard

## 4. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_PRO_PLAN_ID=your_pro_plan_id

# Resend
RESEND_API_KEY=your_resend_key

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 5. Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 6. Vercel Deployment

### Via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all other env variables

# Deploy to production
vercel --prod
```

### Via Dashboard
1. Go to https://vercel.com
2. Import Git repository
3. Add environment variables in Settings
4. Deploy

## 7. Post-Deployment

### Setup Custom Domain
1. Add domain in Vercel dashboard
2. Update DNS records
3. Update `NEXT_PUBLIC_APP_URL` environment variable

### Test Webhooks
```bash
# Test Razorpay webhook
curl -X POST https://your-domain.com/api/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: test_signature" \
  -d '{"event": "subscription.activated"}'
```

### Monitor Performance
- Enable Vercel Analytics
- Setup error tracking (Sentry)
- Monitor Supabase usage

## 8. Database Indexes (Already in migrations)

```sql
-- Performance indexes
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);

-- Full-text search
CREATE INDEX idx_jobs_search ON jobs USING GIN(to_tsvector('english', title || ' ' || description));
```

## 9. Security Checklist

- ✅ Row Level Security enabled on all tables
- ✅ Environment variables secured
- ✅ API rate limiting configured
- ✅ Input validation with Zod
- ✅ JWT session validation
- ✅ Webhook signature verification
- ✅ CORS configured properly

## 10. Scaling Considerations

### Database
- Supabase automatically scales
- Monitor connection pooling
- Use read replicas for heavy queries

### Frontend
- Vercel Edge Network handles CDN
- Automatic scaling based on traffic
- Enable ISR for static pages

### Storage
- Supabase Storage scales automatically
- Use CDN for public assets
- Implement image optimization

## 11. Monitoring & Analytics

### Setup PostHog (Optional)
```typescript
// Add to app/layout.tsx
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  })
}
```

### Track Events
```typescript
posthog.capture('user_signed_up', { role: 'candidate' })
posthog.capture('job_applied', { job_id: jobId })
posthog.capture('subscription_upgraded', { plan: 'pro' })
```

## 12. Backup Strategy

### Database Backups
- Supabase provides automatic daily backups
- Enable Point-in-Time Recovery (PITR)
- Export critical data weekly

### Storage Backups
- Implement periodic bucket exports
- Store backups in separate cloud storage

## 13. Performance Optimization

### Frontend
```typescript
// Use dynamic imports
const JobForm = dynamic(() => import('@/components/forms/job-form'))

// Implement pagination
const ITEMS_PER_PAGE = 20

// Use React Server Components
// Already implemented in app directory
```

### Database
```sql
-- Vacuum regularly
VACUUM ANALYZE;

-- Monitor slow queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

## 14. Support & Maintenance

### Regular Tasks
- Monitor error logs weekly
- Review database performance monthly
- Update dependencies quarterly
- Security audit bi-annually

### User Support
- Setup support email
- Create FAQ documentation
- Implement in-app chat support

## Production Checklist

- [ ] All migrations applied
- [ ] Environment variables configured
- [ ] Storage buckets created
- [ ] RLS policies enabled
- [ ] Webhooks configured
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics tracking enabled
- [ ] Error monitoring setup
- [ ] Backup strategy implemented
- [ ] Performance monitoring active
- [ ] Security audit completed

## Estimated Costs (Monthly)

- Supabase: $25 (Pro plan for 100K users)
- Vercel: $20 (Pro plan)
- Razorpay: Transaction fees only
- Resend: $20 (50K emails)
- **Total: ~$65/month + transaction fees**

## Support

For issues or questions:
- Email: support@hikeforsure.com
- Documentation: https://docs.hikeforsure.com
- GitHub: https://github.com/hikeforsure/platform
