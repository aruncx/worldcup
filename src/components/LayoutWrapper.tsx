'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Tv, Grid, Compass, Sparkles, Users, User, BarChart3, MapPin, Newspaper, Search, Bell, Menu, X
} from 'lucide-react';
import styles from './LayoutWrapper.module.css';
import { useMatches } from '@/hooks/useWorldCupApi';
import { matches } from '@/lib/data/matches';
import { getTeamName, formatLocalTime } from '@/lib/api/worldcup';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);
  
  // Dynamic Live Matches Count
  const { data: apiMatches } = useMatches({ refreshInterval: 45000 });
  
  const currentMatches = (apiMatches ?? matches) as any[];
  const liveCount = currentMatches.filter((m: any) => m.status === 'live' || m.status === 'in_progress').length;
  
  const liveMatchesList = currentMatches.filter((m: any) => m.status === 'live' || m.status === 'in_progress');
  const upcomingMatchesList = currentMatches.filter((m: any) => m.status === 'upcoming' || m.status === 'future').slice(0, 3);
  const completedMatchesList = currentMatches.filter((m: any) => m.status === 'completed' || m.status === 'finished').slice(-3).reverse();

  // Extract the latest timeline event for any live match (if available in mock data)
  const liveEvents = liveMatchesList.flatMap(m => {
    const mockFallback = matches.find(mock => String(mock.id) === String(m.id)) || m;
    const timeline = (mockFallback as any).timeline || [];
    if (timeline.length > 0) {
      return { match: m, event: timeline[timeline.length - 1] };
    }
    return null;
  }).filter(Boolean);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Live', path: '/matches', icon: Tv },
    { name: 'Standings', path: '/standings', icon: Grid },
    { name: 'Knockout Bracket', path: '/knockout', icon: Compass },
    { name: 'Teams', path: '/teams', icon: Users },
    { name: 'Players', path: '/players', icon: User },
    { name: 'Host Stadiums', path: '/stadiums', icon: MapPin },
    { name: 'News', path: '/news', icon: Newspaper }
  ];

  return (
    <div className={styles.container}>
      {/* Live Score Ticker */}
      <div className={styles.ticker}>
        <div className={styles.tickerWrap}>
          {liveMatchesList.map((m, i) => (
            <span key={`live-${i}`} className={styles.tickerItem}>
              🔴 LIVE: {getTeamName(m.homeTeamName || m.home_team)} {m.homeScore ?? m.home_score ?? 0} - {m.awayScore ?? m.away_score ?? 0} {getTeamName(m.awayTeamName || m.away_team)}
            </span>
          ))}
          
          {/* Breaking Live Events (Goals, Cards, etc) */}
          {liveEvents.map((item, i) => {
            if (!item) return null;
            const emoji = item.event.type === 'goal' ? '⚽' : item.event.type.includes('red') ? '🟥' : item.event.type.includes('yellow') ? '🟨' : '⚡';
            return (
              <span key={`event-${i}`} className={styles.tickerItem} style={{ color: '#FCD34D' }}>
                {emoji} FLASH: {item.event.detail} ({getTeamName(item.match.homeTeamName || item.match.home_team)} vs {getTeamName(item.match.awayTeamName || item.match.away_team)})
              </span>
            );
          })}

          {upcomingMatchesList.map((m, i) => (
            <span key={`upcoming-${i}`} className={styles.tickerItem}>
              ⏳ UPCOMING: {getTeamName(m.homeTeamName || m.home_team)} vs {getTeamName(m.awayTeamName || m.away_team)} ({hydrated ? formatLocalTime(m.date || m.datetime?.split('T')[0], m.time || m.datetime?.split('T')[1]?.substring(0,5)) : (m.time || "TBD")})
            </span>
          ))}

          {completedMatchesList.map((m, i) => (
            <span key={`completed-${i}`} className={styles.tickerItem} style={{ color: '#94A3B8' }}>
              ✅ FT: {getTeamName(m.homeTeamName || m.home_team)} {m.homeScore ?? m.home_score ?? 0} - {m.awayScore ?? m.away_score ?? 0} {getTeamName(m.awayTeamName || m.away_team)}
            </span>
          ))}
          <span className={styles.tickerItem}>📰 TOURNAMENT UPDATES: Group Stage matches are currently underway</span>
        </div>
      </div>

      {/* Top Sticky Navigation */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logoIcon}>26</div>
          <div className={styles.brandText}>
            WORLD CUP
          </div>
        </Link>
        
        <div className={styles.navLinks}>
          {navItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className={styles.navActions}>
          <Link 
            href="/matches" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.8rem', 
              background: liveCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)', 
              border: liveCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.1)', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              color: liveCount > 0 ? 'var(--danger)' : 'var(--text-secondary)', 
              fontWeight: 700 
            }}
          >
            {liveCount > 0 && <span className="status-live"></span>}
            {liveCount} LIVE
          </Link>

          {/* Hamburger for mobile */}
          <button 
            className={styles.hamburger} 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`${styles.mobileNav} ${mobileMenuOpen ? styles.mobileNavOpen : ''}`}>
        <div className={styles.mobileNavHeader}>
          <Link href="/" className={styles.brand} onClick={() => setMobileMenuOpen(false)}>
            <div className={styles.logoIcon}>26</div>
            <div className={styles.brandText}>WORLD CUP</div>
          </Link>
          <button className={styles.mobileNavCloseBtn} onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

