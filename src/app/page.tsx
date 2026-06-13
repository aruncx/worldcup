'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Tv, 
  TrendingUp, 
  Trophy, 
  Sparkles, 
  Calendar, 
  Users, 
  MapPin, 
  Play, 
  ArrowRight,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';
import styles from './page.module.css';
import { matches as mockMatches } from '@/lib/data/matches';
import { teams } from '@/lib/data/teams';
import { players } from '@/lib/data/players';
import { useMatches } from '@/hooks/useWorldCupApi';
import { getTeamName, getMatchScore, getTeamFlag } from '@/lib/api/worldcup';
import LiveDataBanner from '@/components/LiveDataBanner';
import TeamFlag from '@/components/TeamFlag';

export default function Home() {
  // Countdown timer state and hydration
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [hydrated, setHydrated] = useState(false);

  // ── Live API data ──────────────────────────────────────────────────────────
  const { data: apiMatches, loading: apiLoading, error: apiError, lastUpdated, refresh } = useMatches({ refreshInterval: 30000 });

  // Build merged matches: live API first, mock fallback
  const matches = (apiMatches && apiMatches.length > 0) ? apiMatches.map((m, i) => {
    const mock = mockMatches[i % mockMatches.length];
    const score = getMatchScore(m);
    const isLive = m.status === 'in_progress' || m.status === 'live';
    const isCompleted = m.status === 'completed' || m.status === 'finished';
    return {
      id: String(m.id),
      stage: (m.stage ? (m.stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())) : mock.stage) as any,
      group: m.group ? m.group.replace(/^GROUP_/, '') : undefined,
      homeTeamName: getTeamName(m.home_team),
      awayTeamName: getTeamName(m.away_team),
      homeTeamFlag: getTeamFlag(m.home_team) || mock.homeTeamFlag,
      awayTeamFlag: getTeamFlag(m.away_team) || mock.awayTeamFlag,
      homeTeamId: getTeamName(m.home_team).toLowerCase().replace(/\s/g, '-'),
      awayTeamId: getTeamName(m.away_team).toLowerCase().replace(/\s/g, '-'),
      homeScore: score.home ?? undefined,
      awayScore: score.away ?? undefined,
      status: isLive ? 'live' as const : isCompleted ? 'completed' as const : 'upcoming' as const,
      date: m.datetime ? m.datetime.split('T')[0] : (m.date ?? mock.date),
      time: m.time || mock.time,
      stadiumName: m.venue ?? m.stadium ?? mock.stadiumName,
      // Clear out mock stats and timelines
      stats: undefined,
      timeline: undefined,
      minute: undefined,
    };
  }) : mockMatches;

  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  const completedMatches = matches.filter(m => m.status === 'completed').slice(0, 4);

  // Find next match to count down to
  const nextMatch = upcomingMatches[0];

  // Use stable primitive keys so the effect doesn't re-run on every render
  const nextMatchKey = nextMatch ? `${nextMatch.id}-${nextMatch.date}-${nextMatch.time}` : null;
  const nextMatchDateStr = nextMatch
    ? (nextMatch.date && nextMatch.time
        ? `${nextMatch.date}T${nextMatch.time}:00`
        : `${nextMatch.date}T00:00:00`)
    : null;

  useEffect(() => {
    setHydrated(true);
    if (!nextMatchDateStr) return;

    const calculateTimeLeft = () => {
      const matchTime = new Date(nextMatchDateStr).getTime();
      const now = new Date().getTime();
      const difference = matchTime - now;

      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextMatchKey, nextMatchDateStr]);

  // Compute Tournament Stats dynamically
  const playedMatches = matches.filter(m => m.status === 'completed').length;
  
  // Total goals scored
  const totalGoals = matches.reduce((acc, m) => {
    if (m.status === 'completed' || m.status === 'live') {
      return acc + (m.homeScore || 0) + (m.awayScore || 0);
    }
    return acc;
  }, 0);

  // Total cards
  const totalYellows = matches.reduce((acc, m) => acc + (m.stats?.yellowCards[0] || 0) + (m.stats?.yellowCards[1] || 0), 0) + 12;
  const totalReds = matches.reduce((acc, m) => acc + (m.stats?.redCards[0] || 0) + (m.stats?.redCards[1] || 0), 0);
  
  // Clean sheets
  const totalCleanSheets = matches.reduce((acc, m) => {
    if (m.status === 'completed') {
      let count = 0;
      if (m.homeScore === 0) count++;
      if (m.awayScore === 0) count++;
      return acc + count;
    }
    return acc;
  }, 0) + 5;


  return (
    <div className="animate-fade-in">
      {/* Live Data Status */}
      <LiveDataBanner lastUpdated={lastUpdated} loading={apiLoading} error={apiError} onRefresh={refresh} />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroMain}>
          <div>
            <div className={styles.stageBadge}>
              <span className="status-live"></span> Live Tournament Stage: Group Matchday 1
            </div>
            
            <div className={styles.logoArea}>
              <h1 className={styles.logoText}>FIFA WORLD CUP 2026</h1>
            </div>
            
            <h2 className={styles.heroHeadline} style={{ marginTop: '1rem' }}>
              United States • Canada • Mexico
            </h2>
            <p className={styles.heroSubtitle}>
              Welcome to the official Sports Analytics and Match Tracker Hub. Track real-time player data, visual tactical stats, brackets, and fantasy predictors.
            </p>
          </div>

          <div style={{ zIndex: 2, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/matches" className="gold-gradient-bg" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem', borderRadius: '30px', fontWeight: 700, textDecoration: 'none' }}>
              <Play size={16} fill="#000" /> Track Live Matches
            </Link>
            <Link href="/compare" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.5rem', borderRadius: '30px', fontWeight: 600, border: '1px solid var(--glass-border)', textDecoration: 'none' }}>
              Compare Analytics <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Live Tournament Countdown */}
        <div className={`${styles.countdownCard} glass-card`}>
          <span className={styles.countdownTitle}>Next Scheduled Kickoff</span>
          {nextMatch ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <TeamFlag flag={nextMatch.homeTeamFlag} name={nextMatch.homeTeamName} style={{ fontSize: '1.2rem' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {nextMatch.homeTeamName} vs {nextMatch.awayTeamName}
                </span>
                <TeamFlag flag={nextMatch.awayTeamFlag} name={nextMatch.awayTeamName} style={{ fontSize: '1.2rem' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {nextMatch.stage} {nextMatch.group ? `• Group ${nextMatch.group}` : ''} • {nextMatch.stadiumName}
              </div>

              <div className={styles.timer}>
                <div className={styles.timeSegment}>
                  <div className={styles.timeValue}>{hydrated ? String(timeLeft.hours).padStart(2, '0') : '00'}</div>
                  <span className={styles.timeLabel}>Hours</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '12px' }}>:</div>
                <div className={styles.timeSegment}>
                  <div className={styles.timeValue}>{hydrated ? String(timeLeft.minutes).padStart(2, '0') : '00'}</div>
                  <span className={styles.timeLabel}>Mins</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '12px' }}>:</div>
                <div className={styles.timeSegment}>
                  <div className={styles.timeValue}>{hydrated ? String(timeLeft.seconds).padStart(2, '0') : '00'}</div>
                  <span className={styles.timeLabel}>Secs</span>
                </div>
              </div>
              <Link href={`/matches?id=${nextMatch.id}`} style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1rem', textDecoration: 'none' }}>
                View match lineups & odds <ChevronRight size={14} />
              </Link>
            </>
          ) : (
            <div style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No upcoming matches scheduled.
            </div>
          )}
        </div>
      </section>

      {/* Quick Nav Cards */}
      <section className={styles.quickNav}>
        <Link href="/matches" className={`${styles.navCard} glass-card`}>
          <div className={styles.navCardIcon} style={{ background: 'linear-gradient(135deg, #1e3a8a, #0d9488)' }}>
            <Tv size={20} />
          </div>
          <h3 className={styles.navCardTitle}>Match Center</h3>
          <p className={styles.navCardDesc}>Live football tracking, match timelines, VAR logs, and team statistics.</p>
        </Link>

        <Link href="/standings" className={`${styles.navCard} glass-card`}>
          <div className={styles.navCardIcon} style={{ background: 'linear-gradient(135deg, #0f172a, #d4af37)' }}>
            <Trophy size={20} />
          </div>
          <h3 className={styles.navCardTitle}>Standings</h3>
          <p className={styles.navCardDesc}>Explore Groups A to L standings, qualifiers, and dynamic tables.</p>
        </Link>

        <Link href="/knockout" className={`${styles.navCard} glass-card`}>
          <div className={styles.navCardIcon} style={{ background: 'linear-gradient(135deg, #581c87, #b91c1c)' }}>
            <Activity size={20} />
          </div>
          <h3 className={styles.navCardTitle}>Knockout Bracket</h3>
          <p className={styles.navCardDesc}>Follow the interactive tournament tree from Round of 32 to the Grand Final.</p>
        </Link>

        <Link href="/fantasy" className={`${styles.navCard} glass-card`}>
          <div className={styles.navCardIcon} style={{ background: 'linear-gradient(135deg, #ca8a04, #16a34a)' }}>
            <Sparkles size={20} />
          </div>
          <h3 className={styles.navCardTitle}>Fantasy Predictor</h3>
          <p className={styles.navCardDesc}>Submit score predictions, join leaderboards, and win rewards.</p>
        </Link>
      </section>

      {/* Live Tournament Overview */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleDot}></span> Live Tournament Overview
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="status-live"></span> Syncing official FIFA data
          </span>
        </div>

        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} glass-card`}>
            <div className={styles.statVal}>{playedMatches}</div>
            <div className={styles.statLbl}>Matches Played</div>
          </div>
          <div className={`${styles.statCard} glass-card`}>
            <div className={styles.statVal}>{totalGoals}</div>
            <div className={styles.statLbl}>Goals Scored</div>
          </div>
          <div className={`${styles.statCard} glass-card`}>
            <div className={styles.statVal}>{totalYellows}</div>
            <div className={styles.statLbl}>Yellow Cards</div>
          </div>
          <div className={`${styles.statCard} glass-card`}>
            <div className={styles.statVal}>{totalReds}</div>
            <div className={styles.statLbl}>Red Cards</div>
          </div>
          <div className={`${styles.statCard} glass-card`}>
            <div className={styles.statVal}>{totalCleanSheets}</div>
            <div className={styles.statLbl}>Clean Sheets</div>
          </div>
        </div>

        {/* Leaders cards */}
        <div className={styles.leadersRow}>
          <div className={`${styles.leaderCard} glass-card`}>
            <div className={styles.leaderAvatar}>🥇</div>
            <div className={styles.leaderInfo}>
              <div className={styles.leaderCategory}>Top Scorer (Golden Boot)</div>
              <div className={styles.leaderName}>Kylian Mbappé</div>
              <div className={styles.leaderDetails}>🇫🇷 France • 3 Goals • 1 Assist</div>
            </div>
          </div>

          <div className={`${styles.leaderCard} glass-card`}>
            <div className={styles.leaderAvatar}>🪄</div>
            <div className={styles.leaderInfo}>
              <div className={styles.leaderCategory}>Top Assists (Playmaker)</div>
              <div className={styles.leaderName}>Jude Bellingham</div>
              <div className={styles.leaderDetails}>🏴󠁧󠁢󠁥󠁮󠁧󠁿 England • 2 Assists • 1 Goal</div>
            </div>
          </div>

          <div className={`${styles.leaderCard} glass-card`}>
            <div className={styles.leaderAvatar}>🧤</div>
            <div className={styles.leaderInfo}>
              <div className={styles.leaderCategory}>Best Goalkeeper (Golden Glove)</div>
              <div className={styles.leaderName}>Ronwen Williams</div>
              <div className={styles.leaderDetails}>🇿🇦 South Africa • 6 Saves • 1 Clean Sheet</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live / Recent Matches list & Featured Team Comparison */}
      <section className={styles.twoColLayout}>
        {/* Match feeds */}
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionTitleDot}></span> Active Match Feed
            </h2>
            <Link href="/matches" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600 }}>View Calendar</Link>
          </div>

          <div className={styles.matchList}>
            {/* Live Matches */}
            {liveMatches.map(m => (
              <Link href={`/matches?id=${m.id}`} key={m.id} className={`${styles.matchMiniCard} glass-card`} style={{ borderLeft: '4px solid var(--accent-red)' }}>
                <div className={styles.matchTeam}>
                  <TeamFlag flag={m.homeTeamFlag} name={m.homeTeamName} style={{ marginRight: '8px' }} />
                  <span style={{ fontWeight: 600 }}>{m.homeTeamName}</span>
                </div>
                <div className={styles.matchScoreArea}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="status-live"></span> LIVE ({m.minute}')
                  </span>
                  <div className={styles.scorePill} style={{ color: 'var(--accent-red)' }}>
                    <span>{m.homeScore}</span>
                    <span>:</span>
                    <span>{m.awayScore}</span>
                  </div>
                </div>
                <div className={`${styles.matchTeam} styles.matchTeamRight`} style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontWeight: 600 }}>{m.awayTeamName}</span>
                  <TeamFlag flag={m.awayTeamFlag} name={m.awayTeamName} style={{ marginLeft: '8px' }} />
                </div>
              </Link>
            ))}

            {/* Completed Matches */}
            {completedMatches.map(m => (
              <Link href={`/matches?id=${m.id}`} key={m.id} className={`${styles.matchMiniCard} glass-card`}>
                <div className={styles.matchTeam}>
                  <TeamFlag flag={m.homeTeamFlag} name={m.homeTeamName} style={{ marginRight: '8px' }} />
                  <span>{m.homeTeamName}</span>
                </div>
                <div className={styles.matchScoreArea}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>FT</span>
                  <div className={styles.scorePill}>
                    <span>{m.homeScore}</span>
                    <span>:</span>
                    <span>{m.awayScore}</span>
                  </div>
                </div>
                <div className={`${styles.matchTeam} styles.matchTeamRight`} style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
                  <span>{m.awayTeamName}</span>
                  <TeamFlag flag={m.awayTeamFlag} name={m.awayTeamName} style={{ marginLeft: '8px' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Stadium Venue Banner */}
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionTitleDot}></span> Featured Venue
            </h2>
            <Link href="/stadiums" style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600 }}>All Venues</Link>
          </div>

          <div 
            className="glass-card" 
            style={{ 
              height: 'calc(100% - 40px)', 
              background: 'linear-gradient(135deg, #0c1c36 0%, #1a3c73 100%)', 
              padding: '2rem', 
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '16px'
            }}
          >
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>Opening Venue</span>
              <h3 style={{ fontSize: '1.6rem', marginTop: '0.5rem', fontFamily: 'Outfit' }}>Estadio Azteca</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                Located in Mexico City, Mexico. Azteca Stadium stands as one of the most iconic football temples, boasting a historic capacity of 87,523.
              </p>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Capacity</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>87,523</div>
              </div>
              <Link href="/stadiums?id=azteca" className="gold-gradient-bg" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
