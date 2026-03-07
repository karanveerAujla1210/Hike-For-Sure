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
import TestSupabase from './pages/TestSupabase';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<TestSupabase />} />
          <Route path="/" element={<ModernLayout />}>
            <Route index element={<ModernHomePage />} />
            <Route path="jobs" element={<ModernJobsPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
