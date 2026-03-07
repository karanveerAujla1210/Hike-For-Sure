import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { blogArticles } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const BlogPage = () => {
  useSeo({
    title: "Blog",
    description:
      "Career advice articles on resume writing, interview preparation, and job search strategy."
  });

  const categories = useMemo(
    () => ["All Articles", ...new Set(blogArticles.map((article) => article.category))],
    []
  );
  const [activeCategory, setActiveCategory] = useState("All Articles");

  const filteredArticles =
    activeCategory === "All Articles"
      ? blogArticles
      : blogArticles.filter((article) => article.category === activeCategory);

  const featured = filteredArticles[0];
  const remaining = filteredArticles.slice(1);

  return (
    <div className="section-wrap space-y-10 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SectionHeader
          eyebrow="Career Advice"
          title="Practical playbooks for better job outcomes"
          subtitle="Actionable content on resume writing, interview prep, and job search execution."
        />
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {featured ? (
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card grid gap-5 bg-gradient-to-r from-brand-light/10 to-brand-dark/10 dark:from-brand-light/20 dark:to-brand-dark/20 md:grid-cols-[1fr,auto]"
        >
          <div>
            <span className="inline-flex w-fit rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand dark:bg-brand/25">
              Featured: {featured.category}
            </span>
            <h3 className="mt-4 font-heading text-2xl font-bold">{featured.title}</h3>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{featured.excerpt}</p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {featured.readTime}
          </p>
        </motion.article>
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        {remaining.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="surface-card-hover flex h-full flex-col"
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
