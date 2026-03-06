import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { applicationLink } from "../data/siteData";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Jobs" },
  { to: "/employers", label: "Employers" },
  { to: "/candidates", label: "Candidates" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" }
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-brand/10 text-brand dark:bg-brand/20"
      : "text-slate-600 hover:bg-slate-100 hover:text-brand dark:text-slate-300 dark:hover:bg-slate-800"
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-slate-50/80 backdrop-blur-xl dark:bg-slate-950/70">
      <div className="section-wrap">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-lg font-bold text-white">
              HF
            </span>
            <div className="leading-tight">
              <p className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Hike For Sure
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Recruitment Consultancy
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-secondary px-4 py-2 text-sm">
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn-primary px-4 py-2 text-sm">
                  Logout
                </button>
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

        {isOpen ? (
          <div className="glass mb-4 rounded-2xl p-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={linkClass}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="btn-secondary px-3 py-2 text-sm">
                    Dashboard
                  </Link>
                  <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="btn-primary px-3 py-2 text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary px-3 py-2 text-sm">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary px-3 py-2 text-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
