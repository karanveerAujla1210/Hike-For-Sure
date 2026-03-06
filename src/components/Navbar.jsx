import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Jobs" },
  { to: "/employers", label: "Employers" },
  { to: "/candidates", label: "Candidates" },
  { to: "/blog", label: "Career Advice" },
  { to: "/contact", label: "Contact" }
];

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-brand/15 text-brand dark:bg-brand/25"
      : "text-slate-700 hover:bg-slate-100 hover:text-brand dark:text-slate-300 dark:hover:bg-slate-800"
  }`;

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path
      d="M4 7h16M4 12h16M4 17h16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const Navbar = ({ theme, onToggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  const userInitial = user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={`section-wrap rounded-2xl border transition-all duration-300 ${
          isScrolled
            ? "border-brand/20 bg-white/85 shadow-xl shadow-brand/10 backdrop-blur-xl dark:border-brand/30 dark:bg-slate-950/80"
            : "border-white/50 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70"
        }`}
      >
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-base font-bold text-white">
              HF
            </span>
            <div className="leading-tight">
              <p className="font-heading text-sm font-bold text-slate-900 dark:text-white sm:text-base">
                Hike For Sure
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Talent Platform</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-secondary px-4 py-2 text-sm">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Logout
                </button>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-sm font-bold text-brand">
                  {userInitial}
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary px-4 py-2 text-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary px-4 py-2 text-sm">
                  Sign Up
                </Link>
              </>
            )}
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-200/80 px-2 pb-3 pt-2 dark:border-slate-800"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={navLinkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="btn-secondary px-3 py-2 text-sm"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="btn-primary px-3 py-2 text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="btn-secondary px-3 py-2 text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary px-3 py-2 text-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
