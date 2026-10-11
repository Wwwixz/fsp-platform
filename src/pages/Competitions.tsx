import React, { useState } from 'react';
import PublicHeader from '../components/PublicHeader';

const Competitions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const competitions = [
    {
      id: 1,
      title: "Кубок Сибири по алгоритмическому программированию",
      date: "20-22 мая 2025",
      location: "Новосибирская область",
      participants: 124,
      status: "Открытое",
      statusColor: "bg-emerald-50 text-emerald-700",
      discipline: "Алгоритмическое программирование"
    },
    {
      id: 2,
      title: "Чемпионат России по информационной безопасности",
      date: "1-5 июня 2025",
      location: "Москва",
      participants: 86,
      status: "Региональное",
      statusColor: "bg-purple-50 text-purple-700",
      discipline: "Кибербезопасность"
    },
    {
      id: 3,
      title: "Всероссийские соревнования по спортивному программированию",
      date: "13-14 июля 2025",
      location: "Казань",
      participants: 348,
      status: "Федеральное",
      statusColor: "bg-emerald-50 text-emerald-700",
      discipline: "Продуктовое программирование"
    },
    {
      id: 4,
      title: "Кубок Арктики по программированию роботов",
      date: "5-8 августа 2025",
      location: "Санкт-Петербург",
      participants: 67,
      status: "Открытое",
      statusColor: "bg-amber-50 text-amber-700",
      discipline: "Робототехника"
    },
    {
      id: 5,
      title: "Межвузовский турнир: Backend Pro",
      date: "10-12 сентября 2025",
      location: "Екатеринбург",
      participants: 156,
      status: "Региональное",
      statusColor: "bg-purple-50 text-purple-700",
      discipline: "Алгоритмическое программирование"
    },
    {
      id: 6,
      title: "DevOps Challenge 2025",
      date: "25-26 сентября 2025",
      location: "Онлайн",
      participants: 512,
      status: "Открытое",
      statusColor: "bg-emerald-50 text-emerald-700",
      discipline: "Администрирование"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* НАВИГАЦИЯ */}
      <PublicHeader />


      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-950 tracking-tight">Соревнования</h1>
            <p className="text-slate-500 font-medium mt-1">Выбирай лучшие турниры и прокачивай свой рейтинг</p>
          </div>
          <div className="relative w-full md:w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Поиск по названию или городу..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
            />
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex p-1.5 bg-slate-200/50 rounded-2xl">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'all' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Все
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'active' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Активные
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'past' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Прошедшие
            </button>
          </div>
          
          <div className="h-8 w-px bg-slate-200 hidden md:block mx-2"></div>
          
          <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Все дисциплины</option>
            <option>Алгоритмическое программирование</option>
            <option>Робототехника</option>
            <option>Кибербезопасность</option>
          </select>
          
          <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Любой статус</option>
            <option>Федеральное</option>
            <option>Региональное</option>
            <option>Открытое</option>
          </select>
        </div>

        {/* Grid of Competitions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitions.map((comp) => (
            <div key={comp.id} className="bg-white border border-slate-100 rounded-[32px] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${comp.statusColor}`}>
                    {comp.status}
                  </span>
                  <div className="text-slate-300 group-hover:text-blue-500 transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                </div>
                
                <h3 className="font-extrabold text-blue-950 text-lg mb-3 leading-tight group-hover:text-blue-700 transition">
                  {comp.title}
                </h3>
                
                <div className="text-xs text-blue-600 font-bold mb-5 bg-blue-50 inline-block px-3 py-1 rounded-lg">
                  {comp.discipline}
                </div>

                <div className="space-y-3 text-sm text-slate-500 mb-8 border-t border-slate-50 pt-5">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs">📅</span>
                    <span className="font-medium">{comp.date}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs">📍</span>
                    <span className="font-medium">{comp.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs">👥</span>
                    <span className="font-medium">{comp.participants} участников</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 rounded-2xl transition shadow-lg shadow-blue-900/10 text-sm">
                  Участвовать
                </button>
                <button className="w-12 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center rounded-2xl transition">
                  ⋯
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 flex justify-center">
          <button className="bg-white border border-slate-200 text-slate-600 font-bold px-10 py-4 rounded-3xl hover:bg-slate-50 hover:border-slate-300 transition shadow-sm">
            Загрузить еще
          </button>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">Ф</div>
            <span className="text-xl font-extrabold text-blue-900 tracking-tight">ФСП</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 Всероссийская Федерация спортивного программирования</p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-blue-600 transition">VK</a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition">TG</a>
            <a href="#" className="text-slate-400 hover:text-blue-600 transition">YT</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Competitions;
