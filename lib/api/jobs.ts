import { apiRequest } from "@/lib/api/client";
import type { ApplicationStatus, JobFilters } from "@/types/platform";

export interface JobPayload {
  title: string;
  description: string;
  requirements: string;
  location: string;
  jobType: "full-time" | "part-time" | "contract" | "internship";
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  salaryMin: number | null;
  salaryMax: number | null;
  skills: string[];
}

export interface JobSearchResult {
  jobs: Array<{
    id: string;
    title: string;
    description: string;
    location: string;
    salary_min: number | null;
    salary_max: number | null;
    experience_level: string;
    created_at: string;
    companies: {
      name: string;
      logo_url: string | null;
    } | null;
  }>;
}

export async function createJob(payload: JobPayload) {
  return apiRequest<{ id: string }>("/api/jobs", {
    method: "POST",
    json: payload
  });
}

export async function searchJobs(filters: JobFilters) {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.location) params.set("location", filters.location);
  if (filters.salaryMin !== undefined) params.set("salaryMin", String(filters.salaryMin));
  if (filters.salaryMax !== undefined) params.set("salaryMax", String(filters.salaryMax));
  if (filters.experienceLevel) params.set("experienceLevel", filters.experienceLevel);
  if (filters.skills?.length) params.set("skills", filters.skills.join(","));

  return apiRequest<JobSearchResult>(`/api/jobs?${params.toString()}`, {
    method: "GET"
  });
}

export async function applyToJob(input: {
  jobId: string;
  coverLetter?: string;
  resumePath: string;
}) {
  return apiRequest<{ id: string; status: ApplicationStatus }>(
    `/api/jobs/${input.jobId}/apply`,
    {
      method: "POST",
      json: input
    }
  );
}
