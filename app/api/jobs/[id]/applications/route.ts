import { NextRequest, NextResponse } from "next/server";

import { RECRUITER_ROLES } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(RECRUITER_ROLES);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const supabase = createSupabaseServerClient();
  const { data: job } = await supabase
    .from("jobs")
    .select("id, recruiter_id")
    .eq("id", params.id)
    .single();

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.recruiter_id !== auth.userId && auth.profile.role !== "platform_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("applications")
    .select("id, status, applied_at, resume_url, cover_letter, profiles(id, full_name, email)")
    .eq("job_id", params.id)
    .order("applied_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ applications: data ?? [] });
}
