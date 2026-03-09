import { PageShell } from "@/components/layout/PageShell";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <PageShell
      title="Login"
      subtitle="Use your email and password to access your Hike For Sure account."
    >
      <div className="mx-auto w-full max-w-md">
        <LoginForm />
      </div>
    </PageShell>
  );
}
