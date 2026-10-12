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
  index === 0
    ? 'inline-flex items-center justify-center rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-400/30'
    : index === 1
      ? 'inline-flex items-center justify-center rounded-full bg-slate-300/10 px-2.5 py-1 text-xs font-bold text-slate-200 ring-1 ring-slate-300/30'
      : index === 2
        ? 'inline-flex items-center justify-center rounded-full bg-orange-400/10 px-2.5 py-1 text-xs font-bold text-orange-300 ring-1 ring-orange-400/30'
        : 'inline-flex items-center justify-center rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-bold text-slate-300 ring-1 ring-slate-500/25';

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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased selection:bg-indigo-500/30">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[128px]" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-purple-600/15 blur-[128px]" />
      </div>

      <PublicHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Команды</h1>
            <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] disabled:opacity-50"
          >
            <PlusIcon size={18} />
            Создать команду
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-slate-700/80 hover:shadow-indigo-500/5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Всего команд
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-white">1 240</span>
              <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/25">
                +42 за неделю
              </span>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-slate-700/80 hover:shadow-indigo-500/5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Новых за неделю
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-white">42</span>
              <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/25">
                +15%
              </span>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-slate-700/80 hover:shadow-indigo-500/5">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Турниров проведено
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-white">856</span>
              <span className="inline-flex rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-semibold text-slate-300 ring-1 ring-slate-500/25">
                за сезон
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-xs">
            <label
              className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-500"
              htmlFor="teams-competition"
            >
              Соревнование
            </label>
            <div className="relative">
              <select
                id="teams-competition"
                className="appearance-none w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 pr-10 text-sm text-slate-200 transition placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                <ChevronDownIcon size={16} />
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-slate-400 sm:pb-2.5">
            {isOverall
              ? 'Рейтинг по всем соревнованиям сезона'
              : `Командный зачёт · ${competitionTop.length} команд`}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-slate-700/80 hover:shadow-indigo-500/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr>
                  <th className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800 px-6 py-4 text-left">
                    Место
                  </th>
                  <th className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800 px-6 py-4 text-left">
                    Название
                  </th>
                  <th className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800 px-6 py-4 text-left">
                    {isOverall ? 'Рейтинг' : 'Баллы'}
                  </th>
                  <th className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800 px-6 py-4 text-left">
                    Участников
                  </th>
                  {isOverall && (
                    <th className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800 px-6 py-4 text-left">
                      Побед
                    </th>
                  )}
                  <th className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800 px-6 py-4 text-left">
                    Регион
                  </th>
                </tr>
              </thead>
              <tbody>
                {isOverall
                  ? [...overallTeams]
                      .sort((a, b) => b.rating - a.rating)
                      .map((team, index) => (
                        <tr
                          key={team.name}
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="px-6 py-4 border-b border-slate-800/50 text-sm">
                            <span className={placeClass(index)}>{index + 1}</span>
                          </td>
                          <td className="px-6 py-4 border-b border-slate-800/50 text-sm">
                            <span className="inline-flex items-center gap-3">
                              <Avatar name={team.name} size={40} team />
                              <span className="font-semibold text-white">{team.name}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 border-b border-slate-800/50 text-sm font-semibold text-white">
                            {team.rating.toLocaleString('ru-RU')}
                          </td>
                          <td className="px-6 py-4 border-b border-slate-800/50 text-sm text-slate-400">
                            {team.members}
                          </td>
                          <td className="px-6 py-4 border-b border-slate-800/50 text-sm">
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/25">
                              +{team.wins}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-b border-slate-800/50 text-sm text-slate-400">
                            {team.region}
                          </td>
                        </tr>
                      ))
                  : competitionTop.map((row, index) => (
                      <tr
                        key={row.team}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-6 py-4 border-b border-slate-800/50 text-sm">
                          <span className={placeClass(index)}>{index + 1}</span>
                        </td>
                        <td className="px-6 py-4 border-b border-slate-800/50 text-sm">
                          <span className="inline-flex items-center gap-3">
                            <Avatar name={row.team} size={40} team />
                            <span className="font-semibold text-white">{row.team}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b border-slate-800/50 text-sm font-semibold text-white">
                          {row.points.toLocaleString('ru-RU')}
                        </td>
                        <td className="px-6 py-4 border-b border-slate-800/50 text-sm text-slate-400">
                          {row.members}
                        </td>
                        <td className="px-6 py-4 border-b border-slate-800/50 text-sm text-slate-400">
                          {row.region}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Teams;
