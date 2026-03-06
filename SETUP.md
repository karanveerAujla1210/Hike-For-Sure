# Hike For Sure - Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

## 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings > API
3. Create `.env` file in root:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Create Database Tables

1. Go to Supabase SQL Editor
2. Run the SQL from `supabase-schema.sql` file

## 4. Run Development Server

```bash
npm run dev
```

## Features

- User authentication (signup/login)
- Job browsing and search
- Job applications
- Application tracking dashboard
- Protected routes

## Database Schema

- **profiles**: User profile data
- **applications**: Job applications with status tracking
- **jobs**: (Optional) Store jobs in database

## Application Status Flow

- `pending`: Application submitted
- `interview`: Candidate selected for interview
- `accepted`: Offer accepted
- `rejected`: Application rejected
