const SectionHeader = ({ eyebrow, title, subtitle, center = false }) => {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
};

export default SectionHeader;
