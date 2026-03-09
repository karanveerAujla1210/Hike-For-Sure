import { PageShell } from "@/components/layout/PageShell";
import { SignupForm } from "@/components/forms/SignupForm";

export default function SignupPage() {
  return (
    <PageShell
      title="Create Account"
      subtitle="Join as a candidate, recruiter, or company admin."
    >
      <div className="mx-auto w-full max-w-lg">
        <SignupForm />
      </div>
    </PageShell>
  );
}
