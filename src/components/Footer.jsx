import { Link } from "react-router-dom";
import { applicationLink, contactEmail } from "../data/siteData";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 py-10 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="section-wrap grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-heading text-lg font-bold">Hike For Sure</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Modern recruitment consultancy for high-growth teams and ambitious professionals.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Explore
          </h4>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link to="/jobs" className="hover:text-brand">
              Jobs
            </Link>
            <Link to="/employers" className="hover:text-brand">
              Employers
            </Link>
            <Link to="/candidates" className="hover:text-brand">
              Candidates
            </Link>
            <Link to="/blog" className="hover:text-brand">
              Blog
            </Link>
            <Link to="/contact" className="hover:text-brand">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Get in Touch
          </h4>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{contactEmail}</p>
          <a
            href={applicationLink}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline"
          >
            Candidate Application Form
          </a>
        </div>
      </div>
      <div className="section-wrap mt-8 border-t border-slate-200/70 pt-6 text-xs text-slate-500 dark:border-slate-800">
        Copyright {new Date().getFullYear()} Hike For Sure. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
