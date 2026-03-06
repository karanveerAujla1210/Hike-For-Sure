import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useSeo } from '../hooks/useSeo';

const DashboardPage = () => {
  useSeo({ title: 'Dashboard', description: 'Your job applications dashboard' });
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [profileRes, appsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('applications').select('*, jobs(*)').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);
      setProfile(profileRes.data);
      setApplications(appsRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [user.id]);

  if (loading) return <div className="section-wrap py-12">Loading...</div>;

  return (
    <div className="section-wrap space-y-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Welcome back, {profile?.full_name || user.email}
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="surface-card"
        >
          <p className="text-sm text-slate-600 dark:text-slate-300">Total Applications</p>
          <p className="mt-2 font-heading text-3xl font-bold">{applications.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="surface-card"
        >
          <p className="text-sm text-slate-600 dark:text-slate-300">Under Review</p>
          <p className="mt-2 font-heading text-3xl font-bold">
            {applications.filter(a => a.status === 'pending').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="surface-card"
        >
          <p className="text-sm text-slate-600 dark:text-slate-300">Interviews</p>
          <p className="mt-2 font-heading text-3xl font-bold">
            {applications.filter(a => a.status === 'interview').length}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">My Applications</h2>
          <Link to="/jobs" className="btn-secondary px-4 py-2 text-sm">
            Browse Jobs
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="surface-card text-center">
            <p className="text-slate-600 dark:text-slate-300">No applications yet</p>
            <Link to="/jobs" className="btn-primary mt-4 inline-block">
              Apply to Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="surface-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold">{app.jobs?.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {app.jobs?.company} • {app.jobs?.location}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    app.status === 'interview' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    app.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Applied {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
