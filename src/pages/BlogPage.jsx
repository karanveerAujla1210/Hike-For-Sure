import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { blogArticles } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const BlogPage = () => {
  useSeo({
    title: "Blog",
    description:
      "Career advice articles on resume writing, interview preparation, and job search strategy."
  });

  return (
    <div className="section-wrap space-y-10 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SectionHeader
          eyebrow="Career Advice"
          title="Practical guides for job seekers"
          subtitle="Explore actionable content to improve applications, interviews, and offer outcomes."
        />
      </motion.div>

      <section className="grid gap-5 md:grid-cols-3">
        {blogArticles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="surface-card flex h-full flex-col"
          >
            <span className="inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand dark:bg-brand/20">
              {article.category}
            </span>
            <h3 className="mt-4 font-heading text-lg font-semibold">{article.title}</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{article.excerpt}</p>
            <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {article.readTime}
            </p>
          </motion.article>
        ))}
      </section>
    </div>
  );
};

export default BlogPage;
