const SectionHeader = ({ eyebrow, title, subtitle, center = false }) => {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
};

export default SectionHeader;
