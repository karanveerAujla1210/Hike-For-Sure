import { Resend } from "resend";

import { getServerEnv } from "@/lib/utils/env";

function getResendClient() {
  const env = getServerEnv();
  return new Resend(env.RESEND_API_KEY);
}

const fromAddress = "Hike For Sure <noreply@hikeforsure.com>";

export async function sendSignupEmail(email: string, name?: string | null) {
  const resend = getResendClient();
  return resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "Welcome to Hike For Sure",
    html: `<p>Hello ${name ?? "there"}, your account is ready.</p>`
  });
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const resend = getResendClient();
  return resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "Reset your Hike For Sure password",
    html: `<p>Use this link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
  });
}

export async function sendApplicationConfirmationEmail(
  email: string,
  jobTitle: string
) {
  const resend = getResendClient();
  return resend.emails.send({
    from: fromAddress,
    to: email,
    subject: `Application received for ${jobTitle}`,
    html: `<p>Your application for <strong>${jobTitle}</strong> was submitted successfully.</p>`
  });
}

export async function sendInterviewInvitationEmail(
  email: string,
  jobTitle: string,
  scheduleText: string
) {
  const resend = getResendClient();
  return resend.emails.send({
    from: fromAddress,
    to: email,
    subject: `Interview invitation: ${jobTitle}`,
    html: `<p>You have been invited for an interview for <strong>${jobTitle}</strong>.</p><p>${scheduleText}</p>`
  });
}
