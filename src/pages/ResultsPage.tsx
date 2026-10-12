import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { mockResults, resultDisciplines, resultSeasons } from '../data/mock';
import { ChevronDownIcon, SearchIcon } from '../components/icons';

const selectClass =
  'w-full appearance-none rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 pr-10 text-sm text-slate-200 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400';

const thClass =
  'border-b border-slate-800 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500';

const tdClass = 'border-b border-slate-800/50 px-6 py-4 text-sm';

export function ResultsPage() {
  const [season, setSeason] = useState('2025');
  const [discipline, setDiscipline] = useState('all');
  const [type, setType] = useState('all');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    return mockResults
      .filter((row) => (season === 'all' ? true : row.season === Number(season)))
      .filter((row) => (discipline === 'all' ? true : row.discipline === discipline))
      .filter((row) => (type === 'all' ? true : row.type === type))
      .filter((row) => row.title.toLowerCase().includes(query.trim().toLowerCase()));
  }, [season, discipline, type, query]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Результаты</h1>
          <p className="mt-2 text-sm text-slate-400">История твоих выступлений по сезонам</p>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[160px] flex-1">
            <label className={labelClass} htmlFor="filter-season">
              Сезон
            </label>
            <div className="relative">
              <select
                id="filter-season"
                className={selectClass}
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              >
                {resultSeasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="all">Все сезоны</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                <ChevronDownIcon size={16} />
              </span>
            </div>
          </div>

          <div className="min-w-[160px] flex-1">
            <label className={labelClass} htmlFor="filter-discipline">
              Дисциплина
            </label>
            <div className="relative">
              <select
                id="filter-discipline"
                className={selectClass}
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
              >
                <option value="all">Все дисциплины</option>
                {resultDisciplines.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                <ChevronDownIcon size={16} />
              </span>
            </div>
          </div>

          <div className="min-w-[160px] flex-1">
            <label className={labelClass} htmlFor="filter-type">
              Тип
            </label>
            <div className="relative">
              <select
                id="filter-type"
                className={selectClass}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">Все типы</option>
                <option value="individual">Личные</option>
                <option value="team">Командные</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                <ChevronDownIcon size={16} />
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto md:min-w-[240px] md:flex-1">
            <label className={`${labelClass} sr-only`} htmlFor="filter-search">
              Поиск
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <SearchIcon size={17} />
              </span>
              <input
                id="filter-search"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-2.5 pl-10 pr-4 text-sm text-slate-200 transition placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                type="search"
                placeholder="Поиск по названию..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800/60 bg-slate-900/80 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr>
                <th className={`${thClass} w-[130px]`}>Дата</th>
                <th className={thClass}>Название</th>
                <th className={thClass}>Дисциплина</th>
                <th className={`${thClass} w-[90px] text-center`}>Место</th>
                <th className={`${thClass} w-[100px] text-center`}>Баллы</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-slate-800/40">
                  <td className={`${tdClass} text-slate-400`}>{row.date}</td>
                  <td className={`${tdClass} font-semibold text-slate-100`}>{row.title}</td>
                  <td className={`${tdClass} text-slate-400`}>{row.discipline}</td>
                  <td className={`${tdClass} text-center font-semibold text-slate-100`}>{row.place}</td>
                  <td className={`${tdClass} text-center`}>{row.points}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-6 py-16 text-center" colSpan={5}>
                    <div className="px-6 py-16 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-500 ring-1 ring-slate-700/50">
                        <SearchIcon size={24} />
                      </div>
                      <span className="text-sm font-semibold text-slate-300">
                        По заданным фильтрам ничего не найдено
                      </span>
                      <small className="mt-1 block text-xs text-slate-500">
                        Попробуйте изменить сезон, дисциплину или запрос
                      </small>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
