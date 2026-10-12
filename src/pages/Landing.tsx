import type { FC } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import {
  AwardIcon,
  CalendarIcon,
  ChartIcon,
  ClipboardIcon,
  CodeIcon,
  MapPinIcon,
  SearchIcon,
  TrophyIcon,
  UsersIcon,
} from '../components/icons';

interface Feature {
  icon: typeof AwardIcon;
  title: string;
  text: string;
}

const features: Feature[] = [
  { icon: CodeIcon, title: '5 дисциплин', text: 'Разные направления спортивного программирования' },
  { icon: ClipboardIcon, title: 'Удобная регистрация', text: 'Быстрый и простой процесс участия' },
  { icon: UsersIcon, title: 'Личный кабинет', text: 'Отслеживайте заявки, результаты и достижения' },
  { icon: ChartIcon, title: 'Рейтинги и статистика', text: 'Следите за прогрессом и достижениями' },
];

interface Upcoming {
  id: number;
  status: string;
  statusClass: string;
  title: string;
  date: string;
  location: string;
  participants: string;
}

const upcoming: Upcoming[] = [
  {
    id: 1,
    status: 'Открытое',
    statusClass: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/25',
    title: 'Кубок Сибири по алгоритмическому программированию',
    date: '20-22 мая 2025',
    location: 'Новосибирская область',
    participants: '124 участника',
  },
  {
    id: 2,
    status: 'Региональное',
    statusClass: 'bg-violet-500/10 text-violet-300 ring-violet-500/25',
    title: 'Чемпионат России по информационной безопасности',
    date: '1-5 июня 2025',
    location: 'Москва',
    participants: '86 участников',
  },
  {
    id: 3,
    status: 'Федеральное',
    statusClass: 'bg-indigo-500/10 text-indigo-300 ring-indigo-500/25',
    title: 'Всероссийские соревнования по спортивному программированию',
    date: '13-14 июля 2025',
    location: 'Казань',
    participants: '348 участников',
  },
  {
    id: 4,
    status: 'Открытое',
    statusClass: 'bg-amber-500/10 text-amber-300 ring-amber-500/25',
    title: 'Кубок Арктики по программированию роботов',
    date: '5-8 августа 2025',
    location: 'Санкт-Петербург',
    participants: '67 участников',
  },
];

const Landing: FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased selection:bg-indigo-500/30">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[128px]" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-purple-600/15 blur-[128px]" />
      </div>

      <PublicHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 space-y-16">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] border border-slate-800/60 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm md:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-600/25 blur-[100px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-purple-600/20 blur-[100px]"
          />

          <div className="relative z-10 flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/25">
                <ZapDot />
                Сезон 2025 открыт
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                Всероссийская Федерация{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  спортивного программирования
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                Платформа для проведения соревнований, регистрации участников и развития
                спортивного программирования в России.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/competitions"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
                >
                  <SearchIcon size={17} />
                  Перейти к соревнованиям
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-slate-300 transition-all duration-300 ease-in-out hover:border-slate-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                >
                  Подробнее
                </Link>
              </div>
            </div>

            {/* Иллюстрация: терминал */}
            <div className="w-full lg:w-1/2">
              <div className="ml-auto w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-2xl shadow-black/40 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="space-y-1.5 overflow-hidden rounded-2xl bg-slate-900/60 p-5 font-mono text-xs sm:text-sm">
                  <p className="text-slate-500">// Sport Programming Platform</p>
                  <p className="text-indigo-400">
                    function <span className="text-amber-300">solve</span>() {'{'}
                  </p>
                  <p className="pl-4 text-slate-200">const rating = calculateRating();</p>
                  <p className="pl-4 text-violet-400">
                    return <span className="text-emerald-300">"Victory!"</span>;
                  </p>
                  <p className="text-indigo-400">{'}'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ПРЕИМУЩЕСТВА */}
        <section>
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Всё для сильнейших программистов
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Инструменты платформы закрывают весь путь от регистрации до подиума.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-slate-700/80 hover:shadow-indigo-500/5"
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 text-indigo-300 ring-1 ring-indigo-500/25 transition-transform duration-300 ease-in-out group-hover:scale-105">
                  <feature.icon size={21} />
                </div>
                <h3 className="text-base font-bold text-slate-100">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* БЛИЖАЙШИЕ СОРЕВНОВАНИЯ */}
        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ближайшие соревнования
              </h2>
              <p className="mt-2 text-sm text-slate-400">Успей подать заявку — места ограничены.</p>
            </div>
            <Link
              to="/competitions"
              className="text-sm font-semibold text-indigo-400 transition-colors duration-300 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
            >
              Все соревнования →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((comp) => (
              <div
                key={comp.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-800/60 bg-slate-900/80 p-5 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${comp.statusClass}`}
                  >
                    {comp.status}
                  </span>
                  <h3 className="mt-4 text-sm font-bold leading-snug text-slate-100">{comp.title}</h3>
                  <div className="mt-4 space-y-2.5 border-t border-slate-800 pt-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2.5">
                      <CalendarIcon size={14} className="shrink-0 text-indigo-400" />
                      <span>{comp.date}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPinIcon size={14} className="shrink-0 text-indigo-400" />
                      <span>{comp.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <UsersIcon size={14} className="shrink-0 text-indigo-400" />
                      <span>{comp.participants}</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/competition/${comp.id}`}
                  className="mt-5 w-full rounded-xl bg-slate-800/80 py-2.5 text-center text-sm font-semibold text-slate-200 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                >
                  Подробнее
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA БАННЕР */}
        <section className="relative overflow-hidden rounded-[32px] border border-indigo-500/30 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 shadow-2xl shadow-indigo-900/40 md:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-[80px]"
          />
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm">
                <TrophyIcon size={26} />
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                  Стань частью сообщества сильнейших программистов России!
                </h3>
                <p className="mt-1 text-sm text-white/75">
                  Участвуй в соревнованиях, развивайся и достигай новых высот.
                </p>
              </div>
            </div>
            <Link
              to="/cabinet"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg shadow-black/20 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 active:scale-[0.98]"
            >
              Узнать больше
              <ChevronArrow />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row">
          <p className="text-xs text-slate-500">
            © 2026 Всероссийская Федерация спортивного программирования
          </p>
          <div className="flex gap-6">
            {['VK', 'TG', 'YT'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs font-semibold text-slate-500 transition-colors duration-300 hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

const ZapDot = () => <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />;
const ChevronArrow = () => <span aria-hidden>→</span>;

export default Landing;
