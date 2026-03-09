import Link from "next/link";

import { MainNavbar } from "@/components/navbar/MainNavbar";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      <MainNavbar />
      <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-brand-gradient p-10 text-white shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            Hike For Sure
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            LinkedIn-style hiring platform for candidates, recruiters, and companies.
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Build your profile, discover opportunities, manage applicants, and scale to
            100,000+ users with Next.js + Supabase.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup">
              <Button className="bg-white text-brand hover:bg-slate-100">
                Create account
              </Button>
            </Link>
            <Link href="/jobs">
              <Button variant="secondary" className="border-white/60 bg-transparent text-white">
                Explore jobs
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
