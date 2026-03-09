import { Navbar } from '@/components/layout/navbar'
import { JobCard } from '@/components/job-card'
import { getJobs } from '@/lib/api/jobs'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { location?: string; experience?: string; search?: string }
}) {
  const jobs = await getJobs({
    location: searchParams.location,
    experienceLevel: searchParams.experience,
    search: searchParams.search,
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No jobs found. Try adjusting your filters.</p>
          </div>
        )}
      </main>
    </div>
  )
}
