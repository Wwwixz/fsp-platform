import React from 'react';
import PublicHeader from '../components/PublicHeader';

const Teams: React.FC = () => {
  const teams = [
    { name: "Siberian Bears", members: 3, rating: 2840, wins: 12, region: "Новосибирск" },
    { name: "Moscow JS Wizards", members: 3, rating: 2750, wins: 10, region: "Москва" },
    { name: "Kazan Cyber Stars", members: 2, rating: 2600, wins: 8, region: "Казань" },
    { name: "UrFU Delta", members: 3, rating: 2910, wins: 15, region: "Екатеринбург" },
    { name: "SPb ITMO 1", members: 3, rating: 3100, wins: 22, region: "Санкт-Петербург" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* НАВИГАЦИЯ */}
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-blue-950 tracking-tight">Команды</h1>
            <p className="text-slate-500 font-medium mt-1">Топ команд России в спортивном программировании</p>
          </div>
          <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-lg shadow-blue-800/20">
            Создать команду +
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-900 rounded-[32px] p-6 text-white shadow-xl shadow-blue-900/10">
            <div className="text-blue-300 text-[10px] uppercase font-black tracking-widest mb-1">Всего команд</div>
            <div className="text-3xl font-black italic">1,240</div>
          </div>
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Новых за неделю</div>
            <div className="text-3xl font-black text-blue-950 italic">+42</div>
          </div>
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Турниров проведено</div>
            <div className="text-3xl font-black text-blue-950 italic">856</div>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Место</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Название</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Рейтинг</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Участников</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Побед</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Регион</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {teams.sort((a, b) => b.rating - a.rating).map((team, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition cursor-pointer group">
                    <td className="px-8 py-6">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${index < 3 ? 'bg-blue-100 text-blue-800' : 'bg-slate-50 text-slate-400'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg shadow-inner">🏆</div>
                        <div className="font-bold text-blue-950 group-hover:text-blue-700 transition">{team.name}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-black text-blue-800 tracking-tight">{team.rating}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-bold text-slate-500">{team.members}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-bold text-emerald-600">+{team.wins}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-400">{team.region}</span>
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
};

export default Teams;
