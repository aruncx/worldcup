'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Info, Calendar, Users } from 'lucide-react';
import styles from './stadiums.module.css';
import { stadiums, Stadium } from '@/lib/data/stadiums';
import { matches } from '@/lib/data/matches';
import TeamFlag from '@/components/TeamFlag';
import { useStadiums } from '@/hooks/useWorldCupApi';
import LiveDataBanner from '@/components/LiveDataBanner';

function StadiumsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Live API data ──────────────────────────────────────────────────────────
  const { data: apiStadiums, loading: apiLoading, error: apiError, lastUpdated, refresh } = useStadiums({ refreshInterval: 120000 });

  // Selected Stadium State
  const [selectedStadium, setSelectedStadium] = useState<Stadium>(stadiums[0]);

  // Sync selected stadium from query parameter (triggered by global search)
  useEffect(() => {
    const stadiumId = searchParams.get('id');
    if (stadiumId) {
      const stadium = stadiums.find(s => s.id === stadiumId);
      if (stadium) {
        setSelectedStadium(stadium);
      }
    }
  }, [searchParams]);

  // Handle Stadium Click
  const handleStadiumSelect = (stadium: Stadium) => {
    setSelectedStadium(stadium);
    const params = new URLSearchParams(searchParams);
    params.set('id', stadium.id);
    router.push(`?${params.toString()}`);
  };

  // Get matches scheduled for selected stadium
  const getUpcomingMatches = (stadiumId: string) => {
    return matches.filter(m => m.stadiumId === stadiumId);
  };

  // Approximate relative coordinates for SVG Map plotting (x: 0-100, y: 0-100)
  // Maps 16 cities onto standard projection space representing North America
  const mapNodes = [
    { id: "bcplace", label: "Vancouver", x: 18, y: 22 },
    { id: "lumen", label: "Seattle", x: 20, y: 27 },
    { id: "levis", label: "San Francisco", x: 14, y: 48 },
    { id: "sofi", label: "Los Angeles", x: 19, y: 58 },
    { id: "akron", label: "Guadalajara", x: 38, y: 88 },
    { id: "azteca", label: "Mexico City", x: 44, y: 92 },
    { id: "bbva", label: "Monterrey", x: 44, y: 81 },
    { id: "att", label: "Dallas", x: 45, y: 64 },
    { id: "nrg", label: "Houston", x: 48, y: 71 },
    { id: "arrowhead", label: "Kansas City", x: 53, y: 48 },
    { id: "mercedes", label: "Atlanta", x: 67, y: 62 },
    { id: "bmo", label: "Toronto", x: 78, y: 34 },
    { id: "gillette", label: "Boston", x: 88, y: 31 },
    { id: "metlife", label: "New York", x: 84, y: 38 },
    { id: "lincoln", label: "Philadelphia", x: 82, y: 41 },
    { id: "hardrock", label: "Miami", x: 77, y: 78 }
  ];

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Live Data Status */}
      <LiveDataBanner lastUpdated={lastUpdated} loading={apiLoading} error={apiError} onRefresh={refresh} />
      {/* Intro Header */}
      <section className={styles.intro}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin style={{ color: 'var(--accent-gold)' }} /> Official Stadium Venues
          </h1>
          <p className={styles.subtitle}>
            Explore the 16 state-of-the-art stadiums hosting the FIFA World Cup 2026 across USA, Canada, and Mexico.
          </p>
        </div>
      </section>

      {/* SVG Interactive Map Panel */}
      <section className={`${styles.mapCard} glass-card`}>
        {/* SVG Map Container */}
        <div className={styles.mapWrapper}>
          <svg viewBox="0 0 500 350" className={styles.mapSvg}>
            {/* Outline Boundaries (mock paths representing CA, US, MX borders) */}
            {/* Canada Mock path */}
            <path d="M 50 10 L 450 10 L 450 90 L 320 90 L 300 80 L 180 80 L 150 95 L 50 95 Z" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            {/* USA Mock path */}
            <path d="M 50 95 L 150 95 L 180 80 L 300 80 L 320 90 L 450 90 L 450 200 L 400 210 L 370 260 L 350 260 L 350 230 L 260 230 L 210 260 L 180 200 Z" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
            {/* Mexico Mock path */}
            <path d="M 180 200 L 210 260 L 260 230 L 350 230 L 310 290 L 260 300 L 230 330 L 200 320 L 170 240 Z" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

            {/* Plotted Stadium Nodes */}
            {mapNodes.map(node => {
              const isActive = selectedStadium.id === node.id;
              const stadiumData = stadiums.find(s => s.id === node.id);
              
              // Map dynamic scale
              const cx = (node.x / 100) * 500;
              const cy = (node.y / 100) * 350;

              return (
                <g key={node.id}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isActive ? 7 : 5}
                    className={`${styles.mapDot} ${isActive ? styles.mapDotActive : ''}`}
                    onClick={() => stadiumData && handleStadiumSelect(stadiumData)}
                  />
                  {isActive && (
                    <text 
                      x={cx + 10} 
                      y={cy + 3} 
                      className={styles.mapText}
                      style={{ fill: 'var(--accent-gold)', fontSize: '9px', fontWeight: 800 }}
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Stadium Details panel */}
        <div className={styles.selectedDetails}>
          <div 
            className={styles.venueBanner} 
            style={{ background: selectedStadium.image }}
          >
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {selectedStadium.city}, {selectedStadium.country}
              </span>
              <h2 style={{ fontSize: '1.4rem' }}>{selectedStadium.name}</h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Seating Capacity</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={16} /> {selectedStadium.capacity.toLocaleString()}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Venue Location</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '4px' }}>
                📍 Lat: {selectedStadium.latitude.toFixed(2)} / Lng: {selectedStadium.longitude.toFixed(2)}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            {selectedStadium.description}
          </p>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
              <Calendar size={14} /> Scheduled Match Roster
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {getUpcomingMatches(selectedStadium.id).length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No matches scheduled here.</div>
              ) : (
                getUpcomingMatches(selectedStadium.id).map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TeamFlag flag={m.homeTeamFlag} name={m.homeTeamName} />
                      <span>{m.homeTeamName}</span>
                      <span style={{ color: 'var(--text-muted)' }}>vs</span>
                      <TeamFlag flag={m.awayTeamFlag} name={m.awayTeamName} />
                      <span>{m.awayTeamName}</span>
                    </span>
                    <span style={{ fontWeight: 700 }}>{m.date} • {m.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid of all 16 Venues */}
      <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Host Venues Directory</h2>
      <section className={styles.stadiumGrid}>
        {stadiums.map(s => {
          const isActive = selectedStadium.id === s.id;
          return (
            <div 
              key={s.id} 
              className={`${styles.stadiumCard} glass-card`} 
              style={{ borderColor: isActive ? 'var(--accent-gold)' : 'var(--card-border)' }}
              onClick={() => handleStadiumSelect(s)}
            >
              <div className={styles.stadiumCardBanner} style={{ background: s.image }}></div>
              <h3 className={styles.stadiumCardName}>{s.name}</h3>
              <div className={styles.stadiumCardCity}>{s.city}, {s.country}</div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default function Stadiums() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--accent-gold)', gap: '10px' }}>
        <MapPin size={24} className="animate-spin" /> Loading FIFA Stadiums...
      </div>
    }>
      <StadiumsContent />
    </Suspense>
  );
}
