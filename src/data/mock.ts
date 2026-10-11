import type { Application, LatestApplication, MonthStat, ResultRow, TeamTopRow } from '../types';

/* ---------------- Заявки на участие ---------------- */

export const mockApplications: Application[] = [
  { id: 1, participant: 'Алексей Иванов', isTeam: false, competition: 'Кубок Сибири', region: 'Новосибирская обл.', status: 'pending' },
  { id: 2, participant: 'Команда DreamTeam', isTeam: true, competition: 'Региональный этап', region: 'Екатеринбург', status: 'approved' },
  { id: 3, participant: 'Мария Соколова', isTeam: false, competition: 'Чемпионат России', region: 'Москва', status: 'rejected' },
  { id: 4, participant: 'Команда Code Masters', isTeam: true, competition: 'Кубок Арктики', region: 'Санкт-Петербург', status: 'approved' },
  { id: 5, participant: 'Дмитрий Петров', isTeam: false, competition: 'Кубок Сибири', region: 'Красноярск', status: 'pending' },
  { id: 6, participant: 'Екатерина Орлова', isTeam: false, competition: 'Весенний кубок', region: 'Казань', status: 'approved' },
  { id: 7, participant: 'Команда Binary Stars', isTeam: true, competition: 'Чемпионат России', region: 'Нижний Новгород', status: 'pending' },
  { id: 8, participant: 'Иван Федоров', isTeam: false, competition: 'Региональный этап', region: 'Воронеж', status: 'rejected' },
  { id: 9, participant: 'Анна Кузнецова', isTeam: false, competition: 'Кубок Арктики', region: 'Мурманск', status: 'approved' },
  { id: 10, participant: 'Команда Altay Devs', isTeam: true, competition: 'Весенний кубок', region: 'Барнаул', status: 'pending' },
  { id: 11, participant: 'Сергей Морозов', isTeam: false, competition: 'Зимний чемпионат', region: 'Пермь', status: 'approved' },
  { id: 12, participant: 'Команда Neural Bit', isTeam: true, competition: 'Зимний чемпионат', region: 'Самара', status: 'rejected' },
  { id: 13, participant: 'Ольга Белова', isTeam: false, competition: 'Весенний кубок', region: 'Уфа', status: 'pending' },
  { id: 14, participant: 'Команда Sibiryaks', isTeam: true, competition: 'Кубок Сибири', region: 'Омск', status: 'approved' },
  { id: 15, participant: 'Павел Громов', isTeam: false, competition: 'Региональный этап', region: 'Челябинск', status: 'pending' },
  { id: 16, participant: 'Команда Volga Coders', isTeam: true, competition: 'Чемпионат России', region: 'Тольятти', status: 'approved' },
  { id: 17, participant: 'Ирина Степанова', isTeam: false, competition: 'Кубок Арктики', region: 'Архангельск', status: 'rejected' },
  { id: 18, participant: 'Команда Ural Force', isTeam: true, competition: 'Региональный этап', region: 'Екатеринбург', status: 'pending' },
  { id: 19, participant: 'Николай Зайцев', isTeam: false, competition: 'Зимний чемпионат', region: 'Саратов', status: 'approved' },
  { id: 20, participant: 'Команда Pacific East', isTeam: true, competition: 'Кубок Арктики', region: 'Владивосток', status: 'pending' },
];

/* ---------------- Результаты ---------------- */

export const mockResults: ResultRow[] = [
  { id: 1, date: '12.05.2025', season: 2025, title: 'Кубок Сибири', discipline: 'Алгоритмическое программирование', type: 'individual', place: 3, points: 842 },
  { id: 2, date: '28.04.2025', season: 2025, title: 'Региональный этап', discipline: 'Предметное программирование', type: 'team', place: 5, points: 731 },
  { id: 3, date: '15.03.2025', season: 2025, title: 'Весенний кубок', discipline: 'Информационная безопасность', type: 'individual', place: 7, points: 612 },
  { id: 4, date: '01.02.2025', season: 2025, title: 'Зимний чемпионат', discipline: 'Робототехника', type: 'team', place: 4, points: 688 },
  { id: 5, date: '18.11.2024', season: 2024, title: 'Осенний кубок', discipline: 'Алгоритмическое программирование', type: 'individual', place: 2, points: 915 },
  { id: 6, date: '07.09.2024', season: 2024, title: 'Кубок Арктики', discipline: 'Информационная безопасность', type: 'team', place: 6, points: 654 },
];

export const resultDisciplines = [
  'Алгоритмическое программирование',
  'Предметное программирование',
  'Информационная безопасность',
  'Робототехника',
];

export const resultSeasons = [2025, 2024];

/* ---------------- Аналитика организатора ---------------- */

export const organizerStats = {
  competitions: 12,
  competitionsDelta: '+2',
  applications: 248,
  applicationsDelta: '+36',
  approved: 196,
  approvedShare: '79%',
  rejected: 52,
  rejectedShare: '21%',
};

export const monthlyStats: MonthStat[] = [
  { month: 'Янв', approved: 35, rejected: 15 },
  { month: 'Фев', approved: 50, rejected: 18 },
  { month: 'Мар', approved: 78, rejected: 35 },
  { month: 'Апр', approved: 58, rejected: 28 },
  { month: 'Май', approved: 40, rejected: 55 },
  { month: 'Июн', approved: 48, rejected: 50 },
];

export const latestApplications: LatestApplication[] = [
  { id: 1, name: 'Алексей Иванов', region: 'Новосибирск', status: 'approved', time: '12:45' },
  { id: 2, name: 'Мария Соколова', region: 'Томск', status: 'pending', time: '11:32' },
  { id: 3, name: 'Дмитрий Иванов', region: 'Воронеж', status: 'rejected', time: '10:21' },
  { id: 4, name: 'Екатерина Орлова', region: 'Казань', status: 'approved', time: '09:14' },
  { id: 5, name: 'Иван Федоров', region: 'Пермь', status: 'pending', time: '08:37' },
];

/* ---------------- Топ команд по соревнованиям ---------------- */

export const teamCompetitionTops: Record<string, TeamTopRow[]> = {
  'Чемпионат России': [
    { team: 'SPb ITMO 1', members: 3, points: 780, region: 'Санкт-Петербург' },
    { team: 'UrFU Delta', members: 3, points: 745, region: 'Екатеринбург' },
    { team: 'Siberian Bears', members: 3, points: 710, region: 'Новосибирск' },
    { team: 'Moscow JS Wizards', members: 3, points: 655, region: 'Москва' },
    { team: 'Kazan Cyber Stars', members: 2, points: 610, region: 'Казань' },
  ],
  'Кубок Сибири': [
    { team: 'Siberian Bears', members: 3, points: 820, region: 'Новосибирск' },
    { team: 'Kazan Cyber Stars', members: 2, points: 764, region: 'Казань' },
    { team: 'UrFU Delta', members: 3, points: 730, region: 'Екатеринбург' },
    { team: 'SPb ITMO 1', members: 3, points: 690, region: 'Санкт-Петербург' },
    { team: 'Altay Devs', members: 3, points: 615, region: 'Барнаул' },
  ],
  'Кубок Арктики': [
    { team: 'UrFU Delta', members: 3, points: 755, region: 'Екатеринбург' },
    { team: 'SPb ITMO 1', members: 3, points: 740, region: 'Санкт-Петербург' },
    { team: 'Siberian Bears', members: 3, points: 682, region: 'Новосибирск' },
    { team: 'Moscow JS Wizards', members: 3, points: 640, region: 'Москва' },
    { team: 'Pacific East', members: 3, points: 588, region: 'Владивосток' },
  ],
  'Весенний кубок': [
    { team: 'Moscow JS Wizards', members: 3, points: 770, region: 'Москва' },
    { team: 'SPb ITMO 1', members: 3, points: 736, region: 'Санкт-Петербург' },
    { team: 'Kazan Cyber Stars', members: 2, points: 701, region: 'Казань' },
    { team: 'Siberian Bears', members: 3, points: 668, region: 'Новосибирск' },
    { team: 'Volga Coders', members: 3, points: 595, region: 'Тольятти' },
  ],
};
