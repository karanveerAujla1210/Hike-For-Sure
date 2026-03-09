import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const data = await resend.emails.send({
      from: 'Hike For Sure <noreply@hikeforsure.com>',
      to,
      subject,
      html,
    })
    return data
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: 'Welcome to Hike For Sure',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining Hike For Sure. Start exploring opportunities today.</p>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  return sendEmail({
    to,
    subject: 'Reset Your Password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `,
  })
}

export async function sendApplicationConfirmation(to: string, jobTitle: string) {
  return sendEmail({
    to,
    subject: 'Application Submitted',
    html: `
      <h1>Application Submitted Successfully</h1>
      <p>Your application for <strong>${jobTitle}</strong> has been submitted.</p>
      <p>We'll notify you when the recruiter reviews your application.</p>
    `,
  })
}

export async function sendInterviewInvitation(
  to: string,
  jobTitle: string,
  interviewDetails: string
) {
  return sendEmail({
    to,
    subject: 'Interview Invitation',
    html: `
      <h1>Interview Invitation</h1>
      <p>Congratulations! You've been invited for an interview for <strong>${jobTitle}</strong>.</p>
      <p><strong>Details:</strong></p>
      <p>${interviewDetails}</p>
    `,
  })
}
