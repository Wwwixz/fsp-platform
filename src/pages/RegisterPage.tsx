import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { EyeIcon, EyeOffIcon, BuildingIcon, UserIcon } from '../components/icons';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/client';
import { homePath } from '../data/navigation';
import type { Role } from '../types';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  agree?: string;
}

const inputBase =
  'w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 transition placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';

const labelBase =
  'block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400';

const errorBase = 'mt-1.5 block text-xs font-medium text-rose-400';

export function RegisterPage() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<Role>('athlete');
  const [region, setRegion] = useState('Москва');
  const [regions, setRegions] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    api
      .get<string[]>('/meta/regions')
      .then(setRegions)
      .catch(() => setRegions([]));
  }, []);

  if (!loading && user) {
    return <Navigate to={homePath(user.role)} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: FormErrors = {};
    if (name.trim().length < 3) {
      next.name = 'Укажите имя и фамилию';
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = 'Укажите корректный email';
    }
    if (password.length < 6) {
      next.password = 'Пароль должен содержать минимум 6 символов';
    }
    if (confirm !== password) {
      next.confirm = 'Пароли не совпадают';
    }
    if (!agree) {
      next.agree = 'Нужно принять условия платформы';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    setServerError('');
    try {
      await register({ name: name.trim(), email: email.trim(), password, role, region });
      navigate(homePath(role));
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout active="register">
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {serverError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300">
            {serverError}
          </div>
        )}
        <div>
          <label className={labelBase} htmlFor="reg-name">
            Имя и фамилия
          </label>
          <input
            id="reg-name"
            className={`${inputBase}${errors.name ? ' border-rose-500/60' : ''}`}
            type="text"
            placeholder="Иван Петров"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          {errors.name && <span className={errorBase}>{errors.name}</span>}
        </div>

        <div>
          <label className={labelBase} htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            className={`${inputBase}${errors.email ? ' border-rose-500/60' : ''}`}
            type="email"
            placeholder="example@mail.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <span className={errorBase}>{errors.email}</span>}
        </div>

        <div>
          <label className={labelBase} htmlFor="reg-password">
            Пароль
          </label>
          <div className="relative">
            <input
              id="reg-password"
              className={`${inputBase}${errors.password ? ' border-rose-500/60' : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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
          {errors.password && <span className={errorBase}>{errors.password}</span>}
        </div>

        <div>
          <label className={labelBase} htmlFor="reg-confirm">
            Подтвердите пароль
          </label>
          <input
            id="reg-confirm"
            className={`${inputBase}${errors.confirm ? ' border-rose-500/60' : ''}`}
            type={showPassword ? 'text' : 'password'}
            placeholder="Повторите пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          {errors.confirm && <span className={errorBase}>{errors.confirm}</span>}
        </div>

        <div>
          <span className={labelBase}>Я регистрируюсь как</span>
          <div className="grid grid-cols-2 gap-3">
            <label className="group relative flex cursor-pointer flex-col gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-300 hover:border-slate-700 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-500/10 has-[:checked]:ring-1 has-[:checked]:ring-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-400/60">
              <input
                type="radio"
                name="register-role"
                className="sr-only"
                checked={role === 'athlete'}
                onChange={() => setRole('athlete')}
              />
              <UserIcon
                size={18}
                className="text-slate-400 group-has-[:checked]:text-indigo-400"
              />
              <span className="text-sm font-semibold text-slate-200">
                Спортсмен
              </span>
            </label>

            <label className="group relative flex cursor-pointer flex-col gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-300 hover:border-slate-700 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-500/10 has-[:checked]:ring-1 has-[:checked]:ring-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-400/60">
              <input
                type="radio"
                name="register-role"
                className="sr-only"
                checked={role === 'organizer'}
                onChange={() => setRole('organizer')}
              />
              <BuildingIcon
                size={18}
                className="text-slate-400 group-has-[:checked]:text-indigo-400"
              />
              <span className="text-sm font-semibold text-slate-200">
                Региональный представитель
              </span>
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {role === 'athlete'
              ? 'Участие в соревнованиях, команды и личные результаты'
              : 'Создание соревнований, приём заявок и аналитика'}
          </p>
        </div>

        <div>
          <label className={labelBase} htmlFor="reg-region">
            Регион
          </label>
          <select
            id="reg-region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={inputBase}
          >
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-500">
            {role === 'athlete'
              ? 'От региона зависят доступные региональные соревнования'
              : 'Модерируете заявки и создаёте соревнования своего региона'}
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2.5 text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40 focus:ring-offset-0"
            />
            Согласен с условиями и политикой конфиденциальности
          </label>
          {errors.agree && <span className={errorBase}>{errors.agree}</span>}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] disabled:opacity-60"
        >
          {busy ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
        </button>
      </form>
    </AuthLayout>
  );
}
