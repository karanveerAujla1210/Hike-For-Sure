import { PageShell } from "@/components/layout/PageShell";
import { JobSearchForm } from "@/components/forms/JobSearchForm";
import { JobCard } from "@/components/jobCard/JobCard";
import { fetchJobs } from "@/lib/db/queries";

interface JobsPageProps {
  searchParams: {
    q?: string;
    location?: string;
    salaryMin?: string;
    salaryMax?: string;
    experienceLevel?: "entry" | "mid" | "senior" | "lead";
    skills?: string;
  };
}

interface JobListItem {
  id: string;
  title: string;
  company_name: string | null;
  location: string;
  experience_level: string;
  salary_min: number | null;
  salary_max: number | null;
  created_at: string;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const jobs = (await fetchJobs({
    query: searchParams.q,
    location: searchParams.location,
    salaryMin: searchParams.salaryMin ? Number(searchParams.salaryMin) : undefined,
    salaryMax: searchParams.salaryMax ? Number(searchParams.salaryMax) : undefined,
    experienceLevel: searchParams.experienceLevel,
    skills: searchParams.skills
      ? searchParams.skills.split(",").map((item) => item.trim()).filter(Boolean)
      : undefined
  })) as JobListItem[];

  return (
    <PageShell
      title="Jobs"
      subtitle="Search by keyword, location, salary range, experience level, and skills."
    >
      <div className="space-y-4">
        <JobSearchForm />

        {jobs.length ? (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              companyName={job.company_name ?? "Unknown company"}
              location={job.location}
              experienceLevel={job.experience_level}
              salaryMin={job.salary_min}
              salaryMax={job.salary_max}
              createdAt={job.created_at}
            />
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            No jobs found for your filters.
          </p>
        )}
      </div>
    </PageShell>
  );
}
