export default function BlogCard({ title, summary, author, date }) {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 shadow-md p-6 flex flex-col gap-2">
      <div className="font-bold text-brand mb-1">{title}</div>
      <div className="text-sm text-slate-500 dark:text-slate-300 mb-2">{summary}</div>
      <div className="text-xs text-slate-400 dark:text-slate-500">By {author} | {date}</div>
    </div>
  );
}
