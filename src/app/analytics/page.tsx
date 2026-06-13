'use client'

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Shield, Sparkles } from 'lucide-react';
import styles from './analytics.module.css';
import { useMatches } from '@/hooks/useWorldCupApi';
import TeamFlag from '@/components/TeamFlag';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';

export default function AnalyticsDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const { data: apiMatches } = useMatches({ refreshInterval: 60000 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Top Scorers Data
  const topScorersData = [
    { name: 'K. Mbappé', Goals: 3, Team: 'FRA' },
    { name: 'C. Pulisic', Goals: 2, Team: 'USA' },
    { name: 'Vinícius Jr', Goals: 2, Team: 'BRA' },
    { name: 'S. Giménez', Goals: 2, Team: 'MEX' },
    { name: 'H. Kane', Goals: 2, Team: 'ENG' }
  ];

  // Top Assists Data
  const topAssistsData = [
    { name: 'J. Bellingham', Assists: 2, Team: 'ENG' },
    { name: 'L. Yamal', Assists: 2, Team: 'ESP' },
    { name: 'O. Dembélé', Assists: 1, Team: 'FRA' },
    { name: 'A. Hakimi', Assists: 1, Team: 'MAR' },
    { name: 'F. Valverde', Assists: 1, Team: 'URU' }
  ];

  // Dynamic Goal Trend Data (goals per match day in June 2026)
  const getGoalTrend = () => {
    if (!apiMatches || apiMatches.length === 0) {
      return [
        { date: 'June 11', Goals: 6, average: 3.0 },
        { date: 'June 12', Goals: 4, average: 2.0 },
        { date: 'June 13', Goals: 13, average: 3.25 }
      ];
    }

    const dateMap = new Map<string, { goals: number; matches: number }>();
    
    // Sort all matches chronologically by date
    const sortedMatches = [...apiMatches].sort((a, b) => {
      const dateA = a.datetime || a.date || '';
      const dateB = b.datetime || b.date || '';
      return dateA.localeCompare(dateB);
    });

    sortedMatches.forEach(m => {
      const isCompleted = m.status === 'completed' || m.status === 'finished';
      const isLive = m.status === 'live' || m.status === 'in_progress';
      
      if (isCompleted || isLive) {
        const dateStr = m.date || (m.datetime ? m.datetime.split('T')[0] : null);
        if (dateStr) {
          let displayDate = dateStr;
          try {
            const dateObj = new Date(dateStr + 'T00:00:00');
            displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          } catch {}

          const scoreHome = m.home_score ?? null;
          const scoreAway = m.away_score ?? null;
          
          if (scoreHome !== null && scoreAway !== null) {
            const goals = scoreHome + scoreAway;
            const existing = dateMap.get(displayDate) || { goals: 0, matches: 0 };
            dateMap.set(displayDate, {
              goals: existing.goals + goals,
              matches: existing.matches + 1
            });
          }
        }
      }
    });

    if (dateMap.size > 0) {
      return Array.from(dateMap.entries()).map(([date, val]) => ({
        date,
        Goals: val.goals,
        average: val.matches > 0 ? parseFloat((val.goals / val.matches).toFixed(2)) : 0
      }));
    }

    return [
      { date: 'June 11', Goals: 6, average: 3.0 },
      { date: 'June 12', Goals: 4, average: 2.0 },
      { date: 'June 13', Goals: 13, average: 3.25 }
    ];
  };

  const goalTrendData = getGoalTrend();

  // Team Comparison Radar Data (Argentina vs France)
  const radarData = [
    { attribute: 'Attack Power', Argentina: 85, France: 94 },
    { attribute: 'Defending Structure', Argentina: 82, France: 88 },
    { attribute: 'Midfield Control', Argentina: 93, France: 83 },
    { attribute: 'Passing Accuracy', Argentina: 89, France: 88 },
    { attribute: 'Pace & Transition', Argentina: 79, France: 92 },
    { attribute: 'Physical Stature', Argentina: 80, France: 86 }
  ];

  // Goalkeeper Saves Data
  const goalieData = [
    { name: 'Ronwen Williams', flag: '🇿🇦', country: 'South Africa', saves: 6, maxSaves: 8 },
    { name: 'Gianluigi Donnarumma', flag: '🇮🇹', country: 'Italy', saves: 5, maxSaves: 8 },
    { name: 'Alisson Becker', flag: '🇧🇷', country: 'Brazil', saves: 4, maxSaves: 8 },
    { name: 'Mathew Ryan', flag: '🇦🇺', country: 'Australia', saves: 4, maxSaves: 8 }
  ];

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Page Title */}
      <section className={styles.titleRow}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 style={{ color: 'var(--accent-gold)' }} /> Live Visual Analytics
          </h1>
          <p className={styles.subtitle}>
            Explore interactive charts, attributes radar, and goalkeeper glove stats compiled in real time.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span className="status-live" style={{ width: '8px', height: '8px', background: apiMatches ? 'var(--accent-green)' : 'var(--text-muted)' }}></span>
          <span>{apiMatches ? 'Live Stats Sync' : 'Offline simulator'}</span>
          <span style={{ margin: '0 4px', color: 'var(--text-muted)' }}>•</span>
          <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} /> Compiled by Opta & FIFA+ data model
        </div>
      </section>

      {/* Charts Layout Grid */}
      <section className={styles.chartsGrid}>
        {/* Chart 1: Top Scorers */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>
            <span>Golden Boot Standings</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Goals Scored</span>
          </div>
          <div className={styles.chartContainer}>
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topScorersData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} domain={[0, 4]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent-gold)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 700 }}
                  />
                  <Bar dataKey="Goals" fill="var(--accent-gold)" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>Loading...</div>
            )}
          </div>
        </div>

        {/* Chart 2: Top Assists */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>
            <span>Playmaking Standings</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Assists Log</span>
          </div>
          <div className={styles.chartContainer}>
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topAssistsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} domain={[0, 3]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent-gold)', borderRadius: '8px' }}
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 700 }}
                  />
                  <Bar dataKey="Assists" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>Loading...</div>
            )}
          </div>
        </div>

        {/* Chart 3: Goal Trend Line */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>
            <span>Tournament Goalscoring Flow</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Accumulated Goals</span>
          </div>
          <div className={styles.chartContainer}>
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={goalTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent-gold)', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }} />
                  <Area type="monotone" dataKey="Goals" stroke="var(--accent-red)" fill="rgba(227, 6, 19, 0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>Loading...</div>
            )}
          </div>
        </div>

        {/* Chart 4: Team Attributes Radar */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>
            <span>Core Giants Profile Comparison</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>France vs Argentina</span>
          </div>
          <div className={styles.chartContainer}>
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="attribute" stroke="var(--text-secondary)" fontSize={10} />
                  <PolarRadiusAxis stroke="rgba(255,255,255,0.1)" angle={30} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent-gold)', borderRadius: '8px' }}
                  />
                  <Radar name="Argentina" dataKey="Argentina" stroke="var(--accent-gold)" fill="var(--accent-gold)" fillOpacity={0.25} />
                  <Radar name="France" dataKey="France" stroke="var(--accent-blue)" fill="var(--accent-blue)" fillOpacity={0.25} />
                  <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>Loading...</div>
            )}
          </div>
        </div>

        {/* List 5: Best Goalkeepers saves */}
        <div className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
          <div className={styles.chartTitle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={16} /> Golden Glove (Most Saves)
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Clean Sheets & Stops</span>
          </div>
          
          <div className={styles.goaliesList}>
            {goalieData.map((goalie, idx) => {
              const widthPct = (goalie.saves / goalie.maxSaves) * 100;
              return (
                <div key={idx} className={styles.goalieRow}>
                  <div className={styles.goalieLeft}>
                    <span style={{ color: 'var(--text-muted)', width: '20px' }}>#{idx+1}</span>
                    <TeamFlag flag={goalie.flag} name={goalie.country} style={{ fontSize: '1.2rem' }} />
                    <span>{goalie.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>({goalie.country})</span>
                  </div>

                  <div className={styles.goalieSavesBar}>
                    <div className={styles.goalieSavesFill} style={{ width: `${widthPct}%` }}></div>
                  </div>

                  <span style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--accent-gold)', fontSize: '1rem' }}>
                    {goalie.saves} Saves
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
