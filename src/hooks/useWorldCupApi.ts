'use client';

import { useState, useEffect, useCallback } from 'react';
import type { APIMatch, APIGroup, APITeam, APIStadium } from '@/lib/api/worldcup';

type Endpoint = 'games' | 'groups' | 'teams' | 'stadiums';

interface UseApiOptions {
  /** Refresh interval in ms. Default: 30000 (30s). Set 0 to disable. */
  refreshInterval?: number;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

// Client-side cache to share API responses across components and prevent duplicate requests
interface CacheEntry {
  data: any;
  lastUpdated: Date | null;
  promise: Promise<any> | null;
  listeners: Set<() => void>;
}

const cache: Record<Endpoint, CacheEntry> = {
  games: { data: null, lastUpdated: null, promise: null, listeners: new Set() },
  groups: { data: null, lastUpdated: null, promise: null, listeners: new Set() },
  teams: { data: null, lastUpdated: null, promise: null, listeners: new Set() },
  stadiums: { data: null, lastUpdated: null, promise: null, listeners: new Set() },
};

function useWorldCupApi<T>(endpoint: Endpoint, opts: UseApiOptions = {}): UseApiResult<T> {
  const { refreshInterval = 30000 } = opts;
  const [data, setData] = useState<T | null>(cache[endpoint].data as T | null);
  const [loading, setLoading] = useState(cache[endpoint].data === null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(cache[endpoint].lastUpdated);

  const fetchData = useCallback(async (force = false) => {
    const entry = cache[endpoint];
    const now = new Date();

    // If we have fresh data (under 10s old) and are not forcing a refresh, return cached data
    if (!force && entry.data && entry.lastUpdated && (now.getTime() - entry.lastUpdated.getTime() < 10000)) {
      setData(entry.data);
      setLastUpdated(entry.lastUpdated);
      setLoading(false);
      setError(null);
      return;
    }

    // If a request is already in-flight, await it instead of initiating a new one
    if (entry.promise && !force) {
      try {
        await entry.promise;
        setData(entry.data);
        setLastUpdated(entry.lastUpdated);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (cache[endpoint].data === null) {
      setLoading(true);
    }
    
    entry.promise = (async () => {
      try {
        const res = await fetch(`/api/worldcup/${endpoint}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        entry.data = json;
        entry.lastUpdated = new Date();
        entry.promise = null;
        
        // Notify all hooks utilizing this cache entry to re-render
        entry.listeners.forEach(listener => listener());
      } catch (e) {
        entry.promise = null;
        throw e;
      }
    })();

    try {
      await entry.promise;
      setData(entry.data);
      setLastUpdated(entry.lastUpdated);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Sync state with global cache and set up refresh intervals
  useEffect(() => {
    const entry = cache[endpoint];
    const listener = () => {
      setData(entry.data);
      setLastUpdated(entry.lastUpdated);
      setLoading(false);
      setError(null);
    };
    
    entry.listeners.add(listener);
    fetchData();

    let interval: NodeJS.Timeout | null = null;
    if (refreshInterval > 0) {
      interval = setInterval(() => fetchData(true), refreshInterval);
    }

    return () => {
      entry.listeners.delete(listener);
      if (interval) clearInterval(interval);
    };
  }, [fetchData, refreshInterval, endpoint]);

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refresh };
}


// ─── Typed hooks ──────────────────────────────────────────────────────────────

export function useMatches(opts?: UseApiOptions) {
  const result = useWorldCupApi<APIMatch[]>('games', opts);
  // Normalize: unwrap if API returns { matches: [...] } or { games: [...] }
  const raw = result.data;
  const data: APIMatch[] | null = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && 'matches' in (raw as object)
    ? (raw as { matches: APIMatch[] }).matches
    : raw && typeof raw === 'object' && 'games' in (raw as object)
    ? (raw as { games: APIMatch[] }).games
    : null;
  return { ...result, data };
}

export function useGroups(opts?: UseApiOptions) {
  const result = useWorldCupApi<APIGroup[]>('groups', opts);
  const raw = result.data;
  const data: APIGroup[] | null = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && 'groups' in (raw as object)
    ? (raw as { groups: APIGroup[] }).groups
    : null;
  return { ...result, data };
}

export function useTeams(opts?: UseApiOptions) {
  const result = useWorldCupApi<APITeam[]>('teams', opts);
  const raw = result.data;
  const data: APITeam[] | null = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && 'teams' in (raw as object)
    ? (raw as { teams: APITeam[] }).teams
    : null;
  return { ...result, data };
}

export function useStadiums(opts?: UseApiOptions) {
  const result = useWorldCupApi<APIStadium[]>('stadiums', opts);
  const raw = result.data;
  const data: APIStadium[] | null = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && 'stadiums' in (raw as object)
    ? (raw as { stadiums: APIStadium[] }).stadiums
    : null;
  return { ...result, data };
}
