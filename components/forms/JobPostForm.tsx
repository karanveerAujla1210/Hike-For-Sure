"use client";

import { FormEvent, useState } from "react";

import { createJob } from "@/lib/api/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";

const initialState = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  jobType: "full-time" as const,
  experienceLevel: "mid" as const,
  salaryMin: "",
  salaryMax: "",
  skills: ""
};

export function JobPostForm() {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await createJob({
        title: state.title,
        description: state.description,
        requirements: state.requirements,
        location: state.location,
        jobType: state.jobType,
        experienceLevel: state.experienceLevel,
        salaryMin: state.salaryMin ? Number(state.salaryMin) : null,
        salaryMax: state.salaryMax ? Number(state.salaryMax) : null,
        skills: state.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      });
      setState(initialState);
      setMessage("Job posted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to post job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <Input
        placeholder="Job title"
        value={state.title}
        onChange={(event) => setState((prev) => ({ ...prev, title: event.target.value }))}
        required
      />
      <Textarea
        placeholder="Job description"
        value={state.description}
        onChange={(event) => setState((prev) => ({ ...prev, description: event.target.value }))}
        required
      />
      <Textarea
        placeholder="Requirements"
        value={state.requirements}
        onChange={(event) => setState((prev) => ({ ...prev, requirements: event.target.value }))}
        required
      />
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          placeholder="Location"
          value={state.location}
          onChange={(event) => setState((prev) => ({ ...prev, location: event.target.value }))}
          required
        />
        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={state.jobType}
          onChange={(event) =>
            setState((prev) => ({
              ...prev,
              jobType: event.target.value as typeof prev.jobType
            }))
          }
        >
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={state.experienceLevel}
          onChange={(event) =>
            setState((prev) => ({
              ...prev,
              experienceLevel: event.target.value as typeof prev.experienceLevel
            }))
          }
        >
          <option value="entry">Entry</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
        </select>
        <Input
          type="number"
          placeholder="Min salary (INR)"
          value={state.salaryMin}
          onChange={(event) => setState((prev) => ({ ...prev, salaryMin: event.target.value }))}
        />
        <Input
          type="number"
          placeholder="Max salary (INR)"
          value={state.salaryMax}
          onChange={(event) => setState((prev) => ({ ...prev, salaryMax: event.target.value }))}
        />
      </div>
      <Input
        placeholder="Skills (comma-separated)"
        value={state.skills}
        onChange={(event) => setState((prev) => ({ ...prev, skills: event.target.value }))}
      />
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Create job"}
      </Button>
    </form>
  );
}
