import { create } from 'zustand';
import { TimeFilter, DashboardStats } from '@/types/dashboard.types';
import { dashboardApi } from '@/lib/api';

interface DashboardStore {
  timeFilter: TimeFilter;
  stats: DashboardStats | null;
  loading: boolean;
  
  setTimeFilter: (filter: TimeFilter) => void;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  timeFilter: TimeFilter.TODAY,
  stats: null,
  loading: false,

  setTimeFilter: (filter: TimeFilter) => {
    set({ timeFilter: filter });
    get().fetchStats();
  },

  fetchStats: async () => {
    set({ loading: true });
    try {
      const filter = get().timeFilter.toLowerCase() as 'today' | 'weekly';
      const stats = await dashboardApi.getStats(filter);
      set({ stats, loading: false });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      set({ loading: false });
    }
  },
}));