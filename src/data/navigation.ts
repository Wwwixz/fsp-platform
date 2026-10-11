import type { Role } from '../types';

export interface NavItem {
  id: string;
  label: string;
  to: string;
}

/*
 * Меню для авторизованного пользователя (Header в AppShell).
 * «Главная» для спортсмена — лендинг, для организатора — аналитика.
 * «Заявки» доступны только организатору.
 */
export function navForRole(role: Role): NavItem[] {
  const items: NavItem[] = [
    { id: 'home', label: 'Главная', to: role === 'organizer' ? '/analytics' : '/' },
    { id: 'competitions', label: 'Соревнования', to: '/competitions' },
    { id: 'teams', label: 'Команды', to: '/teams' },
  ];
  if (role === 'organizer') {
    items.push({ id: 'applications', label: 'Заявки', to: '/applications' });
  }
  items.push(
    { id: 'results', label: 'Результаты', to: '/results' },
    { id: 'profile', label: 'Профиль', to: '/cabinet' },
  );
  return items;
}

/* Стартовая страница после входа в зависимости от роли. */
export function homePath(role: Role): string {
  return role === 'organizer' ? '/analytics' : '/results';
}
