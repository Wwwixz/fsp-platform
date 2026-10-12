import { useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../api/client';
import type { AnalyticsResponse } from '../api/types';

const cardClass =
  'rounded-3xl border border-slate-800/60 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out';

const cardTitleClass = 'text-sm font-semibold uppercase tracking-wider text-slate-400';

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<AnalyticsResponse>('/analytics')
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, []);

  const stats: { label: string; value: number; delta: string; tone: 'green' | 'red' }[] = [
    { label: 'Всего соревнований', value: data?.stats.competitions ?? 0, delta: 'на платформе', tone: 'green' },
    { label: 'Всего заявок', value: data?.stats.applications ?? 0, delta: 'за текущий год', tone: 'green' },
    { label: 'Одобрено', value: data?.stats.approved ?? 0, delta: data?.stats.approvedShare ?? '—', tone: 'green' },
    { label: 'Отклонено', value: data?.stats.rejected ?? 0, delta: data?.stats.rejectedShare ?? '—', tone: 'red' },
  ];

  const monthlyStats = data?.monthly ?? [];
  const latestApplications = data?.latest ?? [];
  const maxMonth = Math.max(1, ...monthlyStats.map((m) => Math.max(m.approved, m.rejected)));
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Панель организатора
          </h1>
          <p className="mt-2 text-sm text-slate-400">Сводка по соревнованиям и заявкам за сезон</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className={cardClass}>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-3xl font-extrabold tracking-tight text-white">{stat.value}</span>
                <span
                  className={
                    stat.tone === 'green'
                      ? 'inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/25'
                      : 'inline-flex rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/25'
                  }
                >
                  {stat.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className={`${cardClass} lg:col-span-2`}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className={cardTitleClass}>Заявки по месяцам</h2>
              <div className="flex gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Одобрено
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  Отклонено
                </span>
              </div>
            </div>

            <div className="relative h-56 flex items-end gap-3 border-b border-slate-800 pb-0">
              {monthlyStats.length === 0 && (
                <p className="w-full text-center text-sm font-semibold text-slate-500">
                  В текущем году заявок пока нет
                </p>
              )}
              {monthlyStats.map((item) => (
                <div key={item.month} className="flex-1 flex h-full flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end justify-center gap-1.5">
                    <div
                      className="w-4 rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400"
                      style={{ height: `${(item.approved / maxMonth) * 100}%` }}
                      title={`${item.month}: одобрено ${item.approved}`}
                    />
                    <div
                      className="w-4 rounded-t-md bg-gradient-to-t from-rose-600 to-rose-400"
                      style={{ height: `${(item.rejected / maxMonth) * 100}%` }}
                      title={`${item.month}: отклонено ${item.rejected}`}
                    />
                  </div>
                  <span className="mt-2 text-xs font-medium text-slate-500">{item.month}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className={`${cardTitleClass} mb-6`}>Последние заявки</h2>
            <div className="flex flex-col">
              {latestApplications.length === 0 && (
                <p className="text-sm font-semibold text-slate-500">Заявок пока нет</p>
              )}
              {latestApplications.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-slate-800/40 ${
                    index === latestApplications.length - 1 ? '' : 'border-b border-slate-800/50'
                  }`}
                >
                  <Avatar name={item.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-100">{item.name}</div>
                    <div className="truncate text-xs text-slate-400">{item.region}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
