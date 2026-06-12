import { cookies } from 'next/headers';

// Types
export interface UserPrediction {
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  updatedAt: string;
}

export interface TournamentPrediction {
  userId: string;
  winnerTeamId: string;
  goldenBootPlayerId: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  username: string;
  predictionsCount: number;
  points: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface DatabaseOperations {
  savePrediction: (userId: string, matchId: string, homeScore: number, awayScore: number) => Promise<boolean>;
  getPredictions: (userId: string) => Promise<UserPrediction[]>;
  saveTournamentPrediction: (userId: string, winnerTeamId: string, goldenBootPlayerId: string) => Promise<boolean>;
  getTournamentPrediction: (userId: string) => Promise<TournamentPrediction | null>;
  getLeaderboard: (currentUserId?: string) => Promise<LeaderboardEntry[]>;
  followTeam: (userId: string, teamId: string) => Promise<boolean>;
  unfollowTeam: (userId: string, teamId: string) => Promise<boolean>;
  getFollowedTeams: (userId: string) => Promise<string[]>;
  followPlayer: (userId: string, playerId: string) => Promise<boolean>;
  unfollowPlayer: (userId: string, playerId: string) => Promise<boolean>;
  getFollowedPlayers: (userId: string) => Promise<string[]>;
}

// 100% Serverless CookieDB implementation (no database needed)
class CookieDB implements DatabaseOperations {
  private async getPredictionsCookie(): Promise<UserPrediction[]> {
    try {
      const cookieStore = await cookies();
      const val = cookieStore.get('wcup_predictions')?.value || '';
      if (!val) return [];
      
      return val.split(',').map(item => {
        const parts = item.split(':');
        if (parts.length !== 2) return null;
        const [matchId, scores] = parts;
        const [homeScore, awayScore] = scores.split('-').map(Number);
        if (isNaN(homeScore) || isNaN(awayScore)) return null;
        return {
          userId: 'cookie-user',
          matchId,
          homeScore,
          awayScore,
          updatedAt: new Date().toISOString()
        };
      }).filter((p): p is UserPrediction => p !== null);
    } catch (e) {
      console.error('[CookieDB] Read predictions error:', e);
      return [];
    }
  }

  private async savePredictionsCookie(preds: UserPrediction[]) {
    try {
      const cookieStore = await cookies();
      const val = preds.map(p => `${p.matchId}:${p.homeScore}-${p.awayScore}`).join(',');
      cookieStore.set('wcup_predictions', val, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    } catch (e) {
      console.error('[CookieDB] Write predictions error:', e);
    }
  }

  async savePrediction(userId: string, matchId: string, homeScore: number, awayScore: number) {
    const preds = await this.getPredictionsCookie();
    const existingIdx = preds.findIndex(p => p.matchId === matchId);
    
    const prediction: UserPrediction = {
      userId,
      matchId,
      homeScore,
      awayScore,
      updatedAt: new Date().toISOString()
    };

    if (existingIdx > -1) {
      preds[existingIdx] = prediction;
    } else {
      preds.push(prediction);
    }
    
    await this.savePredictionsCookie(preds);
    return true;
  }

  async getPredictions(userId: string): Promise<UserPrediction[]> {
    return this.getPredictionsCookie();
  }

  async saveTournamentPrediction(userId: string, winnerTeamId: string, goldenBootPlayerId: string) {
    try {
      const cookieStore = await cookies();
      const val = JSON.stringify({ winnerTeamId, goldenBootPlayerId });
      cookieStore.set('wcup_tournament', val, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      return true;
    } catch (e) {
      console.error('[CookieDB] Write tournament prediction error:', e);
      return false;
    }
  }

  async getTournamentPrediction(userId: string): Promise<TournamentPrediction | null> {
    try {
      const cookieStore = await cookies();
      const val = cookieStore.get('wcup_tournament')?.value;
      if (!val) return null;
      const parsed = JSON.parse(val);
      return {
        userId,
        winnerTeamId: parsed.winnerTeamId,
        goldenBootPlayerId: parsed.goldenBootPlayerId,
        updatedAt: new Date().toISOString()
      };
    } catch (e) {
      console.error('[CookieDB] Read tournament prediction error:', e);
      return null;
    }
  }

  async getLeaderboard(currentUserId?: string): Promise<LeaderboardEntry[]> {
    const baseLeaderboard: LeaderboardEntry[] = [
      { username: "PunditPro", predictionsCount: 12, points: 34, rank: 1 },
      { username: "SofascoreWizard", predictionsCount: 12, points: 30, rank: 2 },
      { username: "OptaJunior", predictionsCount: 11, points: 28, rank: 3 },
      { username: "FIFA_Master99", predictionsCount: 12, points: 25, rank: 4 },
      { username: "GoalGetta", predictionsCount: 10, points: 22, rank: 5 },
      { username: "TacticalGuru", predictionsCount: 9, points: 19, rank: 6 },
      { username: "WorldCupFanatic", predictionsCount: 10, points: 15, rank: 7 }
    ];

    const preds = await this.getPredictionsCookie();
    if (preds.length > 0) {
      const userPoints = preds.length * 3;
      baseLeaderboard.push({
        username: "You (Anonymous)",
        predictionsCount: preds.length,
        points: userPoints,
        rank: 0,
        isCurrentUser: true
      });
    }

    baseLeaderboard.sort((a, b) => b.points - a.points);
    return baseLeaderboard.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  }

  async followTeam(userId: string, teamId: string) {
    try {
      const teams = await this.getFollowedTeams(userId);
      if (!teams.includes(teamId)) {
        teams.push(teamId);
        const cookieStore = await cookies();
        cookieStore.set('wcup_followed_teams', teams.join(','), {
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
      }
      return true;
    } catch (e) {
      console.error('[CookieDB] Follow team error:', e);
      return false;
    }
  }

  async unfollowTeam(userId: string, teamId: string) {
    try {
      const teams = await this.getFollowedTeams(userId);
      const filtered = teams.filter(t => t !== teamId);
      const cookieStore = await cookies();
      cookieStore.set('wcup_followed_teams', filtered.join(','), {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      return true;
    } catch (e) {
      console.error('[CookieDB] Unfollow team error:', e);
      return false;
    }
  }

  async getFollowedTeams(userId: string): Promise<string[]> {
    try {
      const cookieStore = await cookies();
      const val = cookieStore.get('wcup_followed_teams')?.value || '';
      return val ? val.split(',') : [];
    } catch (e) {
      console.error('[CookieDB] Read followed teams error:', e);
      return [];
    }
  }

  async followPlayer(userId: string, playerId: string) {
    try {
      const players = await this.getFollowedPlayers(userId);
      if (!players.includes(playerId)) {
        players.push(playerId);
        const cookieStore = await cookies();
        cookieStore.set('wcup_followed_players', players.join(','), {
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
      }
      return true;
    } catch (e) {
      console.error('[CookieDB] Follow player error:', e);
      return false;
    }
  }

  async unfollowPlayer(userId: string, playerId: string) {
    try {
      const players = await this.getFollowedPlayers(userId);
      const filtered = players.filter(p => p !== playerId);
      const cookieStore = await cookies();
      cookieStore.set('wcup_followed_players', filtered.join(','), {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      return true;
    } catch (e) {
      console.error('[CookieDB] Unfollow player error:', e);
      return false;
    }
  }

  async getFollowedPlayers(userId: string): Promise<string[]> {
    try {
      const cookieStore = await cookies();
      const val = cookieStore.get('wcup_followed_players')?.value || '';
      return val ? val.split(',') : [];
    } catch (e) {
      console.error('[CookieDB] Read followed players error:', e);
      return [];
    }
  }
}

// Instantiation: Always use the cookieDB now, keeping PG support deactivated for serverless ease
export const db: DatabaseOperations = new CookieDB();
