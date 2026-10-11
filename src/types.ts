export type Role = 'athlete' | 'organizer';

export interface User {
  name: string;
  email: string;
  role: Role;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id: number;
  participant: string;
  isTeam: boolean;
  competition: string;
  region: string;
  status: ApplicationStatus;
}

export interface ResultRow {
  id: number;
  date: string;
  season: number;
  title: string;
  discipline: string;
  type: 'individual' | 'team';
  place: number;
  points: number;
}

export interface LatestApplication {
  id: number;
  name: string;
  region: string;
  status: ApplicationStatus;
  time: string;
}

export interface MonthStat {
  month: string;
  approved: number;
  rejected: number;
}

export interface TeamTopRow {
  team: string;
  members: number;
  points: number;
  region: string;
}
