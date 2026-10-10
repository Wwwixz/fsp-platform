import type { MonthStat } from '../types';

const MAX = 100;
const TICKS = [0, 25, 50, 75, 100];

interface BarChartProps {
  data: MonthStat[];
}

/*
 * Простая столбчатая диаграмма на CSS — без графических библиотек.
 * Высота столбца = значение / MAX.
 */
export function BarChart({ data }: BarChartProps) {
  return (
    <div>
      <div className="chart-body">
        <div className="chart-y">
          {[...TICKS].reverse().map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className="chart-plot">
          {TICKS.slice(1).map((tick) => (
            <span
              key={tick}
              className="chart-gridline"
              style={{ bottom: `${(tick / MAX) * 100}%` }}
            />
          ))}
          {data.map((item) => (
            <div className="chart-group" key={item.month} title={`${item.month}: одобрено ${item.approved}, отклонено ${item.rejected}`}>
              <div
                className="chart-bar green"
                style={{ height: `${(item.approved / MAX) * 100}%` }}
              />
              <div
                className="chart-bar red"
                style={{ height: `${(item.rejected / MAX) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="chart-months">
        {data.map((item) => (
          <span className="chart-month" key={item.month}>
            {item.month}
          </span>
        ))}
      </div>
    </div>
  );
}
