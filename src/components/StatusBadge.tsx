import type { ApplicationStatus } from '../types';

const labelByStatus: Record<ApplicationStatus, string> = {
  pending: 'На рассмотрении',
  approved: 'Одобрено',
  rejected: 'Отклонено',
};

const toneByStatus: Record<ApplicationStatus, string> = {
  approved: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/25',
  pending: 'bg-amber-500/10 text-amber-300 ring-amber-500/25',
  rejected: 'bg-rose-500/10 text-rose-300 ring-rose-500/25',
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${toneByStatus[status]}`}
    >
      {labelByStatus[status]}
    </span>
  );
}

export function statusLabel(status: ApplicationStatus): string {
  return labelByStatus[status];
}
