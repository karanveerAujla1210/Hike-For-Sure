import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface ApplicationWorkflowPayload {
  recruiter_id: string;
  candidate_id: string;
  candidate_email: string;
  job_title: string;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
    return new Response("Missing required environment variables", { status: 500 });
  }

  const payload = (await req.json()) as ApplicationWorkflowPayload;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { error: notifyError } = await supabase.from("notifications").insert({
    user_id: payload.recruiter_id,
    type: "application_received",
    title: "New application received",
    message: `A candidate applied for ${payload.job_title}.`,
    link: "/company"
  });

  if (notifyError) {
    return new Response(notifyError.message, { status: 400 });
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Hike For Sure <noreply@hikeforsure.com>",
      to: payload.candidate_email,
      subject: `Application received for ${payload.job_title}`,
      html: `<p>Your application has been submitted successfully.</p>`
    })
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
});
