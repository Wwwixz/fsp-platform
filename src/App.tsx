import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import type { Role } from './types';
import { homePath } from './data/navigation';
import Landing from './pages/Landing.tsx';
import Cabinet from './pages/Cabinet.tsx';
import Competitions from './pages/Competitions.tsx';
import CompetitionDetails from './pages/CompetitionDetails.tsx';
import Teams from './pages/Teams.tsx';
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
  return <Navigate to={user ? homePath(user.role) : '/'} replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Публичные страницы */}
          <Route path="/" element={<Landing />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/competition/:id" element={<CompetitionDetails />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Личный кабинет спортсмена */}
          <Route
            path="/cabinet"
            element={
              <RequireAuth>
                <Cabinet />
              </RequireAuth>
            }
          />

          {/* Общие разделы после входа */}
          <Route
            path="/results"
            element={
              <RequireAuth>
                <ResultsPage />
              </RequireAuth>
            }
          />

          {/* Разделы регионального представителя */}
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

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
