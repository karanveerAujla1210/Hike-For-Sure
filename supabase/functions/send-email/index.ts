import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type EmailEvent =
  | "signup"
  | "password_reset"
  | "application_confirmation"
  | "interview_invitation";

interface EmailPayload {
  type: EmailEvent;
  to: string;
  name?: string;
  job_title?: string;
  reset_link?: string;
  interview_schedule?: string;
}

function buildTemplate(payload: EmailPayload) {
  switch (payload.type) {
    case "signup":
      return {
        subject: "Welcome to Hike For Sure",
        html: `<p>Hello ${payload.name ?? "there"}, welcome to Hike For Sure.</p>`
      };
    case "password_reset":
      return {
        subject: "Reset your password",
        html: `<p>Reset your password here: <a href="${payload.reset_link}">${payload.reset_link}</a></p>`
      };
    case "application_confirmation":
      return {
        subject: `Application received for ${payload.job_title}`,
        html: `<p>Your application for ${payload.job_title} was received.</p>`
      };
    case "interview_invitation":
      return {
        subject: `Interview invitation for ${payload.job_title}`,
        html: `<p>You have an interview for ${payload.job_title}. ${payload.interview_schedule ?? ""}</p>`
      };
    default:
      return {
        subject: "Hike For Sure",
        html: "<p>Notification</p>"
      };
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    return new Response("Missing RESEND_API_KEY", { status: 500 });
  }

  const payload = (await req.json()) as EmailPayload;
  const template = buildTemplate(payload);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Hike For Sure <noreply@hikeforsure.com>",
      to: payload.to,
      subject: template.subject,
      html: template.html
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(errorText, { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
});
