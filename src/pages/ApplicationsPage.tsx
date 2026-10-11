import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { mockApplications } from '../data/mock';
import type { Application, ApplicationStatus } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, DotsIcon, SearchIcon } from '../components/icons';

const PAGE_SIZE = 5;

const tabs: { id: ApplicationStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'pending', label: 'На рассмотрении' },
  { id: 'approved', label: 'Одобрено' },
  { id: 'rejected', label: 'Отклонено' },
];

export function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [tab, setTab] = useState<ApplicationStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    if (openMenuId === null) return;
    const onClick = () => setOpenMenuId(null);
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [openMenuId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications
      .filter((app) => (tab === 'all' ? true : app.status === tab))
      .filter(
        (app) =>
          app.participant.toLowerCase().includes(q) ||
          app.competition.toLowerCase().includes(q),
      );
  }, [applications, tab, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const setStatus = (id: number, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));
    setOpenMenuId(null);
  };

  const selectTab = (next: ApplicationStatus | 'all') => {
    setTab(next);
    setPage(1);
  };

  return (
    <AppShell>
      <h1 className="page-title">Заявки на участие</h1>

      <div className="tabs-row">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`tab-pill${tab === item.id ? ' active' : ''}`}
            onClick={() => selectTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <span className="input-leading">
          <SearchIcon size={18} />
        </span>
        <input
          className="input input-has-leading"
          type="search"
          placeholder="Поиск по имени или команде..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="search-count">
        Найдено заявок: {filtered.length}
      </div>

      <div className="card table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Участник / Команда</th>
              <th>Соревнование</th>
              <th>Регион</th>
              <th>Статус</th>
              <th className="cell-actions" style={{ width: 90 }}>
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((app) => (
              <tr key={app.id}>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={app.participant} size={38} team={app.isTeam} />
                    <span className="table-strong">{app.participant}</span>
                  </span>
                </td>
                <td>
                  <a
                    href="#"
                    className="table-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    {app.competition}
                  </a>
                </td>
                <td className="table-muted">{app.region}</td>
                <td>
                  <StatusBadge status={app.status} />
                </td>
                <td className="cell-actions">
                  <span style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Действия с заявкой ${app.participant}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) => (prev === app.id ? null : app.id));
                      }}
                    >
                      <DotsIcon size={19} />
                    </button>
                    {openMenuId === app.id && (
                      <div className="dropdown" role="menu" onClick={(e) => e.stopPropagation()}>
                        {app.status !== 'approved' && (
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => setStatus(app.id, 'approved')}
                          >
                            Одобрить
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button
                            type="button"
                            className="dropdown-item danger"
                            onClick={() => setStatus(app.id, 'rejected')}
                          >
                            Отклонить
                          </button>
                        )}
                        {app.status !== 'pending' && (
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={() => setStatus(app.id, 'pending')}
                          >
                            Вернуть на рассмотрение
                          </button>
                        )}
                      </div>
                    )}
                  </span>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td className="table-empty" colSpan={5}>
                  Заявок не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="page-btn"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            aria-label="Предыдущая страница"
          >
            <ChevronLeftIcon size={16} />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`page-btn${n === safePage ? ' active' : ''}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className="page-btn"
            disabled={safePage === pageCount}
            onClick={() => setPage(safePage + 1)}
            aria-label="Следующая страница"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      )}
    </AppShell>
  );
}
