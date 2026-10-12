import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import {
  AwardIcon,
  BuildingIcon,
  CalendarIcon,
  ClipboardIcon,
  ClockIcon,
  MapPinIcon,
  TrophyIcon,
  UsersIcon,
} from '../components/icons';
import { api } from '../api/client';
import type { CompetitionDetails as Details } from '../api/types';
import { useAuth } from '../auth/AuthContext';

const CompetitionDetails: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [comp, setComp] = useState<Details | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<Details>(`/competitions/${id}`)
      .then(setComp)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  const apply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (user.role === 'organizer') {
        navigate('/teams');
        return;
      }
      await api.post('/applications', { competitionId: Number(id) });
      setNotice('Заявка отправлена! Её статус появится в личном кабинете.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const statusTone =
    comp?.type === 'Открытое'
      ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/25'
      : comp?.type === 'Региональное'
        ? 'bg-violet-500/10 text-violet-300 ring-violet-500/25'
        : 'bg-indigo-500/10 text-indigo-300 ring-indigo-500/25';

  if (error && !comp) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased">
        <PublicHeader />
        <main className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="text-lg font-bold text-slate-200">{error}</p>
          <Link to="/competitions" className="mt-4 inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300">
            Вернуться к списку соревнований
          </Link>
        </main>
      </div>
    );
  }

  if (!comp) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased">
        <PublicHeader />
        <main className="mx-auto max-w-5xl px-4 py-16 text-center text-sm font-semibold text-slate-400">
          Загрузка…
        </main>
      </div>
    );
  }

  const meta = [
    { icon: CalendarIcon, label: 'Дата проведения', value: comp.date },
    { icon: MapPinIcon, label: 'Место', value: comp.location },
    {
      icon: UsersIcon,
      label: 'Участников',
      value: `${comp.participants} / ${comp.maxParticipants}`,
    },
    { icon: TrophyIcon, label: 'Призовой фонд', value: comp.prizeFund ?? 'Не указан' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased selection:bg-indigo-500/30">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[128px]" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-purple-600/15 blur-[128px]" />
      </div>

      <PublicHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-10">
        {/* Breadcrumbs */}
        <nav aria-label="Хлебные крошки" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          <Link
            to="/competitions"
            className="text-slate-500 transition-colors duration-300 hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
          >
            Соревнования
          </Link>
          <span className="text-slate-700">/</span>
          <span className="max-w-[280px] truncate text-slate-300">{comp.title}</span>
        </nav>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] border border-slate-800/60 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm md:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-[90px]"
          />
          <div className="relative z-10">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-semibold ring-1 ${statusTone}`}>
                {comp.type}
              </span>
              <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3.5 py-1.5 text-[11px] font-semibold text-indigo-300 ring-1 ring-indigo-500/25">
                {comp.discipline}
              </span>
              {comp.regions.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-violet-500/10 px-3.5 py-1.5 text-[11px] font-semibold text-violet-300 ring-1 ring-violet-500/25">
                  {comp.regions.join(', ')}
                </span>
              )}
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {comp.title}
            </h1>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-800/60 md:grid-cols-4">
              {meta.map((item) => (
                <div key={item.label} className="bg-slate-900/90 p-5">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    <item.icon size={13} className="text-indigo-400" />
                    {item.label}
                  </div>
                  <div className="mt-2 text-base font-extrabold tracking-tight text-white">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {(error || notice) && (
          <div
            className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${
              error
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            }`}
          >
            {error || notice}
          </div>
        )}

        {/* КОНТЕНТ */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold tracking-tight text-white">Описание</h2>
              <p className="mt-4 leading-relaxed text-slate-400">{comp.description}</p>
            </section>

            {comp.schedule.length > 0 && (
              <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-8">
                <h2 className="text-xl font-bold tracking-tight text-white">Расписание</h2>
                <div className="mt-5 space-y-3">
                  {comp.schedule.map((item) => (
                    <div
                      key={item.time}
                      className="flex flex-col gap-1.5 rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4 transition-all duration-300 ease-in-out hover:border-slate-700/80 sm:flex-row sm:items-center sm:gap-6"
                    >
                      <div className="flex w-full items-center gap-2 text-sm font-bold text-indigo-300 sm:w-40 sm:shrink-0">
                        <ClockIcon size={15} className="shrink-0 text-indigo-400" />
                        {item.time}
                      </div>
                      <div className="font-semibold text-slate-200">{item.event}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {comp.teams.length > 0 && (
              <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-8">
                <h2 className="text-xl font-bold tracking-tight text-white">Команды</h2>
                <div className="mt-5 space-y-3">
                  {comp.teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-100">{team.name}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          Капитан: {team.captain} · {team.region}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-300 ring-1 ring-indigo-500/20">
                          {team.members} участн.
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${
                            team.status === 'Сформирована'
                              ? 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/25'
                              : 'bg-amber-500/10 text-amber-300 ring-amber-500/25'
                          }`}
                        >
                          {team.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {comp.results.length > 0 && (
              <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-8">
                <h2 className="text-xl font-bold tracking-tight text-white">Итоги</h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[420px] text-sm">
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="border-b border-slate-800 px-4 py-3">Место</th>
                        <th className="border-b border-slate-800 px-4 py-3">Участник</th>
                        <th className="border-b border-slate-800 px-4 py-3 text-right">Баллы</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comp.results.map((row) => (
                        <tr key={`${row.place}-${row.name}`} className="hover:bg-slate-800/40">
                          <td className="border-b border-slate-800/50 px-4 py-3 font-bold text-slate-100">{row.place}</td>
                          <td className="border-b border-slate-800/50 px-4 py-3 text-slate-300">
                            {row.name}
                            {row.isTeam && (
                              <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                                команда
                              </span>
                            )}
                          </td>
                          <td className="border-b border-slate-800/50 px-4 py-3 text-right font-semibold text-slate-100">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          {/* Сайдбар */}
          <div className="space-y-6">
            <div className="sticky top-28 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-7 shadow-2xl shadow-indigo-900/40">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm">
                <AwardIcon size={14} />
                {comp.completed
                  ? 'Соревнование завершено'
                  : comp.registrationOpen
                    ? 'Регистрация открыта'
                    : 'Регистрация закрыта'}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-white/75">
                {comp.individualFormat
                  ? 'Индивидуальный зачёт: заявку подаёт каждый спортсмен отдельно.'
                  : 'Командный зачёт: создайте команду или найдите свободные составы.'}
              </p>
              {!comp.completed && comp.registrationOpen && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={apply}
                  className="mb-3 w-full rounded-xl bg-white py-3.5 text-sm font-bold text-indigo-700 shadow-lg shadow-black/20 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 active:scale-[0.98] disabled:opacity-60"
                >
                  {busy ? 'Отправляем…' : 'Подать заявку'}
                </button>
              )}
              <Link
                to="/teams"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 py-3.5 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <ClipboardIcon size={16} />
                Список команд
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Организатор
              </h4>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/25">
                  <BuildingIcon size={20} />
                </span>
                <div className="text-sm font-bold leading-tight text-slate-200">{comp.organizer}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompetitionDetails;
