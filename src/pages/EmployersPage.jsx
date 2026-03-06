import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { contactEmail, employerServices } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

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
          title="Scale hiring with strategic recruitment support"
          subtitle="From urgent team expansion to executive mandates, we align talent delivery with business outcomes."
        />
      </motion.div>

      <section className="grid gap-5 md:grid-cols-3">
        {employerServices.map((service, index) => (
          <motion.article
            key={service.title}
            className="surface-card"
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
