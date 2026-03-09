# Hike For Sure - System Architecture

## Overview

Production-grade recruitment platform built for scalability, supporting 100,000+ users with modern tech stack.

## Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with server components
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vercel** - Hosting and CDN

### Backend
- **Supabase PostgreSQL** - Primary database
- **Supabase Auth** - Authentication system
- **Supabase Storage** - File storage
- **Supabase Edge Functions** - Serverless functions
- **Supabase Realtime** - WebSocket connections

### Third-Party Services
- **Razorpay** - Payment processing
- **Resend** - Transactional emails
- **PostHog** - Analytics (optional)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js 14 App (React Server Components)           │   │
│  │  - Server-side rendering                             │   │
│  │  - Client components for interactivity              │   │
│  │  - Optimistic UI updates                            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                     │
│  - Global CDN                                                │
│  - Automatic scaling                                         │
│  - Edge functions                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Routes  │  │ API Routes   │  │  Webhooks    │      │
│  │ /login       │  │ /api/jobs    │  │ /api/webhooks│      │
│  │ /signup      │  │ /api/search  │  │ /razorpay    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                     │   │
│  │  - Row Level Security (RLS)                         │   │
│  │  - Full-text search indexes                         │   │
│  │  - Optimized queries                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Auth                           │   │
│  │  - JWT tokens                                        │   │
│  │  - Session management                                │   │
│  │  - Role-based access                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Storage                        │   │
│  │  - Resumes bucket                                    │   │
│  │  - Profile images bucket                            │   │
│  │  - Company logos bucket                             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Supabase Realtime                       │   │
│  │  - WebSocket connections                             │   │
│  │  - Live message updates                             │   │
│  │  - Notification streaming                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Razorpay    │  │   Resend     │  │   PostHog    │      │
│  │  Payments    │  │   Emails     │  │  Analytics   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

**profiles** - User profiles extending Supabase auth
- Links to auth.users
- Stores role (candidate/recruiter/admin)
- Profile information

**companies** - Company information
- Created by recruiters
- Linked to jobs

**jobs** - Job postings
- Belongs to company
- Created by recruiter
- Full-text searchable

**applications** - Job applications
- Links candidate to job
- Tracks status workflow
- Stores resume URL

**messages** - Direct messaging
- Realtime enabled
- Read status tracking

**subscriptions** - Payment plans
- Razorpay integration
- Job post limits

### Relationships

```
auth.users (Supabase)
    ↓
profiles (1:1)
    ↓
    ├─→ jobs (1:many) [as recruiter]
    ├─→ applications (1:many) [as candidate]
    ├─→ messages (1:many) [as sender/receiver]
    ├─→ subscriptions (1:1)
    └─→ experience, education (1:many)

companies
    ↓
jobs (1:many)
    ↓
applications (1:many)
```

## Security Architecture

### Authentication Flow

```
1. User submits credentials
   ↓
2. Supabase Auth validates
   ↓
3. JWT token issued
   ↓
4. Token stored in httpOnly cookie
   ↓
5. Middleware validates on each request
   ↓
6. RLS policies enforce data access
```

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only view/edit their own data
- Recruiters can manage their jobs
- Public data (jobs, profiles) viewable by all
- Applications visible to candidate and recruiter

### Input Validation

```typescript
// Zod schemas validate all inputs
const jobSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(50),
  // ... more validations
})
```

## Data Flow Examples

### Job Application Flow

```
1. Candidate views job
   ↓
2. Uploads resume to Supabase Storage
   ↓
3. Creates application record
   ↓
4. Triggers notification to recruiter
   ↓
5. Sends email via Resend
   ↓
6. Realtime update to recruiter dashboard
```

### Subscription Flow

```
1. Recruiter selects Pro plan
   ↓
2. Frontend initiates Razorpay checkout
   ↓
3. User completes payment
   ↓
4. Razorpay webhook hits /api/webhooks/razorpay
   ↓
5. Webhook verifies signature
   ↓
6. Updates subscription in database
   ↓
7. User gets unlimited job posts
```

### Messaging Flow

```
1. User sends message
   ↓
2. Message saved to database
   ↓
3. Supabase Realtime broadcasts
   ↓
4. Receiver's client updates instantly
   ↓
5. Notification created
   ↓
6. Email sent if user offline
```

## Performance Optimizations

### Database
- **Indexes** on foreign keys and search columns
- **Full-text search** using PostgreSQL GIN indexes
- **Connection pooling** via Supabase
- **Query optimization** with proper joins

### Frontend
- **Server Components** for initial render
- **Client Components** only for interactivity
- **Dynamic imports** for code splitting
- **Image optimization** via Next.js
- **Edge caching** via Vercel

### Caching Strategy
```typescript
// Static pages cached at edge
export const revalidate = 3600 // 1 hour

// Dynamic data with stale-while-revalidate
fetch(url, { next: { revalidate: 60 } })
```

## Scalability

### Horizontal Scaling
- **Vercel**: Auto-scales based on traffic
- **Supabase**: Managed PostgreSQL with auto-scaling
- **CDN**: Global edge network

### Database Scaling
- **Read replicas** for heavy read operations
- **Connection pooling** (PgBouncer)
- **Partitioning** for large tables (future)

### File Storage Scaling
- **Supabase Storage** backed by S3
- **CDN** for public assets
- **Lazy loading** for images

## Monitoring & Observability

### Metrics to Track
- API response times
- Database query performance
- Error rates
- User signup/conversion rates
- Job application rates
- Subscription conversions

### Tools
- **Vercel Analytics** - Frontend performance
- **Supabase Dashboard** - Database metrics
- **PostHog** - User analytics
- **Sentry** (optional) - Error tracking

## Disaster Recovery

### Backups
- **Database**: Daily automated backups (Supabase)
- **Point-in-Time Recovery**: 7-day window
- **Storage**: Replicated across regions

### Recovery Plan
1. Identify issue
2. Restore from backup
3. Replay transactions if needed
4. Verify data integrity
5. Resume operations

## API Rate Limiting

```typescript
// Implement rate limiting per user
const rateLimit = {
  free: 100, // requests per hour
  pro: 1000,
}

// Use Vercel Edge Config or Upstash Redis
```

## Future Enhancements

### Phase 2
- Video interviews
- AI-powered job matching
- Advanced analytics dashboard
- Mobile apps (React Native)

### Phase 3
- Multi-language support
- Company reviews
- Salary insights
- Skill assessments

## Cost Optimization

### Current Architecture Costs
- **Supabase Pro**: $25/month (100K users)
- **Vercel Pro**: $20/month
- **Resend**: $20/month (50K emails)
- **Razorpay**: Transaction fees only

### Optimization Strategies
- Use edge caching aggressively
- Optimize database queries
- Compress images
- Lazy load components
- Implement pagination

## Security Best Practices

✅ Environment variables secured
✅ RLS enabled on all tables
✅ Input validation with Zod
✅ JWT token validation
✅ Webhook signature verification
✅ HTTPS only
✅ CORS configured
✅ SQL injection prevention
✅ XSS protection
✅ CSRF tokens

## Development Workflow

```bash
# Local development
npm run dev

# Run migrations
supabase db push

# Type generation
supabase gen types typescript --local > types/database.types.ts

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Testing Strategy

### Unit Tests
- API functions
- Validation schemas
- Utility functions

### Integration Tests
- Authentication flow
- Job application flow
- Payment flow

### E2E Tests
- User signup → job application
- Recruiter → job posting → applicant review

## Conclusion

This architecture provides:
- ✅ Scalability to 100K+ users
- ✅ Security with RLS and validation
- ✅ Performance with caching and optimization
- ✅ Reliability with backups and monitoring
- ✅ Cost-effectiveness (~$65/month)
- ✅ Developer experience with modern tools
