import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/utils/rate-limit";
import { jobCreateSchema } from "@/lib/utils/validation";
import { RECRUITER_ROLES } from "@/lib/auth/roles";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await enforceRateLimit({
    route: "jobs-search",
    identifier: ip,
    limit: 120,
    windowSeconds: 60
  });

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const params = request.nextUrl.searchParams;
  const query = params.get("q");
  const location = params.get("location");
  const salaryMin = params.get("salaryMin");
  const salaryMax = params.get("salaryMax");
  const experienceLevel = params.get("experienceLevel");
  const skills = params.get("skills");

  const parsedSkills = skills
    ? skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : null;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc("search_jobs", {
    q: query,
    p_location: location,
    p_salary_min: salaryMin ? Number(salaryMin) : null,
    p_salary_max: salaryMax ? Number(salaryMax) : null,
    p_experience_level: experienceLevel,
    p_skills: parsedSkills
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ jobs: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(RECRUITER_ROLES);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const allowed = await enforceRateLimit({
    route: "jobs-create",
    identifier: auth.userId,
    limit: 30,
    windowSeconds: 3600
  });

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = jobCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("id", auth.userId)
    .single();

  if (!profile?.company_id) {
    return NextResponse.json(
      { error: "Company profile is required before posting jobs." },
      { status: 400 }
    );
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_type, status, job_posts_limit, job_posts_used")
    .eq("user_id", auth.userId)
    .maybeSingle();

  const effectivePlan = subscription?.status === "active" ? subscription : null;
  const limit = effectivePlan?.job_posts_limit ?? 3;
  const used = effectivePlan?.job_posts_used ?? 0;
  const hasUnlimited = limit < 0;

  if (!hasUnlimited && used >= limit) {
    return NextResponse.json(
      { error: "Job posting limit reached. Upgrade to Pro for unlimited jobs." },
      { status: 403 }
    );
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .insert({
      company_id: profile.company_id,
      recruiter_id: auth.userId,
      title: parsed.data.title,
      description: parsed.data.description,
      requirements: parsed.data.requirements,
      location: parsed.data.location,
      job_type: parsed.data.jobType,
      experience_level: parsed.data.experienceLevel,
      salary_min: parsed.data.salaryMin,
      salary_max: parsed.data.salaryMax,
      status: "active"
    })
    .select("id")
    .single();

  if (jobError || !job) {
    return NextResponse.json(
      { error: jobError?.message ?? "Failed to create job" },
      { status: 400 }
    );
  }

  const normalizedSkills = parsed.data.skills
    .map((skill) => skill.trim().toLowerCase())
    .filter(Boolean);

  if (normalizedSkills.length) {
    const upsertRows = normalizedSkills.map((name) => ({ name }));
    await supabase.from("skills").upsert(upsertRows, {
      onConflict: "name",
      ignoreDuplicates: true
    });

    const { data: skillRows } = await supabase
      .from("skills")
      .select("id, name")
      .in("name", normalizedSkills);

    if (skillRows?.length) {
      await supabase.from("job_skills").insert(
        skillRows.map((skillRow) => ({
          job_id: job.id,
          skill_id: skillRow.id
        }))
      );
    }
  }

  await supabase.from("subscriptions").upsert(
    {
      user_id: auth.userId,
      plan_type: effectivePlan?.plan_type ?? "free",
      status: "active",
      job_posts_limit: hasUnlimited ? -1 : limit,
      job_posts_used: hasUnlimited ? used : used + 1
    },
    { onConflict: "user_id" }
  );

  return NextResponse.json({ id: job.id }, { status: 201 });
}
