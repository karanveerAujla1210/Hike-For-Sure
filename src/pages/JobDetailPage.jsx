import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobs } from '../data/siteData';
import { supabase } from '../lib/supabase';
import { useSeo } from '../hooks/useSeo';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === id);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  useSeo({ title: job?.title || 'Job Details', description: `Apply for ${job?.title} at ${job?.company}` });

  useEffect(() => {
    if (user && job) {
      supabase.from('applications').select('id').eq('user_id', user.id).eq('job_id', job.id).single()
        .then(({ data }) => setApplied(!!data));
    }
  }, [user, job]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('applications').insert({
      user_id: user.id,
      job_id: job.id,
      status: 'pending'
    });

    if (!error) {
      setApplied(true);
      alert('Application submitted successfully!');
    } else {
      alert('Failed to submit application');
    }
    setLoading(false);
  };

  if (!job) return <div className="section-wrap py-12">Job not found</div>;

  return (
    <div className="section-wrap py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="surface-card">
          <h1 className="font-heading text-3xl font-bold">{job.title}</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">{job.company}</p>
          
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="rounded-lg bg-slate-100 px-3 py-1 dark:bg-slate-800">{job.location}</span>
            <span className="rounded-lg bg-slate-100 px-3 py-1 dark:bg-slate-800">{job.salary}</span>
            <span className="rounded-lg bg-slate-100 px-3 py-1 dark:bg-slate-800">{job.experience}</span>
            <span className="rounded-lg bg-slate-100 px-3 py-1 dark:bg-slate-800">{job.industry}</span>
          </div>

          <div className="mt-8">
            <h2 className="font-heading text-xl font-bold">Job Description</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              We are looking for a talented {job.title} to join our team at {job.company}. 
              This role requires {job.experience} of experience in {job.industry}.
            </p>
          </div>

          <div className="mt-8">
            {applied ? (
              <button disabled className="btn-secondary cursor-not-allowed opacity-60">
                Already Applied
              </button>
            ) : (
              <button onClick={handleApply} disabled={loading} className="btn-primary">
                {loading ? 'Submitting...' : 'Apply Now'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDetailPage;
