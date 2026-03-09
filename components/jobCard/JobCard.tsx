import Link from "next/link";

import { Button } from "@/components/ui/button";

interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  location: string;
  experienceLevel: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  createdAt: string;
}

function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) {
    return "Not disclosed";
  }
  return `${min ? `₹${min.toLocaleString("en-IN")}` : ""} - ${max ? `₹${max.toLocaleString("en-IN")}` : ""}`;
}

export function JobCard({
  id,
  title,
  companyName,
  location,
  experienceLevel,
  salaryMin,
  salaryMax,
  createdAt
}: JobCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">{companyName}</p>
          <p className="mt-2 text-sm text-slate-500">
            {location} | {experienceLevel}
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">
            Salary: {formatSalary(salaryMin, salaryMax)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Posted {new Date(createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/jobs/${id}`}>
            <Button variant="secondary">View</Button>
          </Link>
          <Link href={`/apply?jobId=${id}`}>
            <Button>Apply</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
