import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';

const SignupPage = () => {
  useSeo({ title: 'Sign Up', description: 'Create your Hike For Sure account' });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) setError(error.message);
    else navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#f3f2ef] py-10">
      <div className="mx-auto grid w-full max-w-[1128px] gap-8 px-4 lg:grid-cols-[1fr_420px] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-[#8f5849] sm:text-5xl">
            Join your network and unlock better opportunities
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600">
            Create your profile once and let recruiters match you with openings aligned to your experience.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-700">
            <p className="rounded-lg border border-slate-200 bg-white px-4 py-3">Get matched with relevant roles faster</p>
            <p className="rounded-lg border border-slate-200 bg-white px-4 py-3">Track your application status in one dashboard</p>
            <p className="rounded-lg border border-slate-200 bg-white px-4 py-3">Receive interview feedback and hiring updates</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
            <h2 className="text-3xl font-semibold text-slate-900">Create account</h2>
            <p className="mt-2 text-sm text-slate-600">No spam. Just real hiring conversations.</p>

            {error && (
              <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1 h-12 w-full rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-[#0a66c2] focus:shadow-[inset_0_0_0_1px_#0a66c2]"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 h-12 w-full rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-[#0a66c2] focus:shadow-[inset_0_0_0_1px_#0a66c2]"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password (6+ characters)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 h-12 w-full rounded-md border border-slate-300 px-4 text-sm outline-none transition focus:border-[#0a66c2] focus:shadow-[inset_0_0_0_1px_#0a66c2]"
                  placeholder="Create a password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-full bg-[#0a66c2] text-base font-semibold text-white transition hover:bg-[#004182] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Agree & join'}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Already on HikeForSure?{' '}
              <Link to="/login" className="font-semibold text-[#0a66c2] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
