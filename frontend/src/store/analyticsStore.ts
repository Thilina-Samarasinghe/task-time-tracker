import { create } from 'zustand';
import { api } from '@/lib/api';

export enum TimeRange {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  CUSTOM = 'custom',
}

interface AnalyticsFilters {
  timeRange: TimeRange;
  startDate: string;
  endDate: string;
  categoryId: string;
  status: string;
  priority: string;
}

interface CategoryDistribution {
  category: string;
  hours: number;
  color: string;
}

interface DailyHours {
  date: string;
  hours: number;
}

interface TaskData {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  status: string;
  priority: string;
  totalHours: number;
  createdAt: string;
}

interface AnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  avgTimePerTask: number;
  dateRange: {
    start: string;
    end: string;
  };
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  categoryDistribution: CategoryDistribution[];
  dailyHours: DailyHours[];
  tasks: TaskData[];
}

interface AnalyticsStore {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilters;
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  fetchAnalytics: () => Promise<void>;
  exportCSV: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  filters: {
    timeRange: TimeRange.TODAY,
    startDate: '',
    endDate: '',
    categoryId: '',
    status: '',
    priority: '',
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    // Fetch analytics with new filters
    get().fetchAnalytics();
  },

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();

      if (filters.timeRange) params.append('timeRange', filters.timeRange);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await api.get(`/analytics?${params.toString()}`);
      set({ data: response.data, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch analytics',
        loading: false 
      });
    }
  },

  exportCSV: async () => {
    try {
      const { filters } = get();
      const params = new URLSearchParams();

      if (filters.timeRange) params.append('timeRange', filters.timeRange);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await api.get(`/analytics/export/csv?${params.toString()}`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasks-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to export CSV:', error);
    }
  },
}));