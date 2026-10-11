import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { EyeIcon, EyeOffIcon } from '../components/icons';
import { useAuth } from '../auth/AuthContext';
import { homePath } from '../data/navigation';
import type { Role } from '../types';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  agree?: string;
}

export function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<Role>('athlete');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  if (user) {
    return <Navigate to={homePath(user.role)} replace />;
  }

  const handleSubmit = (e: FormEvent) => {
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

    register({ name: name.trim(), email: email.trim(), password, role });
    navigate(homePath(role));
  };

  return (
    <AuthLayout active="register">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field-label" htmlFor="reg-name">
            Имя и фамилия
          </label>
          <input
            id="reg-name"
            className={`input${errors.name ? ' input-invalid' : ''}`}
            type="text"
            placeholder="Иван Петров"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="reg-email">
            Email
          </label>
          <input
            id="reg-email"
            className={`input${errors.email ? ' input-invalid' : ''}`}
            type="email"
            placeholder="example@mail.ru"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="reg-password">
            Пароль
          </label>
          <div className="input-wrap">
            <input
              id="reg-password"
              className={`input${errors.password ? ' input-invalid' : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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

        <div className="field">
          <label className="field-label" htmlFor="reg-confirm">
            Подтвердите пароль
          </label>
          <input
            id="reg-confirm"
            className={`input${errors.confirm ? ' input-invalid' : ''}`}
            type={showPassword ? 'text' : 'password'}
            placeholder="Повторите пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          {errors.confirm && <span className="field-error">{errors.confirm}</span>}
        </div>

        <div className="field">
          <span className="field-label">Я регистрируюсь как</span>
          <div className="role-switch">
            <button
              type="button"
              className={`role-option${role === 'athlete' ? ' active' : ''}`}
              onClick={() => setRole('athlete')}
            >
              Спортсмен
            </button>
            <button
              type="button"
              className={`role-option${role === 'organizer' ? ' active' : ''}`}
              onClick={() => setRole('organizer')}
            >
              Региональный представитель
            </button>
          </div>
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span className="checkbox-box">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </span>
          Согласен с условиями и политикой конфиденциальности
        </label>
        {errors.agree && <span className="field-error" style={{ marginTop: -12 }}>{errors.agree}</span>}

        <button type="submit" className="btn btn-primary btn-block">
          Зарегистрироваться
        </button>
      </form>
    </AuthLayout>
  );
}
