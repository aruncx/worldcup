'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Tv, 
  MapPin, 
  Clock, 
  Calendar, 
  Share2, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import styles from './matches.module.css';
import { matches as mockMatches, Match, MatchEvent } from '@/lib/data/matches';
import { stadiums } from '@/lib/data/stadiums';
import { toggleFollowTeam, getUserState } from '@/app/actions';
import { useMatches } from '@/hooks/useWorldCupApi';
import { getTeamName, getMatchScore, getLiveMatches, getCompletedMatches, getUpcomingMatches, getMatchStage, getTeamFlag } from '@/lib/api/worldcup';
import LiveDataBanner from '@/components/LiveDataBanner';

function MatchCenterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // ── Live API data ────────────────────────────────────────────────────────
  const { data: liveMatches, loading: apiLoading, error: apiError, lastUpdated, refresh } = useMatches({ refreshInterval: 30000 });

  // Merge live API data with mock data (API first, mock as fallback)
  const buildMatches = (): Match[] => {
    if (!liveMatches || liveMatches.length === 0) return mockMatches;
    return liveMatches.map((m, i): Match => {
      const homeName = getTeamName(m.home_team);
      const awayName = getTeamName(m.away_team);
      const score = getMatchScore(m);
      const mockFallback = mockMatches[i % mockMatches.length];
      
      const isLive = m.status === 'in_progress' || m.status === 'live';
      const isCompleted = m.status === 'completed' || m.status === 'finished';

      return {
        id: String(m.id),
        stage: getMatchStage(m.stage, m.group, mockFallback.stage) as Match['stage'],
        group: m.group ? m.group.replace(/^GROUP_/, '') : undefined,
        homeTeamName: homeName,
        awayTeamName: awayName,
        homeTeamFlag: getTeamFlag(m.home_team) || mockFallback.homeTeamFlag,
        awayTeamFlag: getTeamFlag(m.away_team) || mockFallback.awayTeamFlag,
        homeTeamId: homeName.toLowerCase().replace(/\s/g, '-'),
        awayTeamId: awayName.toLowerCase().replace(/\s/g, '-'),
        homeScore: score.home ?? undefined,
        awayScore: score.away ?? undefined,
        status: isLive ? 'live' : isCompleted ? 'completed' : 'upcoming',
        date: m.datetime ? m.datetime.split('T')[0] : (m.date ?? mockFallback.date),
        time: m.time || mockFallback.time,
        stadiumId: mockFallback.stadiumId,
        stadiumName: m.venue ?? m.stadium ?? mockFallback.stadiumName,
        // Clean up live mock data fields to avoid leaking mock content into API data
        stats: undefined,
        timeline: undefined,
        minute: undefined,
      };
    });
  };

  const matches = buildMatches();
  
  // URL selected match id
  const selectedIdFromUrl = searchParams.get('id');
  
  // Filter States
  const [activeStageFilter, setActiveStageFilter] = useState<string>('All');
  const [activeDateFilter, setActiveDateFilter] = useState<string>('All');
  const [followedTeams, setFollowedTeams] = useState<string[]>([]);
  const [isFollowingSelected, setIsFollowingSelected] = useState(false);

  // Sync user state (followed teams)
  useEffect(() => {
    async function syncState() {
      const state = await getUserState();
      setFollowedTeams(state.followedTeams);
    }
    syncState();
  }, []);

  // Filter Match list
  const stages = ['All', 'Group Stage', 'Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];
  const dates = ['All', '2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16'];

  const filteredMatches = matches.filter(m => {
    const matchStage = activeStageFilter === 'All' || m.stage === activeStageFilter;
    const matchDate = activeDateFilter === 'All' || m.date === activeDateFilter;
    return matchStage && matchDate;
  });

  // Selected Match State
  const defaultSelectedMatch = matches.find(m => m.status === 'live') || filteredMatches[0] || matches[0];
  const activeMatch = matches.find(m => m.id === selectedIdFromUrl) || defaultSelectedMatch;

  // Sync follow state for active match home/away teams
  useEffect(() => {
    if (activeMatch) {
      const isFollowing = followedTeams.includes(activeMatch.homeTeamId) || followedTeams.includes(activeMatch.awayTeamId);
      setIsFollowingSelected(isFollowing);
    }
  }, [activeMatch, followedTeams]);

  // Handle Match Click
  const handleMatchSelect = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('id', id);
    router.push(`?${params.toString()}`);
  };

  // Follow Team handler
  const handleFollowActiveTeam = async (teamId: string) => {
    const res = await toggleFollowTeam(teamId);
    if (res.success) {
      setFollowedTeams(prev => 
        res.isFollowing ? [...prev, teamId] : prev.filter(t => t !== teamId)
      );
    }
  };

  // Helper to map event icons
  const getEventEmoji = (type: MatchEvent['type']) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'card-yellow': return '🟨';
      case 'card-red': return '🟥';
      case 'sub': return '🔄';
      case 'var': return '🖥️';
      case 'injury': return '🩹';
      default: return '📢';
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Panel: Matches Schedule */}
      <div className={styles.schedulePanel}>
        {/* Live Data Status */}
        <LiveDataBanner lastUpdated={lastUpdated} loading={apiLoading} error={apiError} onRefresh={refresh} />
        {/* Stage Filters */}
        <div className={styles.filterSection}>
          {stages.map(stage => (
            <button 
              key={stage} 
              className={`${styles.filterBtn} ${activeStageFilter === stage ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveStageFilter(stage)}
            >
              {stage}
            </button>
          ))}
        </div>

        {/* Calendar Slider */}
        <div className={styles.calendarScroll}>
          {dates.map(date => {
            const dateObj = new Date(date + 'T00:00:00');
            const dayName = date === 'All' ? 'ALL' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = date === 'All' ? 'DAYS' : dateObj.getDate();
            const isActive = activeDateFilter === date;
            
            return (
              <div 
                key={date} 
                className={`${styles.dateCard} ${isActive ? styles.dateCardActive : ''}`}
                onClick={() => setActiveDateFilter(date)}
              >
                <span className={styles.dateDay}>{dayName}</span>
                <span className={styles.dateNum}>{dayNum}</span>
              </div>
            );
          })}
        </div>

        {/* Matches List */}
        <div className={styles.matchList}>
          {filteredMatches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              No fixtures scheduled for this filter.
            </div>
          ) : (
            filteredMatches.map(m => {
              const isActive = activeMatch?.id === m.id;
              const isLive = m.status === 'live';
              const isCompleted = m.status === 'completed';
              
              return (
                <div 
                  key={m.id} 
                  className={`${styles.matchCard} ${isActive ? styles.matchCardActive : ''}`}
                  onClick={() => handleMatchSelect(m.id)}
                >
                  <div className={styles.matchCardHeader}>
                    <span>{m.stage} {m.group ? `• Group ${m.group}` : ''}</span>
                    {isLive ? (
                      <span style={{ color: 'var(--accent-red)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="status-live"></span> LIVE ({m.minute}')
                      </span>
                    ) : isCompleted ? (
                      <span style={{ fontWeight: 700 }}>FT</span>
                    ) : (
                      <span>{m.time}</span>
                    )}
                  </div>

                  <div className={styles.matchTeamsRow}>
                    <div className={styles.matchTeamLine}>
                      <div className={styles.teamNameGroup}>
                        <span>{m.homeTeamFlag}</span>
                        <span style={{ fontWeight: isActive ? 700 : 500 }}>{m.homeTeamName}</span>
                        {followedTeams.includes(m.homeTeamId) && <span style={{ fontSize: '0.65rem', color: 'var(--accent-gold)' }}>★</span>}
                      </div>
                      {(isLive || isCompleted) && (
                        <span className={styles.teamScore}>{m.homeScore}</span>
                      )}
                    </div>

                    <div className={styles.matchTeamLine}>
                      <div className={styles.teamNameGroup}>
                        <span>{m.awayTeamFlag}</span>
                        <span style={{ fontWeight: isActive ? 700 : 500 }}>{m.awayTeamName}</span>
                        {followedTeams.includes(m.awayTeamId) && <span style={{ fontSize: '0.65rem', color: 'var(--accent-gold)' }}>★</span>}
                      </div>
                      {(isLive || isCompleted) && (
                        <span className={styles.teamScore}>{m.awayScore}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={10} /> {m.stadiumName.split(' ')[0]}
                    </span>
                    <span>{m.date}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel: Match Detailed Analytics */}
      <div className={styles.detailsPanel}>
        {activeMatch ? (
          <>
            {/* Top Scoreboard */}
            <div className={styles.detailsHeader}>
              <div className={styles.detailsStage}>
                {activeMatch.stage} {activeMatch.group ? `• Group ${activeMatch.group}` : ''}
              </div>
              <div className={styles.detailsStadium}>
                🏟️ {activeMatch.stadiumName} • Capacity: {stadiums.find(s => s.id === activeMatch.stadiumId)?.capacity.toLocaleString()}
              </div>

              <div className={styles.scoreboardLarge}>
                <div className={styles.largeTeam}>
                  <span className={styles.largeFlag}>{activeMatch.homeTeamFlag}</span>
                  <span className={styles.largeTeamName}>{activeMatch.homeTeamName}</span>
                  <button 
                    onClick={() => handleFollowActiveTeam(activeMatch.homeTeamId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: followedTeams.includes(activeMatch.homeTeamId) ? 'var(--accent-gold)' : 'var(--text-muted)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontWeight: 600
                    }}
                  >
                    ★ {followedTeams.includes(activeMatch.homeTeamId) ? 'Following' : 'Follow'}
                  </button>
                </div>

                <div className={styles.largeScoreArea}>
                  {activeMatch.status !== 'upcoming' ? (
                    <>
                      <div className={styles.largeScore}>
                        <span>{activeMatch.homeScore}</span>
                        <span style={{ color: 'var(--text-muted)' }}>:</span>
                        <span>{activeMatch.awayScore}</span>
                      </div>
                      {activeMatch.status === 'live' && (
                        <div className={styles.largeLiveMinutes}>
                          <span className="status-live"></span> Live ({activeMatch.minute}')
                        </div>
                      )}
                      {activeMatch.status === 'completed' && (
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.5rem' }}>Full Time</div>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{activeMatch.time}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scheduled</div>
                    </div>
                  )}
                </div>

                <div className={styles.largeTeam}>
                  <span className={styles.largeFlag}>{activeMatch.awayTeamFlag}</span>
                  <span className={styles.largeTeamName}>{activeMatch.awayTeamName}</span>
                  <button 
                    onClick={() => handleFollowActiveTeam(activeMatch.awayTeamId)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: followedTeams.includes(activeMatch.awayTeamId) ? 'var(--accent-gold)' : 'var(--text-muted)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontWeight: 600
                    }}
                  >
                    ★ {followedTeams.includes(activeMatch.awayTeamId) ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Stats Board (only for live/completed games) */}
            {activeMatch.status !== 'upcoming' && activeMatch.stats && (
              <div>
                <h3 className={styles.statsSectionTitle}>Team Performance Matrix</h3>
                
                {/* Possession */}
                <div className={styles.statRow}>
                  <div className={styles.statLabels}>
                    <span>{activeMatch.stats.possession[0]}%</span>
                    <span>Ball Possession</span>
                    <span>{activeMatch.stats.possession[1]}%</span>
                  </div>
                  <div className={styles.statBarContainer}>
                    <div className={styles.statBarLeft} style={{ width: `${activeMatch.stats.possession[0]}%` }}></div>
                    <div className={styles.statBarRight} style={{ width: `${activeMatch.stats.possession[1]}%` }}></div>
                  </div>
                </div>

                {/* Shots on Target */}
                <div className={styles.statRow}>
                  <div className={styles.statLabels}>
                    <span>{activeMatch.stats.shotsOnTarget[0]} ({activeMatch.stats.shots[0]})</span>
                    <span>Shots on Target (Total)</span>
                    <span>{activeMatch.stats.shotsOnTarget[1]} ({activeMatch.stats.shots[1]})</span>
                  </div>
                  {(() => {
                    const totalShots = activeMatch.stats.shots[0] + activeMatch.stats.shots[1] || 1;
                    const leftWidth = (activeMatch.stats.shots[0] / totalShots) * 100;
                    const rightWidth = (activeMatch.stats.shots[1] / totalShots) * 100;
                    return (
                      <div className={styles.statBarContainer}>
                        <div className={styles.statBarLeft} style={{ width: `${leftWidth}%` }}></div>
                        <div className={styles.statBarRight} style={{ width: `${rightWidth}%` }}></div>
                      </div>
                    );
                  })()}
                </div>

                {/* Corners */}
                <div className={styles.statRow}>
                  <div className={styles.statLabels}>
                    <span>{activeMatch.stats.corners[0]}</span>
                    <span>Corner Kicks</span>
                    <span>{activeMatch.stats.corners[1]}</span>
                  </div>
                  {(() => {
                    const totalCorners = activeMatch.stats.corners[0] + activeMatch.stats.corners[1] || 1;
                    const leftWidth = (activeMatch.stats.corners[0] / totalCorners) * 100;
                    const rightWidth = (activeMatch.stats.corners[1] / totalCorners) * 100;
                    return (
                      <div className={styles.statBarContainer}>
                        <div className={styles.statBarLeft} style={{ width: `${leftWidth}%` }}></div>
                        <div className={styles.statBarRight} style={{ width: `${rightWidth}%` }}></div>
                      </div>
                    );
                  })()}
                </div>

                {/* Fouls */}
                <div className={styles.statRow}>
                  <div className={styles.statLabels}>
                    <span>{activeMatch.stats.fouls[0]}</span>
                    <span>Fouls Committed</span>
                    <span>{activeMatch.stats.fouls[1]}</span>
                  </div>
                  {(() => {
                    const totalFouls = activeMatch.stats.fouls[0] + activeMatch.stats.fouls[1] || 1;
                    const leftWidth = (activeMatch.stats.fouls[0] / totalFouls) * 100;
                    const rightWidth = (activeMatch.stats.fouls[1] / totalFouls) * 100;
                    return (
                      <div className={styles.statBarContainer}>
                        <div className={styles.statBarLeft} style={{ width: `${leftWidth}%` }}></div>
                        <div className={styles.statBarRight} style={{ width: `${rightWidth}%` }}></div>
                      </div>
                    );
                  })()}
                </div>

                {/* Cards */}
                <div className={styles.statRow}>
                  <div className={styles.statLabels}>
                    <span style={{ color: 'var(--accent-gold)' }}>🟨 {activeMatch.stats.yellowCards[0]}  🟥 {activeMatch.stats.redCards[0]}</span>
                    <span>Cards (Yellow / Red)</span>
                    <span style={{ color: 'var(--accent-gold)' }}>🟨 {activeMatch.stats.yellowCards[1]}  🟥 {activeMatch.stats.redCards[1]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Match Timeline Feed (only for live/completed games) */}
            {activeMatch.status !== 'upcoming' && activeMatch.timeline && (
              <div>
                <h3 className={styles.statsSectionTitle}>Live Match Feed Timeline</h3>
                <div className={styles.timelineList}>
                  {activeMatch.timeline.map((event, idx) => (
                    <div key={idx} className={styles.timelineNode}>
                      <span className={styles.timelineMarker}></span>
                      <div className={styles.timelineDetails}>
                        <span className={styles.timelineMinute}>{event.minute}'</span>
                        <span style={{ marginRight: '6px' }}>{getEventEmoji(event.type)}</span>
                        <span className={styles.timelineText}>{event.detail}</span>
                      </div>
                    </div>
                  ))}
                  {activeMatch.status === 'live' && (
                    <div className={styles.timelineNode}>
                      <span className="status-live" style={{ position: 'absolute', left: '-18px', top: '4px' }}></span>
                      <div className={styles.timelineDetails}>
                        <span className={styles.timelineMinute} style={{ color: 'var(--accent-red)' }}>LIVE</span>
                        <span className={styles.timelineText} style={{ color: 'var(--accent-red)', fontWeight: 700 }}>Match is in play...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Fallback info when stats/timeline are not available (e.g. live API feed matches) */}
            {activeMatch.status !== 'upcoming' && !activeMatch.stats && !activeMatch.timeline && (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                <Activity size={40} style={{ color: 'var(--accent-gold)' }} />
                <h4 style={{ fontWeight: 700 }}>Match Analytics Log</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: 1.4 }}>
                  Detailed game statistics and timeline logs are currently unavailable for this match.
                </p>
              </div>
            )}

            {/* Upcoming Pre-match Card (for upcoming matches) */}
            {activeMatch.status === 'upcoming' && (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Clock size={40} style={{ color: 'var(--accent-gold)' }} />
                <h4 style={{ fontWeight: 700 }}>Pre-Match Prediction Model</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.4 }}>
                  Lineups and official match rosters will be announced 60 minutes before kickoff. Head over to our Predictor tab to submit your score forecast!
                </p>
                <Link href="/fantasy" className="gold-gradient-bg" style={{ padding: '0.6rem 1.2rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                  Predict & Earn Points
                </Link>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
            Select a match from the schedule to view live analytics.
          </div>
        )}
      </div>
    </div>
  );
}

export default function MatchCenter() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--accent-gold)', gap: '10px' }}>
        <Tv size={24} className="animate-spin" /> Loading FIFA Match Center...
      </div>
    }>
      <MatchCenterContent />
    </Suspense>
  );
}
