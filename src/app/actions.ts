'use server'

import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import crypto from 'crypto';

// Helper to get or create a stable userId in cookies
async function getOrCreateUserId(): Promise<string> {
  const cookieStore = await cookies();
  let userId = cookieStore.get('wcup_user_id')?.value;
  
  if (!userId) {
    userId = crypto.randomUUID();
    cookieStore.set('wcup_user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/'
    });
  }
  return userId;
}

export async function getUserState() {
  const userId = await getOrCreateUserId();
  const predictions = await db.getPredictions(userId);
  const tournamentPrediction = await db.getTournamentPrediction(userId);
  const followedTeams = await db.getFollowedTeams(userId);
  const followedPlayers = await db.getFollowedPlayers(userId);
  const leaderboard = await db.getLeaderboard(userId);

  return {
    userId,
    predictions,
    tournamentPrediction,
    followedTeams,
    followedPlayers,
    leaderboard
  };
}

export async function submitPrediction(matchId: string, homeScore: number, awayScore: number) {
  try {
    const userId = await getOrCreateUserId();
    await db.savePrediction(userId, matchId, homeScore, awayScore);
    return { success: true };
  } catch (error) {
    console.error("Action error saving prediction", error);
    return { success: false, error: "Failed to save score prediction." };
  }
}

export async function submitTournamentPrediction(winnerTeamId: string, goldenBootPlayerId: string) {
  try {
    const userId = await getOrCreateUserId();
    await db.saveTournamentPrediction(userId, winnerTeamId, goldenBootPlayerId);
    return { success: true };
  } catch (error) {
    console.error("Action error saving tournament prediction", error);
    return { success: false, error: "Failed to save tournament predictions." };
  }
}

export async function toggleFollowTeam(teamId: string) {
  try {
    const userId = await getOrCreateUserId();
    const followed = await db.getFollowedTeams(userId);
    const isFollowing = followed.includes(teamId);
    
    if (isFollowing) {
      await db.unfollowTeam(userId, teamId);
      return { success: true, isFollowing: false };
    } else {
      await db.followTeam(userId, teamId);
      return { success: true, isFollowing: true };
    }
  } catch (error) {
    console.error("Action error toggling team follow", error);
    return { success: false, error: "Failed to toggle follow status." };
  }
}

export async function toggleFollowPlayer(playerId: string) {
  try {
    const userId = await getOrCreateUserId();
    const followed = await db.getFollowedPlayers(userId);
    const isFollowing = followed.includes(playerId);
    
    if (isFollowing) {
      await db.unfollowPlayer(userId, playerId);
      return { success: true, isFollowing: false };
    } else {
      await db.followPlayer(userId, playerId);
      return { success: true, isFollowing: true };
    }
  } catch (error) {
    console.error("Action error toggling player follow", error);
    return { success: false, error: "Failed to toggle follow status." };
  }
}
