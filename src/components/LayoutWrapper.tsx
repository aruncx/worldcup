'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Tv, 
  Calendar, 
  Grid, 
  Users, 
  User, 
  BarChart3, 
  MapPin, 
  Newspaper, 
  Sparkles, 
  Compass, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  X, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import styles from './LayoutWrapper.module.css';
import { teams } from '@/lib/data/teams';
import { players } from '@/lib/data/players';
import { stadiums } from '@/lib/data/stadiums';
import { matches } from '@/lib/data/matches';
import { getUserState } from '@/app/actions';
import { useMatches } from '@/hooks/useWorldCupApi';

// Structured notification type
interface Notification {
  id: string;
  type: 'goal' | 'card' | 'var' | 'system';
  title: string;
  desc: string;
  time: string;
  live?: boolean;
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Dynamic Live Matches Count
  const { data: apiMatches } = useMatches({ refreshInterval: 45000 });
  const liveCount = apiMatches !== null
    ? apiMatches.filter(m => m.status === 'live' || m.status === 'in_progress').length
    : matches.filter(m => m.status === 'live').length;
  
  // Theme state (default dark)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // UI Panels states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(2);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "nt1",
      type: "goal",
      title: "GOAL! France 2 - 1 Japan",
      desc: "Kylian Mbappé bags a brace (61') assisted by Antoine Griezmann. Les Bleus take the lead!",
      time: "15m ago",
      live: true
    },
    {
      id: "nt2",
      type: "goal",
      title: "GOAL! Colombia 2 - 2 Ghana",
      desc: "Mohammed Kudus scores a stunning free-kick (41') to bring the Black Stars level!",
      time: "2m ago",
      live: true
    },
    {
      id: "nt3",
      type: "var",
      title: "VAR Decision - France vs Japan",
      desc: "Penalty appeal by France for handball is rejected after pitchside review (68').",
      time: "8m ago",
      live: true
    }
  ]);
  
  // User follow lists for custom notification filters
  const [followedTeams, setFollowedTeams] = useState<string[]>([]);
  const [followedPlayers, setFollowedPlayers] = useState<string[]>([]);

  // Toast message state
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  // Sync theme & load user DB state
  useEffect(() => {
    // 1. Sync theme from localStorage or system
    const savedTheme = localStorage.getItem('wcup_theme') as 'dark' | 'light';
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // 2. Load cookie-based user states
    async function loadUserState() {
      const state = await getUserState();
      setFollowedTeams(state.followedTeams);
      setFollowedPlayers(state.followedPlayers);
    }
    loadUserState();
  }, []);

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('wcup_theme', nextTheme);
  };

  // Simulated live match alert system (triggers every 45 seconds to keep dashboard dynamic)
  useEffect(() => {
    const alerts = [
      {
        id: "nt_live_1",
        type: "goal" as const,
        title: "GOAL! France 3 - 1 Japan",
        desc: "Jude Bellingham's Real Madrid teammate Kylian Mbappé completes his hat-trick (82') with a sublime volley!",
        time: "Just now",
        live: true
      },
      {
        id: "nt_live_2",
        type: "card" as const,
        title: "RED CARD! Colombia vs Ghana",
        desc: "Thomas Partey receives a second yellow card (87') for a late challenge. Ghana down to 10 men!",
        time: "Just now",
        live: true
      },
      {
        id: "nt_live_3",
        type: "goal" as const,
        title: "GOAL! Colombia 3 - 2 Ghana",
        desc: "Luis Díaz scores a dramatic late winner (90+1')! El Campín erupts in celebration!",
        time: "Just now",
        live: true
      }
    ];

    let alertIndex = 0;
    const interval = setInterval(() => {
      if (alertIndex < alerts.length) {
        const newAlert = alerts[alertIndex];
        setNotifications(prev => [newAlert, ...prev]);
        setUnreadNotifs(prev => prev + 1);
        setActiveToast(newAlert);
        
        // Auto-dismiss toast after 6 seconds
        setTimeout(() => {
          setActiveToast(null);
        }, 6000);
        
        alertIndex++;
      }
    }, 45000); // 45 seconds

    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut to open search (Ctrl + K or Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search filter lists
  const filteredTeams = searchQuery 
    ? teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredPlayers = searchQuery 
    ? players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.club.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredStadiums = searchQuery
    ? stadiums.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.city.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchResultClick = (path: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    router.push(path);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Live Match Center', path: '/matches', icon: Tv },
    { name: 'Standings', path: '/standings', icon: Grid },
    { name: 'Knockout Bracket', path: '/knockout', icon: Compass },
    { name: 'Compare Analytics', path: '/compare', icon: Sparkles },
    { name: 'Teams Profiles', path: '/teams', icon: Users },
    { name: 'Players Profiles', path: '/players', icon: User },
    { name: 'Visual Stats', path: '/analytics', icon: BarChart3 },
    { name: 'Host Stadiums', path: '/stadiums', icon: MapPin },
    { name: 'News Feed', path: '/news', icon: Newspaper }
  ];

  return (
    <div className={styles.container}>
      {/* Toast Notification (Toaster) */}
      {activeToast && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 2000,
            width: '320px',
            background: 'var(--bg-secondary)',
            borderLeft: '4px solid var(--accent-red)',
            borderRadius: '8px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            padding: '12px 16px',
            animation: 'fadeIn 0.3s ease-out'
          }}
          className="glass-panel"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="status-live"></span> Live Alert
            </span>
            <button onClick={() => setActiveToast(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeToast.title}</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>{activeToast.desc}</p>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>26</div>
          <div className={styles.brandText}>
            WORLD CUP
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', letterSpacing: '0.15em' }}>ANALYSIS HUB</div>
          </div>
        </div>
        
        <nav className={styles.navLinks}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footerInfo}>
          <p>FIFA World Cup 2026™ Hub</p>
          <p style={{ marginTop: '2px' }}>v1.0 • Premium Analytics</p>
        </div>
      </aside>

      {/* Main Panel */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.searchBarTrigger} onClick={() => setSearchOpen(true)}>
            <Search size={16} />
            <span>Search team, player, stadium...</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>Ctrl+K</span>
          </div>

          <div className={styles.headerActions}>
            {/* Live Matches Quick Counter */}
            <Link 
              href="/matches" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '0.75rem', 
                background: liveCount > 0 ? 'rgba(227,6,19,0.1)' : 'rgba(255,255,255,0.05)', 
                border: liveCount > 0 ? '1px solid rgba(227,6,19,0.2)' : '1px solid rgba(255,255,255,0.1)', 
                padding: '6px 12px', 
                borderRadius: '15px', 
                color: liveCount > 0 ? 'var(--accent-red)' : 'var(--text-secondary)', 
                fontWeight: 700 
              }}
            >
              {liveCount > 0 && <span className="status-live"></span>}
              {liveCount} LIVE {liveCount === 1 ? 'MATCH' : 'MATCHES'}
            </Link>

            {/* Light / Dark Mode Toggle */}
            <button className={styles.iconBtn} onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Alert Bell */}
            <button className={styles.iconBtn} onClick={() => { setNotifOpen(true); setUnreadNotifs(0); }} title="Notifications">
              <Bell size={18} />
              {unreadNotifs > 0 && <span className={styles.badge}>{unreadNotifs}</span>}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className={styles.bottomNav}>
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className={`${styles.bottomNavItem} ${isActive ? styles.bottomNavItemActive : ''}`}>
              <Icon size={20} />
              <span>{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Advanced Search Overlay */}
      {searchOpen && (
        <div className={styles.searchOverlay} onClick={() => setSearchOpen(false)}>
          <div className={styles.searchContainer} onClick={e => e.stopPropagation()}>
            <div className={styles.searchInputWrapper}>
              <Search size={20} style={{ color: 'var(--accent-gold)' }} />
              <input 
                type="text" 
                placeholder="Type to search teams, players, stadiums, coaches..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button className={styles.closeBtn} onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.searchResults}>
              {searchQuery === '' ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  <TrendingUp size={36} style={{ color: 'var(--accent-gold)', marginBottom: '8px' }} />
                  <p style={{ fontWeight: 600 }}>FIFA 2026 Live Analytics Index</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Try searching "USA", "Mbappe", "Azteca", or "Pochettino"</p>
                </div>
              ) : (
                <>
                  {filteredTeams.length === 0 && filteredPlayers.length === 0 && filteredStadiums.length === 0 && (
                    <div className={styles.noResults}>No matches found for "{searchQuery}"</div>
                  )}

                  {/* Teams Results */}
                  {filteredTeams.length > 0 && (
                    <div className={styles.searchSection}>
                      <div className={styles.searchSectionTitle}>Teams ({filteredTeams.length})</div>
                      {filteredTeams.map(t => (
                        <div key={t.id} className={styles.searchItem} onClick={() => handleSearchResultClick(`/teams?id=${t.id}`)}>
                          <div className={styles.searchItemLeft}>
                            <span style={{ fontSize: '1.25rem' }}>{t.flag}</span>
                            <div>
                              <div style={{ fontWeight: 600 }}>{t.name} ({t.code})</div>
                              <div className={styles.searchItemSub}>{t.confederation} • Coach: {t.coach}</div>
                            </div>
                          </div>
                          <ChevronRight size={16} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Players Results */}
                  {filteredPlayers.length > 0 && (
                    <div className={styles.searchSection}>
                      <div className={styles.searchSectionTitle}>Players ({filteredPlayers.length})</div>
                      {filteredPlayers.map(p => (
                        <div key={p.id} className={styles.searchItem} onClick={() => handleSearchResultClick(`/players?id=${p.id}`)}>
                          <div className={styles.searchItemLeft}>
                            <span style={{ fontSize: '1.25rem' }}>{p.teamFlag}</span>
                            <div>
                              <div style={{ fontWeight: 600 }}>{p.name}</div>
                              <div className={styles.searchItemSub}>{p.position} • {p.club}</div>
                            </div>
                          </div>
                          <ChevronRight size={16} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stadiums Results */}
                  {filteredStadiums.length > 0 && (
                    <div className={styles.searchSection}>
                      <div className={styles.searchSectionTitle}>Stadiums ({filteredStadiums.length})</div>
                      {filteredStadiums.map(s => (
                        <div key={s.id} className={styles.searchItem} onClick={() => handleSearchResultClick(`/stadiums?id=${s.id}`)}>
                          <div className={styles.searchItemLeft}>
                            <MapPin size={18} className={styles.searchItemIcon} />
                            <div>
                              <div style={{ fontWeight: 600 }}>{s.name}</div>
                              <div className={styles.searchItemSub}>{s.city}, {s.country} • Capacity: {s.capacity.toLocaleString()}</div>
                            </div>
                          </div>
                          <ChevronRight size={16} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {notifOpen && (
        <>
          <div className={styles.drawerOverlay} onClick={() => setNotifOpen(false)}></div>
          <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} style={{ color: 'var(--accent-gold)' }} /> Match Alerts
              </h3>
              <button className={styles.closeBtn} onClick={() => setNotifOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.drawerContent}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '4rem' }}>No recent updates.</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`${styles.notifCard} ${n.live ? styles.notifLive : ''}`}>
                    <div className={styles.notifHeader}>
                      <span>{n.type.toUpperCase()} ALERT</span>
                      <span className={styles.notifTime}>{n.time}</span>
                    </div>
                    <div className={styles.notifTitle}>{n.title}</div>
                    <div className={styles.notifDesc}>{n.desc}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
