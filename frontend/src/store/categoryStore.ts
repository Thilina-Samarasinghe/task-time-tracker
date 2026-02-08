import { create } from 'zustand';
import api from '@/lib/api';
import { Category } from '@/types/task.types';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (data: { name: string; color?: string }) => Promise<Category>;
  updateCategory: (id: string, data: { name?: string; color?: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/categories');
      set({ categories: response.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    const newCategory = response.data;
    set((state) => ({ 
      categories: [...state.categories, newCategory].sort((a, b) => a.name.localeCompare(b.name))
    }));
    return newCategory;
  },

  updateCategory: async (id, data) => {
    const response = await api.patch(`/categories/${id}`, data);
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? response.data : cat
      ),
    }));
  },

  deleteCategory: async (id) => {
    await api.delete(`/categories/${id}`);
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    }));
  },
}));