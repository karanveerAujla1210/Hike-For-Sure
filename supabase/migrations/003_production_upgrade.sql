-- Migration 003: Production upgrade for Hike For Sure
-- This migration is additive and safe to run on top of existing schema.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE user_role_enum AS ENUM (
      'candidate',
      'recruiter',
      'company_admin',
      'platform_admin'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status_enum') THEN
    CREATE TYPE application_status_enum AS ENUM (
      'applied',
      'shortlisted',
      'interview',
      'rejected',
      'hired'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status_enum') THEN
    CREATE TYPE job_status_enum AS ENUM ('active', 'closed', 'draft');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type_enum') THEN
    CREATE TYPE job_type_enum AS ENUM ('full-time', 'part-time', 'contract', 'internship');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_level_enum') THEN
    CREATE TYPE experience_level_enum AS ENUM ('entry', 'mid', 'senior', 'lead');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'candidate',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS company_id UUID,
  ADD COLUMN IF NOT EXISTS resume_url TEXT,
  ADD COLUMN IF NOT EXISTS role user_role_enum,
  ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE public.profiles
SET user_id = id
WHERE user_id IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'profiles'
      AND constraint_name = 'profiles_user_id_fkey'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'profiles'
      AND constraint_name = 'profiles_user_id_key'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END
$$;

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS admin_user_id UUID,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'companies'
      AND constraint_name = 'companies_admin_user_id_fkey'
  ) THEN
    ALTER TABLE public.companies
      ADD CONSTRAINT companies_admin_user_id_fkey
      FOREIGN KEY (admin_user_id) REFERENCES public.users(id) ON DELETE SET NULL;
  END IF;
END
$$;

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
      to_tsvector(
        'english',
        coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(requirements, '')
      )
    ) STORED;

ALTER TABLE public.jobs
  ALTER COLUMN status TYPE job_status_enum USING status::job_status_enum,
  ALTER COLUMN job_type TYPE job_type_enum USING job_type::job_type_enum,
  ALTER COLUMN experience_level TYPE experience_level_enum USING experience_level::experience_level_enum;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'jobs'
      AND constraint_name = 'jobs_recruiter_id_users_fkey'
  ) THEN
    ALTER TABLE public.jobs
      ADD CONSTRAINT jobs_recruiter_id_users_fkey
      FOREIGN KEY (recruiter_id) REFERENCES public.users(id) ON DELETE SET NULL;
  END IF;
END
$$;

ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS normalized_name TEXT;

UPDATE public.skills
SET normalized_name = lower(name)
WHERE normalized_name IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'skills'
      AND constraint_name = 'skills_normalized_name_key'
  ) THEN
    ALTER TABLE public.skills
      ADD CONSTRAINT skills_normalized_name_key UNIQUE (normalized_name);
  END IF;
END
$$;

ALTER TABLE public.user_skills
  ADD COLUMN IF NOT EXISTS years_experience NUMERIC(4, 1);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'user_skills'
      AND constraint_name = 'user_skills_user_id_users_fkey'
  ) THEN
    ALTER TABLE public.user_skills
      ADD CONSTRAINT user_skills_user_id_users_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'experience'
      AND constraint_name = 'experience_user_id_users_fkey'
  ) THEN
    ALTER TABLE public.experience
      ADD CONSTRAINT experience_user_id_users_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'education'
      AND constraint_name = 'education_user_id_users_fkey'
  ) THEN
    ALTER TABLE public.education
      ADD CONSTRAINT education_user_id_users_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END
$$;

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS recruiter_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID;

ALTER TABLE public.applications
  ALTER COLUMN status TYPE application_status_enum USING status::application_status_enum;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'applications'
      AND constraint_name = 'applications_user_id_users_fkey'
  ) THEN
    ALTER TABLE public.applications
      ADD CONSTRAINT applications_user_id_users_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'applications'
      AND constraint_name = 'applications_reviewed_by_users_fkey'
  ) THEN
    ALTER TABLE public.applications
      ADD CONSTRAINT applications_reviewed_by_users_fkey
      FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;
  END IF;
END
$$;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS conversation_id TEXT GENERATED ALWAYS AS (
    CASE
      WHEN sender_id::text < receiver_id::text
        THEN sender_id::text || ':' || receiver_id::text
      ELSE receiver_id::text || ':' || sender_id::text
    END
  ) STORED;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'messages'
      AND constraint_name = 'messages_sender_id_users_fkey'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_sender_id_users_fkey
      FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'messages'
      AND constraint_name = 'messages_receiver_id_users_fkey'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_receiver_id_users_fkey
      FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'notifications'
      AND constraint_name = 'notifications_user_id_users_fkey'
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_user_id_users_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END
$$;

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS razorpay_plan_id TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'subscriptions'
      AND constraint_name = 'subscriptions_user_id_users_fkey'
  ) THEN
    ALTER TABLE public.subscriptions
      ADD CONSTRAINT subscriptions_user_id_users_fkey
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'connections'
      AND constraint_name = 'connections_requester_id_users_fkey'
  ) THEN
    ALTER TABLE public.connections
      ADD CONSTRAINT connections_requester_id_users_fkey
      FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'connections'
      AND constraint_name = 'connections_receiver_id_users_fkey'
  ) THEN
    ALTER TABLE public.connections
      ADD CONSTRAINT connections_receiver_id_users_fkey
      FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  identifier TEXT NOT NULL,
  route TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  last_request_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (identifier, route, window_start)
);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users',
    'profiles',
    'companies',
    'jobs',
    'applications',
    'subscriptions',
    'connections'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_trigger
      WHERE tgname = 'set_' || t || '_updated_at'
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER set_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();',
        t,
        t
      );
    END IF;
  END LOOP;
END
$$;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role user_role_enum := coalesce((NEW.raw_user_meta_data->>'role')::user_role_enum, 'candidate');
  user_name TEXT := NEW.raw_user_meta_data->>'full_name';
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, user_role)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = now();

  INSERT INTO public.profiles (id, user_id, email, full_name, role)
  VALUES (NEW.id, NEW.id, NEW.email, user_name, user_role)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = coalesce(public.profiles.full_name, EXCLUDED.full_name),
    role = EXCLUDED.role,
    user_id = EXCLUDED.user_id,
    updated_at = now();

  INSERT INTO public.subscriptions (user_id, plan_type, status, job_posts_limit, job_posts_used)
  VALUES (NEW.id, 'free', 'active', 3, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

CREATE OR REPLACE FUNCTION public.search_jobs(
  q TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_salary_min INTEGER DEFAULT NULL,
  p_salary_max INTEGER DEFAULT NULL,
  p_experience_level TEXT DEFAULT NULL,
  p_skills TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  experience_level experience_level_enum,
  created_at TIMESTAMPTZ,
  company_id UUID,
  company_name TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    j.title,
    j.description,
    j.location,
    j.salary_min,
    j.salary_max,
    j.experience_level,
    j.created_at,
    j.company_id,
    c.name
  FROM public.jobs j
  LEFT JOIN public.companies c ON c.id = j.company_id
  WHERE j.status = 'active'
    AND (q IS NULL OR q = '' OR j.search_vector @@ plainto_tsquery('english', q))
    AND (p_location IS NULL OR j.location ILIKE '%' || p_location || '%')
    AND (p_salary_min IS NULL OR coalesce(j.salary_min, 0) >= p_salary_min)
    AND (p_salary_max IS NULL OR coalesce(j.salary_max, 999999999) <= p_salary_max)
    AND (p_experience_level IS NULL OR j.experience_level::text = p_experience_level)
    AND (
      p_skills IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.job_skills js
        JOIN public.skills s ON s.id = js.skill_id
        WHERE js.job_id = j.id
          AND s.normalized_name = ANY (
            SELECT lower(unnest(p_skills))
          )
      )
    )
  ORDER BY j.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_route TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_count INTEGER;
BEGIN
  v_window_start :=
    to_timestamp(floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds);

  INSERT INTO public.api_rate_limits (
    identifier,
    route,
    window_start,
    request_count,
    last_request_at
  )
  VALUES (
    p_identifier,
    p_route,
    v_window_start,
    1,
    now()
  )
  ON CONFLICT (identifier, route, window_start)
  DO UPDATE SET
    request_count = public.api_rate_limits.request_count + 1,
    last_request_at = now()
  RETURNING request_count INTO v_count;

  RETURN v_count <= p_limit;
END;
$$;

REVOKE ALL ON TABLE public.api_rate_limits FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.search_jobs(TEXT, TEXT, INTEGER, INTEGER, TEXT, TEXT[]) TO anon, authenticated, service_role;

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_status ON public.jobs(company_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON public.jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_experience ON public.jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_salary_min ON public.jobs(salary_min);
CREATE INDEX IF NOT EXISTS idx_jobs_salary_max ON public.jobs(salary_max);
CREATE INDEX IF NOT EXISTS idx_jobs_search_vector ON public.jobs USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_skills_normalized_name ON public.skills(normalized_name);
CREATE INDEX IF NOT EXISTS idx_job_skills_skill_job ON public.job_skills(skill_id, job_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_status ON public.applications(job_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_user ON public.applications(user_id, applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_unread ON public.messages(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_pair ON public.connections(requester_id, receiver_id);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS users_select_self ON public.users
FOR SELECT USING (id = auth.uid());

CREATE POLICY IF NOT EXISTS users_update_self ON public.users
FOR UPDATE USING (id = auth.uid());

CREATE POLICY IF NOT EXISTS profiles_select_public ON public.profiles
FOR SELECT USING (TRUE);

CREATE POLICY IF NOT EXISTS profiles_insert_self ON public.profiles
FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY IF NOT EXISTS profiles_update_self ON public.profiles
FOR UPDATE USING (id = auth.uid());

CREATE POLICY IF NOT EXISTS companies_select_public ON public.companies
FOR SELECT USING (TRUE);

CREATE POLICY IF NOT EXISTS companies_insert_recruiters ON public.companies
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('recruiter', 'company_admin', 'platform_admin')
  )
);

CREATE POLICY IF NOT EXISTS companies_update_admin ON public.companies
FOR UPDATE USING (
  admin_user_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role = 'platform_admin'
  )
);

CREATE POLICY IF NOT EXISTS jobs_select_active_or_owner ON public.jobs
FOR SELECT USING (
  status = 'active'
  OR recruiter_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'platform_admin'
  )
);

CREATE POLICY IF NOT EXISTS jobs_insert_recruiters ON public.jobs
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('recruiter', 'company_admin', 'platform_admin')
  )
);

CREATE POLICY IF NOT EXISTS jobs_update_owner ON public.jobs
FOR UPDATE USING (
  recruiter_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'platform_admin'
  )
);

CREATE POLICY IF NOT EXISTS applications_select_scope ON public.applications
FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = public.applications.job_id
      AND j.recruiter_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'platform_admin'
  )
);

CREATE POLICY IF NOT EXISTS applications_insert_candidate ON public.applications
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS applications_update_recruiter ON public.applications
FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM public.jobs j
    WHERE j.id = public.applications.job_id
      AND j.recruiter_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'platform_admin'
  )
);

CREATE POLICY IF NOT EXISTS skills_select_public ON public.skills
FOR SELECT USING (TRUE);

CREATE POLICY IF NOT EXISTS user_skills_select_public ON public.user_skills
FOR SELECT USING (TRUE);

CREATE POLICY IF NOT EXISTS user_skills_manage_own ON public.user_skills
FOR ALL USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS experience_select_public ON public.experience
FOR SELECT USING (TRUE);

CREATE POLICY IF NOT EXISTS experience_manage_own ON public.experience
FOR ALL USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS education_select_public ON public.education
FOR SELECT USING (TRUE);

CREATE POLICY IF NOT EXISTS education_manage_own ON public.education
FOR ALL USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS messages_select_scope ON public.messages
FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY IF NOT EXISTS messages_insert_sender ON public.messages
FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY IF NOT EXISTS messages_update_receiver ON public.messages
FOR UPDATE USING (receiver_id = auth.uid());

CREATE POLICY IF NOT EXISTS notifications_select_self ON public.notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS notifications_update_self ON public.notifications
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS subscriptions_select_self ON public.subscriptions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS subscriptions_update_self ON public.subscriptions
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS subscriptions_insert_self ON public.subscriptions
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS connections_select_scope ON public.connections
FOR SELECT USING (requester_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY IF NOT EXISTS connections_insert_requester ON public.connections
FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY IF NOT EXISTS connections_update_receiver ON public.connections
FOR UPDATE USING (receiver_id = auth.uid());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  FALSE,
  5242880,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  TRUE,
  2097152,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  TRUE,
  2097152,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY IF NOT EXISTS storage_resumes_upload_own
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY IF NOT EXISTS storage_resumes_select_own
ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY IF NOT EXISTS storage_resumes_delete_own
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY IF NOT EXISTS storage_profile_images_insert_own
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY IF NOT EXISTS storage_company_logos_insert_own
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
