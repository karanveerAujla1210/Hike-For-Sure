import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';

const DashboardPage = () => {
  useSeo({ title: 'Dashboard', description: 'Your dashboard' });
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (!loading && user) {
      // Redirect based on user role
      if (user.role === 'candidate') {
        navigate('/candidate/dashboard');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Redirecting to your dashboard...
        </h1>
      </div>
    </div>
  );
};

export default DashboardPage;
