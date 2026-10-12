import type { FC } from 'react';
import { Link } from 'react-router-dom';
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

interface ScheduleItem {
  time: string;
  event: string;
}

const schedule: ScheduleItem[] = [
  { time: '20 мая, 10:00', event: 'Открытие и пробный тур' },
  { time: '21 мая, 11:00', event: 'Основной тур соревнований' },
  { time: '22 мая, 14:00', event: 'Награждение и закрытие' },
];

interface MetaItem {
  icon: typeof CalendarIcon;
  label: string;
  value: string;
}

const meta: MetaItem[] = [
  { icon: CalendarIcon, label: 'Дата проведения', value: '20-22 мая 2025' },
  { icon: MapPinIcon, label: 'Место', value: 'Новосибирск' },
  { icon: UsersIcon, label: 'Участников', value: '124 / 200' },
  { icon: TrophyIcon, label: 'Призовой фонд', value: '500 000 ₽' },
];

const CompetitionDetails: FC = () => {
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
          <span className="text-slate-300">Кубок Сибири</span>
        </nav>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] border border-slate-800/60 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm md:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-[90px]"
          />
          <div className="relative z-10">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/25">
                Открытое
              </span>
              <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3.5 py-1.5 text-[11px] font-semibold text-indigo-300 ring-1 ring-indigo-500/25">
                Алгоритмическое программирование
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Кубок Сибири по алгоритмическому программированию
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

        {/* КОНТЕНТ */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold tracking-tight text-white">Описание</h2>
              <p className="mt-4 leading-relaxed text-slate-400">
                Кубок Сибири — это крупнейшее соревнование по алгоритмическому программированию в
                восточной части России. Участникам предстоит решить 12 сложных задач за 5 часов.
                Соревнование проводится по правилам ICPC.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-bold tracking-tight text-white">Расписание</h2>
              <div className="mt-5 space-y-3">
                {schedule.map((item) => (
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
          </div>

          {/* Сайдбар */}
          <div className="space-y-6">
            <div className="sticky top-28 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-7 shadow-2xl shadow-indigo-900/40">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm">
                <AwardIcon size={14} />
                Регистрация открыта
              </div>
              <p className="mb-6 text-sm leading-relaxed text-white/75">
                Успей подать заявку до 15 мая. Требуется команда от 1 до 3 человек.
              </p>
              <button
                type="button"
                className="mb-3 w-full rounded-xl bg-white py-3.5 text-sm font-bold text-indigo-700 shadow-lg shadow-black/20 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 active:scale-[0.98]"
              >
                Подать заявку
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 py-3.5 text-sm font-bold text-white transition-all duration-300 ease-in-out hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <ClipboardIcon size={16} />
                Регламент (PDF)
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Организатор
              </h4>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/25">
                  <BuildingIcon size={20} />
                </span>
                <div className="text-sm font-bold leading-tight text-slate-200">
                  ФСП Новосибирской области
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompetitionDetails;
