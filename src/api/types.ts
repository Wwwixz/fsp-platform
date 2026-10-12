/**
 * Типы данных бекенда (зеркала Java-DTO). Держим в одном месте,
 * чтобы страницы использовали серверные ответы как единый источник правды.
 */

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

/* --- auth --- */

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: 'athlete' | 'organizer';
  backendRole: 'ATHLETE' | 'REGIONAL' | 'FEDERATION';
  region: string | null;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

/* --- competitions --- */

export interface CompetitionSummary {
  id: number;
  title: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  type: 'Открытое' | 'Региональное' | 'Федеральное';
  discipline: string;
  period: 'active' | 'past';
  individualFormat: boolean;
  registrationOpen: boolean;
}

export interface CompetitionScheduleDto {
  time: string;
  event: string;
}

export interface CompetitionTeamShort {
  id: number;
  name: string;
  members: number;
  status: string;
  captain: string;
  region: string;
  contact: string;
}

export interface CompetitionResultRow {
  name: string;
  isTeam: boolean;
  place: number;
  points: number;
}

export interface CompetitionDetails {
  id: number;
  title: string;
  type: string;
  discipline: string;
  description: string | null;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  prizeFund: string | null;
  organizer: string;
  regions: string[];
  individualFormat: boolean;
  registrationOpen: boolean;
  completed: boolean;
  schedule: CompetitionScheduleDto[];
  teams: CompetitionTeamShort[];
  results: CompetitionResultRow[];
}

export interface CompetitionCreateRequest {
  title: string;
  type: string;
  discipline: string;
  description?: string;
  location: string;
  startDate: string;
  endDate: string;
  regDeadline: string;
  maxParticipants: number;
  prizeFund?: string;
  individualFormat: boolean;
  regions?: string[];
  schedule?: { time: string; event: string }[];
}

/* --- teams --- */

export interface TeamRating {
  id: number;
  name: string;
  members: number;
  rating: number;
  wins: number;
  region: string;
}

export interface TeamTop {
  id: number;
  team: string;
  members: number;
  points: number;
  region: string;
}

export interface TeamStats {
  total: number;
  newThisWeek: number;
  tournaments: number;
}

export interface TeamsResponse {
  overall: TeamRating[];
  competitions: { id: number; title: string }[];
  stats: TeamStats;
}

export interface TeamDetails {
  id: number;
  name: string;
  competition: string;
  captain: string;
  status: string;
  contact: string;
  region: string;
  members: number;
  memberNames: string[];
}

export interface TeamCreateRequest {
  name: string;
  competitionId: number;
  contact?: string;
  recruiting: boolean;
}

/* --- applications --- */

export interface ApplicationItem {
  id: number;
  participant: string;
  isTeam: boolean;
  competition: string;
  competitionId: number;
  region: string;
  status: ApplicationStatus;
  date: string;
  time: string;
  comment: string | null;
}

/* --- results --- */

export interface MyResultRow {
  id: number;
  date: string;
  season: number;
  title: string;
  discipline: string;
  type: 'individual' | 'team';
  place: number;
  points: number;
}

/* --- cabinet --- */

export interface CabinetEvent {
  id: number;
  title: string;
  date: string;
  status: 'approved' | 'pending';
  discipline: string;
}

export interface CabinetResponse {
  id: number;
  name: string;
  email: string;
  role: 'athlete' | 'organizer';
  region: string | null;
  rating: number;
  ratingDelta: number;
  regionPlace: number;
  wins: number;
  successRate: string;
  upcomingEvents: CabinetEvent[];
}

/* --- analytics --- */

export interface AnalyticsStats {
  competitions: number;
  applications: number;
  approved: number;
  approvedShare: string;
  rejected: number;
  rejectedShare: string;
}

export interface AnalyticsResponse {
  stats: AnalyticsStats;
  monthly: { month: string; approved: number; rejected: number }[];
  latest: { id: number; name: string; region: string; status: ApplicationStatus; time: string }[];
}
