import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Avatar } from './Avatar';
import { Logo } from './Logo';
import { BellIcon, ChevronDownIcon, LogoutIcon, UserIcon } from './icons';

interface NavLinkItem {
  to: string;
  label: string;
}

const baseLinks: NavLinkItem[] = [
  { to: '/', label: 'Главная' },
  { to: '/competitions', label: 'Соревнования' },
  { to: '/teams', label: 'Команды' },
  { to: '/results', label: 'Результаты' },
];

const roleLabel = (role: 'athlete' | 'organizer') =>
  role === 'organizer' ? 'Региональный представитель' : 'Спортсмен';

const PublicHeader: FC = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const links: NavLinkItem[] = [...baseLinks];
  if (user?.role === 'organizer') {
    links.push({ to: '/applications', label: 'Заявки' });
  }

  const cabinetPath = user?.role === 'organizer' ? '/analytics' : '/cabinet';

  const linkClass = (to: string) =>
    `whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${
      pathname === to
        ? 'bg-indigo-500/10 text-white ring-1 ring-indigo-500/30'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            aria-label="На главную"
            className="rounded-xl transition-transform duration-300 ease-in-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
          >
            <Logo light />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основная навигация">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                type="button"
                aria-label="Уведомления"
                className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-slate-400 transition-all duration-300 ease-in-out hover:border-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
              >
                <BellIcon size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-400 ring-2 ring-slate-950" />
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 py-1.5 pl-1.5 pr-3 transition-all duration-300 ease-in-out hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                >
                  <Avatar name={user.name} size={34} />
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-semibold leading-tight text-slate-200">
                      {user.name}
                    </span>
                    <span className="block text-xs leading-tight text-slate-500">
                      {roleLabel(user.role)}
                    </span>
                  </span>
                  <ChevronDownIcon
                    size={16}
                    className={`text-slate-500 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-2xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl shadow-black/50"
                  >
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Avatar name={user.name} size={38} />
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-200">
                          {user.name}
                        </span>
                        <span className="block truncate text-xs text-slate-500">{user.email}</span>
                      </div>
                    </div>
                    <div className="my-1 h-px bg-slate-800" />
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate(cabinetPath);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                    >
                      <UserIcon size={16} />
                      {user.role === 'organizer' ? 'Панель организатора' : 'Личный кабинет'}
                    </button>
                    <div className="my-1 h-px bg-slate-800" />
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
                    >
                      <LogoutIcon size={16} />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-300 ease-in-out hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 sm:block"
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Мобильная навигация */}
      <nav
        aria-label="Мобильная навигация"
        className="flex gap-1 overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden"
      >
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={linkClass(link.to)}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default PublicHeader;
