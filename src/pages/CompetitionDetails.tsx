import React from 'react';
import PublicHeader from '../components/PublicHeader';

const CompetitionDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
      {/* НАВИГАЦИЯ */}
      <PublicHeader />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">
          <a href="/competitions" className="hover:text-blue-600 transition">Соревнования</a>
          <span>/</span>
          <span className="text-slate-900">Кубок Сибири</span>
        </div>

        {/* Hero Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700">
              Открытое
            </span>
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700">
              Алгоритмическое программирование
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tight leading-tight mb-6">
            Кубок Сибири по алгоритмическому программированию
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-slate-50 rounded-[40px] border border-slate-100">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Дата проведения</div>
              <div className="text-blue-950 font-extrabold">20-22 мая 2025</div>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <div className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Место</div>
              <div className="text-blue-950 font-extrabold">Новосибирск</div>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <div className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Участников</div>
              <div className="text-blue-950 font-extrabold">124 / 200</div>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <div className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">Призовой фонд</div>
              <div className="text-blue-950 font-extrabold">500,000 ₽</div>
            </div>
          </div>
        </div>

        {/* Content Tabs/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-black text-blue-950 mb-4">Описание</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Кубок Сибири — это крупнейшее соревнование по алгоритмическому программированию в восточной части России. 
                Участникам предстоит решить 12 сложных задач за 5 часов. Соревнование проводится по правилам ICPC.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-blue-950 mb-4">Расписание</h2>
              <div className="space-y-4">
                {[
                  { time: "20 мая, 10:00", event: "Открытие и пробный тур" },
                  { time: "21 мая, 11:00", event: "Основной тур соревнований" },
                  { time: "22 мая, 14:00", event: "Награждение и закрытие" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="w-32 text-blue-700 font-black text-sm">{item.time}</div>
                    <div className="font-bold text-blue-950">{item.event}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-900 rounded-[32px] p-8 text-white shadow-xl shadow-blue-900/20 sticky top-24">
              <h3 className="text-xl font-black mb-4 italic uppercase">Регистрация открыта</h3>
              <p className="text-blue-100/70 text-sm mb-8 font-medium leading-relaxed">
                Успей подать заявку до 15 мая. Требуется команда от 1 до 3 человек.
              </p>
              <button className="w-full bg-white text-blue-900 font-black py-4 rounded-2xl mb-4 hover:scale-[1.02] transition active:scale-95 shadow-lg">
                Подать заявку
              </button>
              <button className="w-full bg-blue-800 text-white border border-blue-700 font-black py-4 rounded-2xl hover:bg-blue-750 transition">
                Регламент (PDF)
              </button>
            </div>
            
            <div className="p-6 border border-slate-100 rounded-[32px] bg-slate-50">
              <h4 className="font-black text-blue-950 mb-4 text-sm uppercase tracking-wider">Организатор</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">🏢</div>
                <div className="text-sm font-bold text-blue-950 leading-tight">ФСП Новосибирской области</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompetitionDetails;
