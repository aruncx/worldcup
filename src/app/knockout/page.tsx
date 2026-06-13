'use client'

import React, { useState, useMemo } from 'react';
import { Compass, RefreshCw, Sparkles, Clock, Wifi } from 'lucide-react';
import styles from './knockout.module.css';
import { knockoutNodes, KnockoutMatchNode } from '@/lib/data/matches';
import { teams as localTeams, Team } from '@/lib/data/teams';
import { matches as localMatches } from '@/lib/data/matches';
import { useGroups } from '@/hooks/useWorldCupApi';
import TeamFlag from '@/components/TeamFlag';

// ─── Bracket advancement map ──────────────────────────────────────────────────
const ADVANCEMENT_MAP: Record<string, { nextId: string; slot: 'home' | 'away' }> = {
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
  "R16_1": { nextId: "QF_1", slot: "home" },
  "R16_2": { nextId: "QF_1", slot: "away" },
  "R16_3": { nextId: "QF_2", slot: "home" },
  "R16_4": { nextId: "QF_2", slot: "away" },
  "R16_5": { nextId: "QF_3", slot: "home" },
  "R16_6": { nextId: "QF_3", slot: "away" },
  "R16_7": { nextId: "QF_4", slot: "home" },
  "R16_8": { nextId: "QF_4", slot: "away" },
  "QF_1": { nextId: "SF_1", slot: "home" },
  "QF_2": { nextId: "SF_1", slot: "away" },
  "QF_3": { nextId: "SF_2", slot: "home" },
  "QF_4": { nextId: "SF_2", slot: "away" },
  "SF_1": { nextId: "F", slot: "home" },
  "SF_2": { nextId: "F", slot: "away" },
};

// Official WC 2026 R32 bracket seeding pairs (groupWinner / groupRunnerUp)
// Format: [homeSlot, awaySlot] where each slot = { group: 'A', position: 1 | 2 }
const R32_SEEDING: Array<{ id: string; home: { g: string; pos: 1 | 2 }; away: { g: string; pos: 1 | 2 } }> = [
  { id: "R32_1",  home: { g: "A", pos: 1 }, away: { g: "B", pos: 2 } },
  { id: "R32_2",  home: { g: "B", pos: 1 }, away: { g: "A", pos: 2 } },
  { id: "R32_3",  home: { g: "C", pos: 1 }, away: { g: "D", pos: 2 } },
  { id: "R32_4",  home: { g: "D", pos: 1 }, away: { g: "C", pos: 2 } },
  { id: "R32_5",  home: { g: "E", pos: 1 }, away: { g: "F", pos: 2 } },
  { id: "R32_6",  home: { g: "F", pos: 1 }, away: { g: "E", pos: 2 } },
  { id: "R32_7",  home: { g: "G", pos: 1 }, away: { g: "H", pos: 2 } },
  { id: "R32_8",  home: { g: "H", pos: 1 }, away: { g: "G", pos: 2 } },
  { id: "R32_9",  home: { g: "I", pos: 1 }, away: { g: "J", pos: 2 } },
  { id: "R32_10", home: { g: "J", pos: 1 }, away: { g: "I", pos: 2 } },
  { id: "R32_11", home: { g: "K", pos: 1 }, away: { g: "L", pos: 2 } },
  { id: "R32_12", home: { g: "L", pos: 1 }, away: { g: "K", pos: 2 } },
  { id: "R32_13", home: { g: "A", pos: 1 }, away: { g: "C", pos: 2 } }, // cross-bracket
  { id: "R32_14", home: { g: "B", pos: 1 }, away: { g: "D", pos: 2 } },
  { id: "R32_15", home: { g: "E", pos: 1 }, away: { g: "G", pos: 2 } },
  { id: "R32_16", home: { g: "F", pos: 1 }, away: { g: "H", pos: 2 } },
];

// Compute local group standings (mirror of standings page logic)
function computeGroupStandings(groupLetter: string): Team[] {
  const groupTeams = localTeams.filter(t => t.group === groupLetter);
  const map = new Map<string, Team>();
  groupTeams.forEach(t => map.set(t.id, {
    ...t,
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }
  }));

  localMatches
    .filter(m => m.group === groupLetter && (m.status === 'completed' || m.status === 'live'))
    .forEach(m => {
      const h = map.get(m.homeTeamId);
      const a = map.get(m.awayTeamId);
      if (h && a && m.homeScore !== undefined && m.awayScore !== undefined) {
        h.stats.played++; a.stats.played++;
        h.stats.goalsFor += m.homeScore; h.stats.goalsAgainst += m.awayScore;
        a.stats.goalsFor += m.awayScore; a.stats.goalsAgainst += m.homeScore;
        if (m.homeScore > m.awayScore) { h.stats.won++; h.stats.points += 3; a.stats.lost++; }
        else if (m.awayScore > m.homeScore) { a.stats.won++; a.stats.points += 3; h.stats.lost++; }
        else { h.stats.drawn++; h.stats.points++; a.stats.drawn++; a.stats.points++; }
      }
    });

  return Array.from(map.values()).sort((a, b) => {
    if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
    const gdA = a.stats.goalsFor - a.stats.goalsAgainst;
    const gdB = b.stats.goalsFor - b.stats.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    if (b.stats.goalsFor !== a.stats.goalsFor) return b.stats.goalsFor - a.stats.goalsFor;
    return a.ranking - b.ranking;
  });
}

type TeamSlot = { id: string; name: string; flag: string; code: string; score?: number };

export default function KnockoutBracket() {
  const [baseNodes] = useState<KnockoutMatchNode[]>(knockoutNodes);
  const [simNodes, setSimNodes] = useState<KnockoutMatchNode[]>(knockoutNodes);
  const [highlightedTeamId, setHighlightedTeamId] = useState<string | null>(null);
  const [activeSide, setActiveSide] = useState<'all' | 'left' | 'right'>('all');

  // Live group standings from API
  const { data: apiGroups, loading, error, lastUpdated, refresh } = useGroups({ refreshInterval: 60000 });

  // Derive the best 2 teams per group from live API or local standings
  const groupSeeds = useMemo(() => {
    const allGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const result: Record<string, [TeamSlot | null, TeamSlot | null]> = {};

    allGroups.forEach(gl => {
      // Try live API first
      let top2: TeamSlot[] = [];

      if (apiGroups && apiGroups.length > 0) {
        const apiGroup = apiGroups.find(g => g.group === gl || g.letter === gl || g.name?.includes(gl));
        const standing = apiGroup?.standings ?? apiGroup?.teams ?? [];
        if (standing.length >= 2) {
          top2 = standing.slice(0, 2).map((item: any) => {
            const teamData = typeof item.team === 'object' ? item.team : {};
            const local = localTeams.find(t =>
              t.group === gl && (
                t.name.toLowerCase() === (teamData.name || '').toLowerCase() ||
                t.code.toLowerCase() === (teamData.fifa_code || '').toLowerCase()
              )
            );
            return {
              id: String(teamData.id || local?.id || teamData.name || 'tbd'),
              name: teamData.name || local?.name || 'TBD',
              flag: local?.flag || teamData.flag || '🏳️',
              code: teamData.fifa_code || local?.code || '???',
            };
          });
        }
      }

      // Fallback: local computed standings
      if (top2.length < 2) {
        const local = computeGroupStandings(gl).slice(0, 2);
        top2 = local.map(t => ({ id: t.id, name: t.name, flag: t.flag, code: t.code }));
      }

      result[gl] = [top2[0] ?? null, top2[1] ?? null];
    });

    return result;
  }, [apiGroups]);

  // Build R32-seeded nodes (auto-seed from groupSeeds)
  const nodes = useMemo(() => {
    return simNodes.map(node => {
      const seeding = R32_SEEDING.find(s => s.id === node.id);
      if (!seeding) return node;

      // Check if simulation already added a team (from user's simulate clicks on later rounds)
      // For R32 nodes, always use live seeding unless user has explicitly set scores (simulation)
      if (node.winnerId) return node; // user simulated this match — keep

      const homeSlot = groupSeeds[seeding.home.g]?.[seeding.home.pos - 1];
      const awaySlot = groupSeeds[seeding.away.g]?.[seeding.away.pos - 1];

      return {
        ...node,
        homeTeam: homeSlot
          ? { ...homeSlot }
          : node.homeTeam,
        awayTeam: awaySlot
          ? { ...awaySlot }
          : node.awayTeam,
        // Label now shows seeding context
        label: `${seeding.home.pos === 1 ? '1' : '2'}${seeding.home.g} vs ${seeding.away.pos === 1 ? '1' : '2'}${seeding.away.g}`,
      };
    });
  }, [simNodes, groupSeeds]);

  const getRoundNodes = (roundName: KnockoutMatchNode['round']) => {
    const roundNodes = nodes.filter(n => n.round === roundName);
    if (activeSide === 'all') return roundNodes;
    if (roundName === 'R32') return activeSide === 'left' ? roundNodes.slice(0, 8) : roundNodes.slice(8, 16);
    if (roundName === 'R16') return activeSide === 'left' ? roundNodes.slice(0, 4) : roundNodes.slice(4, 8);
    if (roundName === 'QF') return activeSide === 'left' ? roundNodes.slice(0, 2) : roundNodes.slice(2, 4);
    if (roundName === 'SF') return activeSide === 'left' ? [roundNodes[0]] : [roundNodes[1]];
    return roundNodes;
  };

  // Advance a winner through the bracket (simulation for R16+)
  const handleAdvanceWinner = (nodeId: string, winnerTeam: TeamSlot) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.homeTeam || !node.awayTeam) return;

    const isHomeWinner = node.homeTeam.id === winnerTeam.id;
    const homeScore = isHomeWinner ? 2 : 1;
    const awayScore = isHomeWinner ? 1 : 2;

    let updated = simNodes.map(n => {
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

    const clearChain = (currentId: string, oldWinnerId: string) => {
      const adv = ADVANCEMENT_MAP[currentId];
      if (!adv) return;
      const nextNode = updated.find(n => n.id === adv.nextId);
      if (nextNode) {
        const teamInSlot = adv.slot === 'home' ? nextNode.homeTeam : nextNode.awayTeam;
        if (teamInSlot && teamInSlot.id === oldWinnerId) {
          updated = updated.map(n => {
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
          clearChain(adv.nextId, oldWinnerId);
        }
      }
    };

    const existingNode = nodes.find(n => n.id === nodeId);
    const oldWinnerId = existingNode?.winnerId;
    if (oldWinnerId && oldWinnerId !== winnerTeam.id) clearChain(nodeId, oldWinnerId);

    const adv = ADVANCEMENT_MAP[nodeId];
    if (adv) {
      updated = updated.map(n => {
        if (n.id === adv.nextId) {
          const newTeam = { id: winnerTeam.id, name: winnerTeam.name, flag: winnerTeam.flag, code: winnerTeam.code };
          return {
            ...n,
            homeTeam: adv.slot === 'home' ? newTeam : n.homeTeam,
            awayTeam: adv.slot === 'away' ? newTeam : n.awayTeam
          };
        }
        return n;
      });
    }

    setSimNodes(updated);
  };

  const handleResetBracket = () => setSimNodes(baseNodes);

  // Check whether group stage matches are all done
  const groupMatches = localMatches.filter(m => m.stage === 'Group Stage');
  const groupMatchesDone = groupMatches.filter(m => m.status === 'completed').length;
  const groupMatchesTotal = groupMatches.length;
  const groupStageComplete = groupMatchesDone === groupMatchesTotal;

  // Reusable team row renderer
  const renderTeamRow = (
    node: KnockoutMatchNode,
    team: TeamSlot | undefined,
    slot: 'home' | 'away',
    placeholder: string
  ) => {
    if (!team) {
      return (
        <div className={styles.placeholderTeam}>
          <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>⏳</span> {placeholder}
        </div>
      );
    }
    return (
      <div
        className={`${styles.teamRow} ${node.winnerId === team.id ? styles.teamRowActive : ''} ${highlightedTeamId === team.id ? styles.teamRowHighlighted : ''}`}
        onMouseEnter={() => setHighlightedTeamId(team.id)}
        onMouseLeave={() => setHighlightedTeamId(null)}
        onClick={() => handleAdvanceWinner(node.id, team)}
      >
        <div className={styles.teamInfo}>
          <TeamFlag flag={team.flag} name={team.name} size={18} />
          <span className={styles.teamCode}>{team.code}</span>
          <span className={styles.teamName}>{team.name}</span>
        </div>
        {team.score !== undefined && (
          <span className={`${styles.score} ${node.winnerId === team.id ? styles.scoreWinner : ''}`}>
            {team.score}
          </span>
        )}
      </div>
    );
  };

  // Render a round column
  const renderRound = (
    roundName: KnockoutMatchNode['round'],
    title: string,
    homePlaceholder: string,
    awayPlaceholder: string,
    isGrandFinal = false
  ) => (
    <div className={styles.roundColumn} style={isGrandFinal ? { justifyContent: 'center' } : undefined}>
      <div style={{
        textTransform: 'uppercase',
        fontSize: '0.7rem',
        color: 'var(--accent-gold)',
        fontWeight: 800,
        textAlign: 'center',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '0.5rem',
        marginBottom: isGrandFinal ? '1rem' : undefined
      }}>{title}</div>

      {getRoundNodes(roundName).map(node => (
        <div
          key={node.id}
          className={styles.matchNode}
          style={isGrandFinal ? { border: '2px solid var(--accent-gold)', scale: '1.05' } : undefined}
        >
          <div
            className={styles.matchNodeHeader}
            style={isGrandFinal ? { background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), transparent)' } : undefined}
          >
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {isGrandFinal ? '🏆' : ''} {node.label}
            </span>
            {node.winnerId && (
              <span style={{ color: isGrandFinal ? 'var(--accent-gold)' : 'var(--accent-green)', fontWeight: 700 }}>
                {isGrandFinal ? 'CHAMPION' : '✓'}
              </span>
            )}
          </div>

          {renderTeamRow(node, node.homeTeam, 'home', homePlaceholder)}
          {renderTeamRow(node, node.awayTeam, 'away', awayPlaceholder)}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`${styles.container} animate-fade-in`}>

      {/* Header */}
      <section className={styles.header}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass style={{ color: 'var(--accent-gold)' }} /> Playoff Knockout Tree
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            R32 seeds update automatically from live group standings. Click a team in R16+ to simulate the path to the trophy.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className={styles.controls}>
            <button className={`${styles.controlBtn} ${activeSide === 'all' ? styles.controlBtnActive : ''}`} onClick={() => setActiveSide('all')}>Full Bracket</button>
            <button className={`${styles.controlBtn} ${activeSide === 'left' ? styles.controlBtnActive : ''}`} onClick={() => setActiveSide('left')}>Left Bracket</button>
            <button className={`${styles.controlBtn} ${activeSide === 'right' ? styles.controlBtnActive : ''}`} onClick={() => setActiveSide('right')}>Right Bracket</button>
          </div>

          <button
            onClick={handleResetBracket}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              color: 'var(--text-primary)', padding: '0.5rem 1rem',
              borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> Reset Simulation
          </button>
        </div>
      </section>

      {/* Live data status banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '0.6rem 1rem',
        background: groupStageComplete
          ? 'rgba(0, 200, 100, 0.08)'
          : 'rgba(212, 175, 55, 0.08)',
        border: `1px solid ${groupStageComplete ? 'rgba(0,200,100,0.25)' : 'rgba(212,175,55,0.25)'}`,
        borderRadius: '12px',
        fontSize: '0.8rem',
        marginBottom: '0.5rem'
      }}>
        {loading ? (
          <>
            <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-gold)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Fetching live group standings…</span>
          </>
        ) : error ? (
          <>
            <Wifi size={14} style={{ color: 'var(--accent-red)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              Using local standings. {error}
            </span>
            <button onClick={refresh} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
              Retry ↺
            </button>
          </>
        ) : groupStageComplete ? (
          <>
            <span style={{ color: '#00c864', fontWeight: 800 }}>✓</span>
            <span style={{ color: 'var(--text-secondary)' }}>Group stage complete — R32 bracket fully seeded</span>
          </>
        ) : (
          <>
            <Clock size={14} style={{ color: 'var(--accent-gold)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--accent-gold)' }}>Group Stage in Progress</strong>
              {' '}— R32 shows current likely qualifiers ({groupMatchesDone}/{groupMatchesTotal} matches played).
              {lastUpdated && <span style={{ marginLeft: '6px', opacity: 0.6 }}>Updated {lastUpdated.toLocaleTimeString()}</span>}
            </span>
            <button onClick={refresh} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
              ↺
            </button>
          </>
        )}
      </div>

      {/* Bracket */}
      <div className={styles.bracketWrapper}>
        {renderRound('R32', 'Round of 32', 'Group Qualifier', 'Group Qualifier')}
        {renderRound('R16', 'Round of 16', 'R32 Winner', 'R32 Winner')}
        {renderRound('QF', 'Quarter Finals', 'R16 Winner', 'R16 Winner')}
        {renderRound('SF', 'Semi Finals', 'QF Winner', 'QF Winner')}
        {renderRound('F', '🏆 Grand Final', 'SF Winner', 'SF Winner', true)}
      </div>

      {/* Footer tip */}
      <section className="glass-card" style={{
        padding: '1rem', display: 'flex', gap: '8px', alignItems: 'center',
        background: 'rgba(212,175,55,0.02)', border: '1px dashed var(--accent-gold)', borderRadius: '12px'
      }}>
        <Sparkles size={20} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong>How it works:</strong> R32 seeds are auto-populated from live group standings. Once a group finishes,
          that slot locks to the actual qualifier. Click any team in R16 or later to simulate who advances.
          Use "Left / Right Bracket" on mobile for a clearer view.
        </span>
      </section>
    </div>
  );
}
