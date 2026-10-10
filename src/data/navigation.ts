import type { Role } from '../types';

export interface NavItem {
  id: string;
  label: string;
  to: string;
}

/*
 * Разделы, помеченные to: '#', — это будущие страницы,
 * ссылки на них пока никуда не ведут.
 *
 * «Аналитика» (пункт «Главная») и «Заявки» доступны только организатору.
 */
export function navForRole(role: Role): NavItem[] {
  const items: NavItem[] = [
    { id: 'home', label: 'Главная', to: role === 'organizer' ? '/analytics' : '#' },
    { id: 'competitions', label: 'Соревнования', to: '#' },
    { id: 'teams', label: 'Команды', to: '#' },
  ];
  if (role === 'organizer') {
    items.push({ id: 'applications', label: 'Заявки', to: '/applications' });
  }
  items.push(
    { id: 'results', label: 'Результаты', to: '/results' },
    { id: 'profile', label: 'Профиль', to: '#' },
  );
  return items;
}

/* Стартовая страница после входа в зависимости от роли. */
export function homePath(role: Role): string {
  return role === 'organizer' ? '/analytics' : '/results';
}
