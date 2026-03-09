"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { applyToJob } from "@/lib/api/jobs";
import { trackEvent } from "@/lib/api/analytics";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/Textarea";

export function ApplicationForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadResume(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads/resume", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error ?? "Resume upload failed");
    }

    const payload = await response.json();
    return payload.path as string;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!resumeFile) {
        throw new Error("Please upload your resume");
      }
      const resumePath = await uploadResume(resumeFile);
      await applyToJob({
        jobId,
        coverLetter,
        resumePath
      });

      trackEvent("job_application", { jobId });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Application failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <label className="block text-sm font-medium text-slate-700">Resume</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
        required
      />

      <label className="block text-sm font-medium text-slate-700">Cover letter</label>
      <Textarea
        value={coverLetter}
        onChange={(event) => setCoverLetter(event.target.value)}
        placeholder="Introduce your background and why you fit this role."
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit application"}
      </Button>
    </form>
  );
}
