'use client'

import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, ListOrdered, Calendar, Save, AlertCircle } from 'lucide-react';
import styles from './fantasy.module.css';
import { teams } from '@/lib/data/teams';
import { players } from '@/lib/data/players';
import { matches } from '@/lib/data/matches';
import type { UserPrediction, TournamentPrediction, LeaderboardEntry } from '@/lib/db';
import { 
  submitPrediction, 
  submitTournamentPrediction, 
  getUserState
} from '@/app/actions';

export default function FantasyPredictor() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'matches' | 'tournament' | 'leaderboard'>('matches');

  // Load User States
  const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
  const [tPrediction, setTPrediction] = useState<TournamentPrediction | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userId, setUserId] = useState<string>('');

  // Scores form states
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  
  // Tournament form states
  const [selectedWinner, setSelectedWinner] = useState('');
  const [selectedGoldenBoot, setSelectedGoldenBoot] = useState('');

  // UI Toast Alert Status
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync state from Database
  const syncState = async () => {
    const state = await getUserState();
    setUserId(state.userId);
    setUserPredictions(state.predictions);
    setTPrediction(state.tournamentPrediction);
    setLeaderboard(state.leaderboard);

    // Seed local scores input state from saved predictions
    const scoresMap: Record<string, { home: string; away: string }> = {};
    state.predictions.forEach(p => {
      scoresMap[p.matchId] = { home: String(p.homeScore), away: String(p.awayScore) };
    });
    setScores(scoresMap);

    // Seed tournament selects
    if (state.tournamentPrediction) {
      setSelectedWinner(state.tournamentPrediction.winnerTeamId);
      setSelectedGoldenBoot(state.tournamentPrediction.goldenBootPlayerId);
    }
  };

  useEffect(() => {
    syncState();
  }, []);

  // Filter only upcoming matches for prediction
  const upcomingMatches = matches.filter(m => m.status === 'upcoming').slice(0, 8);

  // Handle Score Input Change
  const handleScoreChange = (matchId: string, team: 'home' | 'away', val: string) => {
    // Keep only numbers
    const cleanVal = val.replace(/[^0-9]/g, '');
    setScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: cleanVal
      }
    }));
  };

  // Submit Match Prediction
  const handleSubmitMatchPredict = async (matchId: string) => {
    const matchScores = scores[matchId];
    if (!matchScores || matchScores.home === '' || matchScores.away === '') {
      triggerAlert('error', 'Please enter score predictions for both teams.');
      return;
    }

    const homeNum = parseInt(matchScores.home);
    const awayNum = parseInt(matchScores.away);

    const res = await submitPrediction(matchId, homeNum, awayNum);
    if (res.success) {
      triggerAlert('success', 'Score prediction saved successfully!');
      syncState(); // reload leaderboard
    } else {
      triggerAlert('error', res.error || 'Failed to save prediction.');
    }
  };

  // Submit Tournament Predictions
  const handleSaveTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWinner || !selectedGoldenBoot) {
      triggerAlert('error', 'Please select both a Tournament Winner and a Golden Boot recipient.');
      return;
    }

    const res = await submitTournamentPrediction(selectedWinner, selectedGoldenBoot);
    if (res.success) {
      triggerAlert('success', 'Tournament champion forecasts updated!');
      syncState();
    } else {
      triggerAlert('error', res.error || 'Failed to save tournament predictions.');
    }
  };

  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Intro row */}
      <section className={styles.intro}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles style={{ color: 'var(--accent-gold)' }} /> Playoff & Score Predictor
          </h1>
          <p className={styles.subtitle}>
            Submit your forecasts, compete with fans worldwide, and climb the live fantasy leaderboard.
          </p>
        </div>
        
        {/* Dynamic Success Alert Banner */}
        {alertMsg && (
          <div 
            style={{
              background: alertMsg.type === 'success' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(227, 6, 19, 0.1)',
              border: `1px solid ${alertMsg.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'}`,
              color: alertMsg.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AlertCircle size={16} /> {alertMsg.text}
          </div>
        )}
      </section>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'matches' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('matches')}>
          <Calendar size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Predict Scores
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'tournament' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('tournament')}>
          <Trophy size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Tournament Forecasts
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'leaderboard' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('leaderboard')}>
          <ListOrdered size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Leaderboard
        </button>
      </div>

      {/* Tab Panel: Predict Matches */}
      {activeTab === 'matches' && (
        <section className={styles.matchesPredictList}>
          {upcomingMatches.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: 'span 2', padding: '3rem 1rem' }}>No upcoming matches scheduled.</div>
          ) : (
            upcomingMatches.map(m => {
              const savedPredict = userPredictions.find(up => up.matchId === m.id);
              const scoresVal = scores[m.id] || { home: '', away: '' };

              return (
                <div key={m.id} className={`${styles.predictCard} glass-card`}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800 }}>
                    {m.stage} {m.group ? `• Group ${m.group}` : ''}
                  </div>

                  <div className={styles.predictTeamsArea}>
                    {/* Home Team */}
                    <div className={styles.predictTeam}>
                      <span className={styles.predictFlag}>{m.homeTeamFlag}</span>
                      <span className={styles.predictTeamName}>{m.homeTeamName}</span>
                    </div>

                    {/* Score inputs */}
                    <div className={styles.inputsGroup}>
                      <input 
                        type="text" 
                        maxLength={2} 
                        value={scoresVal.home}
                        onChange={e => handleScoreChange(m.id, 'home', e.target.value)}
                        placeholder="-"
                        className={styles.scoreInput}
                      />
                      <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>:</span>
                      <input 
                        type="text" 
                        maxLength={2} 
                        value={scoresVal.away}
                        onChange={e => handleScoreChange(m.id, 'away', e.target.value)}
                        placeholder="-"
                        className={styles.scoreInput}
                      />
                    </div>

                    {/* Away Team */}
                    <div className={styles.predictTeam}>
                      <span className={styles.predictFlag}>{m.awayTeamFlag}</span>
                      <span className={styles.predictTeamName}>{m.awayTeamName}</span>
                    </div>
                  </div>

                  <div style={{ width: '100%', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      Deadline: {m.date} • {m.time}
                    </span>
                    <button 
                      onClick={() => handleSubmitMatchPredict(m.id)}
                      className="gold-gradient-bg" 
                      style={{ 
                        padding: '0.4rem 1rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Save size={12} /> {savedPredict ? 'Update' : 'Submit'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}

      {/* Tab Panel: Tournament Forecasts */}
      {activeTab === 'tournament' && (
        <section>
          <form className={`${styles.tournamentPredictForm} glass-card`} onSubmit={handleSaveTournament}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <Trophy size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto' }} />
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', marginTop: '0.5rem' }}>Tournament Champion Models</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Submit these before the end of the group stages to claim double bonus points.</p>
            </div>

            {/* Winner Select */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Predict Overall Champion</label>
              <select 
                className={styles.selectInput}
                value={selectedWinner}
                onChange={e => setSelectedWinner(e.target.value)}
              >
                <option value="">-- Choose World Cup Winner --</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.flag} {t.name} (FIFA #{t.ranking})</option>
                ))}
              </select>
            </div>

            {/* Golden Boot Select */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Predict Golden Boot Recipient</label>
              <select 
                className={styles.selectInput}
                value={selectedGoldenBoot}
                onChange={e => setSelectedGoldenBoot(e.target.value)}
              >
                <option value="">-- Choose Top Goal Scorer --</option>
                {players.filter(p => p.position === 'Forward').map(p => (
                  <option key={p.id} value={p.id}>{p.teamFlag} {p.name} ({p.club})</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="gold-gradient-bg" 
              style={{ 
                padding: '0.8rem', 
                borderRadius: '10px', 
                fontWeight: 700, 
                border: 'none', 
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '1rem'
              }}
            >
              <Save size={16} /> Save Tournament Predictions
            </button>
          </form>
        </section>
      )}

      {/* Tab Panel: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <section className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <ListOrdered style={{ color: 'var(--accent-gold)' }} />
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem' }}>Global Prediction Leaderboard</h3>
          </div>

          <table className={styles.leaderboardTable} style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Rank</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', color: 'var(--text-muted)' }}>Player Name</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Predictions Made</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Accuracy Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map(entry => (
                <tr 
                  key={entry.username} 
                  className={entry.isCurrentUser ? styles.rowCurrentUser : ''}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                >
                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', fontWeight: 700 }}>
                    {entry.rank === 1 ? '🥇 1' : entry.rank === 2 ? '🥈 2' : entry.rank === 3 ? '🥉 3' : entry.rank}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'left', fontWeight: entry.isCurrentUser ? 700 : 500 }}>
                    {entry.username}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                    {entry.predictionsCount}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    {entry.points} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
