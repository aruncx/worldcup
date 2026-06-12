import { NextRequest, NextResponse } from 'next/server';
import { stadiums } from '@/lib/data/stadiums';

const BASE_URL = 'https://api.football-data.org/v4';
const COMPETITION_CODE = 'WC'; // World Cup

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await params;
  const allowed = ['games', 'groups', 'teams', 'stadiums'];

  if (!allowed.includes(endpoint)) {
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  }

  // Stadiums doesn't need external API call, can return immediately
  if (endpoint === 'stadiums') {
    return NextResponse.json(stadiums, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_token_here')) {
    console.warn('[API proxy] FOOTBALL_DATA_API_KEY is not configured. Falling back to offline simulator mode.');
    return NextResponse.json({ error: 'API key not configured' }, { status: 401 });
  }

  try {
    let targetPath = '';
    if (endpoint === 'games') {
      targetPath = `competitions/${COMPETITION_CODE}/matches`;
    } else if (endpoint === 'groups') {
      targetPath = `competitions/${COMPETITION_CODE}/standings`;
    } else if (endpoint === 'teams') {
      targetPath = `competitions/${COMPETITION_CODE}/teams`;
    }

    const res = await fetch(`${BASE_URL}/${targetPath}`, {
      next: { revalidate: 30 },
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': apiKey,
      },
    });

    if (!res.ok) {
      console.error(`[API proxy] Upstream returned status ${res.status} for ${endpoint}`);
      return NextResponse.json(
        { error: 'Upstream error', status: res.status },
        { status: res.status === 429 ? 429 : 502 }
      );
    }

    const data = await res.json();
    
    // Transform data to match local frontend APIMatch / APIGroup / APITeam interfaces
    let mappedData: any = data;
    
    if (endpoint === 'games') {
      const rawMatches = data.matches || [];
      mappedData = rawMatches.map((m: any) => {
        let status = 'future';
        if (m.status === 'FINISHED') {
          status = 'completed';
        } else if (m.status === 'IN_PLAY' || m.status === 'PAUSED') {
          status = 'live';
        }
        
        const groupLetter = m.group ? m.group.replace(/^GROUP_/, '') : undefined;
        
        let stage = 'Group Stage';
        if (m.stage === 'LAST_32' || m.stage === 'ROUND_OF_32') {
          stage = 'Round of 32';
        } else if (m.stage === 'LAST_16' || m.stage === 'ROUND_OF_16') {
          stage = 'Round of 16';
        } else if (m.stage === 'QUARTER_FINALS') {
          stage = 'Quarter Finals';
        } else if (m.stage === 'SEMI_FINALS') {
          stage = 'Semi Finals';
        } else if (m.stage === 'FINAL') {
          stage = 'Final';
        }

        return {
          id: m.id,
          home_team: {
            id: m.homeTeam.id,
            name: m.homeTeam.name || m.homeTeam.shortName || 'TBD',
            flag: m.homeTeam.crest || '',
            fifa_code: m.homeTeam.tla || '',
          },
          away_team: {
            id: m.awayTeam.id,
            name: m.awayTeam.name || m.awayTeam.shortName || 'TBD',
            flag: m.awayTeam.crest || '',
            fifa_code: m.awayTeam.tla || '',
          },
          home_score: m.score?.fullTime?.home ?? null,
          away_score: m.score?.fullTime?.away ?? null,
          status: status,
          datetime: m.utcDate,
          date: m.utcDate ? m.utcDate.split('T')[0] : undefined,
          time: m.utcDate ? m.utcDate.split('T')[1]?.substring(0, 5) : undefined,
          group: groupLetter,
          stage: stage,
          venue: m.venue || undefined,
          stadium: m.venue || undefined,
        };
      });
    } else if (endpoint === 'groups') {
      const rawStandings = data.standings || [];
      mappedData = rawStandings.map((s: any) => {
        const groupLetter = s.group ? s.group.replace(/^GROUP_/, '') : '';
        return {
          group: groupLetter,
          letter: groupLetter,
          name: groupLetter ? `Group ${groupLetter}` : undefined,
          standings: (s.table || []).map((item: any) => ({
            team: {
              id: item.team.id,
              name: item.team.name || item.team.shortName || 'TBD',
              flag: item.team.crest || '',
              fifa_code: item.team.tla || '',
            },
            played: item.playedGames,
            won: item.won,
            drawn: item.draw,
            lost: item.lost,
            goals_for: item.goalsFor,
            goals_against: item.goalsAgainst,
            goal_difference: item.goalDifference,
            points: item.points,
          })),
        };
      });
    } else if (endpoint === 'teams') {
      const rawTeams = data.teams || [];
      mappedData = rawTeams.map((t: any) => ({
        id: t.id,
        name: t.name || t.shortName || 'TBD',
        flag: t.crest || '',
        fifa_code: t.tla || '',
      }));
    }

    return NextResponse.json(mappedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    console.error(`[API proxy] Failed to fetch or transform ${endpoint}:`, err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
