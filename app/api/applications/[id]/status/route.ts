import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { RECRUITER_ROLES } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendInterviewInvitationEmail } from "@/lib/utils/email";
import { enforceRateLimit } from "@/lib/utils/rate-limit";

const updateStatusSchema = z.object({
  status: z.enum(["applied", "shortlisted", "interview", "rejected", "hired"]),
  note: z.string().max(1000).optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(RECRUITER_ROLES);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const allowed = await enforceRateLimit({
    route: "application-status-update",
    identifier: auth.userId,
    limit: 120,
    windowSeconds: 3600
  });

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select(
      "id, user_id, job_id, jobs(id, recruiter_id, title), profiles!applications_user_id_fkey(email)"
    )
    .eq("id", params.id)
    .single();

  if (applicationError || !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const jobInfo = Array.isArray(application.jobs)
    ? application.jobs[0]
    : application.jobs;
  const candidateProfile = Array.isArray(application.profiles)
    ? application.profiles[0]
    : application.profiles;

  if (jobInfo?.recruiter_id !== auth.userId && auth.profile.role !== "platform_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: updateError } = await supabase
    .from("applications")
    .update({
      status: parsed.data.status,
      recruiter_notes: parsed.data.note ?? null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.userId
    })
    .eq("id", params.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  await supabase.from("notifications").insert({
    user_id: application.user_id,
    type: "application_status_update",
    title: "Application status updated",
    message: `Your application for ${jobInfo?.title ?? "the role"} is now ${parsed.data.status}.`,
    link: "/dashboard"
  });

  if (parsed.data.status === "interview" && candidateProfile?.email) {
    await sendInterviewInvitationEmail(
      candidateProfile.email,
      jobInfo?.title ?? "the role",
      "The recruiter will contact you shortly with schedule details."
    );
  }

  return NextResponse.json({ success: true });
}
