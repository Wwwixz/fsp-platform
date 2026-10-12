import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { mockApplications } from '../data/mock';
import type { Application, ApplicationStatus } from '../types';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ClockIcon,
  DotsIcon,
  SearchIcon,
  XIcon,
} from '../components/icons';

const PAGE_SIZE = 5;

const tabs: { id: ApplicationStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'pending', label: 'На рассмотрении' },
  { id: 'approved', label: 'Одобрено' },
  { id: 'rejected', label: 'Отклонено' },
];

const menuItemBase =
  'inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-300 transition-colors duration-200';
const menuItemNeutral = `${menuItemBase} hover:bg-slate-800`;
const menuItemSuccess = `${menuItemBase} hover:bg-emerald-500/10 hover:text-emerald-300`;
const menuItemDanger = `${menuItemBase} hover:bg-rose-500/10 hover:text-rose-300`;

const thClass =
  'border-b border-slate-800 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500';
const tdClass = 'border-b border-slate-800/50 px-6 py-4 text-sm';

const pageBtnBase =
  'inline-flex items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-400 transition-all duration-300 hover:border-slate-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 disabled:opacity-40 disabled:cursor-not-allowed';

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

  /* Счётчики на табах считаются по всем заявкам, без учёта поиска. */
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: applications.length, pending: 0, approved: 0, rejected: 0 };
    for (const app of applications) {
      counts[app.status] += 1;
    }
    return counts;
  }, [applications]);

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Заявки на участие
          </h1>
        </div>

        <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-slate-800 bg-slate-950/60 p-1.5">
          {tabs.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => selectTab(item.id)}
              >
                {item.label}
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tabCounts[item.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full md:w-auto md:min-w-[320px] md:flex-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="applications-search">
              Поиск
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <SearchIcon size={18} />
              </span>
              <input
                id="applications-search"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-2.5 pl-10 pr-4 text-sm text-slate-200 transition placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                type="search"
                placeholder="Поиск по имени или команде..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Найдено заявок:{' '}
            <span className="font-semibold text-slate-200">{filtered.length}</span>
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800/60 bg-slate-900/80 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr>
                <th className={thClass}>Участник / Команда</th>
                <th className={thClass}>Соревнование</th>
                <th className={thClass}>Регион</th>
                <th className={thClass}>Статус</th>
                <th className={`${thClass} w-[90px] text-center`}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((app) => (
                <tr key={app.id} className="transition-colors hover:bg-slate-800/40">
                  <td className={tdClass}>
                    <span className="inline-flex items-center gap-3">
                      <Avatar name={app.participant} size={38} team={app.isTeam} />
                      <span className="font-semibold text-slate-100">{app.participant}</span>
                    </span>
                  </td>
                  <td className={tdClass}>
                    <a
                      href="#"
                      className="font-semibold text-slate-100 underline-offset-4 transition-colors hover:text-indigo-300 hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      {app.competition}
                    </a>
                  </td>
                  <td className={`${tdClass} text-slate-400`}>{app.region}</td>
                  <td className={tdClass}>
                    <StatusBadge status={app.status} />
                  </td>
                  <td className={`${tdClass} text-center`}>
                    <div className="relative flex justify-center">
                      <button
                        type="button"
                        className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-2.5 text-slate-400 transition-all duration-300 hover:border-slate-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                        aria-label={`Действия с заявкой ${app.participant}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId((prev) => (prev === app.id ? null : app.id));
                        }}
                      >
                        <DotsIcon size={19} />
                      </button>
                      {openMenuId === app.id && (
                        <div
                          className="absolute right-0 z-20 mt-2 w-64 origin-top-right rounded-2xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl shadow-black/40"
                          role="menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {app.status !== 'approved' && (
                            <button
                              type="button"
                              className={menuItemSuccess}
                              onClick={() => setStatus(app.id, 'approved')}
                            >
                              <CheckIcon size={15} />
                              Одобрить
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button
                              type="button"
                              className={menuItemDanger}
                              onClick={() => setStatus(app.id, 'rejected')}
                            >
                              <XIcon size={15} />
                              Отклонить
                            </button>
                          )}
                          {app.status !== 'pending' && (
                            <>
                              <div className="my-1 h-px bg-slate-800" />
                              <button
                                type="button"
                                className={menuItemNeutral}
                                onClick={() => setStatus(app.id, 'pending')}
                              >
                                <ClockIcon size={15} />
                                Вернуть на рассмотрение
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="px-6 py-16 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500 ring-1 ring-slate-700/50">
                        <SearchIcon size={24} />
                      </div>
                      <span className="text-sm font-semibold text-slate-300">Заявок не найдено</span>
                      <small className="mt-1 block text-xs text-slate-500">
                        Попробуйте изменить таб или поисковый запрос
                      </small>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              className={`${pageBtnBase} p-2.5`}
              disabled={safePage === 1}
              onClick={() => setPage(safePage - 1)}
              aria-label="Предыдущая страница"
            >
              <ChevronLeftIcon size={16} />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => {
              const active = n === safePage;
              return (
                <button
                  key={n}
                  type="button"
                  className={
                    active
                      ? 'inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300'
                      : `${pageBtnBase} px-3 py-2.5 text-sm font-semibold text-slate-300`
                  }
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              );
            })}
            <button
              type="button"
              className={`${pageBtnBase} p-2.5`}
              disabled={safePage === pageCount}
              onClick={() => setPage(safePage + 1)}
              aria-label="Следующая страница"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
