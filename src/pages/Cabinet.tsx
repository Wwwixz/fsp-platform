import React from 'react';
import PublicHeader from '../components/PublicHeader';
import { useAuth } from '../auth/AuthContext';

const Cabinet: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.name ?? 'Спортсмен';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'СП';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* НАВИГАЦИЯ */}
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 flex flex-col gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm shadow-slate-200/50">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-blue-200">
                {initials}
              </div>
              <h2 className="text-xl font-extrabold text-blue-950 mb-1">{displayName}</h2>
              <p className="text-slate-500 text-sm mb-4 font-medium italic">{user?.email ?? '@athlete'}</p>
              <div className="w-full h-px bg-slate-100 mb-4"></div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="text-center">
                  <div className="text-blue-700 font-extrabold text-lg leading-tight">1450</div>
                  <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Рейтинг</div>
                </div>
                <div className="text-center border-l border-slate-100">
                  <div className="text-blue-700 font-extrabold text-lg leading-tight">24</div>
                  <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Место</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm shadow-slate-200/50">
            <div className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-blue-50 text-blue-800 font-bold text-sm">
                <span>🏠</span> <span>Дашборд</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition">
                <span>🏆</span> <span>Мои соревнования</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition">
                <span>👥</span> <span>Команды</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition">
                <span>📊</span> <span>Статистика</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition border-t border-slate-50 mt-2 pt-2">
                <span>⚙️</span> <span>Настройки</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col gap-8">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-950 tracking-tight">Личный кабинет</h1>
              <p className="text-slate-500 font-medium">Рады видеть тебя снова, {displayName.split(' ')[0]}!</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-2xl transition shadow-lg shadow-blue-800/20 text-sm">
                Найти соревнование
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">🟢</div>
                <div>
                  <div className="text-2xl font-black text-blue-950">12</div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-tight">Активных заявок</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">⭐</div>
                <div>
                  <div className="text-2xl font-black text-blue-950">4</div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-tight">Победы</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-inner">⚡</div>
                <div>
                  <div className="text-2xl font-black text-blue-950">98%</div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-tight">Процент успеха</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Competitions List */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-blue-950">Ближайшие события</h2>
              <button className="text-blue-700 hover:text-blue-900 font-bold text-sm">Смотреть все</button>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-50">
                {/* Competition Item 1 */}
                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-slate-50/50 transition cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">💻</div>
                    <div>
                      <h3 className="font-bold text-blue-950 text-base leading-tight">Кубок Москвы по алгоритмам</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-slate-400 font-medium">📅 25 Октября, 2025</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-xs text-emerald-600 font-bold px-2 py-0.5 bg-emerald-50 rounded-lg">Подтвержден</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl border border-blue-100 text-blue-700 font-bold text-xs hover:bg-blue-50 transition">
                    Детали
                  </button>
                </div>
                {/* Competition Item 2 */}
                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-slate-50/50 transition cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🛡️</div>
                    <div>
                      <h3 className="font-bold text-blue-950 text-base leading-tight">CTF Региональный Этап</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-slate-400 font-medium">📅 12 Ноября, 2025</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-xs text-amber-600 font-bold px-2 py-0.5 bg-amber-50 rounded-lg">На рассмотрении</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl border border-blue-100 text-blue-700 font-bold text-xs hover:bg-blue-50 transition">
                    Детали
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Results Summary Section */}
          <section className="bg-gradient-to-r from-blue-900 to-blue-950 rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-2 tracking-tight italic uppercase">Твой прогресс в сезоне</h2>
              <p className="text-blue-100/80 mb-6 font-medium max-w-lg leading-relaxed text-sm">
                В этом месяце твой рейтинг вырос на <span className="text-emerald-300 font-bold">+120 пунктов</span>. 
                Продолжай в том же духе, чтобы попасть в сборную!
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-blue-900 font-black px-6 py-3 rounded-2xl text-sm transition hover:scale-105 active:scale-95 shadow-lg shadow-white/10">
                  Анализ кода
                </button>
                <button className="bg-blue-800 text-white font-black px-6 py-3 rounded-2xl text-sm transition hover:bg-blue-700 border border-blue-700/50">
                  История игр
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-full bg-blue-800/10 skew-x-[-20deg] translate-x-20"></div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Cabinet;
