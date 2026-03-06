export default function IndustryCard({ name, icon }) {
  return (
    <div className="rounded-xl bg-brand-gradient text-white shadow-glow p-4 flex flex-col items-center justify-center">
      <span className="text-3xl mb-2">{icon}</span>
      <span className="font-semibold text-lg">{name}</span>
    </div>
  );
}
