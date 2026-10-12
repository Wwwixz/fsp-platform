/**
 * Общие типы фронтенда. Первоисточник — серверные DTO (src/api/types.ts),
 * здесь только переиспользование и алиасы для страниц.
 */
export type Role = 'athlete' | 'organizer';

export type {
  ApplicationStatus,
  ApplicationItem,
  PublicUser,
} from './api/types';

import type { ApplicationItem } from './api/types';

/** Строка таблицы заявок на фронтенде. */
export type Application = ApplicationItem;
