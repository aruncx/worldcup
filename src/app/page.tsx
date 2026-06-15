'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { matches as mockMatches } from '@/lib/data/matches';
import { useMatches } from '@/hooks/useWorldCupApi';
import { getTeamName, getMatchScore, getTeamFlag, formatLocalTime, getLiveMinute } from '@/lib/api/worldcup';
import TeamFlag from '@/components/TeamFlag';

export default function Home() {
  const [hydrated, setHydrated] = useState(false);

  // Live API data
  const { data: apiMatches } = useMatches({ refreshInterval: 30000 });

  // Build merged matches
  const matches = (apiMatches && apiMatches.length > 0) ? apiMatches.map((m, i) => {
    const mock = mockMatches[i % mockMatches.length];
    const score = getMatchScore(m);
    const isLive = m.status === 'in_progress' || m.status === 'live';
    const isCompleted = m.status === 'completed' || m.status === 'finished';
    const rawDate = m.date || mock.date;
    const rawTime = m.time || mock.time;
    return {
      id: String(m.id),
      stage: (m.stage ? (m.stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())) : mock.stage) as any,
      group: m.group ? m.group.replace(/^GROUP_/, '') : mock.group,
      homeTeamName: getTeamName(m.home_team),
      awayTeamName: getTeamName(m.away_team),
      homeTeamFlag: getTeamFlag(m.home_team) || mock.homeTeamFlag,
      awayTeamFlag: getTeamFlag(m.away_team) || mock.awayTeamFlag,
      homeScore: score.home,
      awayScore: score.away,
      status: isLive ? 'live' as const : isCompleted ? 'completed' as const : 'upcoming' as const,
      time: formatLocalTime(rawDate, rawTime),
      kickoffTime: new Date(`${rawDate}T${rawTime}:00Z`),
      minute: isLive ? ((m as any).minute || getLiveMinute(rawDate, rawTime, m.stage)) : undefined,
    };
  }) : mockMatches.map(m => ({
    ...m,
    kickoffTime: new Date(`${m.date}T${m.time}:00Z`),
    time: formatLocalTime(m.date, m.time),
  }));

  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className={styles.hero}>
      {/* Background layers */}
      <div className={styles.heroBackground}></div>
      <div className={styles.floodlight}></div>
      <div className={styles.heroOverlay}></div>

      {/* Decorative Floating Flags */}
      <div className={styles.flagCloud} aria-hidden="true">
        <span className={styles.cloudSpan} style={{ '--x': '8%', '--y': '22%', '--d': '0s' } as React.CSSProperties}>ARG</span>
        <span className={styles.cloudSpan} style={{ '--x': '58%', '--y': '16%', '--d': '0.6s' } as React.CSSProperties}>USA</span>
        <span className={styles.cloudSpan} style={{ '--x': '72%', '--y': '66%', '--d': '2.5s' } as React.CSSProperties}>FRA</span>
        <span className={styles.cloudSpan} style={{ '--x': '86%', '--y': '30%', '--d': '1.1s' } as React.CSSProperties}>JPN</span>
        <span className={styles.cloudSpan} style={{ '--x': '42%', '--y': '80%', '--d': '3s' } as React.CSSProperties}>MEX</span>
      </div>

      <motion.div 
        className={styles.heroContent}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={styles.heroSubNav}>
          Live Scores <span>•</span> Fixtures <span>•</span> Statistics <span>•</span> Teams <span>•</span> Players
        </div>
        
        <h1 className={styles.heroTitle}>WORLD CUP 2026</h1>
        
        <p className={styles.heroSubtitle}>
          Follow every match, player, team, and statistic from the biggest football tournament on Earth. Experience live scores, immersive analytics, and more.
        </p>

        {/* Live Match Widget */}
        <div className={styles.matchWidget}>
          <div className={styles.widgetGrid}>
            {/* Render Live Matches if available */}
            {liveMatches.length > 0 ? liveMatches.slice(0, 1).map((match, i) => {
              return (
                <div key={`live-${i}`} className={styles.matchCard}>
                  <div className={styles.matchHeader}>
                    <div className={styles.headerCol}>
                      <span className={styles.statusLiveText}>
                        <span className="status-live"></span> LIVE •
                      </span>
                      <span className={styles.headerTimeLive}>{match.minute ? `${match.minute}'` : "45'"}</span>
                    </div>
                    <div className={styles.headerCol}>
                      <span className={styles.stageText}>{match.stage} •</span>
                      <span className={styles.groupText}>{match.group ? `Group ${match.group}` : 'TBD'}</span>
                    </div>
                  </div>
                  <div className={styles.matchTeams}>
                    <div className={styles.teamRow}>
                      <div className={styles.teamInfo}>
                        <TeamFlag flag={match.homeTeamFlag} name={match.homeTeamName} /> {match.homeTeamName}
                      </div>
                      <div className={styles.teamScore}>{match.homeScore ?? 0}</div>
                    </div>
                    <div className={styles.teamRow}>
                      <div className={styles.teamInfo}>
                        <TeamFlag flag={match.awayTeamFlag} name={match.awayTeamName} /> {match.awayTeamName}
                      </div>
                      <div className={styles.teamScore} style={{ color: 'var(--text-primary)' }}>{match.awayScore ?? 0}</div>
                    </div>
                  </div>
                  <MatchCountdown targetDate={(match as any).kickoffTime} status="live" />
                </div>
              );
            }) : null}

            {/* Render Upcoming Matches (Fill up to 3 cards total) */}
            {upcomingMatches.slice(0, liveMatches.length > 0 ? 2 : 3).map((match, i) => {
              return (
                <div key={`upcoming-${i}`} className={styles.matchCard}>
                  <div className={styles.matchHeader}>
                    <div className={styles.headerCol}>
                      <span className={styles.statusUpcomingText}>
                        UPCOMING •
                      </span>
                      <span className={styles.headerTimeUpcoming}>{match.time}</span>
                    </div>
                    <div className={styles.headerCol}>
                      <span className={styles.stageText}>{match.stage} •</span>
                      <span className={styles.groupText}>{match.group ? `Group ${match.group}` : 'TBD'}</span>
                    </div>
                  </div>
                  <div className={styles.matchTeams}>
                    <div className={styles.teamRow}>
                      <div className={styles.teamInfo}>
                        <TeamFlag flag={match.homeTeamFlag} name={match.homeTeamName} /> {match.homeTeamName}
                      </div>
                      <div className={styles.teamScore} style={{ color: 'var(--text-secondary)' }}>-</div>
                    </div>
                    <div className={styles.teamRow}>
                      <div className={styles.teamInfo}>
                        <TeamFlag flag={match.awayTeamFlag} name={match.awayTeamName} /> {match.awayTeamName}
                      </div>
                      <div className={styles.teamScore} style={{ color: 'var(--text-secondary)' }}>-</div>
                    </div>
                  </div>
                  <MatchCountdown targetDate={(match as any).kickoffTime} status="upcoming" />
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>48</span>
            <span className={styles.statLabel}>Nations</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>104</span>
            <span className={styles.statLabel}>Matches</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>16</span>
            <span className={styles.statLabel}>Host Cities</span>
          </div>
        </div>

        <div className={styles.heroButtons}>
          <Link href="/matches?date=today">
            <button className={styles.primaryBtn}>Watch Live Scores</button>
          </Link>
          <Link href="/standings">
            <button className={styles.secondaryBtn}>Explore Matches</button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

interface CountdownProps {
  targetDate: Date;
  status: 'live' | 'upcoming';
}

function MatchCountdown({ targetDate, status }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      let diff = 0;

      if (status === 'upcoming') {
        diff = targetDate.getTime() - now.getTime();
      } else {
        // Live match countdown to full time (90 mins + 15 min HT + 6 mins hydration breaks = 111 mins)
        const endTime = new Date(targetDate.getTime() + 111 * 60 * 1000);
        diff = endTime.getTime() - now.getTime();
      }

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, status]);

  const pad = (num: number) => String(num).padStart(2, '0');

  return (
    <div className={styles.countdownContainer}>
      {status === 'upcoming' && (
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem', textAlign: 'center' }}>
          Match starts in
        </div>
      )}
      {status === 'live' && (
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem', textAlign: 'center' }}>
          Remaining Time
        </div>
      )}
      <div className={styles.countdownTime}>
        <div className={styles.countdownBox}>
          <span className={styles.countdownNum}>{pad(timeLeft.hours)}</span>
          <span className={styles.countdownLabel}>HOURS</span>
        </div>
        <span className={styles.countdownColon}>:</span>
        <div className={styles.countdownBox}>
          <span className={styles.countdownNum}>{pad(timeLeft.minutes)}</span>
          <span className={styles.countdownLabel}>MINS</span>
        </div>
        <span className={styles.countdownColon}>:</span>
        <div className={styles.countdownBox}>
          <span className={styles.countdownNum}>{pad(timeLeft.seconds)}</span>
          <span className={styles.countdownLabel}>SECS</span>
        </div>
      </div>
    </div>
  );
}

