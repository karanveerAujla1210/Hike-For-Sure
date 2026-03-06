import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import FilterSelect from "../components/FilterSelect";
import JobCard from "../components/JobCard";
import SectionHeader from "../components/SectionHeader";
import { jobs } from "../data/siteData";
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
  const [location, setLocation] = useState(searchParams.get("location") || "All Locations");
  const [experience, setExperience] = useState("All Experience");

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

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keywordMatch =
        !keyword ||
        `${job.title} ${job.company}`
          .toLowerCase()
          .includes(keyword.trim().toLowerCase());
      const industryMatch = industry === "All Industries" || job.industry === industry;
      const locationMatch = location === "All Locations" || job.location === location;
      const experienceMatch =
        experience === "All Experience" || job.experience === experience;

      return keywordMatch && industryMatch && locationMatch && experienceMatch;
    });
  }, [keyword, industry, location, experience]);

  const clearFilters = () => {
    setKeyword("");
    setIndustry("All Industries");
    setLocation("All Locations");
    setExperience("All Experience");
  };

  return (
    <div className="section-wrap space-y-10 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SectionHeader
          eyebrow="Jobs"
          title="Find your next role with precision filters"
          subtitle="Discover opportunities curated by our recruitment consultants."
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="surface-card"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm md:col-span-2 lg:col-span-1">
            <span className="mb-2 block font-semibold text-slate-600 dark:text-slate-300">
              Keyword
            </span>
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Role or company"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {filteredJobs.length} role{filteredJobs.length === 1 ? "" : "s"} found
          </p>
          <button type="button" onClick={clearFilters} className="btn-secondary px-4 py-2 text-sm">
            Clear Filters
          </button>
        </div>
      </motion.section>

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
