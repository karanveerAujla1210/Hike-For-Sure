import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { getAuthContext } from "@/lib/auth/server";
import {
  fetchMyApplications,
  fetchRecruiterAnalytics
} from "@/lib/db/queries";
import { RECRUITER_ROLES } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const auth = await getAuthContext();
  if (!auth) {
    redirect("/login");
  }

  const isRecruiter = RECRUITER_ROLES.includes(auth.profile.role);

  if (isRecruiter) {
    const analytics = await fetchRecruiterAnalytics();

    return (
      <PageShell
        title="Recruiter Dashboard"
        subtitle="Track posting performance and applicant funnel."
      >
        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total Jobs</p>
            <p className="mt-1 text-3xl font-semibold">{analytics.totalJobs}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Total Applications</p>
            <p className="mt-1 text-3xl font-semibold">
              {analytics.totalApplications}
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Hired Candidates</p>
            <p className="mt-1 text-3xl font-semibold">{analytics.hired}</p>
          </article>
        </section>
      </PageShell>
    );
  }

  const applications = await fetchMyApplications();

  return (
    <PageShell
      title="Candidate Dashboard"
      subtitle="Track your active applications and status updates."
    >
      <div className="space-y-3">
        {applications.length ? (
          applications.map((application) => {
            const job = Array.isArray(application.jobs)
              ? application.jobs[0]
              : application.jobs;
            const company = Array.isArray(job?.companies)
              ? job?.companies[0]
              : job?.companies;

            return (
              <article
                key={application.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {job?.title}
                </h2>
                <p className="text-sm text-slate-600">{company?.name}</p>
                <p className="mt-2 text-sm text-slate-700">
                  Status: <strong>{application.status}</strong>
                </p>
              </article>
            );
          })
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            No applications yet.
          </p>
        )}
      </div>
    </PageShell>
  );
}
