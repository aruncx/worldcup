'use client'

import React from 'react';
import { Trophy, Info, Award, HelpCircle } from 'lucide-react';
import styles from './standings.module.css';
import { teams, Team } from '@/lib/data/teams';
import { matches } from '@/lib/data/matches';
import { useGroups } from '@/hooks/useWorldCupApi';
import LiveDataBanner from '@/components/LiveDataBanner';
import TeamFlag from '@/components/TeamFlag';


export default function Standings() {
  // Live API groups data
  const { data: apiGroups, loading: apiLoading, error: apiError, lastUpdated, refresh } = useGroups({ refreshInterval: 60000 });

  // 1. Group teams by Group Letter
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  // 2. We can compute standings dynamically, or use the seeded stats which are pre-calculated.
  // For robustness, let's write a dynamic standing aggregator that takes base teams and applies completed matches.
  const computeGroupStandings = (groupLetter: string): Team[] => {
    // Filter teams in this group
    const groupTeams = teams.filter(t => t.group === groupLetter);

    // Create a working copy of stats initialized to 0
    const standingsMap = new Map<string, Team>();
    groupTeams.forEach(team => {
      standingsMap.set(team.id, {
        ...team,
        stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }
      });
    });

    // Apply all completed matches for this group
    const completedGroupMatches = matches.filter(m => m.group === groupLetter && (m.status === 'completed' || m.status === 'live'));

    completedGroupMatches.forEach(m => {
      const homeTeam = standingsMap.get(m.homeTeamId);
      const awayTeam = standingsMap.get(m.awayTeamId);

      if (homeTeam && awayTeam && m.homeScore !== undefined && m.awayScore !== undefined) {
        homeTeam.stats.played += 1;
        awayTeam.stats.played += 1;
        homeTeam.stats.goalsFor += m.homeScore;
        homeTeam.stats.goalsAgainst += m.awayScore;
        awayTeam.stats.goalsFor += m.awayScore;
        awayTeam.stats.goalsAgainst += m.homeScore;

        if (m.homeScore > m.awayScore) {
          homeTeam.stats.won += 1;
          homeTeam.stats.points += 3;
          awayTeam.stats.lost += 1;
        } else if (m.awayScore > m.homeScore) {
          awayTeam.stats.won += 1;
          awayTeam.stats.points += 3;
          homeTeam.stats.lost += 1;
        } else {
          homeTeam.stats.drawn += 1;
          homeTeam.stats.points += 1;
          awayTeam.stats.drawn += 1;
          awayTeam.stats.points += 1;
        }
      }
    });

    // Sort standings: Points desc -> Goal Difference desc -> Goals For desc -> FIFA ranking asc
    return Array.from(standingsMap.values()).sort((a, b) => {
      if (b.stats.points !== a.stats.points) {
        return b.stats.points - a.stats.points;
      }
      const gdA = a.stats.goalsFor - a.stats.goalsAgainst;
      const gdB = b.stats.goalsFor - b.stats.goalsAgainst;
      if (gdB !== gdA) {
        return gdB - gdA;
      }
      if (b.stats.goalsFor !== a.stats.goalsFor) {
        return b.stats.goalsFor - a.stats.goalsFor;
      }
      return a.ranking - b.ranking;
    });
  };

  const getGroupStandings = (groupLetter: string) => {
    if (apiGroups && apiGroups.length > 0) {
      const apiGroup = apiGroups.find(
        g => g.group === groupLetter || g.letter === groupLetter
      );
      if (apiGroup && apiGroup.standings && apiGroup.standings.length > 0) {
        return apiGroup.standings.map((item: any) => {
          // Look up locally defined team details where possible
          const localTeam = teams.find(
            t => t.name.toLowerCase() === item.team.name.toLowerCase() || 
                 t.code.toLowerCase() === item.team.fifa_code.toLowerCase()
          );
          return {
            id: String(item.team.id),
            name: item.team.name,
            flag: item.team.flag || localTeam?.flag || '🏳️',
            ranking: localTeam ? localTeam.ranking : '-',
            stats: {
              played: item.played,
              won: item.won,
              drawn: item.drawn,
              lost: item.lost,
              goalsFor: item.goals_for,
              goalsAgainst: item.goals_against,
              points: item.points,
            }
          };
        });
      }
    }
    
    // Fallback to local computation
    return computeGroupStandings(groupLetter);
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Intro Header */}
      <section className={styles.intro}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy style={{ color: 'var(--accent-gold)' }} /> Official Group Standings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            48 teams across 12 groups. The top 2 from each group + the 8 best 3rd-placed teams qualify for the Round of 32.
          </p>
        </div>
        <LiveDataBanner lastUpdated={lastUpdated} loading={apiLoading} error={apiError} onRefresh={refresh} />

        {/* Table Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.indicator} styles.indicatorQualify`} style={{ backgroundColor: 'var(--accent-green)' }}></span>
            <span>Qualifies (Top 2)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.indicator} styles.indicatorContender`} style={{ backgroundColor: 'var(--accent-gold)' }}></span>
            <span>Contender (Best 3rd)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.indicator} styles.indicatorEliminated`} style={{ backgroundColor: 'var(--accent-red)' }}></span>
            <span>Eliminated</span>
          </div>
        </div>
      </section>

      {/* Standings Grid */}
      <section className={styles.groupsGrid}>
        {groups.map(g => {
          const sortedTeams = getGroupStandings(g);
          
          return (
            <div key={g} className={`${styles.groupCard} glass-card`}>
              <div className={styles.groupHeader}>
                <span>Group {g}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                  {apiGroups && apiGroups.length > 0 ? 'Live Data' : 'Pre-Tournament'}
                </span>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th} style={{ width: '45px', textAlign: 'center' }}>Pos</th>
                    <th className={styles.th}>Team</th>
                    <th className={styles.th} style={{ width: '35px', textAlign: 'center' }}>P</th>
                    <th className={styles.th} style={{ width: '35px', textAlign: 'center' }}>W</th>
                    <th className={styles.th} style={{ width: '35px', textAlign: 'center' }}>D</th>
                    <th className={styles.th} style={{ width: '35px', textAlign: 'center' }}>L</th>
                    <th className={styles.th} style={{ width: '45px', textAlign: 'center' }}>GD</th>
                    <th className={styles.th} style={{ width: '45px', textAlign: 'center' }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeams.map((team, idx) => {
                    const pos = idx + 1;
                    const gd = team.stats.goalsFor - team.stats.goalsAgainst;
                    const gdString = gd > 0 ? `+${gd}` : gd;

                    // Row style indicator
                    let rowBorderClass = '';
                    if (pos <= 2) {
                      rowBorderClass = styles.rowQualify;
                    } else if (pos === 3) {
                      rowBorderClass = styles.rowContender;
                    } else {
                      rowBorderClass = styles.rowEliminated;
                    }

                    return (
                      <tr key={team.id} className={rowBorderClass}>
                        <td className={styles.td} style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {pos}
                        </td>
                        <td className={styles.td}>
                          <div className={styles.teamCol}>
                            <TeamFlag flag={team.flag} name={team.name} size={26} />
                            <span className={styles.bold}>{team.name}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>#{team.ranking}</span>
                          </div>
                        </td>
                        <td className={styles.td} style={{ textAlign: 'center' }}>{team.stats.played}</td>
                        <td className={styles.td} style={{ textAlign: 'center' }}>{team.stats.won}</td>
                        <td className={styles.td} style={{ textAlign: 'center' }}>{team.stats.drawn}</td>
                        <td className={styles.td} style={{ textAlign: 'center' }}>{team.stats.lost}</td>
                        <td className={styles.td} style={{ textAlign: 'center', fontWeight: gd !== 0 ? 600 : 400 }}>{gdString}</td>
                        <td className={styles.td} style={{ textAlign: 'center', fontWeight: 800, color: pos <= 2 ? 'var(--accent-green)' : pos === 3 ? 'var(--accent-gold)' : 'inherit' }}>
                          {team.stats.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </section>

      {/* Qualification Explainer */}
      <section className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(212,175,55,0.02)', border: '1px dashed var(--accent-gold)' }}>
        <Info style={{ color: 'var(--accent-gold)', flexShrink: 0 }} size={24} />
        <p style={{ fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
          <strong>Tiebreaker Criteria</strong>: If teams are level on points, positions are determined by: (1) Superior goal difference in all group matches; (2) Greatest number of goals scored in all group matches; (3) Greatest number of points obtained in group matches between teams concerned (head-to-head); (4) Fair Play points; (5) Drawing of lots by the FIFA Organizing Committee.
        </p>
      </section>
    </div>
  );
}
