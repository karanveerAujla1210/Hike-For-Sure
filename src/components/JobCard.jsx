import { motion } from "framer-motion";
import { applicationLink } from "../data/siteData";

const JobCard = ({ job, showIndustry = true }) => {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="surface-card flex h-full flex-col gap-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold">{job.title}</h3>
        {showIndustry ? (
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand dark:bg-brand/20">
            {job.industry}
          </span>
        ) : null}
      </div>

      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Company:</span>{" "}
          {job.company}
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Location:</span>{" "}
          {job.location}
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Salary:</span>{" "}
          {job.salary}
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Experience:</span>{" "}
          {job.experience}
        </p>
      </div>

      <a
        href={applicationLink}
        target="_blank"
        rel="noreferrer"
        className="btn-primary mt-auto px-4 py-2 text-sm"
      >
        Apply
      </a>
    </motion.article>
  );
};

export default JobCard;
