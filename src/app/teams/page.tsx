'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Users, Search, X, Award, Shield, ChevronRight } from 'lucide-react';
import styles from './teams.module.css';
import { teams, Team } from '@/lib/data/teams';
import { matches as localMatches } from '@/lib/data/matches';
import { toggleFollowTeam, getUserState } from '@/app/actions';
import { useTeams, useGroups, useMatches } from '@/hooks/useWorldCupApi';
import LiveDataBanner from '@/components/LiveDataBanner';
import TeamFlag from '@/components/TeamFlag';

function getConfedFromCode(code: string): string {
  const c = code.toUpperCase();
  const uefa = ['CZE', 'BIH', 'SCO', 'NOR', 'NED', 'GER', 'ESP', 'POR', 'ENG', 'FRA', 'SUI', 'SWE', 'CRO', 'BEL', 'AUT', 'ITA', 'SVK', 'UKR'];
  const conmebol = ['ARG', 'BRA', 'URU', 'COL', 'ECU', 'PAR', 'CHI', 'PER'];
  const concacaf = ['USA', 'MEX', 'CAN', 'PAN', 'HAI', 'CUW', 'HON'];
  const caf = ['RSA', 'SEN', 'MAR', 'GHA', 'CIV', 'ALG', 'CPV', 'COD', 'CMR', 'NGA', 'TUN', 'MLI'];
  const afc = ['KOR', 'JPN', 'KSA', 'IRN', 'JOR', 'IRQ', 'UZB', 'CHN', 'UAE', 'OMA'];
  if (uefa.includes(c)) return 'UEFA';
  if (conmebol.includes(c)) return 'CONMEBOL';
  if (concacaf.includes(c)) return 'CONCACAF';
  if (caf.includes(c)) return 'CAF';
  if (afc.includes(c)) return 'AFC';
  return 'OFC'; // fallback
}

function TeamsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Live API data ──────────────────────────────────────────────────────────
  const { data: apiTeams, loading: apiLoading, error: apiError, lastUpdated, refresh } = useTeams({ refreshInterval: 60000 });
  const { data: apiGroups } = useGroups({ refreshInterval: 60000 });
  const { data: apiMatches } = useMatches({ refreshInterval: 60000 });

  // Merge apiTeams & apiGroups if available
  const displayTeams = React.useMemo(() => {
    if (apiTeams && apiTeams.length > 0) {
      return apiTeams.map(at => {
        // Find local team to inherit details
        const localTeam = teams.find(
          t => t.name.toLowerCase() === at.name.toLowerCase() || 
               t.code.toLowerCase() === at.fifa_code?.toLowerCase()
        );
        
        // Find group letter from apiGroups if available
        let groupLetter = localTeam?.group || 'A';
        if (apiGroups && apiGroups.length > 0) {
          const matchingGroup = apiGroups.find(g => 
            g.standings?.some((item: any) => String(item.team.id) === String(at.id))
          );
          if (matchingGroup && matchingGroup.group) {
            groupLetter = matchingGroup.group;
          }
        }

        return {
          id: String(at.id),
          name: at.name,
          code: at.fifa_code || localTeam?.code || '',
          flag: at.flag || localTeam?.flag || '🏳️',
          ranking: localTeam ? localTeam.ranking : 50, // default ranking
          group: groupLetter,
          confederation: localTeam?.confederation || getConfedFromCode(at.fifa_code || ''),
          coach: localTeam?.coach || 'TBD Coach',
          captain: localTeam?.captain || 'TBD Captain',
          stats: localTeam?.stats || { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
          form: localTeam?.form || ['W', 'D', 'L'],
          avgPossession: localTeam?.avgPossession || 50,
          passAccuracy: localTeam?.passAccuracy || 80,
          squad: localTeam?.squad,
        };
      });
    }
    return teams;
  }, [apiTeams, apiGroups]);

  // Merge live API matches
  const displayMatches = React.useMemo((): typeof localMatches => {
    if (!apiMatches || apiMatches.length === 0) return localMatches;
    return apiMatches.map((m, i): typeof localMatches[number] => {
      const homeName = m.home_team && typeof m.home_team !== 'string' ? m.home_team.name : String(m.home_team);
      const awayName = m.away_team && typeof m.away_team !== 'string' ? m.away_team.name : String(m.away_team);
      const score = m.score || { home: m.home_score, away: m.away_score };
      const mockFallback = localMatches[i % localMatches.length];
      
      const isLive = m.status === 'in_progress' || m.status === 'live';
      const isCompleted = m.status === 'completed' || m.status === 'finished';

      return {
        id: String(m.id),
        stage: (m.stage || mockFallback.stage) as any,
        group: m.group ? m.group.replace(/^GROUP_/, '') : undefined,
        homeTeamId: typeof m.home_team === 'string' ? m.home_team : (m.home_team.fifa_code?.toLowerCase() || String(m.home_team.id)),
        homeTeamName: homeName,
        homeTeamFlag: (m.home_team && typeof m.home_team !== 'string' ? m.home_team.flag : '') || mockFallback.homeTeamFlag,
        homeScore: score.home ?? undefined,
        awayTeamId: typeof m.away_team === 'string' ? m.away_team : (m.away_team.fifa_code?.toLowerCase() || String(m.away_team.id)),
        awayTeamName: awayName,
        awayTeamFlag: (m.away_team && typeof m.away_team !== 'string' ? m.away_team.flag : '') || mockFallback.awayTeamFlag,
        awayScore: score.away ?? undefined,
        status: (isLive ? 'live' : isCompleted ? 'completed' : 'upcoming') as any,
        date: m.date || mockFallback.date,
        time: m.time || mockFallback.time,
        stadiumId: mockFallback.stadiumId,
        stadiumName: m.stadium || mockFallback.stadiumName,
        minute: mockFallback.minute,
      };
    });
  }, [apiMatches]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConfed, setActiveConfed] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [followedTeams, setFollowedTeams] = useState<string[]>([]);

  // Sync user state (followed teams)
  useEffect(() => {
    async function syncState() {
      const state = await getUserState();
      setFollowedTeams(state.followedTeams);
    }
    syncState();
  }, []);

  // Check if team ID in query params (to display details modal immediately)
  useEffect(() => {
    const teamId = searchParams.get('id');
    if (teamId) {
      const team = displayTeams.find(t => t.id === teamId);
      if (team) {
        setSelectedTeam(team);
      }
    }
  }, [searchParams, displayTeams]);

  // Confederation list
  const confeds = ['All', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC'];

  // Filtering Logic
  const filteredTeams = displayTeams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.coach.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.captain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesConfed = activeConfed === 'All' || t.confederation === activeConfed;
    return matchesSearch && matchesConfed;
  });

  const handleOpenTeamModal = (team: Team) => {
    const params = new URLSearchParams(searchParams);
    params.set('id', team.id);
    router.push(`?${params.toString()}`);
  };

  const handleCloseModal = () => {
    setSelectedTeam(null);
    const params = new URLSearchParams(searchParams);
    params.delete('id');
    router.push(`?${params.toString()}`);
  };

  const handleFollowTeamToggle = async (teamId: string) => {
    const res = await toggleFollowTeam(teamId);
    if (res.success) {
      setFollowedTeams(prev => 
        res.isFollowing ? [...prev, teamId] : prev.filter(id => id !== teamId)
      );
    }
  };

  // Find fixtures for selected team
  const getTeamFixtures = (teamId: string) => {
    return displayMatches.filter(m => m.homeTeamId === teamId || m.awayTeamId === teamId);
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Live Data Status */}
      <LiveDataBanner lastUpdated={lastUpdated} loading={apiLoading} error={apiError} onRefresh={refresh} />
      {/* Header controls */}
      <section className={styles.headerRow}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users style={{ color: 'var(--accent-gold)' }} /> Qualified Team Profiles
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Click on any of the 48 qualified team cards to view detailed tactical stats, form, and squads.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Confed Buttons */}
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--card-bg)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--card-border)', flexWrap: 'wrap' }}>
            {confeds.map(c => (
              <button
                key={c}
                onClick={() => setActiveConfed(c)}
                style={{
                  background: activeConfed === c ? 'var(--accent-gold)' : 'transparent',
                  border: 'none',
                  color: activeConfed === c ? '#000B1A' : 'var(--text-secondary)',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={styles.searchBox}>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search team, coach, captain..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Grid of Teams */}
      <section className={styles.grid}>
        {filteredTeams.map(t => {
          const isFollowing = followedTeams.includes(t.id);
          return (
            <div key={t.id} className={`${styles.card} glass-card`} onClick={() => handleOpenTeamModal(t)}>
              <div className={styles.cardTop}>
                <TeamFlag flag={t.flag} name={t.name} size={36} className={styles.flag} />
                <span className={styles.rankingBadge}>Rank #{t.ranking}</span>
              </div>
              <div>
                <h3 className={styles.teamName} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t.name} {isFollowing && <span style={{ color: 'var(--accent-gold)' }} title="Followed team">★</span>}
                </h3>
                <div className={styles.confed}>{t.confederation} • Group {t.group}</div>
              </div>

              {/* Form dots */}
              <div className={styles.formRow}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginRight: '4px', fontWeight: 600 }}>FORM:</span>
                {t.form.map((f, i) => (
                  <span 
                    key={i} 
                    className={`${styles.formDot} ${f === 'W' ? styles.dotW : f === 'D' ? styles.dotD : styles.dotL}`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Detail Modal */}
      {selectedTeam && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleCloseModal}>
              <X size={24} />
            </button>

            <div className={styles.modalHeader}>
              <TeamFlag flag={selectedTeam.flag} name={selectedTeam.name} size={60} className={styles.modalFlag} />
              <div>
                <h2 className={styles.modalInfoTitle}>{selectedTeam.name}</h2>
                <div className={styles.confed} style={{ fontSize: '0.85rem' }}>{selectedTeam.confederation} • Group {selectedTeam.group}</div>
                <button
                  onClick={() => handleFollowTeamToggle(selectedTeam.id)}
                  style={{
                    background: followedTeams.includes(selectedTeam.id) ? 'var(--accent-gold)' : 'transparent',
                    border: '1px solid var(--accent-gold)',
                    color: followedTeams.includes(selectedTeam.id) ? '#000' : 'var(--accent-gold)',
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  ★ {followedTeams.includes(selectedTeam.id) ? 'Following Team' : 'Follow Team'}
                </button>
              </div>
            </div>

            <div className={styles.modalMeta}>
              <div className={styles.metaCard}>
                <div className={styles.metaLabel}>FIFA Ranking</div>
                <div className={styles.metaVal}>#{selectedTeam.ranking}</div>
              </div>
              <div className={styles.metaCard}>
                <div className={styles.metaLabel}>Head Coach</div>
                <div className={styles.metaVal}>{selectedTeam.coach}</div>
              </div>
              <div className={styles.metaCard}>
                <div className={styles.metaLabel}>Team Captain</div>
                <div className={styles.metaVal}>{selectedTeam.captain}</div>
              </div>
            </div>

            {/* Tactical stats */}
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Tactical Indicators (Avg)</h3>
            <div className={styles.statsTable}>
              <div className={styles.statsRow}>
                <span className={styles.statsLabel}>Average Possession</span>
                <span className={styles.statsVal}>{selectedTeam.avgPossession}%</span>
              </div>
              <div className={styles.statsRow}>
                <span className={styles.statsLabel}>Passing Accuracy</span>
                <span className={styles.statsVal}>{selectedTeam.passAccuracy}%</span>
              </div>
              <div className={styles.statsRow}>
                <span className={styles.statsLabel}>Group Matches Played</span>
                <span className={styles.statsVal}>{selectedTeam.stats.played}</span>
              </div>
              <div className={styles.statsRow}>
                <span className={styles.statsLabel}>Wins / Draws / Losses</span>
                <span className={styles.statsVal}>{selectedTeam.stats.won}W / {selectedTeam.stats.drawn}D / {selectedTeam.stats.lost}L</span>
              </div>
              <div className={styles.statsRow}>
                <span className={styles.statsLabel}>Goals Scored / Conceded</span>
                <span className={styles.statsVal}>{selectedTeam.stats.goalsFor} GF / {selectedTeam.stats.goalsAgainst} GA</span>
              </div>
            </div>

            {/* Fixtures list */}
            {getTeamFixtures(selectedTeam.id).length > 0 && (
              <>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Schedule & Results</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {getTeamFixtures(selectedTeam.id).map(m => {
                    const isHome = m.homeTeamId === selectedTeam.id;
                    const opponent = isHome ? m.awayTeamName : m.homeTeamName;
                    const opponentFlag = isHome ? m.awayTeamFlag : m.homeTeamFlag;
                    const isCompleted = m.status === 'completed';
                    const isLive = m.status === 'live';
                    
                    return (
                      <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600 }}>{isHome ? 'VS' : 'AT'}</span>
                          <TeamFlag flag={opponentFlag} name={opponent} />
                          <span style={{ fontWeight: 600 }}>{opponent}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isCompleted ? (
                            <span style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>
                              {m.homeScore} : {m.awayScore} (FT)
                            </span>
                          ) : isLive ? (
                            <span style={{ color: 'var(--accent-red)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span className="status-live"></span> {m.homeScore} : {m.awayScore} ({m.minute}')
                            </span>
                          ) : (
                            <span>{m.date} • {m.time}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Squad list */}
            {selectedTeam.squad && (
              <>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem', marginTop: '1.5rem' }}>Squad Roster</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(selectedTeam.squad).map(([pos, players]) => (
                    players.length > 0 && (
                      <div key={pos} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1rem' }}>
                        <h4 style={{ textTransform: 'capitalize', color: 'var(--accent-gold)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{pos}</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {players.map(p => (
                            <span key={p} style={{ background: 'var(--bg-tertiary)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Teams() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--accent-gold)', gap: '10px' }}>
        <Users size={24} className="animate-spin" /> Loading FIFA Teams...
      </div>
    }>
      <TeamsContent />
    </Suspense>
  );
}
