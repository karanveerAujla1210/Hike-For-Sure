import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jobs } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";
import { supabase } from "../lib/supabase";

const statusStyles = {
  success: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  error: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
};

const JobDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const job = jobs.find((item) => item.id === id);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useSeo({
    title: job?.title || "Job Details",
    description: job
      ? `Apply for ${job.title} at ${job.company}`
      : "Explore job details on Hike For Sure."
  });

  const roleHighlights = useMemo(
    () => [
      `Experience expected: ${job?.experience || "Relevant industry experience"}.`,
      `Hiring focus: ${job?.industry || "Multi-domain"} functional expertise.`,
      `Compensation range: ${job?.salary || "As per market standards"}.`
    ],
    [job]
  );

  const candidateProfile = useMemo(
    () => [
      "Strong communication and stakeholder management skills.",
      "Ability to deliver outcomes in fast-paced, target-oriented teams.",
      "Evidence of measurable impact in previous roles."
    ],
    []
  );

  useEffect(() => {
    const checkIfApplied = async () => {
      if (!user || !job) return;
      const { data } = await supabase
        .from("applications")
        .select("id")
        .eq("user_id", user.id)
        .eq("job_id", job.id)
        .maybeSingle();
      setApplied(Boolean(data));
    };

    checkIfApplied();
  }, [user, job]);

  const handleApply = async () => {
    setFeedback(null);
    if (!user) {
      navigate("/login");
      return;
    }

    if (!job) return;

    setLoading(true);
    const { error } = await supabase.from("applications").insert({
      user_id: user.id,
      job_id: job.id,
      status: "pending"
    });

    if (!error) {
      setApplied(true);
      setFeedback({
        type: "success",
        message: "Application submitted successfully. You can track it in Dashboard."
      });
    } else {
      setFeedback({
        type: "error",
        message: "Unable to submit application right now. Please try again."
      });
    }
    setLoading(false);
  };

  if (!job) {
    return (
      <div className="section-wrap py-12">
        <div className="surface-card text-center">
          <h1 className="font-heading text-2xl font-bold">Job not found</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            This role may have been closed or removed.
          </p>
          <Link to="/jobs" className="btn-primary mt-5">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-wrap space-y-8 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/jobs" className="text-sm font-semibold text-brand hover:underline">
          Back to all roles
        </Link>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card"
        >
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">{job.title}</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">{job.company}</p>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="tag">{job.industry}</span>
            <span className="tag">{job.location}</span>
            <span className="tag">{job.experience}</span>
            <span className="tag">{job.mode || "Hybrid"}</span>
            <span className="tag">{job.type || "Full-time"}</span>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="font-heading text-xl font-bold">Role overview</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                We are hiring a {job.title} for {job.company}. The role is focused on
                delivery quality, execution speed, and strong collaboration across teams.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold">Role highlights</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {roleHighlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold">Ideal candidate profile</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {candidateProfile.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="surface-card h-fit lg:sticky lg:top-28"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Compensation</p>
          <p className="mt-2 font-heading text-2xl font-bold">{job.salary}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Posted {job.posted || "recently"} • Application review in 3-7 business days.
          </p>

          <div className="mt-6">
            {applied ? (
              <button disabled className="btn-secondary w-full cursor-not-allowed opacity-65">
                Already Applied
              </button>
            ) : (
              <button onClick={handleApply} disabled={loading} className="btn-primary w-full">
                {loading ? "Submitting..." : "Apply with Account"}
              </button>
            )}
          </div>

          {!user ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Please{" "}
              <Link to="/login" className="font-semibold text-brand hover:underline">
                login
              </Link>{" "}
              to apply and track status.
            </p>
          ) : null}

          {feedback ? (
            <p className={`mt-4 rounded-xl px-3 py-2 text-sm ${statusStyles[feedback.type]}`}>
              {feedback.message}
            </p>
          ) : null}
        </motion.aside>
      </div>
    </div>
  );
};

export default JobDetailPage;
