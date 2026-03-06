import { useState } from "react";

export default function JobSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-lg mx-auto mb-8">
      <input
        type="text"
        placeholder="Search jobs by title, company, or location..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="flex-1 rounded-xl border border-brand/25 bg-white/80 px-4 py-3 text-brand shadow-glow focus:outline-none focus:border-brand"
      />
      <button type="submit" className="rounded-xl bg-brand-gradient px-5 py-3 font-semibold text-white shadow-glow hover:scale-[1.02] transition-all">
        Search
      </button>
    </form>
  );
}
