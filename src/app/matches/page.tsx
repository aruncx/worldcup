'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Tv, 
  MapPin, 
  Clock, 
  Calendar,
  Activity, 
  ChevronRight,
} from 'lucide-react';
import styles from './matches.module.css';
import { matches as mockMatches, Match, MatchEvent } from '@/lib/data/matches';
import { stadiums } from '@/lib/data/stadiums';
import { toggleFollowTeam, getUserState } from '@/app/actions';
import { useMatches } from '@/hooks/useWorldCupApi';
import { getTeamName, getMatchScore, getMatchStage, getTeamFlag, formatLocalTime, getLiveMinute } from '@/lib/api/worldcup';
import LiveDataBanner from '@/components/LiveDataBanner';
import TeamFlag from '@/components/TeamFlag';

function MatchCenterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const matchListRef = useRef<HTMLDivElement>(null);
  
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

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
      const rawDate = m.datetime ? m.datetime.split('T')[0] : (m.date ?? mockFallback.date);
      const rawTime = m.time || mockFallback.time;

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
        minute: isLive ? ((m as any).minute || getLiveMinute(rawDate, rawTime, m.stage)) : undefined,
        date: rawDate,
        time: formatLocalTime(m.date || mockFallback.date, m.time || mockFallback.time),
        stadiumId: mockFallback.stadiumId,
        stadiumName: m.venue ?? m.stadium ?? mockFallback.stadiumName,
        stats: mockFallback.stats,
        timeline: mockFallback.timeline,
      };
    });
  };

  const matches = buildMatches();
  
  // URL selected match id
  const selectedIdFromUrl = searchParams.get('id');
  
  // Filter States
  const [activeStageFilter, setActiveStageFilter] = useState<string>('All');
  
  const dateParam = searchParams.get('date');
  const getInitialDate = () => {
    if (dateParam === 'today') {
      return new Date().toISOString().split('T')[0];
    }
    return dateParam || 'All';
  };
  const [activeDateFilter, setActiveDateFilter] = useState<string>(getInitialDate);
  const [followedTeams, setFollowedTeams] = useState<string[]>([]);

  // Sync dateParam if it changes after mount
  useEffect(() => {
    if (dateParam) {
      if (dateParam === 'today') {
        setActiveDateFilter(new Date().toISOString().split('T')[0]);
      } else {
        setActiveDateFilter(dateParam);
      }
    }
  }, [dateParam]);

  // Sync user state (followed teams)
  useEffect(() => {
    async function syncState() {
      const state = await getUserState();
      setFollowedTeams(state.followedTeams);
    }
    syncState();
  }, []);

  // Derive all unique dates from matches (sorted)
  const allDates = Array.from(new Set(matches.map(m => m.date))).sort();

  const stages = ['All', 'Group Stage', 'Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];

  // Apply stage filter; date filter is used to highlight/jump, not restrict
  const stageFiltered = matches.filter(m =>
    activeStageFilter === 'All' || m.stage === activeStageFilter
  );

  // When date filter changes, also apply it to narrow the list
  const filteredMatches = stageFiltered.filter(m =>
    activeDateFilter === 'All' || m.date === activeDateFilter
  );

  // Group filtered matches by date
  const groupedByDate: Record<string, Match[]> = {};
  filteredMatches.forEach(m => {
    if (!groupedByDate[m.date]) groupedByDate[m.date] = [];
    groupedByDate[m.date].push(m);
  });
  const sortedDates = Object.keys(groupedByDate).sort();

  // Selected Match State
  const defaultSelectedMatch = matches.find(m => m.status === 'live') || filteredMatches[0] || matches[0];
  const activeMatch = matches.find(m => m.id === selectedIdFromUrl) || defaultSelectedMatch;

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

  // Format date for section headers
  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0];
    
    let prefix = '';
    if (dateStr === todayStr) prefix = 'Today · ';
    else if (dateStr === tomorrowStr) prefix = 'Tomorrow · ';

    return prefix + d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
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

  if (!hydrated) return null;

  return (
    <div className={styles.container}>
      {/* Left Panel: Matches Schedule */}
      <div className={styles.schedulePanel}>
        {/* Live Data Status */}
        <LiveDataBanner lastUpdated={lastUpdated} loading={apiLoading} error={apiError} onRefresh={refresh} />

        {/* Stage Filters — horizontal scroll strip */}
        <div className={styles.filterScroll}>
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

        {/* Calendar Date Strip — dynamically from match dates */}
        <div className={styles.calendarScroll}>
          {/* "All" pill */}
          <div
            className={`${styles.dateCard} ${activeDateFilter === 'All' ? styles.dateCardActive : ''}`}
            onClick={() => setActiveDateFilter('All')}
          >
            <span className={styles.dateDay}>ALL</span>
            <span className={styles.dateNum}>—</span>
          </div>
          {allDates.map(date => {
            const d = new Date(date + 'T00:00:00');
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            const dayNum = d.getDate();
            const monthShort = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const hasLive = matches.some(m => m.date === date && m.status === 'live');
            const isActive = activeDateFilter === date;
            return (
              <div 
                key={date} 
                className={`${styles.dateCard} ${isActive ? styles.dateCardActive : ''}`}
                onClick={() => setActiveDateFilter(date)}
                style={{ position: 'relative' }}
              >
                {hasLive && (
                  <span style={{
                    position: 'absolute', top: 4, right: 6,
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--accent-red)', boxShadow: '0 0 4px var(--accent-red)'
                  }} />
                )}
                <span className={styles.dateDay}>{dayName}</span>
                <span className={styles.dateNum}>{dayNum}</span>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, opacity: 0.7 }}>{monthShort}</span>
              </div>
            );
          })}
        </div>

        {/* Matches List — grouped by date (scrollable area) */}
        <div className={styles.matchListScroll} ref={matchListRef}>
        <div className={styles.matchList}>
          {sortedDates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              No fixtures scheduled for this filter.
            </div>
          ) : (
            sortedDates.map(date => (
              <div key={date}>
                {/* Date section header */}
                <div className={styles.dateSectionHeader}>
                  <Calendar size={12} />
                  <span>{formatDateHeader(date)}</span>
                  <span className={styles.dateSectionCount}>{groupedByDate[date].length} match{groupedByDate[date].length !== 1 ? 'es' : ''}</span>
                </div>

                {/* Matches for this date */}
                {groupedByDate[date].map(m => {
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
                        <span>{m.stage}{m.group ? ` • Group ${m.group}` : ''}</span>
                        {isLive ? (
                          <span style={{ color: 'var(--accent-red)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="status-live"></span> LIVE
                          </span>
                        ) : isCompleted ? (
                          <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>FT</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>{m.time}</span>
                        )}
                      </div>

                      <div className={styles.matchTeamsRow}>
                        <div className={styles.matchTeamLine}>
                          <div className={styles.teamNameGroup}>
                            <TeamFlag flag={m.homeTeamFlag} name={m.homeTeamName} size={22} />
                            <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}>{m.homeTeamName}</span>
                            {followedTeams.includes(m.homeTeamId) && <span style={{ fontSize: '0.6rem', color: 'var(--accent-gold)' }}>★</span>}
                          </div>
                          {(isLive || isCompleted) && (
                            <span className={`${styles.teamScore} ${isActive ? styles.teamScoreActive : ''}`}>{m.homeScore}</span>
                          )}
                        </div>

                        <div className={styles.matchTeamLine}>
                          <div className={styles.teamNameGroup}>
                            <TeamFlag flag={m.awayTeamFlag} name={m.awayTeamName} size={22} />
                            <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}>{m.awayTeamName}</span>
                            {followedTeams.includes(m.awayTeamId) && <span style={{ fontSize: '0.6rem', color: 'var(--accent-gold)' }}>★</span>}
                          </div>
                          {(isLive || isCompleted) && (
                            <span className={`${styles.teamScore} ${isActive ? styles.teamScoreActive : ''}`}>{m.awayScore}</span>
                          )}
                        </div>
                      </div>

                      <div className={styles.matchCardFooter}>
                        <span><MapPin size={10} /> {m.stadiumName.split(' ').slice(0, 2).join(' ')}</span>
                        <span style={{ color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                          {isCompleted ? '✓ Full Time' : isLive ? '🔴 Live' : m.time}
                        </span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
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
                  <TeamFlag flag={activeMatch.homeTeamFlag} name={activeMatch.homeTeamName} size={52} className={styles.largeFlag} />
                  <span className={styles.largeTeamName}>{activeMatch.homeTeamName}</span>
                  <button 
                    onClick={() => handleFollowActiveTeam(activeMatch.homeTeamId)}
                    style={{
                      background: 'none', border: 'none',
                      color: followedTeams.includes(activeMatch.homeTeamId) ? 'var(--accent-gold)' : 'var(--text-muted)',
                      fontSize: '0.75rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600
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
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{activeMatch.date}</div>
                    </div>
                  )}
                </div>

                <div className={styles.largeTeam}>
                  <TeamFlag flag={activeMatch.awayTeamFlag} name={activeMatch.awayTeamName} size={52} className={styles.largeFlag} />
                  <span className={styles.largeTeamName}>{activeMatch.awayTeamName}</span>
                  <button 
                    onClick={() => handleFollowActiveTeam(activeMatch.awayTeamId)}
                    style={{
                      background: 'none', border: 'none',
                      color: followedTeams.includes(activeMatch.awayTeamId) ? 'var(--accent-gold)' : 'var(--text-muted)',
                      fontSize: '0.75rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600
                    }}
                  >
                    ★ {followedTeams.includes(activeMatch.awayTeamId) ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Pre-match Card */}
            {activeMatch.status === 'upcoming' && (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Clock size={40} style={{ color: 'var(--accent-gold)' }} />
                <h4 style={{ fontWeight: 700 }}>Upcoming Match</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.4 }}>
                  Lineups and official match rosters will be announced 60 minutes before kickoff.
                </p>
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
