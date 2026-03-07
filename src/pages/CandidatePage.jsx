import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { applicationLink, candidateBenefits, candidateSteps } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const CandidatePage = () => {
  useSeo({
    title: "Candidates",
    description:
      "Understand the Hike For Sure candidate journey from resume submission to offer."
  });

  return (
    <div className="section-wrap space-y-10 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SectionHeader
          eyebrow="Candidate Journey"
          title="A guided journey from resume to offer"
          subtitle="Our consultants support profile positioning, interview preparation, and final offer decisions."
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="space-y-4">
          {candidateSteps.map((item, index) => (
            <motion.article
              key={item.step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="surface-card flex gap-4"
            >
              <div className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand dark:bg-brand/20">
                {index + 1}
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold">{item.step}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
              </div>
            </motion.article>
          ))}
        </section>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="surface-card h-fit"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
            Candidate Success Kit
          </p>
          <h3 className="mt-3 font-heading text-2xl font-bold">
            Everything you need to stand out in interview loops
          </h3>
          <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {candidateBenefits.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a href={applicationLink} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full">
            Submit Resume
          </a>
        </motion.aside>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="surface-card bg-gradient-to-r from-brand-light/15 to-brand-dark/15 dark:from-brand-light/20 dark:to-brand-dark/20"
      >
        <h3 className="font-heading text-2xl font-bold">Need guidance before applying?</h3>
        <p className="mt-3 max-w-2xl text-sm text-slate-700 dark:text-slate-200">
          Reach out through our contact page and a consultant will help you map the best-fit path.
        </p>
      </motion.section>
    </div>
  );
};

export default CandidatePage;
