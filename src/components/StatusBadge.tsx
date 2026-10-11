import type { ApplicationStatus } from '../types';

const labelByStatus: Record<ApplicationStatus, string> = {
  pending: 'На рассмотрении',
  approved: 'Одобрено',
  rejected: 'Отклонено',
};

const toneByStatus: Record<ApplicationStatus, 'green' | 'orange' | 'red'> = {
  approved: 'green',
  pending: 'orange',
  rejected: 'red',
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`badge ${toneByStatus[status]}`}>{labelByStatus[status]}</span>;
}

export function statusLabel(status: ApplicationStatus): string {
  return labelByStatus[status];
}
