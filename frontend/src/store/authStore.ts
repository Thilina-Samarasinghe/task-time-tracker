import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth.types';

interface UpdateProfileData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/login', credentials);
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
          throw error;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/register', credentials);
          const { user, token } = response.data;
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: () => {
        const token = localStorage.getItem('token');
        const state = get();
        
        if (token && state.user) {
          set({ isAuthenticated: true, token });
        } else {
          set({ isAuthenticated: false, user: null, token: null });
        }
      },

      updateProfile: async (data: UpdateProfileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put('/auth/profile', data);
          const updatedUser = response.data.user;
          
          set({ 
            user: updatedUser, 
            isLoading: false,
            error: null 
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Failed to update profile';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    { name: 'auth-storage' }
  )
);