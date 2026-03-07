import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const TestSupabase = () => {
  const [status, setStatus] = useState('Checking...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count');
        if (error) throw error;
        setStatus('✅ Connected to Supabase!');
      } catch (err) {
        setStatus('❌ Connection Failed');
        setError(err.message);
      }
    };
    checkConnection();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold">{status}</h1>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default TestSupabase;
