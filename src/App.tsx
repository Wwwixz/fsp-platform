import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import type { ReactNode } from 'react';
import type { Role } from './types';
import { homePath } from './data/navigation';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ResultsPage } from './pages/ResultsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

/* Разделы организатора: спортсменов отправляем на «Результаты». */
function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== role) {
    return <Navigate to={homePath(user.role)} replace />;
  }
  return <>{children}</>;
}

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? homePath(user.role) : '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/analytics"
          element={
            <RequireRole role="organizer">
              <AnalyticsPage />
            </RequireRole>
          }
        />
        <Route
          path="/applications"
          element={
            <RequireRole role="organizer">
              <ApplicationsPage />
            </RequireRole>
          }
        />
        <Route
          path="/results"
          element={
            <RequireAuth>
              <ResultsPage />
            </RequireAuth>
          }
        />
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </AuthProvider>
  );
}
