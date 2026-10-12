import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import PublicHeader from '../components/PublicHeader';
import { Avatar } from '../components/Avatar';
import { ChevronDownIcon, PlusIcon } from '../components/icons';
import { api } from '../api/client';
import type { TeamDetails, TeamTop, TeamsResponse } from '../api/types';
import { useAuth } from '../auth/AuthContext';

const placeClass = (index: number) =>
  index === 0
    ? 'inline-flex items-center justify-center rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-400/30'
    : index === 1
      ? 'inline-flex items-center justify-center rounded-full bg-slate-300/10 px-2.5 py-1 text-xs font-bold text-slate-200 ring-1 ring-slate-300/30'
      : index === 2
        ? 'inline-flex items-center justify-center rounded-full bg-orange-400/10 px-2.5 py-1 text-xs font-bold text-orange-300 ring-1 ring-orange-400/30'
        : 'inline-flex items-center justify-center rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-bold text-slate-300 ring-1 ring-slate-500/25';

function Teams() {
  const { user } = useAuth();
  const [data, setData] = useState<TeamsResponse | null>(null);
  const [competition, setCompetition] = useState('all');
  const [top, setTop] = useState<TeamTop[]>([]);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', recruiting: true });
  const [modalError, setModalError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<TeamsResponse>('/teams')
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    if (competition === 'all') {
      setTop([]);
      return;
    }
    api
      .get<TeamTop[]>(`/teams/top?competitionId=${competition}`)
      .then(setTop)
      .catch((e: Error) => setError(e.message));
  }, [competition]);

  const isOverall = competition === 'all';
  const subtitle = isOverall
    ? 'Топ команд России в спортивном программировании'
    : `Топ команд — «${data?.competitions.find((c) => String(c.id) === competition)?.title ?? ''}»`;

  const createTeam = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    const competitionId = Number(competition);
    if (Number.isNaN(competitionId)) {
      setModalError('Выберите соревнование, для которого создаётся команда');
      return;
    }
    setBusy(true);
    setModalError('');
    try {
      const created: TeamDetails = await api.post('/teams', {
        name: form.name.trim(),
        competitionId,
        contact: form.contact.trim() || undefined,
        recruiting: form.recruiting,
      });
      setModalOpen(false);
      setForm({ name: '', contact: '', recruiting: true });
      setNotice(
        `Команда «${created.name}» создана. Найдите её на странице соревнования «${created.competition}».`,
      );
    } catch (err) {
      setModalError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const [notice, setNotice] = useState('');

  const stats = useMemo(
    () => [
      { label: 'Всего команд', value: data?.stats.total ?? 0, delta: `${data?.stats.newThisWeek ?? 0} новых за неделю`, tone: 'green' },
      { label: 'Новых за неделю', value: data?.stats.newThisWeek ?? 0, delta: 'за 7 дней', tone: 'green' },
      { label: 'Турниров проведено', value: data?.stats.tournaments ?? 0, delta: 'завершённых', tone: 'neutral' },
    ],
    [data],
  );

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
          {user?.role === 'athlete' && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
            >
              <PlusIcon size={18} />
              Создать команду
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-300">
            {error}
          </div>
        )}
        {notice && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300">
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-extrabold tracking-tight text-white">{stat.value}</span>
                <span
                  className={
                    stat.tone === 'green'
                      ? 'inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/25'
                      : 'inline-flex rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-semibold text-slate-300 ring-1 ring-slate-500/25'
                  }
                >
                  {stat.delta}
                </span>
              </div>
            </div>
          ))}
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
                {data?.competitions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
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
              : `Командный зачёт · ${top.length} команд`}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
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
                  ? data?.overall.map((team, index) => (
                      <tr key={team.id} className="hover:bg-slate-800/40 transition-colors">
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
                  : top.map((row, index) => (
                      <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
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
                {((isOverall && data?.overall.length === 0) || (!isOverall && top.length === 0)) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-sm font-semibold text-slate-400">
                      {isOverall ? 'Команд пока нет' : 'Итоги этого соревнования ещё не опубликованы'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Модалка создания команды */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModalOpen(false)}
        >
          <form
            className="w-full max-w-md space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onSubmit={createTeam}
          >
            <h3 className="text-lg font-bold text-white">Создать команду</h3>
            <p className="text-xs text-slate-500">
              Выберите соревнование, укажите название. Вы станете капитаном и первым участником.
            </p>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="team-comp">
                Соревнование
              </label>
              <select
                id="team-comp"
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="all">Выберите соревнование…</option>
                {data?.competitions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="team-name">
                Название
              </label>
              <input
                id="team-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Например, Binary Stars"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="team-contact">
                Контакт капитана (необязательно)
              </label>
              <input
                id="team-contact"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="telegram: @captain"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2.5 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.recruiting}
                onChange={(e) => setForm({ ...form, recruiting: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-500"
              />
              Статус «Требуются спортсмены»
            </label>
            {modalError && (
              <p className="text-xs font-semibold text-rose-400">{modalError}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={busy}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? 'Создаём…' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Teams;
