import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const publicLinks = [
  { label: "Articles", icon: "document" },
  { label: "People", icon: "people" },
  { label: "Learning", icon: "play" },
  { label: "Jobs", icon: "briefcase", to: "/jobs" }
];

const renderIcon = (type) => {
  if (type === "document") {
    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M7 4h8l4 4v12a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        <path d="M15 4v4h4" />
      </svg>
    );
  }

  if (type === "people") {
    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="3" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a3 3 0 0 1 0 5.75" />
      </svg>
    );
  }

  if (type === "play") {
    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="m10 9 5 3-5 3V9Z" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M8 6V4h8v2" />
    </svg>
  );
};

const LinkedInNavbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[76px] w-full max-w-[1128px] items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-[#0a66c2] text-xl font-bold leading-none text-white">
              in
            </div>
            <span className="hidden font-heading text-lg font-semibold text-[#0a66c2] sm:block">
              HikeForSure
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="hidden items-center gap-6 lg:flex">
              {publicLinks.map((item) => {
                const wrapperClasses = "flex flex-col items-center gap-1 text-xs text-slate-600 transition hover:text-slate-900";
                if (item.to) {
                  return (
                    <NavLink key={item.label} to={item.to} className={wrapperClasses}>
                      {renderIcon(item.icon)}
                      <span>{item.label}</span>
                    </NavLink>
                  );
                }

                return (
                  <span key={item.label} className={wrapperClasses}>
                    {renderIcon(item.icon)}
                    <span>{item.label}</span>
                  </span>
                );
              })}
            </nav>

            <Link
              to="/signup"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Join now
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-[#0a66c2] px-4 py-2 text-sm font-semibold text-[#0a66c2] transition hover:bg-[#eaf4fe]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[58px] w-full max-w-[1128px] items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0a66c2] text-lg font-bold leading-none text-white">
              in
            </div>
          </Link>
          <div className="relative ml-2 hidden sm:block">
            <input
              type="text"
              placeholder="Search jobs, skills and companies"
              className="h-[36px] w-[280px] rounded bg-[#eef3f8] px-3 text-sm outline-none transition placeholder:text-slate-500 focus:bg-white focus:shadow-[inset_0_0_0_1px_#0a66c2]"
            />
          </div>
        </div>

        <nav className="flex items-center gap-4 sm:gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs ${isActive ? "text-[#0a66c2]" : "text-slate-600 hover:text-slate-900"}`
            }
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 9v2h-2v7c0 1.7-1.3 3-3 3h-4v-6h-4v6H6c-1.7 0-3-1.3-3-3v-7H1V9l11-7 5 3.2V2h3v5.1z" />
            </svg>
            <span className="hidden sm:block">Home</span>
          </NavLink>

          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs ${isActive ? "text-[#0a66c2]" : "text-slate-600 hover:text-slate-900"}`
            }
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 6V5c0-1.7-1.3-3-3-3h-4C8.3 2 7 3.3 7 5v1H3v15c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6h-4zM9 5c0-.6.4-1 1-1h4c.6 0 1 .4 1 1v1H9V5z" />
            </svg>
            <span className="hidden sm:block">Jobs</span>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs ${isActive ? "text-[#0a66c2]" : "text-slate-600 hover:text-slate-900"}`
            }
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
            </svg>
            <span className="hidden sm:block">Dashboard</span>
          </NavLink>

          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex flex-col items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-xs font-semibold">
                {user.email?.[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:block">Me</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-slate-200 bg-white shadow-lg">
                <div className="border-b border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-800">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default LinkedInNavbar;
