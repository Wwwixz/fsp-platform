import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../auth/AuthContext';
import {
  AwardIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClipboardIcon,
  CodeIcon,
  SearchIcon,
  ShieldIcon,
  ZapIcon,
} from '../components/icons';

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  status: 'approved' | 'pending';
  icon: 'code' | 'shield';
}

const upcomingEvents: UpcomingEvent[] = [
  { id: 1, title: 'Кубок Москвы по алгоритмам', date: '25 октября 2025', status: 'approved', icon: 'code' },
  { id: 2, title: 'CTF — Региональный этап', date: '12 ноября 2025', status: 'pending', icon: 'shield' },
];

const eventStatusLabel = { approved: 'Подтверждено', pending: 'На рассмотрении' } as const;
const eventStatusTone = { approved: 'green', pending: 'orange' } as const;

function Cabinet() {
  const { user } = useAuth();
  const displayName = user?.name ?? 'Спортсмен';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="public-page">
      <PublicHeader />

      <main className="page-container">
        <div className="page-head">
          <div>
            <h1 className="page-title">Личный кабинет</h1>
            <p className="page-subtitle">Рады видеть тебя снова, {firstName}!</p>
          </div>
          <Link to="/competitions" className="btn btn-primary">
            <SearchIcon size={17} />
            Найти соревнование
          </Link>
        </div>

        {/* Профиль и ключевые показатели */}
        <div className="card profile-hero">
          <div className="profile-info">
            <Avatar name={displayName} size={72} />
            <div>
              <div className="profile-name">{displayName}</div>
              <div className="profile-email">{user?.email}</div>
              <span className="badge blue profile-role">Спортсмен</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-value">
                1 450
                <span className="stat-chip green">+120 за месяц</span>
              </span>
              <span className="profile-stat-label">Рейтинг</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">24</span>
              <span className="profile-stat-label">Место в регионе</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">4</span>
              <span className="profile-stat-label">Победы</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">98%</span>
              <span className="profile-stat-label">Успешность</span>
            </div>
          </div>
        </div>

        {/* Ближайшие события */}
        <div className="section-head">
          <h2 className="section-title">Ближайшие события</h2>
          <Link to="/competitions" className="section-link">
            Смотреть все
          </Link>
        </div>
        <div className="card">
          {upcomingEvents.map((event) => {
            const Icon = event.icon === 'code' ? CodeIcon : ShieldIcon;
            return (
              <div className="event-row" key={event.id}>
                <span className="icon-tile blue">
                  <Icon size={22} />
                </span>
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-meta">
                    <span className="event-date">
                      <CalendarIcon size={14} />
                      {event.date}
                    </span>
                    <span className={`badge ${eventStatusTone[event.status]}`}>
                      {eventStatusLabel[event.status]}
                    </span>
                  </div>
                </div>
                <Link to={`/competition/${event.id}`} className="btn-ghost">
                  Детали
                  <ChevronRightIcon size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Прогресс сезона */}
        <section className="progress-card">
          <div className="progress-badge">
            <ZapIcon size={20} />
            Сезон 2025
          </div>
          <h2 className="progress-title">Твой прогресс в сезоне</h2>
          <p className="progress-text">
            В этом месяце твой рейтинг вырос на <strong>+120 пунктов</strong>.
            Продолжай в том же духе, чтобы попасть в сборную!
          </p>
          <div className="progress-actions">
            <Link to="/results" className="btn-white">
              <AwardIcon size={17} />
              История выступлений
            </Link>
            <Link to="/applications" className="btn-outline-light">
              <ClipboardIcon size={17} />
              Мои заявки
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Cabinet;
