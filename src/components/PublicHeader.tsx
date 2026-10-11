import { useEffect, useRef, useState } from 'react';
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

const PublicHeader: React.FC = () => {
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

  return (
    <header className="header header-public">
      <div className="header-inner">
        <Link to="/" aria-label="На главную">
          <Logo />
        </Link>

        <nav className="header-nav">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header-link${pathname === link.to ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          {user ? (
            <>
              <button type="button" className="bell-btn" aria-label="Уведомления">
                <BellIcon size={21} />
                <span className="bell-dot" />
              </button>

              <div className="user-menu" ref={menuRef}>
                <button
                  type="button"
                  className="user-btn"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <Avatar name={user.name} size={38} />
                  <span>
                    <span className="user-name">{user.name}</span>
                    <br />
                    <span className="user-role">{roleLabel(user.role)}</span>
                  </span>
                  <span className="user-chevron">
                    <ChevronDownIcon size={16} />
                  </span>
                </button>

                {menuOpen && (
                  <div className="dropdown" role="menu">
                    <div className="dropdown-head">
                      <Avatar name={user.name} size={38} />
                      <div className="dropdown-head-info">
                        <span className="dropdown-name">{user.name}</span>
                        <span className="dropdown-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-sep" />
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate(cabinetPath);
                      }}
                    >
                      <UserIcon size={16} />
                      {user.role === 'organizer' ? 'Панель организатора' : 'Личный кабинет'}
                    </button>
                    <div className="dropdown-sep" />
                    <button
                      type="button"
                      className="dropdown-item danger"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
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
              <Link to="/login" className="header-link">
                Войти
              </Link>
              <Link to="/register" className="btn btn-primary header-cta">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
