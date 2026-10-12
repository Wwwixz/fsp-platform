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
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400"
            htmlFor="login-identity"
          >
            Email или телефон
          </label>
          <input
            id="login-identity"
            className={`w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 transition placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20${
              errors.identity ? ' border-rose-500/60' : ''
            }`}
            type="text"
            placeholder="example@mail.ru"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            autoComplete="username"
          />
          {errors.identity && (
            <span className="mt-1.5 block text-xs font-medium text-rose-400">
              {errors.identity}
            </span>
          )}
        </div>

        <div>
          <label
            className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400"
            htmlFor="login-password"
          >
            Пароль
          </label>
          <div className="relative">
            <input
              id="login-password"
              className={`w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 transition placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20${
                errors.password ? ' border-rose-500/60' : ''
              }`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOffIcon size={19} /> : <EyeIcon size={19} />}
            </button>
          </div>
          {errors.password && (
            <span className="mt-1.5 block text-xs font-medium text-rose-400">
              {errors.password}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2.5 text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40 focus:ring-offset-0"
            />
            Запомнить меня
          </label>
          <a
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Забыли пароль?
          </a>
        </div>

        <button
          type="submit"
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
        >
          Войти
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-600">
        <span className="flex-1 h-px bg-slate-800" />
        или войдите через
        <span className="flex-1 h-px bg-slate-800" />
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-bold text-sky-400 transition-all duration-300 hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
          aria-label="Войти через VK"
        >
          VK
        </button>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 transition-all duration-300 hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
          aria-label="Войти через GitHub"
        >
          <GitHubIcon size={22} />
        </button>
      </div>

      <button
        type="button"
        className="mt-3 w-full inline-flex items-center justify-center gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
        onClick={handleFspLogin}
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white" aria-hidden>
          Ф
        </span>
        Войти через личный кабинет ФСП
      </button>
    </AuthLayout>
  );
}
