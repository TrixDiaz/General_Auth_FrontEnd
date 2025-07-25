import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  id: string;
  email: string;
  isVerified: boolean;
}

interface AuthState {
  email: string;
  user: User | null;
  isAuthenticated: boolean;
  setEmail: (email: string) => void;
  clearEmail: () => void;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: '',
  user: null,
  isAuthenticated: false,
  setEmail: (email) => set({ email }),
  clearEmail: () => set({ email: '' }),
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: async () => {
    try {
      // Call backend logout endpoint to clear cookies
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of server response
      set({ user: null, isAuthenticated: false, email: '' });
    }
  },
}));