import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Avatar } from './Avatar';
import { useAuth } from '../auth/AuthContext';
import { homePath, navForRole } from '../data/navigation';
import {
  BellIcon,
  ChevronDownIcon,
  LogoutIcon,
  UserIcon,
} from './icons';

export function Header() {
  const { user, logout } = useAuth();
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

  const roleLabel = user?.role === 'organizer' ? 'Региональный представитель' : 'Спортсмен';

  return (
    <header className="header">
      <NavLink to={homePath(user?.role ?? 'athlete')} aria-label="На главную">
        <Logo />
      </NavLink>

      <nav className="header-nav">
        {navForRole(user?.role ?? 'athlete').map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              `header-link${item.to !== '#' && isActive ? ' active' : ''}`
            }
            onClick={item.to === '#' ? (e) => e.preventDefault() : undefined}
            title={item.to === '#' ? 'Раздел в разработке' : undefined}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-right">
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
            <Avatar name={user?.name ?? ''} size={38} />
            <span>
              <span className="user-name">{user?.name}</span>
              <br />
              <span className="user-role">{roleLabel}</span>
            </span>
            <span className="user-chevron">
              <ChevronDownIcon size={16} />
            </span>
          </button>

          {menuOpen && (
            <div className="dropdown" role="menu">
              <div className="dropdown-head">
                <Avatar name={user?.name ?? ''} size={38} />
                <div className="dropdown-head-info">
                  <span className="dropdown-name">{user?.name}</span>
                  <span className="dropdown-email">{user?.email}</span>
                </div>
              </div>
              <div className="dropdown-sep" />
              <button
                type="button"
                className="dropdown-item"
                onClick={() => setMenuOpen(false)}
              >
                <UserIcon size={16} />
                Профиль
              </button>
              <div className="dropdown-sep" />
              <button
                type="button"
                className="dropdown-item danger"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
              >
                <LogoutIcon size={16} />
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
