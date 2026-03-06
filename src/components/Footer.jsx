import { Link } from "react-router-dom";
import { applicationLink, contactEmail } from "../data/siteData";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/70 bg-white/65 py-12 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/65">
      <div className="section-wrap">
        <div className="surface-card mb-8 grid gap-6 bg-gradient-to-r from-brand-light/15 to-brand-dark/15 dark:from-brand-light/20 dark:to-brand-dark/20 lg:grid-cols-[1fr,auto]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">
              Hike For Sure Network
            </p>
            <h3 className="mt-2 font-heading text-2xl font-bold">
              Hiring support for growth-stage teams and ambitious candidates
            </h3>
            <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">
              Build your career path or close critical roles faster with recruiter-led matching.
            </p>
          </div>
          <div className="flex items-center">
            <a href={applicationLink} target="_blank" rel="noreferrer" className="btn-primary">
              Start Application
            </a>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-heading text-lg font-bold">Hike For Sure</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              New-age recruitment platform for talent discovery, consulting, and hiring outcomes.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Explore</h4>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
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
                Career Advice
              </Link>
              <Link to="/contact" className="hover:text-brand">
                Contact
              </Link>
              <Link to="/signup" className="hover:text-brand">
                Candidate Account
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Get in Touch
            </h4>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{contactEmail}</p>
            <a
              href={`mailto:${contactEmail}?subject=Hiring%20or%20Career%20Support`}
              className="mt-2 inline-flex text-sm font-semibold text-brand hover:underline"
            >
              Email Us
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/70 pt-6 text-xs text-slate-500 dark:border-slate-800">
          Copyright {new Date().getFullYear()} Hike For Sure. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
