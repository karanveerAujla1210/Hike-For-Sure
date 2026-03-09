import { redirect } from "next/navigation";

import { PageShell } from "@/components/layout/PageShell";
import { ApplicationForm } from "@/components/forms/ApplicationForm";

export default function ApplyPage({
  searchParams
}: {
  searchParams: { jobId?: string };
}) {
  if (!searchParams.jobId) {
    redirect("/jobs");
  }

  return (
    <PageShell
      title="Apply to Job"
      subtitle="Upload resume and submit your application."
    >
      <div className="max-w-2xl">
        <ApplicationForm jobId={searchParams.jobId} />
      </div>
    </PageShell>
  );
}
