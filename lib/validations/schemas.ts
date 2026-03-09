import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['candidate', 'recruiter']),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  companyId: z.string().uuid(),
})

export const applicationSchema = z.object({
  jobId: z.string().uuid(),
  resumeUrl: z.string().url(),
  coverLetter: z.string().optional(),
})

export const profileSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
})

export const messageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1).max(1000),
})

export const companySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  location: z.string().optional(),
})
