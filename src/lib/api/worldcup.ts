/**
 * WorldCup 2026 API Client
 * Powered by football-data.org (via local API proxy)
 */

const BASE_URL = '/api/worldcup';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface APITeam {
  id: number | string;
  name: string;
  name_fa?: string;
  flag?: string;
  group?: string;
  fifa_code?: string;
}

export interface APIScore {
  home: number | null;
  away: number | null;
}

export interface APIMatch {
  id: number | string;
  home_team: APITeam | string;
  away_team: APITeam | string;
  score?: APIScore;
  home_score?: number | null;
  away_score?: number | null;
  status?: string; // 'completed' | 'in_progress' | 'future'
  datetime?: string;
  date?: string;
  time?: string;
  group?: string;
  stage?: string;
  venue?: string;
  stadium?: string;
  attendance?: number;
  winner?: string | null;
}

export interface APIStanding {
  team: APITeam | string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export interface APIGroup {
  id?: string;
  name?: string;
  group?: string;
  letter?: string;
  standings?: APIStanding[];
  teams?: APIStanding[];
}

export interface APIStadium {
  id: number | string;
  name: string;
  city: string;
  capacity?: number;
  country?: string;
}

// ─── Fetch Helpers ────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, timeout = 8000): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${BASE_URL}/${path}`, {
      signal: controller.signal,
      next: { revalidate: 30 }, // cache 30s for live data
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function fetchMatches(): Promise<APIMatch[]> {
  const data = await apiFetch<APIMatch[] | { matches?: APIMatch[]; games?: APIMatch[] }>('games');
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.matches ?? data.games ?? [];
}

export async function fetchGroups(): Promise<APIGroup[]> {
  const data = await apiFetch<APIGroup[] | { groups?: APIGroup[] }>('groups');
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.groups ?? [];
}

export async function fetchTeams(): Promise<APITeam[]> {
  const data = await apiFetch<APITeam[] | { teams?: APITeam[] }>('teams');
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.teams ?? [];
}

export async function fetchStadiums(): Promise<APIStadium[]> {
  const data = await apiFetch<APIStadium[] | { stadiums?: APIStadium[] }>('stadiums');
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.stadiums ?? [];
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

export function getLiveMatches(matches: APIMatch[]) {
  return matches.filter(m =>
    m.status === 'in_progress' ||
    m.status === 'live' ||
    m.status === 'ongoing'
  );
}

export function getCompletedMatches(matches: APIMatch[]) {
  return matches.filter(m =>
    m.status === 'completed' ||
    m.status === 'finished' ||
    m.status === 'full_time'
  );
}

export function getUpcomingMatches(matches: APIMatch[]) {
  return matches.filter(m =>
    m.status === 'future' ||
    m.status === 'upcoming' ||
    m.status === 'scheduled'
  );
}

export function getTeamName(team: APITeam | string | null | undefined): string {
  if (!team) return 'TBD';
  if (typeof team === 'string') return team;
  return team.name ?? 'TBD';
}

export function getTeamFlag(team: APITeam | string | null | undefined): string {
  if (!team) return '';
  if (typeof team === 'string') return '';
  if (team.flag) return team.flag;
  if (team.fifa_code) {
    return `https://flagcdn.com/w40/${team.fifa_code.toLowerCase()}.png`;
  }
  return '';
}

export function getMatchScore(match: APIMatch | null | undefined): { home: number | null; away: number | null } {
  if (!match) return { home: null, away: null };
  if (match.score) return match.score;
  return {
    home: match.home_score ?? null,
    away: match.away_score ?? null,
  };
}

export function getTournamentStats(matches: APIMatch[]) {
  const completed = getCompletedMatches(matches);
  let totalGoals = 0;
  completed.forEach(m => {
    const score = getMatchScore(m);
    totalGoals += (score.home ?? 0) + (score.away ?? 0);
  });
  return {
    totalMatches: matches.length,
    matchesPlayed: completed.length,
    totalGoals,
    avgGoalsPerMatch: completed.length > 0 ? (totalGoals / completed.length).toFixed(2) : '0',
  };
}

export function getMatchStage(
  stage: string | null | undefined,
  group: string | null | undefined,
  fallback: 'Group Stage' | 'Round of 32' | 'Round of 16' | 'Quarter Finals' | 'Semi Finals' | 'Final'
): 'Group Stage' | 'Round of 32' | 'Round of 16' | 'Quarter Finals' | 'Semi Finals' | 'Final' {
  if (group) return 'Group Stage';
  if (!stage) return fallback;
  const s = stage.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.includes('group')) return 'Group Stage';
  if (s.includes('32')) return 'Round of 32';
  if (s.includes('16')) return 'Round of 16';
  if (s.includes('quarter')) return 'Quarter Finals';
  if (s.includes('semi')) return 'Semi Finals';
  if (s.includes('final')) return 'Final';
  return fallback;
}

export function formatLocalTime(dateStr: string | undefined, timeStr: string | undefined): string {
  if (!dateStr || !timeStr) return timeStr || '';
  try {
    const utcDate = new Date(`${dateStr}T${timeStr}:00Z`);
    // Format as "h:MM AM/PM" in the user's local timezone
    return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', hour12: true }).format(utcDate);
  } catch (e) {
    return timeStr;
  }
}

export function getLiveMinute(dateStr: string | undefined, timeStr: string | undefined, stage?: string): number {
  if (!dateStr || !timeStr) return 45;
  try {
    const kickoffTime = new Date(`${dateStr}T${timeStr}:00Z`).getTime();
    const now = Date.now();
    let elapsedMins = Math.floor((now - kickoffTime) / 60000);
    
    if (elapsedMins <= 0) return 1;
    
    // 1st Half Hydration Break (3 mins) at 30 mins
    if (elapsedMins > 30 && elapsedMins <= 33) return 30;
    if (elapsedMins > 33) elapsedMins -= 3;
    
    // Half Time (15 mins) at 45 mins
    if (elapsedMins > 45 && elapsedMins <= 60) return 45;
    if (elapsedMins > 60) elapsedMins -= 15;

    // 2nd Half Hydration Break (3 mins) at 75 mins
    if (elapsedMins > 75 && elapsedMins <= 78) return 75;
    if (elapsedMins > 78) elapsedMins -= 3;
    
    // Cap Group Stage matches at 90' if the API is delayed in marking it 'completed'
    const isGroupStage = !stage || stage.toLowerCase().includes('group');
    const maxMins = isGroupStage ? 90 : 120;
    
    return Math.min(maxMins, elapsedMins);
  } catch {
    return 45;
  }
}
