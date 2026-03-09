import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { trackServerEvent } from "@/lib/utils/analytics";
import { sendApplicationConfirmationEmail } from "@/lib/utils/email";
import { enforceRateLimit } from "@/lib/utils/rate-limit";
import { applicationCreateSchema } from "@/lib/utils/validation";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireRole(["candidate"]);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const allowed = await enforceRateLimit({
    route: "job-apply",
    identifier: auth.userId,
    limit: 30,
    windowSeconds: 3600
  });

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = applicationCreateSchema.safeParse({
    ...body,
    jobId: params.id
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, title, recruiter_id, status")
    .eq("id", params.id)
    .single();

  if (jobError || !job || job.status !== "active") {
    return NextResponse.json({ error: "Job is not open for applications." }, { status: 404 });
  }

  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .insert({
      job_id: params.id,
      user_id: auth.userId,
      resume_url: parsed.data.resumePath,
      cover_letter: parsed.data.coverLetter ?? null,
      status: "applied"
    })
    .select("id, status")
    .single();

  if (applicationError || !application) {
    return NextResponse.json(
      { error: applicationError?.message ?? "Failed to create application" },
      { status: 400 }
    );
  }

  await supabase.from("notifications").insert({
    user_id: job.recruiter_id,
    type: "application_received",
    title: "New application received",
    message: `A candidate applied for ${job.title}.`,
    link: `/company?jobId=${job.id}`
  });

  await sendApplicationConfirmationEmail(auth.profile.email, job.title);

  await trackServerEvent({
    distinctId: auth.userId,
    event: "job_application",
    properties: {
      job_id: job.id,
      application_id: application.id
    }
  });

  return NextResponse.json(application, { status: 201 });
}
