import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSeo } from "../hooks/useSeo";
import { jobs } from "../data/siteData";
import { useAuth } from "../context/AuthContext";

const ModernHomePage = () => {
  useSeo({ title: "Find Your Dream Job", description: "Professional hiring platform" });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  const stats = [
    { label: "Active Jobs", value: "500+" },
    { label: "Companies", value: "100+" },
    { label: "Candidates Hired", value: "2000+" },
    { label: "Success Rate", value: "95%" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-24 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950">
        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/50 px-4 py-2 text-sm font-medium text-violet-600 backdrop-blur-sm dark:border-violet-800 dark:bg-slate-900/50 dark:text-violet-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
              </span>
              500+ New Jobs This Week
            </div>
            <h1 className="font-heading text-6xl font-bold leading-tight text-slate-900 sm:text-7xl dark:text-white">
              Find Your Next{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Career Move
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C50 2.5 150 2.5 199 5.5" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-slate-600 dark:text-slate-400">
              Submit once and get matched with multiple opportunities. Your dream job is just one application away.
            </p>

            <form onSubmit={handleSearch} className="mx-auto mt-12 max-w-4xl">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:flex-row dark:border-slate-800 dark:bg-slate-900">
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Job title, keywords, or company"
                    className="h-14 w-full rounded-xl border-0 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-violet-500 dark:bg-slate-800 dark:focus:bg-slate-900"
                  />
                </div>
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, state, or remote"
                    className="h-14 w-full rounded-xl border-0 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-violet-500 dark:bg-slate-800 dark:focus:bg-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  className="group relative h-14 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-10 font-semibold text-white shadow-lg shadow-violet-500/50 transition hover:shadow-xl hover:shadow-violet-500/60"
                >
                  <span className="relative z-10">Search Jobs</span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 transition group-hover:opacity-100" />
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="rounded-2xl border border-slate-200 bg-white/50 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <p className="font-heading text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-white">
                Featured Opportunities
              </h2>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
                Hand-picked jobs from top companies hiring now
              </p>
            </div>
            <Link
              to="/jobs"
              className="group flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
            >
              View all jobs
              <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.filter(j => j.featured).slice(0, 6).map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={`/jobs/${job.id}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-500/20 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-800"
                >
                  <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 px-3 py-1 text-xs font-semibold text-violet-600 dark:from-violet-950 dark:to-indigo-950 dark:text-violet-400">
                      Featured
                    </span>
                  </div>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-xl font-bold text-violet-600 dark:from-violet-950 dark:to-indigo-950 dark:text-violet-400">
                    {job.company[0]}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-slate-900 transition group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                    {job.title}
                  </h3>
                  <p className="mt-2 font-medium text-slate-600 dark:text-slate-400">
                    {job.company}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {job.experience}
                    </span>
                  </div>
                  <p className="mt-4 font-semibold text-violet-600 dark:text-violet-400">
                    {job.salary}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-16 text-center shadow-2xl">
              <div className="absolute inset-0 bg-grid-white/10" />
              <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute right-1/4 bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <h2 className="font-heading text-4xl font-bold text-white sm:text-5xl">
                  Ready to Start Your Journey?
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-xl text-violet-100">
                  Join thousands of professionals finding their dream jobs through our platform
                </p>
                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    to="/signup"
                    className="group relative overflow-hidden rounded-xl bg-white px-8 py-4 font-semibold text-violet-600 shadow-xl transition hover:shadow-2xl"
                  >
                    <span className="relative z-10">Create Free Account</span>
                  </Link>
                  <Link
                    to="/jobs"
                    className="rounded-xl border-2 border-white px-8 py-4 font-semibold text-white transition hover:bg-white/10"
                  >
                    Explore All Jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernHomePage;
