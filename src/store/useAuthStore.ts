import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  id: string;
  email: string;
  isVerified: boolean;
  hasCompletedProfile?: boolean;
}

interface AuthState {
  email: string;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setEmail: (email: string) => void;
  clearEmail: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  email: '',
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setEmail: (email) => set({ email }),
  clearEmail: () => set({ email: '' }),
  setUser: (user) => set({ user, isAuthenticated: true }),
  setLoading: (loading) => set({ isLoading: loading }),
  checkAuth: async () => {
    const { setUser, setLoading } = get();
    
    setLoading(true);
    try {
      const response = await api.get('/users/me');
      const userData = response.data;
      
      // Transform the user data to match our interface
      const user: User = {
        id: userData._id || userData.id,
        email: userData.email,
        isVerified: userData.isVerified,
        hasCompletedProfile: userData.hasCompletedProfile,
      };
      
      setUser(user);
      return true;
    } catch (error) {
      console.error('Authentication check failed:', error);
      set({ user: null, isAuthenticated: false });
      return false;
    } finally {
      setLoading(false);
    }
  },
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