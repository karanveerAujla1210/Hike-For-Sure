import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { jobs, industries } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const ModernJobsPage = () => {
  useSeo({ title: "Browse Jobs", description: "Find your next opportunity" });
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [industry, setIndustry] = useState(searchParams.get("industry") || "");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchKeyword = !keyword || job.title.toLowerCase().includes(keyword.toLowerCase());
      const matchLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
      const matchIndustry = !industry || job.industry === industry;
      return matchKeyword && matchLocation && matchIndustry;
    });
  }, [keyword, location, industry]);

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    if (industry) params.set("industry", industry);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="mb-4 font-heading text-2xl font-bold text-slate-900 dark:text-white">
            Find Your Perfect Job
          </h1>
          <div className="grid gap-4 md:grid-cols-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title or keyword"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800"
            />
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <button
              onClick={handleFilter}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:shadow-xl"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {filteredJobs.length} jobs found
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={`/jobs/${job.id}`}
                className="group block h-full rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 font-bold text-violet-600 dark:from-violet-950 dark:to-indigo-950 dark:text-violet-400">
                    {job.company[0]}
                  </div>
                  {job.featured && (
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-lg font-semibold text-slate-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                  {job.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {job.company}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {job.location}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {job.experience}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-violet-600 dark:text-violet-400">
                  {job.salary}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-600 dark:text-slate-400">No jobs found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernJobsPage;
