import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import FilterSelect from "../components/FilterSelect";
import JobCard from "../components/JobCard";
import SectionHeader from "../components/SectionHeader";
import { jobs, jobSearchTips } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const JobsPage = () => {
  useSeo({
    title: "Jobs",
    description:
      "Browse active openings in IT, Finance, Sales, and Marketing with filters for location and experience."
  });

  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [industry, setIndustry] = useState("All Industries");
  const [location, setLocation] = useState("All Locations");
  const [experience, setExperience] = useState("All Experience");
  const [mode, setMode] = useState("All Modes");

  const industryOptions = useMemo(
    () => ["All Industries", ...new Set(jobs.map((job) => job.industry))],
    []
  );
  const locationOptions = useMemo(
    () => ["All Locations", ...new Set(jobs.map((job) => job.location))],
    []
  );
  const experienceOptions = useMemo(
    () => ["All Experience", ...new Set(jobs.map((job) => job.experience))],
    []
  );
  const modeOptions = useMemo(() => ["All Modes", ...new Set(jobs.map((job) => job.mode))], []);

  const defaultLocationParam = searchParams.get("location") || "";

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keywordMatch =
        !keyword ||
        `${job.title} ${job.company} ${job.industry}`
          .toLowerCase()
          .includes(keyword.trim().toLowerCase());
      const industryMatch = industry === "All Industries" || job.industry === industry;
      const locationMatch =
        location === "All Locations" &&
        (!defaultLocationParam ||
          job.location.toLowerCase().includes(defaultLocationParam.toLowerCase())) ||
        (location !== "All Locations" && job.location === location);
      const experienceMatch =
        experience === "All Experience" || job.experience === experience;
      const modeMatch = mode === "All Modes" || job.mode === mode;

      return keywordMatch && industryMatch && locationMatch && experienceMatch && modeMatch;
    });
  }, [keyword, industry, location, experience, mode, defaultLocationParam]);

  const activeFilters = [
    industry !== "All Industries" ? industry : null,
    location !== "All Locations" ? location : null,
    experience !== "All Experience" ? experience : null,
    mode !== "All Modes" ? mode : null,
    defaultLocationParam && location === "All Locations" ? `Near: ${defaultLocationParam}` : null
  ].filter(Boolean);

  const clearFilters = () => {
    setKeyword("");
    setIndustry("All Industries");
    setLocation("All Locations");
    setExperience("All Experience");
    setMode("All Modes");
  };

  return (
    <div className="section-wrap space-y-10 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SectionHeader
          eyebrow="Jobs"
          title="Find opportunities aligned with your role and growth stage"
          subtitle="Use precision filters and move from search to application quickly."
        />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1fr,300px]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="surface-card"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <label className="block text-sm md:col-span-2 lg:col-span-2">
              <span className="mb-2 block font-semibold text-slate-600 dark:text-slate-300">
                Keyword
              </span>
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Role, skill, or company"
                className="input-control"
              />
            </label>
            <FilterSelect
              label="Industry"
              value={industry}
              options={industryOptions}
              onChange={setIndustry}
            />
            <FilterSelect
              label="Location"
              value={location}
              options={locationOptions}
              onChange={setLocation}
            />
            <FilterSelect
              label="Experience"
              value={experience}
              options={experienceOptions}
              onChange={setExperience}
            />
            <FilterSelect label="Mode" value={mode} options={modeOptions} onChange={setMode} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {activeFilters.length > 0 ? (
                activeFilters.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">No active filters</span>
              )}
            </div>
            <button type="button" onClick={clearFilters} className="btn-secondary px-4 py-2 text-sm">
              Reset Filters
            </button>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="surface-card h-fit"
        >
          <h3 className="font-heading text-lg font-semibold">Search smarter</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {jobSearchTips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {filteredJobs.length} role{filteredJobs.length === 1 ? "" : "s"} found
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * index, duration: 0.3 }}
          >
            <JobCard job={job} />
          </motion.div>
        ))}
      </section>

      {filteredJobs.length === 0 ? (
        <div className="surface-card text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No jobs match your filters. Try adjusting industry, location, or experience.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default JobsPage;
