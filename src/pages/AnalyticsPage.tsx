import { AppShell } from '../components/AppShell';
import { BarChart } from '../components/BarChart';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/StatusBadge';
import {
  latestApplications,
  monthlyStats,
  organizerStats,
} from '../data/mock';

export function AnalyticsPage() {
  return (
    <AppShell>
      <h1 className="page-title">Панель организатора</h1>

      <div className="stats-grid">
        <div className="card stat-card">
          <span className="stat-label">Всего соревнований</span>
          <div className="stat-bottom">
            <span className="stat-value">{organizerStats.competitions}</span>
            <span className="stat-chip green">{organizerStats.competitionsDelta}</span>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Всего заявок</span>
          <div className="stat-bottom">
            <span className="stat-value">{organizerStats.applications}</span>
            <span className="stat-chip green">{organizerStats.applicationsDelta}</span>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Одобрено</span>
          <div className="stat-bottom">
            <span className="stat-value">{organizerStats.approved}</span>
            <span className="stat-chip green">{organizerStats.approvedShare}</span>
          </div>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Отклонено</span>
          <div className="stat-bottom">
            <span className="stat-value">{organizerStats.rejected}</span>
            <span className="stat-chip red">{organizerStats.rejectedShare}</span>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <section className="card chart-card">
          <div className="chart-head">
            <h2 className="card-title">Заявки по месяцам</h2>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot green" />
                Одобрено
              </span>
              <span className="legend-item">
                <span className="legend-dot red" />
                Отклонено
              </span>
            </div>
          </div>
          <BarChart data={monthlyStats} />
        </section>

        <section className="card latest-card">
          <h2 className="card-title">Последние заявки</h2>
          <div className="latest-list">
            {latestApplications.map((item) => (
              <div className="latest-row" key={item.id}>
                <Avatar name={item.name} size={40} />
                <div className="latest-info">
                  <div className="latest-name">{item.name}</div>
                  <div className="latest-region">{item.region}</div>
                </div>
                <StatusBadge status={item.status} />
                <span className="latest-time">{item.time}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
