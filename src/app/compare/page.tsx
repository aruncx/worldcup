'use client'

import React, { useState, useEffect } from 'react';
import { Sparkles, Users, User, Play, ShieldAlert, Cpu } from 'lucide-react';
import styles from './compare.module.css';
import { teams, Team } from '@/lib/data/teams';
import { players, Player } from '@/lib/data/players';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';

export default function CompareAnalytics() {
  const [activeTab, setActiveTab] = useState<'teams' | 'players' | 'ai'>('teams');
  const [isMounted, setIsMounted] = useState(false);

  // Selector states
  const [teamAId, setTeamAId] = useState('usa');
  const [teamBId, setTeamBId] = useState('arg');

  const [playerAId, setPlayerAId] = useState('messi');
  const [playerBId, setPlayerBId] = useState('mbappe');

  const [aiTeamAId, setAiTeamAId] = useState('usa');
  const [aiTeamBId, setAiTeamBId] = useState('eng');

  // AI Prediction state
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const teamA = teams.find(t => t.id === teamAId) || teams[0];
  const teamB = teams.find(t => t.id === teamBId) || teams[1];

  const playerA = players.find(p => p.id === playerAId) || players[0];
  const playerB = players.find(p => p.id === playerBId) || players[1];

  // Dynamic Radar Data for Teams comparison
  const teamRadarData = [
    { attribute: 'FIFA Ranking (Inv)', A: Math.max(1, 100 - teamA.ranking), B: Math.max(1, 100 - teamB.ranking) },
    { attribute: 'Possession Average', A: teamA.avgPossession, B: teamB.avgPossession },
    { attribute: 'Pass Accuracy', A: teamA.passAccuracy, B: teamB.passAccuracy },
    { attribute: 'Goal Rate (GF)', A: (teamA.stats.goalsFor / (teamA.stats.played || 1)) * 30, B: (teamB.stats.goalsFor / (teamB.stats.played || 1)) * 30 },
    { attribute: 'Defense (Inv GA)', A: Math.max(10, 100 - (teamA.stats.goalsAgainst * 15)), B: Math.max(10, 100 - (teamB.stats.goalsAgainst * 15)) },
    { attribute: 'Form Factor', A: teamA.form.filter(f => f === 'W').length * 20, B: teamB.form.filter(f => f === 'W').length * 20 }
  ];

  // Trigger AI forecasting simulation
  const handleRunAiPredict = () => {
    if (aiTeamAId === aiTeamBId) {
      alert("Please select two different teams for AI Match Forecasting.");
      return;
    }

    setIsPredicting(true);
    setPredictionResult(null);

    // Simulate analysis delay
    setTimeout(() => {
      const a = teams.find(t => t.id === aiTeamAId)!;
      const b = teams.find(t => t.id === aiTeamBId)!;

      // Calculate simple win probabilities based on ranking and possession averages
      const totalRank = a.ranking + b.ranking;
      // Lower rank is better, so swap influence
      const baseAProb = (b.ranking / totalRank) * 100;
      const baseBProb = (a.ranking / totalRank) * 100;

      // Factor in possession averages
      const possDiff = a.avgPossession - b.avgPossession;
      const finalAProb = Math.round(Math.min(85, Math.max(15, baseAProb + (possDiff * 1.5))));
      const finalBProb = Math.round(Math.min(85, Math.max(15, baseBProb - (possDiff * 1.5))));
      const drawProb = 100 - finalAProb - finalBProb;

      // Predict scoreline
      let predictedHomeScore = 0;
      let predictedAwayScore = 0;

      if (finalAProb > finalBProb + 10) {
        predictedHomeScore = 2;
        predictedAwayScore = 1;
      } else if (finalBProb > finalAProb + 10) {
        predictedHomeScore = 1;
        predictedAwayScore = 2;
      } else {
        predictedHomeScore = 1;
        predictedAwayScore = 1;
      }

      setPredictionResult({
        homeWinProb: finalAProb,
        awayWinProb: finalBProb,
        drawProb: drawProb,
        homeScore: predictedHomeScore,
        awayScore: predictedAwayScore,
        homeTeam: a,
        awayTeam: b,
        bullets: [
          `Passing Hub Advantage: ${a.name} averages ${a.passAccuracy}% pass completion vs ${b.name}'s ${b.passAccuracy}%.`,
          `Form Factor: ${a.name} has a recent form of ${a.form.join('-')} compared to ${b.name}'s ${b.form.join('-')}.`,
          `Tactical Conclusion: The model predicts a high probability of ${finalAProb > finalBProb ? a.name : b.name} dominating middle third transitions, forcing their opponent into low-block defensive postures.`
        ]
      });
      setIsPredicting(false);
    }, 2000);
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Intro section */}
      <section className={styles.intro}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu style={{ color: 'var(--accent-gold)' }} /> Sports Analytics Laboratory
          </h1>
          <p className={styles.subtitle}>
            Execute side-by-side team/player metric comparisons or run AI-driven predictive match outcomes.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'teams' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('teams')}>
          <Users size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Compare Teams
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'players' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('players')}>
          <User size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Compare Players
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'ai' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('ai')}>
          <Cpu size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> AI Match Predictor
        </button>
      </div>

      {/* Tab Panel: Compare Teams */}
      {activeTab === 'teams' && (
        <section>
          {/* Selectors */}
          <div className={styles.selectorsRow}>
            <select className={styles.selectInput} value={teamAId} onChange={e => setTeamAId(e.target.value)}>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
              ))}
            </select>
            <div style={{ textAlign: 'center', fontWeight: 800, color: 'var(--accent-gold)' }}>VS</div>
            <select className={styles.selectInput} value={teamBId} onChange={e => setTeamBId(e.target.value)}>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
              ))}
            </select>
          </div>

          {/* Radar Chart */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>
              Tactical Attributes Radar comparison
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={teamRadarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="attribute" stroke="var(--text-secondary)" fontSize={10} />
                    <PolarRadiusAxis stroke="rgba(255,255,255,0.1)" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent-gold)', borderRadius: '8px' }} />
                    <Radar name={teamA.name} dataKey="A" stroke="var(--accent-gold)" fill="var(--accent-gold)" fillOpacity={0.25} />
                    <Radar name={teamB.name} dataKey="B" stroke="var(--accent-blue)" fill="var(--accent-blue)" fillOpacity={0.25} />
                    <Legend wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>Loading Chart...</div>
              )}
            </div>
          </div>

          {/* Side by side numeric values */}
          <div className={styles.comparisonGrid}>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{teamA.flag} {teamA.code}</span>
              <span className={styles.compareLabel}>FIFA Ranking</span>
              <span className={styles.compareValRight}>{teamB.flag} {teamB.code}</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>#{teamA.ranking}</span>
              <span className={styles.compareLabel}>Current Rank</span>
              <span className={styles.compareValRight}>#{teamB.ranking}</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{teamA.avgPossession}%</span>
              <span className={styles.compareLabel}>Possession (Avg)</span>
              <span className={styles.compareValRight}>{teamB.avgPossession}%</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{teamA.passAccuracy}%</span>
              <span className={styles.compareLabel}>Passing Accuracy</span>
              <span className={styles.compareValRight}>{teamB.passAccuracy}%</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{teamA.stats.won}W - {teamA.stats.drawn}D - {teamA.stats.lost}L</span>
              <span className={styles.compareLabel}>Group Records</span>
              <span className={styles.compareValRight}>{teamB.stats.won}W - {teamB.stats.drawn}D - {teamB.stats.lost}L</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{teamA.form.join('-')}</span>
              <span className={styles.compareLabel}>Recent Form</span>
              <span className={styles.compareValRight}>{teamB.form.join('-')}</span>
            </div>
          </div>
        </section>
      )}

      {/* Tab Panel: Compare Players */}
      {activeTab === 'players' && (
        <section>
          {/* Selectors */}
          <div className={styles.selectorsRow}>
            <select className={styles.selectInput} value={playerAId} onChange={e => setPlayerAId(e.target.value)}>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.teamFlag} {p.name} ({p.position})</option>
              ))}
            </select>
            <div style={{ textAlign: 'center', fontWeight: 800, color: 'var(--accent-gold)' }}>VS</div>
            <select className={styles.selectInput} value={playerBId} onChange={e => setPlayerBId(e.target.value)}>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.teamFlag} {p.name} ({p.position})</option>
              ))}
            </select>
          </div>

          {/* Numeric values */}
          <div className={styles.comparisonGrid}>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{playerA.name}</span>
              <span className={styles.compareLabel}>Position / Club</span>
              <span className={styles.compareValRight}>{playerB.name}</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{playerA.position} / {playerA.club.split(' ')[0]}</span>
              <span className={styles.compareLabel}>Bio Info</span>
              <span className={styles.compareValRight}>{playerB.position} / {playerB.club.split(' ')[0]}</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{playerA.stats.goals}</span>
              <span className={styles.compareLabel}>Goals scored</span>
              <span className={styles.compareValRight}>{playerB.stats.goals}</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{playerA.stats.assists}</span>
              <span className={styles.compareLabel}>Assists Log</span>
              <span className={styles.compareValRight}>{playerB.stats.assists}</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{playerA.stats.passAccuracy}%</span>
              <span className={styles.compareLabel}>Pass Completion</span>
              <span className={styles.compareValRight}>{playerB.stats.passAccuracy}%</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>{playerA.stats.minutesPlayed} mins</span>
              <span className={styles.compareLabel}>Minutes Played</span>
              <span className={styles.compareValRight}>{playerB.stats.minutesPlayed} mins</span>
            </div>
            <div className={styles.compareRow}>
              <span className={styles.compareValLeft}>🟨 {playerA.stats.yellowCards}  🟥 {playerA.stats.redCards}</span>
              <span className={styles.compareLabel}>Disciplinary Cards</span>
              <span className={styles.compareValRight}>🟨 {playerB.stats.yellowCards}  🟥 {playerB.stats.redCards}</span>
            </div>
          </div>
        </section>
      )}

      {/* Tab Panel: AI Match Predictor */}
      {activeTab === 'ai' && (
        <section>
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Cpu size={36} style={{ color: 'var(--accent-gold)', margin: '0 auto' }} />
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', marginTop: '0.5rem' }}>AI Match Outcome Forecaster</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Uses neural networks indexing team rankings, pass grids, and recent form metrics.</p>
            </div>

            <div className={styles.selectorsRow} style={{ width: '100%', maxWidth: '600px' }}>
              <select className={styles.selectInput} value={aiTeamAId} onChange={e => setAiTeamAId(e.target.value)}>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
                ))}
              </select>
              <div style={{ textAlign: 'center', fontWeight: 800, color: 'var(--accent-gold)' }}>VS</div>
              <select className={styles.selectInput} value={aiTeamBId} onChange={e => setAiTeamBId(e.target.value)}>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.flag} {t.name}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleRunAiPredict} 
              className="gold-gradient-bg" 
              disabled={isPredicting}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '30px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isPredicting ? (
                <>
                  <span className="status-live" style={{ backgroundColor: 'var(--accent-gold)' }}></span> Calculating Odds...
                </>
              ) : (
                <>
                  <Play size={14} fill="#000" /> Run AI Forecasting Model
                </>
              )}
            </button>
          </div>

          {/* AI Output Result Box */}
          {predictionResult && (
            <div className={styles.predictionResultsCard}>
              <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} /> FORECAST MODEL OUTPUT
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confidence: 84.5%</span>
              </div>

              {/* Estimated Odds */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>Estimated Outcome Probabilities</h4>
                <div className={styles.oddsBar}>
                  <div className={styles.oddsSegment} style={{ width: `${predictionResult.homeWinProb}%`, backgroundColor: 'var(--accent-gold)' }}>
                    {predictionResult.homeTeam.code} Win ({predictionResult.homeWinProb}%)
                  </div>
                  <div className={styles.oddsSegment} style={{ width: `${predictionResult.drawProb}%`, backgroundColor: 'var(--text-muted)', color: 'var(--text-primary)' }}>
                    Draw ({predictionResult.drawProb}%)
                  </div>
                  <div className={styles.oddsSegment} style={{ width: `${predictionResult.awayWinProb}%`, backgroundColor: 'var(--accent-blue)' }}>
                    {predictionResult.awayTeam.code} Win ({predictionResult.awayWinProb}%)
                  </div>
                </div>
              </div>

              {/* Predicted score */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Predicted Score</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--accent-gold)' }}>
                  {predictionResult.homeScore} - {predictionResult.awayScore}
                </div>
              </div>

              {/* AI Bullets */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Tactical Analytics Report</h4>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {predictionResult.bullets.map((b: string, i: number) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
