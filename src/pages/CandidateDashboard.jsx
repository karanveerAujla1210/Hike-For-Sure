import { useState, useEffect } from 'react';
import { candidateAPI, jobAPI, notificationAPI } from '../services/api';
import { Link } from 'react-router-dom';

export default function CandidateDashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, applicationsRes, notificationsRes] = await Promise.all([
        candidateAPI.getProfile(),
        jobAPI.getApplications(),
        notificationAPI.getNotifications({ limit: 5 }),
      ]);

      setProfile(profileRes.data);
      setApplications(applicationsRes.data);
      setNotifications(notificationsRes.data.notifications);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {profile?.first_name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {profile?.headline || 'Complete your profile to get better job matches'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Profile Views
          </h3>
          <p className="text-3xl font-bold text-blue-600">{profile?.profile_views_count || 0}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Applications
          </h3>
          <p className="text-3xl font-bold text-green-600">{applications.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Profile Completeness
          </h3>
          <p className="text-3xl font-bold text-purple-600">{profile?.profile_completeness || 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Applications</h2>
            <Link to="/applications" className="text-blue-600 hover:text-blue-700 text-sm">
              View All
            </Link>
          </div>

          {applications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No applications yet</p>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {app.job_title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {app.company_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === 'hired' ? 'bg-green-100 text-green-800' :
                      app.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
            <Link to="/notifications" className="text-blue-600 hover:text-blue-700 text-sm">
              View All
            </Link>
          </div>

          {notifications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {notif.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/jobs"
            className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Browse Jobs</p>
          </Link>
          <Link
            to="/profile/edit"
            className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">✏️</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Edit Profile</p>
          </Link>
          <Link
            to="/connections"
            className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">My Network</p>
          </Link>
          <Link
            to="/messages"
            className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition"
          >
            <div className="text-2xl mb-2">💬</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Messages</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
