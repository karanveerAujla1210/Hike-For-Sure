import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { jobs } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const LinkedInJobsPage = () => {
  useSeo({ title: "Job Search", description: "Find your next opportunity" });
  const [searchParams] = useSearchParams();
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = useMemo(() => {
    const keyword = searchParams.get("keyword")?.toLowerCase();
    const location = searchParams.get("location")?.toLowerCase();
    const industry = searchParams.get("industry");

    return jobs.filter((job) => {
      const matchKeyword = !keyword || job.title.toLowerCase().includes(keyword);
      const matchLocation = !location || job.location.toLowerCase().includes(location);
      const matchIndustry = !industry || job.industry === industry;
      return matchKeyword && matchLocation && matchIndustry;
    });
  }, [searchParams]);

  return (
    <div className="flex min-h-screen bg-[#f3f2ef] dark:bg-[#000000]">
      {/* Jobs List */}
      <div className="w-full lg:w-[380px] border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1b1f23]">
        <div className="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h1 className="text-xl font-semibold">Jobs</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {filteredJobs.length} results
            </p>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredJobs.map((job) => (
              <motion.button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`w-full p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800 ${
                  selectedJob?.id === job.id ? "bg-slate-50 dark:bg-slate-800" : ""
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="font-semibold text-[#0a66c2]">{job.title}</h3>
                <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">{job.company}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {job.location} • {job.experience}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
                    {job.industry}
                  </span>
                  {job.featured && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Featured
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="hidden flex-1 lg:block">
        {selectedJob ? (
          <div className="sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto bg-white p-8 dark:bg-[#1b1f23]">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">{selectedJob.title}</h1>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    {selectedJob.company} • {selectedJob.location}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{selectedJob.experience}</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded bg-slate-100 dark:bg-slate-800">
                  <span className="text-2xl font-bold text-[#0a66c2]">
                    {selectedJob.company[0]}
                  </span>
                </div>
              </div>

              <Link
                to={`/jobs/${selectedJob.id}`}
                className="inline-flex h-10 items-center rounded-full bg-[#0a66c2] px-6 font-semibold text-white hover:bg-[#004182]"
              >
                Apply
              </Link>

              <div className="mt-8 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">About the job</h2>
                  <div className="mt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                      We are looking for a talented {selectedJob.title} to join our team at{" "}
                      {selectedJob.company}. This role requires {selectedJob.experience} of
                      experience in {selectedJob.industry}.
                    </p>
                    <p>
                      <strong>Salary:</strong> {selectedJob.salary}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedJob.location}
                    </p>
                    <p>
                      <strong>Industry:</strong> {selectedJob.industry}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-52px)] items-center justify-center bg-white dark:bg-[#1b1f23]">
            <p className="text-slate-500">Select a job to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInJobsPage;
