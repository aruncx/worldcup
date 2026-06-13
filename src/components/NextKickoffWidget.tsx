'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TeamFlag from './TeamFlag';
import styles from './NextKickoffWidget.module.css';
import { Match } from '@/lib/data/matches';
import { getTeamName } from '@/lib/api/worldcup';

interface Props {
  match: Match | null;
}

export default function NextKickoffWidget({ match }: Props) {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', mins: '00', secs: '00' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!match) return;

    // Parse the date and time strings. Assuming format "YYYY-MM-DD" and "HH:MM" in UTC for countdown target
    const targetDate = new Date(`${match.date}T${match.time || '00:00'}:00Z`).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ hours: '00', mins: '00', secs: '00' });
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(hours).padStart(2, '0'),
        mins: String(mins).padStart(2, '0'),
        secs: String(secs).padStart(2, '0')
      });
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [match]);

  if (!mounted || !match) return null;

  return (
    <div className={styles.widgetContainer}>
      <h3 className={styles.title}>NEXT SCHEDULED KICKOFF</h3>
      
      <div className={styles.matchup}>
        <div className={styles.team}>
          <TeamFlag flag={match.homeTeamFlag} name={match.homeTeamName} />
          <span className={styles.teamName}>{getTeamName(match.homeTeamName)}</span>
        </div>
        <div className={styles.vs}>VS</div>
        <div className={styles.team}>
          <TeamFlag flag={match.awayTeamFlag} name={match.awayTeamName} />
          <span className={styles.teamName}>{getTeamName(match.awayTeamName)}</span>
        </div>
      </div>

      <div className={styles.matchMeta}>
        {match.stage} {match.group ? `• Group ${match.group}` : ''} • {match.stadiumName}
      </div>

      <div className={styles.timerContainer}>
        <div className={styles.timeBlock}>
          <div className={styles.timeValue}>{timeLeft.hours}</div>
          <div className={styles.timeLabel}>HOURS</div>
        </div>
        <div className={styles.colon}>:</div>
        <div className={styles.timeBlock}>
          <div className={styles.timeValue}>{timeLeft.mins}</div>
          <div className={styles.timeLabel}>MINS</div>
        </div>
        <div className={styles.colon}>:</div>
        <div className={styles.timeBlock}>
          <div className={styles.timeValue}>{timeLeft.secs}</div>
          <div className={styles.timeLabel}>SECS</div>
        </div>
      </div>

      <Link href="/matches" className={styles.link}>
        View match lineups & odds &gt;
      </Link>
    </div>
  );
}
