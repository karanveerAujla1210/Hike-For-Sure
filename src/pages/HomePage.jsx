import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import JobCard from "../components/JobCard";
import SectionHeader from "../components/SectionHeader";
import {
  applicationLink,
  howItWorks,
  industries,
  jobs,
  testimonials,
  whyChoose
} from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.45, ease: "easeOut" }
};

const HomePage = () => {
  useSeo({
    title: "Modern Recruitment Consultancy",
    description:
      "Submit once with Hike For Sure and get matched with multiple job opportunities across IT, Finance, Sales, and Marketing."
  });

  const featuredJobs = jobs.filter((job) => job.featured).slice(0, 4);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="space-y-20 pb-20">
      <section className="section-wrap pt-10">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-brand/10 bg-brand-gradient px-6 py-16 text-white shadow-glow sm:px-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -right-10 top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -left-14 bottom-2 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-100">
                Startup-Grade Hiring Platform
              </p>
              <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Stop Sending Your Resume Everywhere
              </h1>
              <p className="mt-4 max-w-xl text-sm text-violet-100 sm:text-base">
                Submit once with Hike For Sure and get matched with multiple job
                opportunities.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={applicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary border-white/30 bg-white text-brand hover:bg-white/90"
                >
                  Apply Now
                </a>
                <Link
                  to="/employers"
                  className="inline-flex items-center justify-center rounded-xl border border-white/35 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Post a Job
                </Link>
              </div>
            </div>

            <div className="glass rounded-2xl border-white/25 p-5 text-slate-900 dark:text-white">
              <p className="font-heading text-lg font-semibold">Quick Job Search</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Search jobs by title and preferred location.
              </p>
              <form className="mt-5 space-y-3" onSubmit={handleSearch}>
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Job title or keyword"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900"
                />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(event) => setSearchLocation(event.target.value)}
                  placeholder="Preferred location"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900"
                />
                <button type="submit" className="btn-primary w-full">
                  Search Jobs
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-wrap">
        <motion.div {...fadeInUp}>
          <SectionHeader
            eyebrow="How It Works"
            title="A simple 3-step process to accelerate your hiring journey"
            subtitle="One profile. Multiple opportunities. Faster closure."
            center
          />
        </motion.div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {howItWorks.map((item, index) => (
            <motion.div key={item.title} className="surface-card" {...fadeInUp} transition={{ delay: 0.08 * index, duration: 0.4 }}>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand dark:bg-brand/20">
                0{index + 1}
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-wrap">
        <motion.div {...fadeInUp} className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Featured Jobs"
            title="Top opportunities curated by our consultants"
            subtitle="Explore active openings from hiring partners."
          />
          <Link to="/jobs" className="btn-secondary px-4 py-2 text-sm">
            View All Jobs
          </Link>
        </motion.div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {featuredJobs.map((job, index) => (
            <motion.div key={job.id} {...fadeInUp} transition={{ delay: index * 0.06, duration: 0.42 }}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-wrap">
        <motion.div {...fadeInUp}>
          <SectionHeader
            eyebrow="Industries"
            title="Industries We Hire For"
            subtitle="Domain-focused recruitment across fast-growing sectors."
          />
        </motion.div>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {industries.map((industry, index) => (
            <motion.div
              key={industry}
              {...fadeInUp}
              transition={{ delay: index * 0.07, duration: 0.4 }}
              className="surface-card flex items-center justify-center py-8 text-center"
            >
              <p className="font-heading text-lg font-semibold">{industry}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-wrap">
        <motion.div {...fadeInUp}>
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Why Choose Hike For Sure"
            subtitle="Built for candidates who need outcomes and employers who need reliable hiring support."
            center
          />
        </motion.div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {whyChoose.map((item, index) => (
            <motion.div key={item.title} {...fadeInUp} transition={{ delay: index * 0.06, duration: 0.4 }} className="surface-card">
              <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-wrap">
        <motion.div {...fadeInUp}>
          <SectionHeader
            eyebrow="Testimonials"
            title="What our clients and candidates say"
            subtitle="Real hiring experiences with measurable impact."
            center
          />
        </motion.div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.figure
              key={item.name}
              {...fadeInUp}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="surface-card"
            >
              <blockquote className="text-sm text-slate-700 dark:text-slate-200">
                "{item.quote}"
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <p className="font-semibold">{item.name}</p>
                <p className="text-slate-500 dark:text-slate-400">{item.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <section id="apply-now" className="section-wrap">
        <motion.div
          {...fadeInUp}
          className="rounded-3xl border border-brand/20 bg-gradient-to-br from-brand-light/15 to-brand-dark/15 p-8 dark:from-brand-light/25 dark:to-brand-dark/25 sm:p-10"
        >
          <SectionHeader
            eyebrow="Apply Now"
            title="Ready to start your next career move?"
            subtitle="Use our application form once and get considered for multiple opportunities."
          />
          <div className="mt-6">
            <a
              href={applicationLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Open Google Application Form
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
