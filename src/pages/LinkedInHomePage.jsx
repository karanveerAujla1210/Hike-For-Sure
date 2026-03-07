import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSeo } from "../hooks/useSeo";
import { jobs } from "../data/siteData";

const LinkedInHomePage = () => {
  useSeo({ title: "Find Your Next Opportunity", description: "Professional hiring platform" });
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const featuredJobs = useMemo(() => jobs.filter((job) => job.featured).slice(0, 4), []);

  const industryStats = useMemo(() => {
    const counts = jobs.reduce((acc, job) => {
      acc[job.industry] = (acc[job.industry] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (keyword.trim()) query.set("keyword", keyword.trim());
    if (location.trim()) query.set("location", location.trim());
    const queryString = query.toString();
    navigate(`/jobs${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] pb-14">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-[1128px] gap-10 px-4 pb-14 pt-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="font-heading text-4xl font-semibold leading-tight text-[#8f5849] sm:text-5xl">
              Welcome to your professional community
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-600">
              Build a standout profile, discover verified opportunities, and connect directly with recruiters.
            </p>

            <form onSubmit={handleSearch} className="mt-7 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search by role or skill"
                  className="h-12 rounded-md border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-[#0a66c2] focus:shadow-[inset_0_0_0_1px_#0a66c2]"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or remote"
                  className="h-12 rounded-md border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-[#0a66c2] focus:shadow-[inset_0_0_0_1px_#0a66c2]"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0a66c2] px-8 text-base font-semibold text-white transition hover:bg-[#004182]"
              >
                Search jobs
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center rounded-full border border-[#0a66c2] bg-[#eaf4fe] px-5 py-2 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#d8ecfc]"
              >
                Join now
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Sign in
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
              <img
                src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4"
                alt="Professional networking illustration"
                className="w-full"
              />
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-[#f3f8fd] p-3">
                  <p className="text-xl font-semibold text-[#0a66c2]">120+</p>
                  <p className="text-xs text-slate-600">Companies</p>
                </div>
                <div className="rounded-lg bg-[#f3f8fd] p-3">
                  <p className="text-xl font-semibold text-[#0a66c2]">1.5K+</p>
                  <p className="text-xs text-slate-600">Roles closed</p>
                </div>
                <div className="rounded-lg bg-[#f3f8fd] p-3">
                  <p className="text-xl font-semibold text-[#0a66c2]">7 Days</p>
                  <p className="text-xs text-slate-600">Interview avg</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-[1128px] gap-4 px-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Explore opportunities</h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse roles from consulting, product, engineering, finance, and growth teams.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Build your profile</h2>
          <p className="mt-2 text-sm text-slate-600">
            Keep your profile current and get matched with relevant openings faster.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-900">Learn from recruiters</h2>
          <p className="mt-2 text-sm text-slate-600">
            Receive direct feedback and interview guidance from experienced hiring partners.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[1128px] px-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Explore jobs by industry</h2>
            <Link to="/jobs" className="text-sm font-semibold text-[#0a66c2] hover:underline">
              View all job results
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {industryStats.map((industry) => (
              <button
                key={industry.name}
                type="button"
                onClick={() => navigate(`/jobs?industry=${encodeURIComponent(industry.name)}`)}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#0a66c2] hover:text-[#0a66c2]"
              >
                {industry.name}
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {industry.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[1128px] px-4">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Recommended jobs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {featuredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(15,23,42,0.1)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-[#0a66c2]">{job.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{job.company}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {job.location} • {job.experience}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eef3f8] text-lg font-semibold text-[#0a66c2]">
                  {job.company[0]}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#eaf4fe] px-3 py-1 text-xs font-semibold text-[#0a66c2]">{job.industry}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{job.type}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-[1128px] px-4">
        <div className="rounded-2xl bg-[#0a66c2] px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-3xl font-semibold">Join your professional community</h2>
          <p className="mt-3 text-sm text-[#d8ecfc] sm:text-base">
            One profile. Multiple opportunities. Faster updates from real recruiters.
          </p>
          <Link
            to="/signup"
            className="mt-6 inline-flex items-center rounded-full border border-white bg-white px-8 py-3 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#f5faff]"
          >
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LinkedInHomePage;
