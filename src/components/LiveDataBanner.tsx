'use client';

import { useEffect, useState } from 'react';

interface LiveBannerProps {
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
  provider?: string;
}

export default function LiveDataBanner({ lastUpdated, loading, error, onRefresh, provider = 'Football-Data.org' }: LiveBannerProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastUpdated) return;
    const update = () => {
      const secs = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (secs < 5) setTimeAgo('just now');
      else if (secs < 60) setTimeAgo(`${secs}s ago`);
      else setTimeAgo(`${Math.floor(secs / 60)}m ago`);
    };
    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 16px',
      background: error
        ? 'rgba(239,68,68,0.1)'
        : 'rgba(34,197,94,0.08)',
      border: `1px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.25)'}`,
      borderRadius: '8px',
      fontSize: '0.78rem',
      color: error ? '#f87171' : 'var(--text-secondary)',
      marginBottom: '16px',
      flexWrap: 'wrap',
    }}>
      {/* Dot indicator */}
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: error ? '#ef4444' : loading ? '#f59e0b' : '#22c55e',
        boxShadow: error ? 'none' : loading ? 'none' : '0 0 8px #22c55e',
        animation: (!error && !loading) ? 'pulse 2s infinite' : 'none',
        flexShrink: 0,
      }} />

      {error ? (
        <span>⚠️ Live data unavailable — showing cached data. {error}</span>
      ) : loading ? (
        <span>🔄 Fetching live data from {provider}...</span>
      ) : (
        <span>
          🟢 <strong>Live data</strong> from {provider} · Updated {timeAgo}
        </span>
      )}

      {/* Refresh button */}
      {onRefresh && !loading && (
        <button
          onClick={onRefresh}
          style={{
            marginLeft: 'auto',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            padding: '2px 10px',
            cursor: 'pointer',
            fontSize: '0.75rem',
          }}
        >
          ↺ Refresh
        </button>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
