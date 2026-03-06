import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { applicationLink, candidateSteps } from "../data/siteData";
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
          title="A guided process from submission to offer"
          subtitle="Our consultants support you with profile alignment, interview preparation, and offer-stage guidance."
        />
      </motion.div>

      <section className="space-y-4">
        {candidateSteps.map((item, index) => (
          <motion.article
            key={item.step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="surface-card flex gap-4"
          >
            <div className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand dark:bg-brand/20">
              {index + 1}
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold">{item.step}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
            </div>
          </motion.article>
        ))}
      </section>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <a href={applicationLink} target="_blank" rel="noreferrer" className="btn-primary">
          Submit Resume
        </a>
      </motion.div>
    </div>
  );
};

export default CandidatePage;
