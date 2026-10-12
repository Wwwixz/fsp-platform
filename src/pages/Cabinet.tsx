import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/client';
import type { CabinetResponse } from '../api/types';
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

const eventStatusTone = {
  approved:
    'inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/25',
  pending:
    'inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300 ring-1 ring-amber-500/25',
} as const;

const eventStatusLabel = { approved: 'Подтверждено', pending: 'На рассмотрении' } as const;

function Cabinet() {
  const { user } = useAuth();
  const [data, setData] = useState<CabinetResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<CabinetResponse>('/cabinet')
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, []);

  const displayName = data?.name ?? user?.name ?? 'Спортсмен';
  const firstName = displayName.split(' ')[0];

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
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Личный кабинет
            </h1>
            <p className="mt-2 text-sm text-slate-400">Рады видеть тебя снова, {firstName}!</p>
          </div>
          <Link
            to="/competitions"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
          >
            <SearchIcon size={17} />
            Найти соревнование
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-300">
            {error}
          </div>
        )}

        {/* Профиль и ключевые показатели */}
        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out hover:border-slate-700/80 hover:shadow-indigo-500/5">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar name={displayName} size={72} />
            <div>
              <div className="text-xl font-bold tracking-tight text-white">{displayName}</div>
              <div className="mt-0.5 text-sm text-slate-400">{data?.email ?? user?.email}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-violet-500/10 px-3 py-1 text-[11px] font-semibold text-violet-300 ring-1 ring-violet-500/25">
                  {data?.role === 'organizer' ? 'Региональный представитель' : 'Спортсмен'}
                </span>
                {data?.region && (
                  <span className="inline-flex items-center rounded-full bg-slate-500/10 px-3 py-1 text-[11px] font-semibold text-slate-300 ring-1 ring-slate-500/25">
                    {data.region}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4 transition-all duration-300 ease-in-out hover:border-slate-700/80">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Рейтинг
              </span>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  {(data?.rating ?? 0).toLocaleString('ru-RU')}
                </span>
                <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/25">
                  подтверждён результатами
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4 transition-all duration-300 ease-in-out hover:border-slate-700/80">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Место в регионе
              </span>
              <div className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                {data?.regionPlace ?? '—'}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4 transition-all duration-300 ease-in-out hover:border-slate-700/80">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Победы
              </span>
              <div className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                {data?.wins ?? 0}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4 transition-all duration-300 ease-in-out hover:border-slate-700/80">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Успешность заявок
              </span>
              <div className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                {data?.successRate ?? '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Ближайшие события */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-100">Ближайшие события</h2>
          <Link
            to="/competitions"
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
          >
            Смотреть все
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
          <div className="divide-y divide-slate-800/60">
            {(data?.upcomingEvents ?? []).map((event) => {
              const Icon = event.discipline.includes('безопасности') ? ShieldIcon : CodeIcon;
              return (
                <div
                  className="flex flex-col gap-4 py-4 transition-all duration-300 ease-in-out first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  key={event.id}
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex shrink-0 rounded-xl bg-indigo-500/10 p-3 text-indigo-300 ring-1 ring-indigo-500/20">
                      <Icon size={22} />
                    </span>
                    <div>
                      <div className="font-semibold text-white">{event.title}</div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                          <CalendarIcon size={14} />
                          {event.date}
                        </span>
                        <span className={eventStatusTone[event.status]}>
                          {eventStatusLabel[event.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/competition/${event.id}`}
                    className="inline-flex items-center gap-1.5 self-start rounded-lg px-3 py-2 text-sm font-semibold text-indigo-400 transition-all duration-300 ease-in-out hover:bg-indigo-500/10 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 sm:self-auto"
                  >
                    Детали
                    <ChevronRightIcon size={14} />
                  </Link>
                </div>
              );
            })}
            {data && data.upcomingEvents.length === 0 && (
              <p className="py-6 text-center text-sm font-semibold text-slate-400">
                Пока нет активных заявок — найдите соревнование и подайте заявку!
              </p>
            )}
          </div>
        </div>

        {/* Прогресс сезона */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-8 shadow-xl shadow-indigo-500/20 transition-all duration-300 ease-in-out sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
            <ZapIcon size={14} />
            Сезон {new Date().getFullYear()}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Твой прогресс в сезоне
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
            Рейтинг растёт автоматически, когда организатор публикует итоги соревнований с твоим
            участием. Побед: <strong className="font-bold text-white">{data?.wins ?? 0}</strong>.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/results"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition-all duration-300 ease-in-out hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 active:scale-[0.98]"
            >
              <AwardIcon size={17} />
              История выступлений
            </Link>
            <Link
              to="/applications"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:scale-[0.98]"
            >
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
