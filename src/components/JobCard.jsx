import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { applicationLink } from "../data/siteData";

const JobCard = ({ job, showIndustry = true }) => {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="surface-card-hover flex h-full flex-col gap-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{job.company}</p>
        </div>
        {showIndustry ? (
          <span className="tag">
            {job.industry}
          </span>
        ) : null}
      </div>

      <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Location:</span> {job.location}
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Salary:</span> {job.salary}
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Experience:</span> {job.experience}
        </p>
        <p>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Mode:</span>{" "}
          {job.mode || "Hybrid"}
        </p>
      </div>

      <div className="mt-auto flex gap-2">
        <Link to={`/jobs/${job.id}`} className="btn-secondary flex-1 px-4 py-2 text-sm">
          View Details
        </Link>
        <a
          href={applicationLink}
          target="_blank"
          rel="noreferrer"
          className="btn-primary flex-1 px-4 py-2 text-sm"
        >
          Quick Apply
        </a>
      </div>
    </motion.article>
  );
};

export default JobCard;
