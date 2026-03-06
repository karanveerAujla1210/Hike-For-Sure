# 🚀 Hike For Sure - Professional Recruitment Platform

A complete, production-ready recruitment and networking platform built with modern technologies. Connect candidates with recruiters, manage job applications, professional networking, messaging, and premium subscriptions.

![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Hike For Sure** is a LinkedIn-style professional recruitment platform that connects job seekers with employers. The platform provides comprehensive features for:

- **Candidates**: Create profiles, search jobs, apply, network, and message
- **Recruiters**: Post jobs, search candidates, manage applications, schedule interviews
- **Admins**: Platform management, analytics, user moderation

### Key Highlights

✅ **Production-Ready**: Complete with authentication, authorization, and security  
✅ **Scalable Architecture**: Designed to handle millions of users  
✅ **Modern Tech Stack**: React, Node.js, PostgreSQL, Redis, Elasticsearch  
✅ **Real-time Features**: Messaging and notifications  
✅ **Premium Subscriptions**: Multiple pricing tiers with payment integration  
✅ **Comprehensive API**: RESTful APIs with proper documentation  
✅ **Database Optimized**: Indexed queries, connection pooling, caching  

---

## ✨ Features

### For Candidates

- 📝 **Complete Profile Management**
  - Personal information, headline, bio
  - Skills with endorsements
  - Work experience history
  - Education and certifications
  - Projects portfolio
  - Resume and document uploads

- 🔍 **Job Search & Discovery**
  - Advanced search with filters
  - Job recommendations based on skills
  - Save jobs for later
  - Track application status

- 🤝 **Professional Networking**
  - Send/receive connection requests
  - Build professional network
  - View profile visitors (premium)

- 💬 **Messaging System**
  - Direct messaging with recruiters
  - Conversation history
  - Real-time notifications

- 📊 **Dashboard & Analytics**
  - Profile views tracking
  - Application status overview
  - Profile completeness score

### For Recruiters

- 📢 **Job Posting Management**
  - Create detailed job postings
  - Edit and close jobs
  - Track job views and applications

- 👥 **Candidate Management**
  - Search candidates by skills
  - View candidate profiles
  - Manage applications
  - Schedule interviews

- 📈 **Recruiter Dashboard**
  - Active jobs overview
  - Application statistics
  - Interview scheduling
  - Hiring analytics

- 💼 **Company Pages**
  - Company profile management
  - Employee listings
  - Follower tracking

### For Admins

- 🎛️ **Platform Management**
  - User management
  - Company verification
  - Content moderation
  - Report handling

- 📊 **Analytics Dashboard**
  - User statistics
  - Revenue tracking
  - Platform activity metrics
  - Growth analytics

### Premium Features

- 🌟 **Candidate Pro**
  - Profile visibility boost
  - See who viewed your profile
  - Priority job applications
  - Advanced analytics

- 🏢 **Recruiter Pro**
  - Unlimited job postings
  - Advanced candidate search
  - Analytics dashboard
  - Priority support

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18+** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Framer Motion** - Animations

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **PostgreSQL 14+** - Primary database
- **Redis 6+** - Caching & sessions
- **Elasticsearch 8+** - Search engine
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Infrastructure
- **AWS S3** - File storage
- **CloudFront** - CDN
- **PM2** - Process manager
- **Nginx** - Web server
- **Docker** - Containerization (optional)

### DevOps
- **Git/GitHub** - Version control
- **GitHub Actions** - CI/CD
- **Winston** - Logging
- **Morgan** - HTTP logging

---

## 🏗️ Architecture

### System Architecture

```
Frontend (React) → CDN → Load Balancer → Backend Servers (Node.js)
                                              ↓
                                    ┌─────────┼─────────┐
                                    ↓         ↓         ↓
                              PostgreSQL   Redis   Elasticsearch
                                    ↓
                                  AWS S3
```

### Key Design Patterns

- **Three-Tier Architecture**: Presentation, Application, Data layers
- **RESTful API Design**: Standard HTTP methods and status codes
- **Microservices-Ready**: Modular structure for easy extraction
- **Stateless Backend**: Horizontal scaling capability
- **Caching Strategy**: Multi-level caching (Browser, CDN, Redis, DB)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Elasticsearch 8+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/karanveerAujla1210/Hike-For-Sure.git
cd Hike-For-Sure
```

2. **Setup Database**

```bash
# Create database
psql -U postgres
CREATE DATABASE hike_for_sure;
\q

# Run schema
psql -U postgres -d hike_for_sure -f backend/database/schema.sql
```

3. **Setup Backend**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

4. **Setup Frontend**

```bash
cd ..
npm install
npm run dev
```

5. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup and deployment instructions.

---

## 📁 Project Structure

```
Hike-For-Sure/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   ├── database.js
│   │   │   ├── redis.js
│   │   │   └── elasticsearch.js
│   │   ├── middleware/       # Express middleware
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/
│   │   │   ├── candidates/
│   │   │   ├── jobs/
│   │   │   ├── messaging/
│   │   │   ├── subscriptions/
│   │   │   ├── networking/
│   │   │   ├── notifications/
│   │   │   ├── companies/
│   │   │   └── admin/
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   └── server.js         # Entry point
│   ├── database/
│   │   └── schema.sql        # Database schema
│   ├── package.json
│   └── .env.example
├── src/
│   ├── components/           # React components
│   ├── pages/                # Page components
│   │   ├── CandidateDashboard.jsx
│   │   ├── RecruiterDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── MessagingPage.jsx
│   │   └── PricingPage.jsx
│   ├── services/             # API services
│   │   └── api.js
│   ├── context/              # React context
│   └── App.jsx
├── ARCHITECTURE.md           # Architecture documentation
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.hikeforsure.com/api/v1
```

### Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <access_token>
```

### Key Endpoints

#### Authentication
```
POST /auth/signup          - Register new user
POST /auth/login           - Login user
POST /auth/logout          - Logout user
POST /auth/otp/generate    - Generate OTP
POST /auth/otp/verify      - Verify OTP
```

#### Candidates
```
GET    /candidates/profile        - Get profile
PUT    /candidates/profile        - Update profile
POST   /candidates/skills         - Add skill
GET    /candidates/skills         - Get skills
POST   /candidates/experience     - Add experience
POST   /candidates/education      - Add education
```

#### Jobs
```
POST   /jobs                 - Create job
GET    /jobs                 - List jobs
GET    /jobs/:id             - Get job details
POST   /jobs/:id/apply       - Apply to job
GET    /applications         - Get applications
```

#### Messaging
```
POST   /conversations                    - Create conversation
GET    /conversations                    - List conversations
POST   /conversations/:id/messages       - Send message
GET    /conversations/:id/messages       - Get messages
```

#### Subscriptions
```
GET    /plans                      - List plans
POST   /subscriptions              - Subscribe
GET    /subscriptions/current      - Get subscription
POST   /payments                   - Process payment
```

See full API documentation in [API.md](./API.md) (to be created).

---

## 🗄️ Database Schema

### Core Tables

- **users** - User authentication and roles
- **candidate_profiles** - Candidate information
- **recruiter_profiles** - Recruiter information
- **companies** - Company profiles
- **jobs** - Job postings
- **job_applications** - Application tracking
- **skills** - Skill taxonomy
- **connections** - Professional networking
- **messages** - Messaging system
- **subscriptions** - Premium plans
- **payments** - Payment tracking

### Key Relationships

```sql
users (1:1) candidate_profiles
users (1:1) recruiter_profiles
companies (1:M) jobs
jobs (1:M) job_applications
candidate_profiles (M:M) skills
users (M:M) connections
```

See [backend/database/schema.sql](./backend/database/schema.sql) for complete schema.

---

## 🌐 Deployment

### Quick Deploy Options

#### Option 1: AWS
- Frontend: S3 + CloudFront
- Backend: EC2 + ALB
- Database: RDS PostgreSQL
- Cache: ElastiCache Redis
- Search: OpenSearch

#### Option 2: DigitalOcean
- Droplet for backend
- Spaces for storage
- Managed PostgreSQL
- Managed Redis

#### Option 3: Docker
```bash
docker-compose up -d
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

## 🔒 Security

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuration
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ HTTPS/SSL encryption
- ✅ Input validation
- ✅ Audit logging

---

## 📈 Performance

- ⚡ Database indexing on key columns
- ⚡ Redis caching for hot data
- ⚡ Elasticsearch for fast search
- ⚡ CDN for static assets
- ⚡ Connection pooling
- ⚡ Gzip compression
- ⚡ Lazy loading on frontend

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ..
npm test
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📞 Support

- **Email**: support@hikeforsure.com
- **Documentation**: [docs.hikeforsure.com](https://docs.hikeforsure.com)
- **Issues**: [GitHub Issues](https://github.com/karanveerAujla1210/Hike-For-Sure/issues)

---

## 🎯 Roadmap

- [ ] Mobile apps (React Native)
- [ ] Video interviews (WebRTC)
- [ ] AI-powered job matching
- [ ] Resume parser
- [ ] Skill assessments
- [ ] Company reviews
- [ ] Salary insights
- [ ] Career coaching

---

## 🙏 Acknowledgments

- React.js team for the amazing framework
- PostgreSQL community for the robust database
- All open-source contributors

---

**Built with ❤️ by the Hike For Sure Team**

**⭐ Star this repo if you find it helpful!**
