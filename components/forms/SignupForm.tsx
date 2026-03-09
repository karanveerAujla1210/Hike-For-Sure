"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { signUpWithEmail } from "@/lib/api/auth";
import { trackEvent } from "@/lib/api/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const roles = [
  { value: "candidate", label: "Candidate" },
  { value: "recruiter", label: "Recruiter" },
  { value: "company_admin", label: "Company Admin" }
] as const;

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<(typeof roles)[number]["value"]>("candidate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUpWithEmail({
        email,
        password,
        fullName,
        role
      });
      await fetch("/api/auth/welcome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          name: fullName
        })
      });
      trackEvent("user_signup", { role });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
        <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <Input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
        <Input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
        <select
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={role}
          onChange={(event) => setRole(event.target.value as (typeof roles)[number]["value"])}
        >
          {roles.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
