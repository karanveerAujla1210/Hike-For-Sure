import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { fetchJobById } from "@/lib/db/queries";

export default async function JobDetailPage({
  params
}: {
  params: { id: string };
}) {
  const job = await fetchJobById(params.id).catch(() => null);

  if (!job) {
    notFound();
  }

  const company = Array.isArray(job.companies) ? job.companies[0] : job.companies;

  return (
    <PageShell title={job.title} subtitle={company?.name ?? ""}>
      <article className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">{job.location}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {job.description}
        </p>
        <h2 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Requirements
        </h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {job.requirements}
        </p>
        <div className="mt-6">
          <Link href={`/apply?jobId=${job.id}`}>
            <Button>Apply now</Button>
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
