import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(80),
  role: z.enum(["candidate", "recruiter", "company_admin", "platform_admin"])
});

export const resetPasswordSchema = z.object({
  email: z.string().email()
});

export const jobCreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(30),
  requirements: z.string().min(10),
  location: z.string().min(2).max(120),
  jobType: z.enum(["full-time", "part-time", "contract", "internship"]),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"]),
  salaryMin: z.number().int().nonnegative().nullable(),
  salaryMax: z.number().int().nonnegative().nullable(),
  skills: z.array(z.string().min(1)).max(20)
});

export const applicationCreateSchema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z.string().max(3000).optional(),
  resumePath: z.string().min(4)
});

export const applicationStatusSchema = z.object({
  applicationId: z.string().uuid(),
  status: z.enum(["applied", "shortlisted", "interview", "rejected", "hired"])
});

export const messageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1).max(4000)
});

export const subscriptionCheckoutSchema = z.object({
  plan: z.enum(["free", "pro"])
});

export const analyticsEventSchema = z.object({
  event: z.enum(["user_signup", "job_application", "subscription_conversion"]),
  payload: z.record(z.any()).optional()
});
