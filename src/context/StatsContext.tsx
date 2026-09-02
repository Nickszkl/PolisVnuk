import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Stats } from '../types';
import { initialStats } from '../data/mockData';

interface StatsContextType {
  stats: Stats;
  trackPageView: (page?: string) => void;
  trackProposalView: (id: string) => void;
  trackNewsView: (id: string) => void;
  trackWhatsApp: () => void;
  trackSocial: (platform: string) => void;
  trackShare: (proposalId?: string) => void;
  addSupporter: () => boolean;
  hasSupported: boolean;
}

const StatsContext = createContext<StatsContextType | null>(null);
const STORAGE_KEY = 'pedrinho_stats';
const SUPPORT_KEY = 'pedrinho_has_supported';

function loadStats(): Stats {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? { ...initialStats, ...JSON.parse(s) } : { ...initialStats };
  } catch { return { ...initialStats }; }
}

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<Stats>(loadStats);
  const [hasSupported, setHasSupported] = useState(() => localStorage.getItem(SUPPORT_KEY) === '1');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const update = (fn: (prev: Stats) => Stats) => setStats(fn);

  const trackPageView = useCallback((page?: string) => {
    const today = new Date().toISOString().slice(0, 10);
    update(s => ({
      ...s,
      pageViews: s.pageViews + 1,
      viewsByDate: { ...s.viewsByDate, [today]: (s.viewsByDate[today] || 0) + 1 },
    }));
  }, []);

  const trackProposalView = useCallback((id: string) => {
    update(s => ({ ...s, proposalViews: { ...s.proposalViews, [id]: (s.proposalViews[id] || 0) + 1 } }));
  }, []);

  const trackNewsView = useCallback((id: string) => {
    update(s => ({ ...s, newsViews: { ...s.newsViews, [id]: (s.newsViews[id] || 0) + 1 } }));
  }, []);

  const trackWhatsApp = useCallback(() => {
    update(s => ({ ...s, whatsappClicks: s.whatsappClicks + 1 }));
  }, []);

  const trackSocial = useCallback((platform: string) => {
    update(s => ({ ...s, socialClicks: { ...s.socialClicks, [platform]: (s.socialClicks[platform] || 0) + 1 } }));
  }, []);

  const trackShare = useCallback((proposalId?: string) => {
    update(s => {
      const ps = proposalId ? { ...s.proposalShares, [proposalId]: (s.proposalShares[proposalId] || 0) + 1 } : s.proposalShares;
      return { ...s, shares: s.shares + 1, proposalShares: ps };
    });
  }, []);

  const addSupporter = useCallback((): boolean => {
    if (hasSupported) return false;
    update(s => ({ ...s, supporters: s.supporters + 1 }));
    setHasSupported(true);
    localStorage.setItem(SUPPORT_KEY, '1');
    return true;
  }, [hasSupported]);

  return (
    <StatsContext.Provider value={{ stats, trackPageView, trackProposalView, trackNewsView, trackWhatsApp, trackSocial, trackShare, addSupporter, hasSupported }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error('useStats must be used within StatsProvider');
  return ctx;
}
