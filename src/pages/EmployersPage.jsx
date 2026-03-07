import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { contactEmail, employerOutcomes, employerServices } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const executionSteps = [
  {
    title: "Discovery",
    detail: "Role calibration, success criteria, and hiring timeline mapping."
  },
  {
    title: "Search",
    detail: "Market mapping and targeted outreach to high-fit candidates."
  },
  {
    title: "Delivery",
    detail: "Shortlists with recruiter notes, interview coordination, and closure support."
  }
];

const EmployersPage = () => {
  useSeo({
    title: "Employers",
    description:
      "Partner with Hike For Sure for talent sourcing, executive search, and recruitment outsourcing."
  });

  return (
    <div className="section-wrap space-y-10 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SectionHeader
          eyebrow="For Employers"
          title="Scale hiring with a recruiter-first operating model"
          subtitle="From urgent team expansion to executive mandates, we align talent delivery with business outcomes and timeline discipline."
        />
      </motion.div>

      <section className="grid gap-4 md:grid-cols-3">
        {employerOutcomes.map((item, index) => (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            className="surface-card"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-2 font-heading text-2xl font-bold">{item.value}</p>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {employerServices.map((service, index) => (
          <motion.article
            key={service.title}
            className="surface-card-hover"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
          >
            <h3 className="font-heading text-xl font-semibold">{service.title}</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {service.description}
            </p>
          </motion.article>
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.35 }}
      >
        <SectionHeader
          eyebrow="Execution Framework"
          title="How we run hiring mandates"
          subtitle="A transparent process for predictable delivery and better candidate quality."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {executionSteps.map((step, index) => (
            <article key={step.title} className="surface-card">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand dark:bg-brand/20">
                {index + 1}
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.detail}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="rounded-3xl border border-brand/20 bg-gradient-to-r from-brand-light/15 to-brand-dark/15 p-8 dark:from-brand-light/25 dark:to-brand-dark/25"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <h3 className="font-heading text-2xl font-bold">Need to hire talent quickly?</h3>
        <p className="mt-3 max-w-2xl text-sm text-slate-700 dark:text-slate-200">
          Tell us your hiring goals and we will build a structured recruitment plan for your team.
        </p>
        <a
          href={`mailto:${contactEmail}?subject=Hiring%20Support%20Request`}
          className="btn-primary mt-6"
        >
          Hire Talent
        </a>
      </motion.section>
    </div>
  );
};

export default EmployersPage;
