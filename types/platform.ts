export type UserRole =
  | "candidate"
  | "recruiter"
  | "company_admin"
  | "platform_admin";

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "hired";

export type SubscriptionPlan = "free" | "pro";

export interface JobFilters {
  query?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: "entry" | "mid" | "senior" | "lead";
  skills?: string[];
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export interface AuthProfile {
  id: string;
  role: UserRole;
  email: string;
  full_name: string | null;
  company_id: string | null;
}
