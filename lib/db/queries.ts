import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { JobFilters } from "@/types/platform";

export async function fetchJobs(filters: JobFilters) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.rpc("search_jobs", {
    q: filters.query ?? null,
    p_location: filters.location ?? null,
    p_salary_min: filters.salaryMin ?? null,
    p_salary_max: filters.salaryMax ?? null,
    p_experience_level: filters.experienceLevel ?? null,
    p_skills: filters.skills ?? null
  });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchJobById(id: string) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, title, description, requirements, location, experience_level, salary_min, salary_max, created_at, company_id, companies(name, logo_url)"
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchMyApplications() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return [];
  }

  const { data, error } = await supabase
    .from("applications")
    .select(
      "id, status, applied_at, jobs(id, title, location, companies(name)), recruiter_notes"
    )
    .eq("user_id", userData.user.id)
    .order("applied_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchMyNotifications() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return [];
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, message, link, is_read, created_at")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchConversation(withUserId: string) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return [];
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, content, is_read, read_at, created_at")
    .or(
      `and(sender_id.eq.${userData.user.id},receiver_id.eq.${withUserId}),and(sender_id.eq.${withUserId},receiver_id.eq.${userData.user.id})`
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchRecruiterAnalytics() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return {
      totalJobs: 0,
      totalApplications: 0,
      hired: 0
    };
  }

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id")
    .eq("recruiter_id", userData.user.id);

  const jobIds = jobs?.map((job) => job.id) ?? [];

  if (!jobIds.length) {
    return {
      totalJobs: 0,
      totalApplications: 0,
      hired: 0
    };
  }

  const { count: totalApplications } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .in("job_id", jobIds);

  const { count: hired } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .in("job_id", jobIds)
    .eq("status", "hired");

  return {
    totalJobs: jobIds.length,
    totalApplications: totalApplications ?? 0,
    hired: hired ?? 0
  };
}
