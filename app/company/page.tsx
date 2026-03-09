import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { JobPostForm } from "@/components/forms/JobPostForm";
import { RECRUITER_ROLES } from "@/lib/auth/roles";
import { getAuthContext } from "@/lib/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CompanyPage() {
  const auth = await getAuthContext();
  if (!auth) {
    redirect("/login");
  }

  if (!RECRUITER_ROLES.includes(auth.profile.role)) {
    redirect("/dashboard");
  }

  const supabase = createSupabaseServerClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, status, created_at")
    .eq("recruiter_id", auth.userId)
    .order("created_at", { ascending: false });

  return (
    <PageShell
      title="Company Console"
      subtitle="Create jobs, review applicants, and grow your hiring pipeline."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <JobPostForm />

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent job posts</h2>
          <div className="mt-3 space-y-2">
            {jobs?.length ? (
              jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <p className="font-medium text-slate-900">{job.title}</p>
                  <p className="text-slate-600">
                    {job.status} | {new Date(job.created_at).toLocaleDateString("en-IN")}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-600">No jobs posted yet.</p>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
