import { useState } from 'react';
import PublicHeader from '../components/PublicHeader';
import { Avatar } from '../components/Avatar';
import { ChevronDownIcon, PlusIcon } from '../components/icons';
import { teamCompetitionTops } from '../data/mock';

interface Team {
  name: string;
  members: number;
  rating: number;
  wins: number;
  region: string;
}

const overallTeams: Team[] = [
  { name: 'Siberian Bears', members: 3, rating: 2840, wins: 12, region: 'Новосибирск' },
  { name: 'Moscow JS Wizards', members: 3, rating: 2750, wins: 10, region: 'Москва' },
  { name: 'Kazan Cyber Stars', members: 2, rating: 2600, wins: 8, region: 'Казань' },
  { name: 'UrFU Delta', members: 3, rating: 2910, wins: 15, region: 'Екатеринбург' },
  { name: 'SPb ITMO 1', members: 3, rating: 3100, wins: 22, region: 'Санкт-Петербург' },
];

const placeClass = (index: number) =>
  index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'plain';

function Teams() {
  const [competition, setCompetition] = useState('all');

  const isOverall = competition === 'all';
  const competitionTop = isOverall
    ? []
    : [...teamCompetitionTops[competition]].sort((a, b) => b.points - a.points);

  const subtitle = isOverall
    ? 'Топ команд России в спортивном программировании'
    : `Топ команд — «${competition}»`;

  return (
    <div className="public-page">
      <PublicHeader />

      <main className="page-container">
        <div className="page-head">
          <div>
            <h1 className="page-title">Команды</h1>
            <p className="page-subtitle">{subtitle}</p>
          </div>
          <button type="button" className="btn btn-primary">
            <PlusIcon size={18} />
            Создать команду
          </button>
        </div>

        <div className="stats-grid stats-grid-3">
          <div className="card stat-card">
            <span className="stat-label">Всего команд</span>
            <div className="stat-bottom">
              <span className="stat-value">1 240</span>
              <span className="stat-chip green">+42 за неделю</span>
            </div>
          </div>
          <div className="card stat-card">
            <span className="stat-label">Новых за неделю</span>
            <div className="stat-bottom">
              <span className="stat-value">42</span>
              <span className="stat-chip green">+15%</span>
            </div>
          </div>
          <div className="card stat-card">
            <span className="stat-label">Турниров проведено</span>
            <div className="stat-bottom">
              <span className="stat-value">856</span>
              <span className="stat-chip muted">за сезон</span>
            </div>
          </div>
        </div>

        <div className="filters-row">
          <div className="field">
            <label className="field-label" htmlFor="teams-competition">
              Соревнование
            </label>
            <div className="input-wrap">
              <select
                id="teams-competition"
                className="input"
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
              >
                <option value="all">Общий рейтинг</option>
                {Object.keys(teamCompetitionTops).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <span className="select-chevron">
                <ChevronDownIcon size={16} />
              </span>
            </div>
          </div>
          <span className="filters-note">
            {isOverall
              ? 'Рейтинг по всем соревнованиям сезона'
              : `Командный зачёт · ${competitionTop.length} команд`}
          </span>
        </div>

        <div className="card table-card">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Место</th>
                <th>Название</th>
                <th className="cell-center" style={{ width: 120 }}>
                  {isOverall ? 'Рейтинг' : 'Баллы'}
                </th>
                <th className="cell-center" style={{ width: 130 }}>
                  Участников
                </th>
                {isOverall && (
                  <th className="cell-center" style={{ width: 110 }}>
                    Побед
                  </th>
                )}
                <th style={{ width: 190 }}>Регион</th>
              </tr>
            </thead>
            <tbody>
              {isOverall
                ? [...overallTeams]
                    .sort((a, b) => b.rating - a.rating)
                    .map((team, index) => (
                      <tr key={team.name}>
                        <td>
                          <span className={`place-chip ${placeClass(index)}`}>{index + 1}</span>
                        </td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                            <Avatar name={team.name} size={40} team />
                            <span className="table-strong">{team.name}</span>
                          </span>
                        </td>
                        <td className="cell-center table-strong">
                          {team.rating.toLocaleString('ru-RU')}
                        </td>
                        <td className="cell-center table-muted">{team.members}</td>
                        <td className="cell-center">
                          <span className="badge green">+{team.wins}</span>
                        </td>
                        <td className="table-muted">{team.region}</td>
                      </tr>
                    ))
                : competitionTop.map((row, index) => (
                    <tr key={row.team}>
                      <td>
                        <span className={`place-chip ${placeClass(index)}`}>{index + 1}</span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                          <Avatar name={row.team} size={40} team />
                          <span className="table-strong">{row.team}</span>
                        </span>
                      </td>
                      <td className="cell-center table-strong">
                        {row.points.toLocaleString('ru-RU')}
                      </td>
                      <td className="cell-center table-muted">{row.members}</td>
                      <td className="table-muted">{row.region}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Teams;
