import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import {
  EyeIcon,
  EyeOffIcon,
  GitHubIcon,
} from '../components/icons';
import { useAuth } from '../auth/AuthContext';
import { homePath } from '../data/navigation';

const emailOrPhoneValid = (value: string) =>
  /^\S+@\S+\.\S+$/.test(value) || /^\+?[\d\s()-]{10,}$/.test(value);

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identity?: string; password?: string }>({});

  if (user) {
    return <Navigate to={homePath(user.role)} replace />;
  }

  /* Демо-режим SSO: личный кабинет ФСП — аккаунт федерации (организатора). */
  const handleFspLogin = () => {
    const ssoUser = login('federation@fsp.ru', 'fsp-sso', {
      name: 'Федерация ФСП',
      role: 'organizer',
    });
    navigate(homePath(ssoUser.role));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!emailOrPhoneValid(identity.trim())) {
      next.identity = 'Укажите корректный email или телефон';
    }
    if (password.length < 6) {
      next.password = 'Пароль должен содержать минимум 6 символов';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const loggedIn = login(identity.trim(), password);
    navigate(homePath(loggedIn.role));
  };

  return (
    <AuthLayout active="login">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="login-identity">
            Email или телефон
          </label>
          <input
            id="login-identity"
            className={`input${errors.identity ? ' input-invalid' : ''}`}
            type="text"
            placeholder="example@mail.ru"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            autoComplete="username"
          />
          {errors.identity && <span className="field-error">{errors.identity}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="login-password">
            Пароль
          </label>
          <div className="input-wrap">
            <input
              id="login-password"
              className={`input${errors.password ? ' input-invalid' : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="input-trailing"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOffIcon size={19} /> : <EyeIcon size={19} />}
            </button>
          </div>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="auth-row">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="checkbox-box">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>
            Запомнить меня
          </label>
          <a className="auth-link" href="#" onClick={(e) => e.preventDefault()}>
            Забыли пароль?
          </a>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Войти
        </button>
      </form>

      <div className="auth-divider">или войдите через</div>
      <div className="auth-social">
        <button type="button" className="auth-social-btn" aria-label="Войти через VK">
          <span className="vk-tile">VK</span>
        </button>
        <button type="button" className="auth-social-btn" aria-label="Войти через GitHub">
          <GitHubIcon size={28} />
        </button>
      </div>

      <button type="button" className="auth-fsp-btn" onClick={handleFspLogin}>
        <span className="fsp-tile" aria-hidden>
          <svg width="17" height="17" viewBox="0 0 32 32">
            <path d="M16 3l10 5.7-10 5.6-10-5.6L16 3z" fill="#3b82f6" />
            <path d="M16 14.3l10-5.6v11.6L16 26V14.3z" fill="#1e3a8a" />
            <path d="M16 14.3L6 8.7v11.6L16 26V14.3z" fill="#1d4ed8" />
          </svg>
        </span>
        Войти через личный кабинет ФСП
      </button>
    </AuthLayout>
  );
}
