import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PitchesPage from './pages/PitchesPage';
import NewPitchPage from './pages/NewPitchPage';
import PitchDetailPage from './pages/PitchDetailPage';
import ExplorePage from './pages/ExplorePage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppInit() {
  const { fetchMe } = useAuthStore();
  useEffect(() => { fetchMe(); }, [fetchMe]);
  return null;
}

export default function App() {
  return (
    <>
      <AppInit />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/pitches" element={<PrivateRoute><PitchesPage /></PrivateRoute>} />
        <Route path="/pitches/new" element={<PrivateRoute><NewPitchPage /></PrivateRoute>} />
        <Route path="/pitches/:id" element={<PrivateRoute><PitchDetailPage /></PrivateRoute>} />
        <Route path="/explore" element={<PrivateRoute><ExplorePage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
