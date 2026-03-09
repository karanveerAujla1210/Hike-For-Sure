-- Migration 002: Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Companies policies
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Recruiters can create companies" ON companies FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('recruiter', 'company_admin'))
);
CREATE POLICY "Company admins can update their companies" ON companies FOR UPDATE USING (
  created_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'platform_admin')
);

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (status = 'active' OR recruiter_id = auth.uid());
CREATE POLICY "Recruiters can create jobs" ON jobs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('recruiter', 'company_admin'))
);
CREATE POLICY "Recruiters can update own jobs" ON jobs FOR UPDATE USING (recruiter_id = auth.uid());
CREATE POLICY "Recruiters can delete own jobs" ON jobs FOR DELETE USING (recruiter_id = auth.uid());

-- Applications policies
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid())
);
CREATE POLICY "Candidates can create applications" ON applications FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Recruiters can update application status" ON applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid())
);

-- Experience policies
CREATE POLICY "Experience is viewable by everyone" ON experience FOR SELECT USING (true);
CREATE POLICY "Users can manage own experience" ON experience FOR ALL USING (user_id = auth.uid());

-- Education policies
CREATE POLICY "Education is viewable by everyone" ON education FOR SELECT USING (true);
CREATE POLICY "Users can manage own education" ON education FOR ALL USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update own received messages" ON messages FOR UPDATE USING (receiver_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own subscription" ON subscriptions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own subscription" ON subscriptions FOR UPDATE USING (user_id = auth.uid());

-- Connections policies
CREATE POLICY "Users can view own connections" ON connections FOR SELECT USING (
  requester_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "Users can create connections" ON connections FOR INSERT WITH CHECK (requester_id = auth.uid());
CREATE POLICY "Users can update received connections" ON connections FOR UPDATE USING (receiver_id = auth.uid());
