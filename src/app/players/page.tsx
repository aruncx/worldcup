'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Search, X, Award, Eye, ShieldAlert } from 'lucide-react';
import styles from './players.module.css';
import { players, Player } from '@/lib/data/players';
import { toggleFollowPlayer, getUserState } from '@/app/actions';
import TeamFlag from '@/components/TeamFlag';

function PlayersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activePosition, setActivePosition] = useState('All');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [followedPlayers, setFollowedPlayers] = useState<string[]>([]);

  // Sync user followed players
  useEffect(() => {
    async function syncState() {
      const state = await getUserState();
      setFollowedPlayers(state.followedPlayers);
    }
    syncState();
  }, []);

  // Check if player ID is in query parameter (triggered by global search)
  useEffect(() => {
    const playerId = searchParams.get('id');
    if (playerId) {
      const player = players.find(p => p.id === playerId);
      if (player) {
        setSelectedPlayer(player);
      }
    }
  }, [searchParams]);

  // Position filter list
  const positions = ['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

  // Filtering Logic
  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = activePosition === 'All' || p.position === activePosition;
    return matchesSearch && matchesPosition;
  });

  const handleOpenPlayerModal = (player: Player) => {
    const params = new URLSearchParams(searchParams);
    params.set('id', player.id);
    router.push(`?${params.toString()}`);
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
    const params = new URLSearchParams(searchParams);
    params.delete('id');
    router.push(`?${params.toString()}`);
  };

  const handleFollowPlayerToggle = async (playerId: string) => {
    const res = await toggleFollowPlayer(playerId);
    if (res.success) {
      setFollowedPlayers(prev => 
        res.isFollowing ? [...prev, playerId] : prev.filter(id => id !== playerId)
      );
    }
  };

  // Helper for mock avatar icons depending on position
  const getPositionAvatar = (pos: Player['position']) => {
    switch (pos) {
      case 'Forward': return '🏃‍♂️';
      case 'Midfielder': return '🧠';
      case 'Defender': return '🛡️';
      case 'Goalkeeper': return '🧤';
    }
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Header section */}
      <section className={styles.headerRow}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User style={{ color: 'var(--accent-gold)' }} /> Player Insight Profiles
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Browse and search active tournament squads, individual performance metrics, and match statistics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Position tabs */}
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--card-bg)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            {positions.map(pos => (
              <button
                key={pos}
                onClick={() => setActivePosition(pos)}
                style={{
                  background: activePosition === pos ? 'var(--accent-gold)' : 'transparent',
                  border: 'none',
                  color: activePosition === pos ? '#000B1A' : 'var(--text-secondary)',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {pos}
              </button>
            ))}
          </div>

          <div className={styles.searchBox}>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search player, club, country..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Players Grid */}
      <section className={styles.grid}>
        {filteredPlayers.map(p => {
          const isFollowing = followedPlayers.includes(p.id);
          return (
            <div key={p.id} className={`${styles.card} glass-card`} onClick={() => handleOpenPlayerModal(p)}>
              <div className={styles.photoArea}>
                {getPositionAvatar(p.position)}
              </div>
              
              <div>
                <h3 className={styles.playerName} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {p.name} {isFollowing && <span style={{ color: 'var(--accent-gold)' }} title="Followed player">★</span>}
                </h3>
                <div className={styles.positionTag} style={{ marginTop: '0.25rem' }}>{p.position}</div>
              </div>

              <div className={styles.playerMetaLine}>
                <span>
                  <TeamFlag flag={p.teamFlag} name={p.teamName} style={{ marginRight: '4px' }} />
                  {p.teamName}
                </span>
                <span style={{ fontWeight: 600 }}>{p.club.split(' ')[0]}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Player details modal */}
      {selectedPlayer && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleCloseModal}>
              <X size={24} />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalPhoto}>
                {getPositionAvatar(selectedPlayer.position)}
              </div>
              <div>
                <h2 className={styles.modalName}>{selectedPlayer.name}</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.25rem' }}>
                  <span>
                    <TeamFlag flag={selectedPlayer.teamFlag} name={selectedPlayer.teamName} style={{ marginRight: '4px' }} />
                    {selectedPlayer.teamName}
                  </span>
                  <span>•</span>
                  <span>{selectedPlayer.club}</span>
                </div>
                
                <button
                  onClick={() => handleFollowPlayerToggle(selectedPlayer.id)}
                  style={{
                    background: followedPlayers.includes(selectedPlayer.id) ? 'var(--accent-gold)' : 'transparent',
                    border: '1px solid var(--accent-gold)',
                    color: followedPlayers.includes(selectedPlayer.id) ? '#000' : 'var(--accent-gold)',
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
                  ★ {followedPlayers.includes(selectedPlayer.id) ? 'Following Player' : 'Follow Player'}
                </button>
              </div>
            </div>

            {/* Numeric overview stats */}
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Tournament Aggregates</h3>
            <div className={styles.gridStats}>
              <div className={styles.statItem}>
                <div className={styles.statVal}>{selectedPlayer.stats.minutesPlayed}</div>
                <div className={styles.statLabel}>Mins Played</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statVal}>{selectedPlayer.stats.goals}</div>
                <div className={styles.statLabel}>Goals</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statVal}>{selectedPlayer.stats.assists}</div>
                <div className={styles.statLabel}>Assists</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statVal}>{selectedPlayer.stats.yellowCards}</div>
                <div className={styles.statLabel}>Yellow Cards</div>
              </div>
            </div>

            {/* Performance Gauges */}
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>Performance Attributes</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>Pass Completion Accuracy</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className={styles.barWrapper}>
                    <div className={styles.barFill} style={{ width: `${selectedPlayer.stats.passAccuracy}%` }}></div>
                  </div>
                  <span style={{ fontWeight: 700 }}>{selectedPlayer.stats.passAccuracy}%</span>
                </div>
              </div>

              {selectedPlayer.position !== 'Goalkeeper' ? (
                <div className={styles.barRow}>
                  <span className={styles.barLabel}>Successful Tackles / 90</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={styles.barWrapper}>
                      <div className={styles.barFill} style={{ width: `${(selectedPlayer.stats.tackles / 6) * 100}%` }}></div>
                    </div>
                    <span style={{ fontWeight: 700 }}>{selectedPlayer.stats.tackles}</span>
                  </div>
                </div>
              ) : (
                <div className={styles.barRow}>
                  <span className={styles.barLabel}>Goalkeeper Saves</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={styles.barWrapper}>
                      <div className={styles.barFill} style={{ width: `${(selectedPlayer.stats.saves / 8) * 100}%` }}></div>
                    </div>
                    <span style={{ fontWeight: 700 }}>{selectedPlayer.stats.saves}</span>
                  </div>
                </div>
              )}

              <div className={styles.barRow}>
                <span className={styles.barLabel}>Age & Experience</span>
                <span style={{ fontWeight: 700 }}>{selectedPlayer.age} years old</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Players() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--accent-gold)', gap: '10px' }}>
        <User size={24} className="animate-spin" /> Loading FIFA Players...
      </div>
    }>
      <PlayersContent />
    </Suspense>
  );
}
