import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

interface AuthLayoutProps {
  active: 'login' | 'register';
  children: ReactNode;
}

export function AuthLayout({ active, children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <aside className="auth-panel">
        <Logo light />
        <h1 className="auth-panel-title">Добро пожаловать на&nbsp;платформу</h1>
        <p className="auth-panel-text">
          Войдите в аккаунт, чтобы получить доступ к&nbsp;соревнованиям, командам
          и&nbsp;личному кабинету.
        </p>
      </aside>

      <main className="auth-content">
        <div className="auth-card">
          <div className="auth-tabs">
            <Link
              to="/login"
              className={`auth-tab${active === 'login' ? ' active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              Вход
            </Link>
            <Link
              to="/register"
              className={`auth-tab${active === 'register' ? ' active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              Регистрация
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
