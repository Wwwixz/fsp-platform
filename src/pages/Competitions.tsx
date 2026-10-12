import { useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { CalendarIcon, CodeIcon, MapPinIcon, SearchIcon, UsersIcon, XIcon } from '../components/icons';
import { api } from '../api/client';
import type { CompetitionSummary } from '../api/types';

const statusClass: Record<CompetitionSummary['type'], string> = {
  Открытое: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/25',
  Региональное: 'bg-violet-500/10 text-violet-300 ring-violet-500/25',
  Федеральное: 'bg-indigo-500/10 text-indigo-300 ring-indigo-500/25',
};

const tabs = [
  { id: 'all', label: 'Все' },
  { id: 'active', label: 'Активные' },
  { id: 'past', label: 'Прошедшие' },
] as const;

type TabId = (typeof tabs)[number]['id'];

const Competitions: FC = () => {
  const [competitions, setCompetitions] = useState<CompetitionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [query, setQuery] = useState('');
  const [discipline, setDiscipline] = useState('all');
  const [type, setType] = useState('all');

  useEffect(() => {
    api
      .get<CompetitionSummary[]>('/competitions')
      .then(setCompetitions)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const disciplines = useMemo(
    () => [...new Set(competitions.map((c) => c.discipline))],
    [competitions],
  );

  const visible = competitions.filter((comp) => {
    if (activeTab !== 'all' && comp.period !== activeTab) return false;
    if (type !== 'all' && comp.type !== type) return false;
    if (discipline !== 'all' && comp.discipline !== discipline) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      comp.title.toLowerCase().includes(q) ||
      comp.location.toLowerCase().includes(q) ||
      comp.discipline.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased selection:bg-indigo-500/30">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[128px]" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-purple-600/15 blur-[128px]" />
      </div>

      <PublicHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
        {/* Заголовок и поиск */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Соревнования
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Выбирай лучшие турниры и прокачивай свой рейтинг
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <SearchIcon
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию или городу..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-3 pl-11 pr-10 text-sm text-slate-200 transition placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Очистить поиск"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
              >
                <XIcon size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Табы и фильтры */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-slate-800 bg-slate-950/60 p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-slate-800" aria-hidden />

          <select
            aria-label="Дисциплина"
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            className="appearance-none rounded-xl border border-slate-800 bg-slate-900/70 py-2.5 pl-4 pr-10 text-sm font-medium text-slate-300 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Все дисциплины</option>
            {disciplines.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            aria-label="Статус"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="appearance-none rounded-xl border border-slate-800 bg-slate-900/70 py-2.5 pl-4 pr-10 text-sm font-medium text-slate-300 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Любой статус</option>
            <option>Федеральное</option>
            <option>Региональное</option>
            <option>Открытое</option>
          </select>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 px-6 py-16 text-center text-sm font-semibold text-slate-400">
            Загрузка соревнований…
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((comp) => (
              <article
                key={comp.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${statusClass[comp.type]}`}
                    >
                      {comp.type}
                    </span>
                    <span className="rounded-xl bg-slate-800/60 p-2 text-slate-500 transition-all duration-300 group-hover:bg-indigo-500/10 group-hover:text-indigo-300">
                      <CodeIcon size={17} />
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold leading-snug text-slate-100 transition-colors duration-300 group-hover:text-indigo-300">
                    {comp.title}
                  </h3>

                  <span className="mt-3 inline-flex rounded-lg bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/20">
                    {comp.discipline}
                  </span>

                  <div className="mt-5 space-y-3 border-t border-slate-800 pt-5 text-sm text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800/60 text-indigo-400">
                        <CalendarIcon size={14} />
                      </span>
                      <span className="font-medium">{comp.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800/60 text-indigo-400">
                        <MapPinIcon size={14} />
                      </span>
                      <span className="font-medium">{comp.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800/60 text-indigo-400">
                        <UsersIcon size={14} />
                      </span>
                      <span className="font-medium">{comp.participants} участников</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/competition/${comp.id}`}
                  className="mt-6 w-full rounded-xl bg-slate-800/80 py-3 text-center text-sm font-semibold text-slate-200 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                >
                  Участвовать
                </Link>
              </article>
            ))}

            {visible.length === 0 && (
              <div className="col-span-full rounded-3xl border border-slate-800/60 bg-slate-900/80 px-6 py-16 text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500 ring-1 ring-slate-700/50">
                  <SearchIcon size={24} />
                </span>
                <p className="text-sm font-semibold text-slate-300">Ничего не найдено</p>
                <p className="mt-1 text-xs text-slate-500">Попробуйте изменить запрос или фильтры</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Competitions;
