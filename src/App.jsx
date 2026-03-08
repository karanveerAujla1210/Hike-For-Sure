import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ModernLayout from './components/ModernLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ModernHomePage from './pages/ModernHomePage';
import ModernJobsPage from './pages/ModernJobsPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MessagingPage from './pages/MessagingPage';
import PricingPage from './pages/PricingPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModernLayout />}>
            <Route index element={<ModernHomePage />} />
            <Route path="jobs" element={<ModernJobsPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="candidate/dashboard" element={<ProtectedRoute><CandidateDashboard /></ProtectedRoute>} />
            <Route path="recruiter/dashboard" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
            <Route path="admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="messages" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
