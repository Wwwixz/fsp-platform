import { useMemo, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { mockResults, resultDisciplines, resultSeasons } from '../data/mock';
import { ChevronDownIcon, SearchIcon } from '../components/icons';

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
      <h1 className="page-title">Результаты</h1>

      <div className="filters-row">
        <div className="field">
          <label className="field-label" htmlFor="filter-season">
            Сезон
          </label>
          <div className="input-wrap">
            <select
              id="filter-season"
              className="input"
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
            <span className="select-chevron">
              <ChevronDownIcon size={16} />
            </span>
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="filter-discipline">
            Дисциплина
          </label>
          <div className="input-wrap">
            <select
              id="filter-discipline"
              className="input"
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
            <span className="select-chevron">
              <ChevronDownIcon size={16} />
            </span>
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="filter-type">
            Тип
          </label>
          <div className="input-wrap">
            <select
              id="filter-type"
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">Все типы</option>
              <option value="individual">Личные</option>
              <option value="team">Командные</option>
            </select>
            <span className="select-chevron">
              <ChevronDownIcon size={16} />
            </span>
          </div>
        </div>

        <div className="field filters-search">
          <label className="field-label" htmlFor="filter-search" style={{ visibility: 'hidden' }}>
            Поиск
          </label>
          <div className="input-wrap">
            <span className="input-leading">
              <SearchIcon size={17} />
            </span>
            <input
              id="filter-search"
              className="input input-has-leading"
              type="search"
              placeholder="Поиск по названию..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card table-card">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 130 }}>Дата</th>
              <th>Название</th>
              <th>Дисциплина</th>
              <th className="cell-center" style={{ width: 90 }}>
                Место
              </th>
              <th className="cell-center" style={{ width: 100 }}>
                Баллы
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="table-muted">{row.date}</td>
                <td className="table-strong">{row.title}</td>
                <td className="table-muted">{row.discipline}</td>
                <td className="cell-center table-strong">{row.place}</td>
                <td className="cell-center">{row.points}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="table-empty" colSpan={5}>
                  <div className="empty-state">
                    <SearchIcon size={24} />
                    <span>По заданным фильтрам ничего не найдено</span>
                    <small>Попробуйте изменить сезон, дисциплину или запрос</small>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
