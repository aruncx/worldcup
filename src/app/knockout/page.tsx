'use client'

import React, { useState } from 'react';
import { Compass, HelpCircle, RefreshCw, Sparkles } from 'lucide-react';
import styles from './knockout.module.css';
import { knockoutNodes, KnockoutMatchNode } from '@/lib/data/matches';

// Deterministic mapping table for bracket advancement
// Key represents the source match node ID. Value specifies the destination node and team slot (home or away).
const ADVANCEMENT_MAP: Record<string, { nextId: string; slot: 'home' | 'away' }> = {
  // R32 -> R16
  "R32_1": { nextId: "R16_1", slot: "home" },
  "R32_2": { nextId: "R16_1", slot: "away" },
  "R32_3": { nextId: "R16_2", slot: "home" },
  "R32_4": { nextId: "R16_2", slot: "away" },
  "R32_5": { nextId: "R16_3", slot: "home" },
  "R32_6": { nextId: "R16_3", slot: "away" },
  "R32_7": { nextId: "R16_4", slot: "home" },
  "R32_8": { nextId: "R16_4", slot: "away" },
  "R32_9": { nextId: "R16_5", slot: "home" },
  "R32_10": { nextId: "R16_5", slot: "away" },
  "R32_11": { nextId: "R16_6", slot: "home" },
  "R32_12": { nextId: "R16_6", slot: "away" },
  "R32_13": { nextId: "R16_7", slot: "home" },
  "R32_14": { nextId: "R16_7", slot: "away" },
  "R32_15": { nextId: "R16_8", slot: "home" },
  "R32_16": { nextId: "R16_8", slot: "away" },

  // R16 -> QF
  "R16_1": { nextId: "QF_1", slot: "home" },
  "R16_2": { nextId: "QF_1", slot: "away" },
  "R16_3": { nextId: "QF_2", slot: "home" },
  "R16_4": { nextId: "QF_2", slot: "away" },
  "R16_5": { nextId: "QF_3", slot: "home" },
  "R16_6": { nextId: "QF_3", slot: "away" },
  "R16_7": { nextId: "QF_4", slot: "home" },
  "R16_8": { nextId: "QF_4", slot: "away" },

  // QF -> SF
  "QF_1": { nextId: "SF_1", slot: "home" },
  "QF_2": { nextId: "SF_1", slot: "away" },
  "QF_3": { nextId: "SF_2", slot: "home" },
  "QF_4": { nextId: "SF_2", slot: "away" },

  // SF -> F
  "SF_1": { nextId: "F", slot: "home" },
  "SF_2": { nextId: "F", slot: "away" }
};

export default function KnockoutBracket() {
  const [nodes, setNodes] = useState<KnockoutMatchNode[]>(knockoutNodes);
  const [highlightedTeamId, setHighlightedTeamId] = useState<string | null>(null);
  const [activeSide, setActiveSide] = useState<'all' | 'left' | 'right'>('all');

  // Filter nodes for responsive column rendering based on activeSide (to fit smaller screens)
  const getRoundNodes = (roundName: KnockoutMatchNode['round']) => {
    const roundNodes = nodes.filter(n => n.round === roundName);
    
    if (activeSide === 'all') return roundNodes;
    
    // For left/right bracket filtering
    if (roundName === 'R32') {
      return activeSide === 'left' ? roundNodes.slice(0, 8) : roundNodes.slice(8, 16);
    }
    if (roundName === 'R16') {
      return activeSide === 'left' ? roundNodes.slice(0, 4) : roundNodes.slice(4, 8);
    }
    if (roundName === 'QF') {
      return activeSide === 'left' ? roundNodes.slice(0, 2) : roundNodes.slice(2, 4);
    }
    if (roundName === 'SF') {
      return activeSide === 'left' ? [roundNodes[0]] : [roundNodes[1]];
    }
    return roundNodes; // Grand Final always shown
  };

  // Click handler to advance winner
  const handleAdvanceWinner = (nodeId: string, winnerTeam: { id: string; name: string; flag: string; code: string }) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.homeTeam || !node.awayTeam) return;

    // Determine scoreline (Winner gets 2/3, Loser gets 0/1)
    const isHomeWinner = node.homeTeam.id === winnerTeam.id;
    const homeScore = isHomeWinner ? 2 : 1;
    const awayScore = isHomeWinner ? 1 : 2;

    // 1. Update the current node's winner and scores
    let updatedNodes = nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          winnerId: winnerTeam.id,
          homeTeam: n.homeTeam ? { ...n.homeTeam, score: homeScore } : undefined,
          awayTeam: n.awayTeam ? { ...n.awayTeam, score: awayScore } : undefined
        };
      }
      return n;
    });

    // 2. Clear subsequent rounds if a previous winner was changed
    // We walk down the chain and clear teams that are no longer eligible
    const clearChain = (currentId: string, oldWinnerId: string) => {
      const adv = ADVANCEMENT_MAP[currentId];
      if (!adv) return;

      const nextNode = updatedNodes.find(n => n.id === adv.nextId);
      if (nextNode) {
        const teamInSlot = adv.slot === 'home' ? nextNode.homeTeam : nextNode.awayTeam;
        if (teamInSlot && teamInSlot.id === oldWinnerId) {
          // Clear it
          updatedNodes = updatedNodes.map(n => {
            if (n.id === adv.nextId) {
              return {
                ...n,
                winnerId: undefined,
                homeTeam: adv.slot === 'home' ? undefined : n.homeTeam,
                awayTeam: adv.slot === 'away' ? undefined : n.awayTeam
              };
            }
            return n;
          });
          // Recurse down
          clearChain(adv.nextId, oldWinnerId);
        }
      }
    };

    const oldWinnerId = node.winnerId;
    if (oldWinnerId && oldWinnerId !== winnerTeam.id) {
      clearChain(nodeId, oldWinnerId);
    }

    // 3. Advance to the next node
    const adv = ADVANCEMENT_MAP[nodeId];
    if (adv) {
      updatedNodes = updatedNodes.map(n => {
        if (n.id === adv.nextId) {
          const newTeamVal = { id: winnerTeam.id, name: winnerTeam.name, flag: winnerTeam.flag, code: winnerTeam.code };
          return {
            ...n,
            homeTeam: adv.slot === 'home' ? newTeamVal : n.homeTeam,
            awayTeam: adv.slot === 'away' ? newTeamVal : n.awayTeam
          };
        }
        return n;
      });
    }

    setNodes(updatedNodes);
  };

  // Reset bracket simulation
  const handleResetBracket = () => {
    setNodes(knockoutNodes);
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Header Controls */}
      <section className={styles.header}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass style={{ color: 'var(--accent-gold)' }} /> Playoff Knockout Tree
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Click on a team row to choose the winner and simulate their path to the trophy. Hover to trace path.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Side Selector (helps fit on mobile screen) */}
          <div className={styles.controls}>
            <button className={`${styles.controlBtn} ${activeSide === 'all' ? styles.controlBtnActive : ''}`} onClick={() => setActiveSide('all')}>Full Bracket</button>
            <button className={`${styles.controlBtn} ${activeSide === 'left' ? styles.controlBtnActive : ''}`} onClick={() => setActiveSide('left')}>Left Bracket</button>
            <button className={`${styles.controlBtn} ${activeSide === 'right' ? styles.controlBtnActive : ''}`} onClick={() => setActiveSide('right')}>Right Bracket</button>
          </div>

          <button 
            onClick={handleResetBracket}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-primary)',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> Reset Simulation
          </button>
        </div>
      </section>

      {/* Bracket Tree Wraps */}
      <div className={styles.bracketWrapper}>
        
        {/* Round of 32 */}
        <div className={styles.roundColumn}>
          <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, textAlign: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Round of 32</div>
          {getRoundNodes('R32').map(node => (
            <div key={node.id} className={styles.matchNode}>
              <div className={styles.matchNodeHeader}>
                <span>{node.label}</span>
                {node.winnerId && <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓ Done</span>}
              </div>
              
              {node.homeTeam ? (
                <div 
                  className={`${styles.teamRow} ${node.winnerId === node.homeTeam.id ? styles.teamRowActive : ''} ${highlightedTeamId === node.homeTeam.id ? styles.teamRowHighlighted : ''}`}
                  onMouseEnter={() => setHighlightedTeamId(node.homeTeam?.id || null)}
                  onMouseLeave={() => setHighlightedTeamId(null)}
                  onClick={() => handleAdvanceWinner(node.id, node.homeTeam!)}
                >
                  <div className={styles.teamInfo}>
                    <span>{node.homeTeam.flag}</span>
                    <span className={styles.teamCode}>{node.homeTeam.code}</span>
                    <span className={styles.teamName}>{node.homeTeam.name}</span>
                  </div>
                  {node.homeTeam.score !== undefined && (
                    <span className={`${styles.score} ${node.winnerId === node.homeTeam.id ? styles.scoreWinner : ''}`}>{node.homeTeam.score}</span>
                  )}
                </div>
              ) : (
                <div className={styles.placeholderTeam}>TBD (Qualifier)</div>
              )}

              {node.awayTeam ? (
                <div 
                  className={`${styles.teamRow} ${node.winnerId === node.awayTeam.id ? styles.teamRowActive : ''} ${highlightedTeamId === node.awayTeam.id ? styles.teamRowHighlighted : ''}`}
                  onMouseEnter={() => setHighlightedTeamId(node.awayTeam?.id || null)}
                  onMouseLeave={() => setHighlightedTeamId(null)}
                  onClick={() => handleAdvanceWinner(node.id, node.awayTeam!)}
                >
                  <div className={styles.teamInfo}>
                    <span>{node.awayTeam.flag}</span>
                    <span className={styles.teamCode}>{node.awayTeam.code}</span>
                    <span className={styles.teamName}>{node.awayTeam.name}</span>
                  </div>
                  {node.awayTeam.score !== undefined && (
                    <span className={`${styles.score} ${node.winnerId === node.awayTeam.id ? styles.scoreWinner : ''}`}>{node.awayTeam.score}</span>
                  )}
                </div>
              ) : (
                <div className={styles.placeholderTeam}>TBD (Qualifier)</div>
              )}
            </div>
          ))}
        </div>

        {/* Round of 16 */}
        <div className={styles.roundColumn}>
          <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, textAlign: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Round of 16</div>
          {getRoundNodes('R16').map(node => (
            <div key={node.id} className={styles.matchNode}>
              <div className={styles.matchNodeHeader}>
                <span>{node.label}</span>
                {node.winnerId && <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓</span>}
              </div>
              
              {node.homeTeam ? (
                <div 
                  className={`${styles.teamRow} ${node.winnerId === node.homeTeam.id ? styles.teamRowActive : ''} ${highlightedTeamId === node.homeTeam.id ? styles.teamRowHighlighted : ''}`}
                  onMouseEnter={() => setHighlightedTeamId(node.homeTeam?.id || null)}
                  onMouseLeave={() => setHighlightedTeamId(null)}
                  onClick={() => handleAdvanceWinner(node.id, node.homeTeam!)}
                >
                  <div className={styles.teamInfo}>
                    <span>{node.homeTeam.flag}</span>
                    <span className={styles.teamCode}>{node.homeTeam.code}</span>
                    <span className={styles.teamName}>{node.homeTeam.name}</span>
                  </div>
                  {node.homeTeam.score !== undefined && (
                    <span className={`${styles.score} ${node.winnerId === node.homeTeam.id ? styles.scoreWinner : ''}`}>{node.homeTeam.score}</span>
                  )}
                </div>
              ) : (
                <div className={styles.placeholderTeam}>R32 Contender</div>
              )}

              {node.awayTeam ? (
                <div 
                  className={`${styles.teamRow} ${node.winnerId === node.awayTeam.id ? styles.teamRowActive : ''} ${highlightedTeamId === node.awayTeam.id ? styles.teamRowHighlighted : ''}`}
                  onMouseEnter={() => setHighlightedTeamId(node.awayTeam?.id || null)}
                  onMouseLeave={() => setHighlightedTeamId(null)}
                  onClick={() => handleAdvanceWinner(node.id, node.awayTeam!)}
                >
                  <div className={styles.teamInfo}>
                    <span>{node.awayTeam.flag}</span>
                    <span className={styles.teamCode}>{node.awayTeam.code}</span>
                    <span className={styles.teamName}>{node.awayTeam.name}</span>
                  </div>
                  {node.awayTeam.score !== undefined && (
                    <span className={`${styles.score} ${node.winnerId === node.awayTeam.id ? styles.scoreWinner : ''}`}>{node.awayTeam.score}</span>
                  )}
                </div>
              ) : (
                <div className={styles.placeholderTeam}>R32 Contender</div>
              )}
            </div>
          ))}
        </div>

        {/* Quarter Finals */}
        <div className={styles.roundColumn}>
          <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, textAlign: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Quarter Finals</div>
          {getRoundNodes('QF').map(node => (
            <div key={node.id} className={styles.matchNode}>
              <div className={styles.matchNodeHeader}>
                <span>{node.label}</span>
                {node.winnerId && <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓</span>}
              </div>
              
              {node.homeTeam ? (
                <div 
                  className={`${styles.teamRow} ${node.winnerId === node.homeTeam.id ? styles.teamRowActive : ''} ${highlightedTeamId === node.homeTeam.id ? styles.teamRowHighlighted : ''}`}
                  onMouseEnter={() => setHighlightedTeamId(node.homeTeam?.id || null)}
                  onMouseLeave={() => setHighlightedTeamId(null)}
                  onClick={() => handleAdvanceWinner(node.id, node.homeTeam!)}
                >
                  <div className={styles.teamInfo}>
                    <span>{node.homeTeam.flag}</span>
                    <span className={styles.teamCode}>{node.homeTeam.code}</span>
                    <span className={styles.teamName}>{node.homeTeam.name}</span>
                  </div>
                  {node.homeTeam.score !== undefined && (
                    <span className={`${styles.score} ${node.winnerId === node.homeTeam.id ? styles.scoreWinner : ''}`}>{node.homeTeam.score}</span>
                  )}
                </div>
              ) : (
                <div className={styles.placeholderTeam}>R16 Contender</div>
              )}

              {node.awayTeam ? (
                <div 
                  className={`${styles.teamRow} ${node.winnerId === node.awayTeam.id ? styles.teamRowActive : ''} ${highlightedTeamId === node.awayTeam.id ? styles.teamRowHighlighted : ''}`}
                  onMouseEnter={() => setHighlightedTeamId(node.awayTeam?.id || null)}
                  onMouseLeave={() => setHighlightedTeamId(null)}
                  onClick={() => handleAdvanceWinner(node.id, node.awayTeam!)}
                >
                  <div className={styles.teamInfo}>
                    <span>{node.awayTeam.flag}</span>
                    <span className={styles.teamCode}>{node.awayTeam.code}</span>
                    <span className={styles.teamName}>{node.awayTeam.name}</span>
                  </div>
                  {node.awayTeam.score !== undefined && (
                    <span className={`${styles.score} ${node.winnerId === node.awayTeam.id ? styles.scoreWinner : ''}`}>{node.awayTeam.score}</span>
                  )}
                </div>
              ) : (
                <div className={styles.placeholderTeam}>R16 Contender</div>
              )}
            </div>
          ))}
        </div>

        {/* Semi Finals */}
        <div className={styles.roundColumn}>
          <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, textAlign: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Semi Finals</div>
          {getRoundNodes('SF').map(node => (
            <div key={node.id} className={styles.matchNode}>
              <div className={styles.matchNodeHeader}>
                <span>{node.label}</span>
                {node.winnerId && <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>✓</span>}
              </div>
              
              {node.homeTeam ? (
                <div 
                  className={`${styles.teamRow} ${node.winnerId === node.homeTeam.id ? styles.teamRowActive : ''} ${highlightedTeamId === node.homeTeam.id ? styles.teamRowHighlighted : ''}`}
                  onMouseEnter={() => setHighlightedTeamId(node.homeTeam?.id || null)}
                  onMouseLeave={() => setHighlightedTeamId(null)}
                  onClick={() => handleAdvanceWinner(node.id, node.homeTeam!)}
                >
                  <div className={styles.teamInfo}>
                    <span>{node.homeTeam.flag}</span>
                    <span className={styles.teamCode}>{node.homeTeam.code}</span>
                    <span className={styles.teamName}>{node.homeTeam.name}</span>
                  </div>
                  {node.homeTeam.score !== undefined && (
                    <span className={`${styles.score} ${node.winnerId === node.homeTeam.id ? styles.scoreWinner : ''}`}>{node.homeTeam.score}</span>
                  )}
                </div>
              ) : (
                <div className={styles.placeholderTeam}>QF Winner</div>
              )}

              {node.awayTeam ? (
                <div 
                  className={`${styles.teamRow} ${node.winnerId === node.awayTeam.id ? styles.teamRowActive : ''} ${highlightedTeamId === node.awayTeam.id ? styles.teamRowHighlighted : ''}`}
                  onMouseEnter={() => setHighlightedTeamId(node.awayTeam?.id || null)}
                  onMouseLeave={() => setHighlightedTeamId(null)}
                  onClick={() => handleAdvanceWinner(node.id, node.awayTeam!)}
                >
                  <div className={styles.teamInfo}>
                    <span>{node.awayTeam.flag}</span>
                    <span className={styles.teamCode}>{node.awayTeam.code}</span>
                    <span className={styles.teamName}>{node.awayTeam.name}</span>
                  </div>
                  {node.awayTeam.score !== undefined && (
                    <span className={`${styles.score} ${node.winnerId === node.awayTeam.id ? styles.scoreWinner : ''}`}>{node.awayTeam.score}</span>
                  )}
                </div>
              ) : (
                <div className={styles.placeholderTeam}>QF Winner</div>
              )}
            </div>
          ))}
        </div>

        {/* Grand Final */}
        <div className={styles.roundColumn} style={{ justifyContent: 'center' }}>
          <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 800, textAlign: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Grand Final</div>
          {getRoundNodes('F').map(node => (
            <div key={node.id} className={styles.matchNode} style={{ border: '2px solid var(--accent-gold)', scale: '1.05' }}>
              <div className={styles.matchNodeHeader} style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), transparent)' }}>
                <span>🏆 {node.label}</span>
                {node.winnerId && <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>CHAMPION</span>}
              </div>
              
              {node.homeTeam ? (
                <div 
                  className={`${styles.teamRow} ${node.winnerId === node.homeTeam.id ? styles.teamRowActive : ''} ${highlightedTeamId === node.homeTeam.id ? styles.teamRowHighlighted : ''}`}
                  onMouseEnter={() => setHighlightedTeamId(node.homeTeam?.id || null)}
                  onMouseLeave={() => setHighlightedTeamId(null)}
                  onClick={() => handleAdvanceWinner(node.id, node.homeTeam!)}
                >
                  <div className={styles.teamInfo}>
                    <span>{node.homeTeam.flag}</span>
                    <span className={styles.teamCode} style={{ color: 'var(--accent-gold)' }}>{node.homeTeam.code}</span>
                    <span className={styles.teamName}>{node.homeTeam.name}</span>
                  </div>
                  {node.homeTeam.score !== undefined && (
                    <span className={`${styles.score} ${node.winnerId === node.homeTeam.id ? styles.scoreWinner : ''}`}>{node.homeTeam.score}</span>
                  )}
                </div>
              ) : (
                <div className={styles.placeholderTeam}>SF Winner</div>
              )}

              {node.awayTeam ? (
                <div 
                  className={`${styles.teamRow} ${node.winnerId === node.awayTeam.id ? styles.teamRowActive : ''} ${highlightedTeamId === node.awayTeam.id ? styles.teamRowHighlighted : ''}`}
                  onMouseEnter={() => setHighlightedTeamId(node.awayTeam?.id || null)}
                  onMouseLeave={() => setHighlightedTeamId(null)}
                  onClick={() => handleAdvanceWinner(node.id, node.awayTeam!)}
                >
                  <div className={styles.teamInfo}>
                    <span>{node.awayTeam.flag}</span>
                    <span className={styles.teamCode} style={{ color: 'var(--accent-gold)' }}>{node.awayTeam.code}</span>
                    <span className={styles.teamName}>{node.awayTeam.name}</span>
                  </div>
                  {node.awayTeam.score !== undefined && (
                    <span className={`${styles.score} ${node.winnerId === node.awayTeam.id ? styles.scoreWinner : ''}`}>{node.awayTeam.score}</span>
                  )}
                </div>
              ) : (
                <div className={styles.placeholderTeam}>SF Winner</div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Bracket Explainer banner */}
      <section className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(212,175,55,0.02)', border: '1px dashed var(--accent-gold)', borderRadius: '12px' }}>
        <Sparkles size={20} style={{ color: 'var(--accent-gold)' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong>Pro-Tip</strong>: Use the "Left Bracket" and "Right Bracket" filters above on smaller screens or mobile devices to inspect specific matchups with absolute clarity.
        </span>
      </section>
    </div>
  );
}
