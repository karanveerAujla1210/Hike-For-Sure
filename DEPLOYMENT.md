# Hike For Sure - Deployment Guide

## Complete Production-Ready Recruitment Platform

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Environment Configuration](#environment-configuration)
7. [Production Deployment](#production-deployment)
8. [Scaling Strategy](#scaling-strategy)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## System Requirements

### Development Environment
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Elasticsearch 8+
- npm or yarn

### Production Environment
- AWS EC2 / DigitalOcean / Azure VM
- PostgreSQL (RDS or managed)
- Redis (ElastiCache or managed)
- Elasticsearch (AWS OpenSearch or managed)
- S3 or equivalent for file storage
- Load Balancer (ALB/NLB)
- CDN (CloudFront)

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/karanveerAujla1210/Hike-For-Sure.git
cd Hike-For-Sure
```

### 2. Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Install and set password for postgres user
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

### 3. Install Redis

**Windows:**
```bash
# Download from https://github.com/microsoftarchive/redis/releases
# Or use WSL
```

**Linux:**
```bash
sudo apt install redis-server
sudo systemctl start redis
```

**macOS:**
```bash
brew install redis
brew services start redis
```

### 4. Install Elasticsearch

**All Platforms:**
```bash
# Download from https://www.elastic.co/downloads/elasticsearch
# Extract and run
./bin/elasticsearch
```

---

## Database Setup

### 1. Create Database

```bash
psql -U postgres
CREATE DATABASE hike_for_sure;
\q
```

### 2. Run Schema

```bash
cd backend
psql -U postgres -d hike_for_sure -f database/schema.sql
```

### 3. Verify Tables

```bash
psql -U postgres -d hike_for_sure
\dt
```

---

## Backend Setup

### 1. Navigate to Backend

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=hike_for_sure
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key

REDIS_HOST=localhost
REDIS_PORT=6379

ELASTICSEARCH_NODE=http://localhost:9200

AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=hike-for-sure-uploads

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

FRONTEND_URL=http://localhost:5173
```

### 4. Start Backend Server

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

---

## Frontend Setup

### 1. Navigate to Frontend

```bash
cd ..
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 4. Start Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment | production |
| PORT | Server port | 5000 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | hike_for_sure |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | secure_password |
| JWT_SECRET | JWT secret key | min_32_characters |
| JWT_REFRESH_SECRET | Refresh token secret | min_32_characters |
| REDIS_HOST | Redis host | localhost |
| ELASTICSEARCH_NODE | ES endpoint | http://localhost:9200 |
| AWS_ACCESS_KEY_ID | AWS access key | AKIA... |
| AWS_SECRET_ACCESS_KEY | AWS secret | secret |
| AWS_S3_BUCKET | S3 bucket name | uploads |
| SMTP_HOST | Email server | smtp.gmail.com |
| FRONTEND_URL | Frontend URL | https://hikeforsure.com |

---

## Production Deployment

### Option 1: AWS Deployment

#### 1. Database (RDS)

```bash
# Create PostgreSQL RDS instance
# Security group: Allow port 5432 from backend EC2
# Note down endpoint
```

#### 2. Redis (ElastiCache)

```bash
# Create Redis cluster
# Security group: Allow port 6379 from backend EC2
```

#### 3. Elasticsearch (OpenSearch)

```bash
# Create OpenSearch domain
# Configure access policies
```

#### 4. S3 Bucket

```bash
aws s3 mb s3://hike-for-sure-uploads
aws s3api put-bucket-cors --bucket hike-for-sure-uploads --cors-configuration file://cors.json
```

#### 5. Backend EC2

```bash
# Launch Ubuntu EC2 instance
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Clone repository
git clone https://github.com/karanveerAujla1210/Hike-For-Sure.git
cd Hike-For-Sure/backend

# Install dependencies
npm install --production

# Configure environment
nano .env

# Install PM2
sudo npm install -g pm2

# Start application
pm2 start src/server.js --name hike-backend
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/hike-backend
```

Nginx configuration:

```nginx
server {
    listen 80;
    server_name api.hikeforsure.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/hike-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.hikeforsure.com
```

#### 6. Frontend (S3 + CloudFront)

```bash
# Build frontend
cd ../
npm run build

# Upload to S3
aws s3 sync dist/ s3://hikeforsure.com --delete

# Create CloudFront distribution
# Origin: S3 bucket
# Default root object: index.html
# Custom error response: 404 -> /index.html (for SPA routing)
```

### Option 2: DigitalOcean Deployment

```bash
# Create Droplet (Ubuntu 22.04)
# SSH into droplet

# Install dependencies
sudo apt update
sudo apt install -y nodejs npm postgresql redis-server nginx

# Follow similar steps as AWS EC2
```

### Option 3: Docker Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: hike_for_sure
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6
    ports:
      - "6379:6379"

  elasticsearch:
    image: elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
      - ELASTICSEARCH_NODE=http://elasticsearch:9200
    depends_on:
      - postgres
      - redis
      - elasticsearch

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

```bash
docker-compose up -d
```

---

## Scaling Strategy

### Horizontal Scaling

1. **Load Balancer**: Use AWS ALB or Nginx
2. **Multiple Backend Instances**: Run 3+ backend servers
3. **Database Read Replicas**: PostgreSQL read replicas
4. **Redis Cluster**: Redis cluster mode
5. **CDN**: CloudFront for static assets

### Caching Strategy

```javascript
// Redis caching example
const cacheKey = `job:${jobId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const job = await db.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
await redis.setex(cacheKey, 3600, JSON.stringify(job));
```

### Database Optimization

1. **Indexes**: Already created in schema
2. **Connection Pooling**: Configured in database.js
3. **Query Optimization**: Use EXPLAIN ANALYZE
4. **Partitioning**: Partition large tables by date

---

## Monitoring & Maintenance

### Application Monitoring

```bash
# Install monitoring tools
npm install --save winston morgan

# PM2 monitoring
pm2 monit
pm2 logs
```

### Database Monitoring

```sql
-- Check slow queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backup Strategy

```bash
# Database backup
pg_dump -U postgres hike_for_sure > backup_$(date +%Y%m%d).sql

# Automated daily backups
crontab -e
0 2 * * * pg_dump -U postgres hike_for_sure > /backups/backup_$(date +\%Y\%m\%d).sql
```

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Database health
psql -U postgres -d hike_for_sure -c "SELECT 1"

# Redis health
redis-cli ping
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database encryption at rest
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Implement API authentication
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Monitor logs for suspicious activity

---

## Support & Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -d hike_for_sure
```

**Redis Connection Error:**
```bash
# Check Redis is running
redis-cli ping
```

**Port Already in Use:**
```bash
# Find process using port
lsof -i :5000
kill -9 <PID>
```

---

## API Documentation

API documentation available at: `http://localhost:5000/api/v1/docs`

---

## License

MIT License - See LICENSE file

---

## Contact

For support: support@hikeforsure.com
For sales: sales@hikeforsure.com

---

**Platform is now ready for production deployment! 🚀**
