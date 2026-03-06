import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { applicationLink, contactEmail } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const ContactPage = () => {
  useSeo({
    title: "Contact",
    description: "Contact Hike For Sure for hiring support or career opportunities."
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Website Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setIsSubmitted(true);
  };

  return (
    <div className="section-wrap space-y-10 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SectionHeader
          eyebrow="Contact"
          title="Talk to the Hike For Sure team"
          subtitle="Share your hiring requirement or career question, and we will get back to you."
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <motion.form
          onSubmit={handleSubmit}
          className="surface-card space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-slate-600 dark:text-slate-300">
              Name
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-slate-600 dark:text-slate-300">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-slate-600 dark:text-slate-300">
              Phone
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-slate-600 dark:text-slate-300">
              Message
            </span>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <button type="submit" className="btn-primary w-full">
            Send Message
          </button>
          {isSubmitted ? (
            <p className="text-sm text-green-600 dark:text-green-400">
              Your mail client should open with the drafted message.
            </p>
          ) : null}
        </motion.form>

        <motion.aside
          className="surface-card space-y-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Contact Details
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Email:
              {" "}
              <a href={`mailto:${contactEmail}`} className="font-semibold text-brand hover:underline">
                {contactEmail}
              </a>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Application Link
            </p>
            <a
              href={applicationLink}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm font-semibold text-brand hover:underline"
            >
              https://forms.gle/mNMj8zdzQav2GGJT7
            </a>
          </div>
          <div className="rounded-2xl border border-brand/15 bg-brand/5 p-4 text-sm text-slate-600 dark:border-brand/30 dark:bg-brand/10 dark:text-slate-300">
            For faster assistance, include target role, current experience, and preferred location.
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default ContactPage;
