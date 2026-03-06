import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import JobCard from "../components/JobCard";
import SectionHeader from "../components/SectionHeader";
import {
  applicationLink,
  faqItems,
  howItWorks,
  industries,
  jobs,
  platformStats,
  testimonials,
  trustSignals,
  whyChoose
} from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const staggerParent = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 }
  }
};

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

const HomePage = () => {
  useSeo({
    title: "Modern Recruitment Consultancy",
    description:
      "Submit once with Hike For Sure and get matched with multiple job opportunities across IT, Finance, Sales, and Marketing."
  });

  const featuredJobs = useMemo(() => jobs.filter((job) => job.featured).slice(0, 4), []);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (searchLocation.trim()) params.set("location", searchLocation.trim());
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="space-y-24 pb-20">
      <section className="section-wrap">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="mesh-bg relative overflow-hidden rounded-3xl border border-white/15 px-6 py-10 text-white shadow-2xl shadow-brand/30 sm:px-10 sm:py-14"
        >
          <div className="grid-overlay absolute inset-0 opacity-20" />
          <div className="absolute -right-10 top-4 h-52 w-52 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -left-16 bottom-[-4rem] h-56 w-56 rounded-full bg-violet-300/30 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <motion.div variants={rise}>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-100">
                New-Age Recruitment Platform
              </p>
              <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Stop Sending Your Resume Everywhere
              </h1>
              <p className="mt-5 max-w-2xl text-sm text-violet-100 sm:text-base">
                Submit once with Hike For Sure and get matched with multiple job opportunities.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={applicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary border-white/40 bg-white text-brand hover:bg-white/95"
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

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {platformStats.map((stat) => (
                  <motion.div key={stat.label} variants={rise} className="kpi">
                    <p className="font-heading text-2xl font-bold">{stat.value}</p>
                    <p className="mt-1 text-xs text-violet-100">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={rise} className="glass rounded-2xl border-white/20 p-5 text-slate-900 dark:text-white">
              <p className="font-heading text-lg font-semibold">Quick Job Search</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Search by role keyword and location to find matching opportunities.
              </p>
              <form className="mt-5 space-y-3" onSubmit={handleSearch}>
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Job title, skill, or company"
                  className="input-control"
                />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(event) => setSearchLocation(event.target.value)}
                  placeholder="Preferred location"
                  className="input-control"
                />
                <button type="submit" className="btn-primary w-full">
                  Search Jobs
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="section-wrap">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface-card"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Trusted by teams hiring at speed
          </p>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3 lg:grid-cols-6">
            {trustSignals.map((name) => (
              <div key={name} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="section-wrap">
        <SectionHeader
          eyebrow="How It Works"
          title="A streamlined path from profile to placement"
          subtitle="One profile. Multiple opportunities. Better recruiter visibility."
          center
        />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 grid gap-5 md:grid-cols-3"
        >
          {howItWorks.map((item, index) => (
            <motion.article key={item.title} variants={rise} className="surface-card-hover">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand dark:bg-brand/20">
                0{index + 1}
              </div>
              <h3 className="mt-4 font-heading text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="section-wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Featured Jobs"
            title="Curated opportunities from active hiring partners"
            subtitle="Openings across IT, Finance, Sales, and Marketing."
          />
          <Link to="/jobs" className="btn-secondary px-4 py-2 text-sm">
            Explore All Roles
          </Link>
        </div>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 grid gap-5 md:grid-cols-2"
        >
          {featuredJobs.map((job) => (
            <motion.div key={job.id} variants={rise}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section-wrap">
        <SectionHeader
          eyebrow="Industries"
          title="Industries We Hire For"
          subtitle="Domain-first recruiting aligned with your function and growth stage."
          center
        />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {industries.map((industry) => (
            <motion.div
              key={industry}
              variants={rise}
              className="surface-card-hover flex items-center justify-center py-8 text-center"
            >
              <p className="font-heading text-lg font-semibold">{industry}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="section-wrap">
        <SectionHeader
          eyebrow="Why Choose Us"
          title="Why candidates and employers choose Hike For Sure"
          subtitle="Recruiter-led process design with startup speed and enterprise discipline."
          center
        />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 grid gap-5 md:grid-cols-2"
        >
          {whyChoose.map((item) => (
            <motion.article key={item.title} variants={rise} className="surface-card-hover">
              <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="section-wrap">
        <SectionHeader
          eyebrow="Testimonials"
          title="What clients and candidates say"
          subtitle="Real outcomes from our recruitment partnerships."
          center
        />
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 grid gap-5 lg:grid-cols-3"
        >
          {testimonials.map((item) => (
            <motion.figure key={item.name} variants={rise} className="surface-card-hover">
              <blockquote className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                "{item.quote}"
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <p className="font-semibold">{item.name}</p>
                <p className="text-slate-500 dark:text-slate-400">{item.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </section>

      <section className="section-wrap">
        <SectionHeader
          eyebrow="FAQ"
          title="Common questions about our recruitment process"
          subtitle="Everything you need before you apply or start a hiring mandate."
          center
        />
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="surface-card p-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold">{item.question}</span>
                  <span className="text-brand">{isOpen ? "-" : "+"}</span>
                </button>
                {isOpen ? (
                  <p className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                    {item.answer}
                  </p>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="apply-now" className="section-wrap">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-brand/20 bg-gradient-to-br from-brand-light/20 to-brand-dark/20 p-8 sm:p-10"
        >
          <SectionHeader
            eyebrow="Apply Now"
            title="Ready for your next role?"
            subtitle="Submit your profile once and get considered for multiple opportunities."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={applicationLink} target="_blank" rel="noreferrer" className="btn-primary">
              Open Candidate Form
            </a>
            <Link to="/jobs" className="btn-secondary">
              Browse Open Roles
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
