export default function TestimonialCard({ name, role, text, avatar }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-md p-6 flex gap-4 items-center">
      <img src={avatar} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-brand" />
      <div>
        <div className="font-bold text-brand mb-1">{name}</div>
        <div className="text-sm text-slate-500 dark:text-slate-300 mb-2">{role}</div>
        <div className="text-slate-700 dark:text-slate-100">{text}</div>
      </div>
    </div>
  );
}
