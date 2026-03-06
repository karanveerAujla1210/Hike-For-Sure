const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path
      d="M12 3v2.5M12 18.5V21M5.64 5.64l1.77 1.77M16.59 16.59l1.77 1.77M3 12h2.5M18.5 12H21M5.64 18.36l1.77-1.77M16.59 7.41l1.77-1.77"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path
      d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 1 0 10.5 10.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ThemeToggle = ({ theme, onToggleTheme }) => {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

export default ThemeToggle;
