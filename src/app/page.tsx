'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { matches as mockMatches } from '@/lib/data/matches';
import { useMatches } from '@/hooks/useWorldCupApi';
import { getTeamName, getMatchScore, getTeamFlag, formatLocalTime } from '@/lib/api/worldcup';
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
    return {
      id: String(m.id),
      stage: (m.stage ? (m.stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())) : mock.stage) as any,
      homeTeamName: getTeamName(m.home_team),
      awayTeamName: getTeamName(m.away_team),
      homeTeamFlag: getTeamFlag(m.home_team) || mock.homeTeamFlag,
      awayTeamFlag: getTeamFlag(m.away_team) || mock.awayTeamFlag,
      homeScore: score.home,
      awayScore: score.away,
      status: isLive ? 'live' as const : isCompleted ? 'completed' as const : 'upcoming' as const,
      time: formatLocalTime(m.date || mock.date, m.time || mock.time),
      minute: isLive ? "67'" : undefined, // Mocked live minute for demo
    };
  }) : mockMatches;

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
          <Link href="/matches">
            <button className={styles.primaryBtn}>Watch Live Scores</button>
          </Link>
          <Link href="/standings">
            <button className={styles.secondaryBtn}>Explore Matches</button>
          </Link>
        </div>

        {/* Live Match Widget */}
        <div className={styles.matchWidget}>
          <div className={styles.widgetGrid}>
            {/* Render Live Matches if available */}
            {liveMatches.length > 0 ? liveMatches.slice(0, 1).map((match, i) => (
              <div key={`live-${i}`} className={styles.matchCard}>
                <div className={styles.matchHeader}>
                  <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="status-live"></span> Live • {match.minute || "45'"}
                  </span>
                  <span>{match.stage || match.group}</span>
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
              </div>
            )) : null}

            {/* Render Upcoming Matches (Fill up to 3 cards total) */}
            {upcomingMatches.slice(0, liveMatches.length > 0 ? 2 : 3).map((match, i) => (
              <div key={`upcoming-${i}`} className={styles.matchCard}>
                <div className={styles.matchHeader}>
                  <span style={{ color: 'var(--accent-primary)' }}>Upcoming • {match.time}</span>
                  <span>{match.stage || match.group}</span>
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
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
