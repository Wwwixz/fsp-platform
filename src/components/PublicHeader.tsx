import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/competitions', label: 'Соревнования' },
  { to: '/teams', label: 'Команды' },
  { to: '/results', label: 'Результаты' },
];

const roleLabel = (role: 'athlete' | 'organizer') =>
  role === 'organizer' ? 'Региональный представитель' : 'Спортсмен';

const PublicHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const initials = (user?.name ?? '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ФСП';

  const cabinetPath = user?.role === 'organizer' ? '/analytics' : '/cabinet';

  return (
    <header className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-100">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">Ф</div>
          <span className="text-xl font-extrabold text-blue-900 tracking-tight">ФСП</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-full font-medium text-sm transition ${
                pathname === link.to
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <button className="p-2 text-slate-600 hover:text-slate-900 relative" aria-label="Уведомления">
              🔔
            </button>
            <Link to={cabinetPath} className="flex items-center space-x-3 border-l pl-4 border-slate-200">
              <div className="w-9 h-9 bg-blue-900 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-bold text-slate-900 leading-tight">{user.name}</div>
                <div className="text-xs text-slate-500">{roleLabel(user.role)}</div>
              </div>
            </Link>
            <button
              onClick={logout}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="bg-blue-800 hover:bg-blue-900 text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition shadow-md shadow-blue-800/20"
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;
