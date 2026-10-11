import React from 'react';
import PublicHeader from '../components/PublicHeader';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
      {/* НАВИГАЦИЯ */}
      <PublicHeader />

      {/* ГЛАВНЫЙ ЭКРАН (HERO) */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-blue-50/80 to-slate-100/50 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between border border-slate-100">
          <div className="max-w-xl z-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-950 tracking-tight leading-tight mb-6">
              Всероссийская Федерация спортивного программирования
            </h1>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Платформа для проведения соревнований, регистрации участников и развития спортивного программирования в России.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/competitions" className="bg-blue-800 hover:bg-blue-900 text-white font-medium px-6 py-3.5 rounded-xl transition shadow-lg shadow-blue-800/20">
                Перейти к соревнованиям
              </a>
              <a href="#" className="bg-white hover:bg-slate-50 text-blue-800 border border-blue-200 font-medium px-6 py-3.5 rounded-xl transition">
                Подробнее
              </a>
            </div>
          </div>
          {/* Иллюстрация нотбука */}
          <div className="mt-8 lg:mt-0 z-10 w-full lg:w-1/2 flex justify-end">
            <div className="bg-white/80 backdrop-blur p-4 rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg">
              <div className="bg-slate-900 rounded-xl h-64 flex flex-col p-4 text-xs font-mono text-emerald-400 overflow-hidden shadow-inner">
                <div className="flex space-x-1.5 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <p className="text-slate-400">// Sport Programming Platform</p>
                <p className="text-blue-400">function <span className="text-yellow-300">solve</span>() &#123;</p>
                <p className="pl-4 text-white">const rating = calculateRating();</p>
                <p className="pl-4 text-purple-400">return <span className="text-emerald-300">"Victory!"</span>;</p>
                <p className="text-blue-400">&#125;</p>
              </div>
            </div>
          </div>
        </div>

        {/* КАРТОЧКИ ПРЕИМУЩЕСТВ (4 колонки) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
          <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-2xl">
            <div className="text-2xl mb-4">⚛️</div>
            <h3 className="font-bold text-slate-900 text-base mb-1">5 дисциплин</h3>
            <p className="text-slate-500 text-sm">Разные направления спортивного программирования</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-2xl">
            <div className="text-2xl mb-4">📝</div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Удобная регистрация</h3>
            <p className="text-slate-500 text-sm">Быстрый и простой процесс участия</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-2xl">
            <div className="text-2xl mb-4">👤</div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Личный кабинет</h3>
            <p className="text-slate-500 text-sm">Отслеживайте заявки, результаты и достижения</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-100 p-6 rounded-2xl">
            <div className="text-2xl mb-4">📊</div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Рейтинги и статистика</h3>
            <p className="text-slate-500 text-sm">Следите за прогрессом и достижениями</p>
          </div>
        </div>

        {/* БЛИЖАЙШИЕ СОРЕВНОВАНИЯ */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Ближайшие соревнования</h2>
            <a href="/competitions" className="text-blue-700 hover:text-blue-900 font-medium text-sm flex items-center space-x-1">
              <span>Все соревнования</span> <span>→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-4">Открытое</span>
                <h3 className="font-bold text-slate-900 text-sm mb-4 leading-snug">Кубок Сибири по алгоритмическому программированию</h3>
                <div className="space-y-2 text-xs text-slate-500 mb-6">
                  <div className="flex items-center space-x-2"><span>📅</span> <span>20-22 мая 2025</span></div>
                  <div className="flex items-center space-x-2"><span>📍</span> <span>Новосибирская область</span></div>
                  <div className="flex items-center space-x-2"><span>👥</span> <span>124 участника</span></div>
                </div>
              </div>
              <button className="w-full bg-blue-900 hover:bg-blue-950 text-white font-medium text-sm py-2.5 rounded-xl transition">
                Подробнее
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 mb-4">Региональное</span>
                <h3 className="font-bold text-slate-900 text-sm mb-4 leading-snug">Чемпионат России по информационной безопасности</h3>
                <div className="space-y-2 text-xs text-slate-500 mb-6">
                  <div className="flex items-center space-x-2"><span>📅</span> <span>1-5 июня 2025</span></div>
                  <div className="flex items-center space-x-2"><span>📍</span> <span>Москва</span></div>
                  <div className="flex items-center space-x-2"><span>👥</span> <span>86 участников</span></div>
                </div>
              </div>
              <button className="w-full bg-blue-900 hover:bg-blue-950 text-white font-medium text-sm py-2.5 rounded-xl transition">
                Подробнее
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-4">Федеральное</span>
                <h3 className="font-bold text-slate-900 text-sm mb-4 leading-snug">Всероссийские соревнования по спортивному программированию</h3>
                <div className="space-y-2 text-xs text-slate-500 mb-6">
                  <div className="flex items-center space-x-2"><span>📅</span> <span>13-14 июля 2025</span></div>
                  <div className="flex items-center space-x-2"><span>📍</span> <span>Казань</span></div>
                  <div className="flex items-center space-x-2"><span>👥</span> <span>348 участников</span></div>
                </div>
              </div>
              <button className="w-full bg-blue-900 hover:bg-blue-950 text-white font-medium text-sm py-2.5 rounded-xl transition">
                Подробнее
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 mb-4">Открытое</span>
                <h3 className="font-bold text-slate-900 text-sm mb-4 leading-snug">Кубок Арктики по программированию роботов</h3>
                <div className="space-y-2 text-xs text-slate-500 mb-6">
                  <div className="flex items-center space-x-2"><span>📅</span> <span>5-8 августа 2025</span></div>
                  <div className="flex items-center space-x-2"><span>📍</span> <span>Санкт-Петербург</span></div>
                  <div className="flex items-center space-x-2"><span>👥</span> <span>67 участников</span></div>
                </div>
              </div>
              <button className="w-full bg-blue-900 hover:bg-blue-950 text-white font-medium text-sm py-2.5 rounded-xl transition">
                Подробнее
              </button>
            </div>
          </div>
        </section>

        {/* НИЖНИЙ БАННЕР */}
        <section className="mt-16 bg-blue-50/70 border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <div className="text-4xl bg-white p-4 rounded-2xl shadow-sm">🏆</div>
            <div>
              <h3 className="text-lg font-bold text-blue-950 mb-1">Стань частью сообщества сильнейших программистов России!</h3>
              <p className="text-slate-600 text-sm">Участвуй в соревнованиях, развивайся и достигай новых высот.</p>
            </div>
          </div>
          <a href="/cabinet" className="bg-blue-900 hover:bg-blue-950 text-white font-medium px-6 py-3.5 rounded-xl transition whitespace-nowrap shadow-md">
            Узнать больше →
          </a>
        </section>
      </main>
    </div>
  );
};

export default Landing;
