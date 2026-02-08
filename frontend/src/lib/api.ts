import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardApi = {
  getStats: async (filter: 'today' | 'weekly') => {
    const response = await api.get(`/analytics/dashboard-stats`, {
      params: { filter },
    });
    return response.data;
  },

  getTimeTracked: async (filter: 'today' | 'weekly') => {
    const response = await api.get(`/analytics/time-tracked`, {
      params: { filter },
    });
    return response.data;
  },
};

// Auth API
export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Tasks API
export const tasksApi = {
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

// Time Entries API
export const timeEntriesApi = {
  start: async (taskId: string) => {
    const response = await api.post(`/time-entries/start/${taskId}`);
    return response.data;
  },

  stop: async (entryId: string) => {
    const response = await api.post(`/time-entries/stop/${entryId}`);
    return response.data;
  },

  getByTask: async (taskId: string) => {
    const response = await api.get(`/time-entries/task/${taskId}`);
    return response.data;
  },

  getActive: async () => {
    const response = await api.get('/time-entries/active');
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  create: async (data: { name: string; color: string }) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: { name?: string; color?: string }) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Analytics API
export const analyticsApi = {
  getTaskStats: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/analytics/tasks', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getTimeStats: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/analytics/time', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getCategoryStats: async () => {
    const response = await api.get('/analytics/categories');
    return response.data;
  },

  getProductivityTrends: async (period: 'week' | 'month' | 'year') => {
    const response = await api.get('/analytics/productivity', {
      params: { period },
    });
    return response.data;
  },
};

export default api;