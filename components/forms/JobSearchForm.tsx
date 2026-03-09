"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function JobSearchForm() {
  const params = useSearchParams();
  const router = useRouter();
  const getParam = (key: string) => params?.get(key) ?? "";
  const [query, setQuery] = useState(getParam("q"));
  const [location, setLocation] = useState(getParam("location"));
  const [experienceLevel, setExperienceLevel] = useState(
    getParam("experienceLevel")
  );
  const [salaryMin, setSalaryMin] = useState(getParam("salaryMin"));
  const [salaryMax, setSalaryMax] = useState(getParam("salaryMax"));
  const [skills, setSkills] = useState(getParam("skills"));

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (location) next.set("location", location);
    if (experienceLevel) next.set("experienceLevel", experienceLevel);
    if (salaryMin) next.set("salaryMin", salaryMin);
    if (salaryMax) next.set("salaryMax", salaryMax);
    if (skills) next.set("skills", skills);
    router.push(`/jobs?${next.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-6">
        <Input
          className="md:col-span-2"
          placeholder="Search title or skill"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Input
          placeholder="Location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={experienceLevel}
          onChange={(event) => setExperienceLevel(event.target.value)}
        >
          <option value="">Experience</option>
          <option value="entry">Entry</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
        </select>
        <Input
          type="number"
          placeholder="Min salary"
          value={salaryMin}
          onChange={(event) => setSalaryMin(event.target.value)}
        />
        <Input
          type="number"
          placeholder="Max salary"
          value={salaryMax}
          onChange={(event) => setSalaryMax(event.target.value)}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <Input
          placeholder="Skills (comma-separated)"
          value={skills}
          onChange={(event) => setSkills(event.target.value)}
        />
        <Button type="submit">Search jobs</Button>
      </div>
    </form>
  );
}
