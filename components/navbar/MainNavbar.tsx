import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs", label: "Jobs" },
  { href: "/messages", label: "Messages" },
  { href: "/notifications", label: "Notifications" },
  { href: "/subscription", label: "Subscription" }
];

export async function MainNavbar() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-lg font-semibold text-brand">
          Hike For Sure
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/profile"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
            >
              Profile
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-700">
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
