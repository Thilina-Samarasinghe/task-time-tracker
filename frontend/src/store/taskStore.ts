import { create } from 'zustand';
import api from '@/lib/api';
import { Task } from '@/types/task.types';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: any) => Promise<void>;
  updateTask: (id: string, data: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<Task[]>('/tasks');
      set({ tasks: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTask: async (data) => {
    try {
      const response = await api.post<Task>('/tasks', data);
      set((state) => ({ tasks: [response.data, ...state.tasks] }));
    } catch (error: any) {
      throw error;
    }
  },

  updateTask: async (id, data) => {
    try {
      const response = await api.patch<Task>(`/tasks/${id}`, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
      }));
    } catch (error: any) {
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error: any) {
      throw error;
    }
  },

  toggleTask: async (id) => {
    try {
      const response = await api.patch<Task>(`/tasks/${id}/toggle`);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
      }));
    } catch (error: any) {
      throw error;
    }
  },
}));