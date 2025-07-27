import { create } from 'zustand';
import api from '../lib/axios';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  isVerified: boolean;
  hasCompletedProfile?: boolean;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  email: string; // For auth flow
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setEmail: (email: string) => void;
  checkAuth: (force?: boolean) => Promise<boolean>;
  loginSuccess: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedAuth: false,
  email: '',

  setUser: (user) => set({
    user,
    isAuthenticated: true,
    hasCheckedAuth: true,
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  setEmail: (email) => set({ email }),

  loginSuccess: (user) => set({
    user,
    isAuthenticated: true,
    isLoading: false,
    hasCheckedAuth: true,
    email: '', // Clear email after successful login
  }),

  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      set({
        user: { ...user, ...updates }
      });
    }
  },

  clearAuth: () => set({
    user: null,
    isAuthenticated: false,
    hasCheckedAuth: true,
    isLoading: false,
    email: '',
  }),

  checkAuth: async (force = false) => {
    const { setUser, setLoading, hasCheckedAuth, user, isAuthenticated } = get();

    // If we already have a user and are authenticated, and not forcing refresh, don't check again
    if (!force && hasCheckedAuth && user && isAuthenticated) {
      return true;
    }

    // If we've already checked and found no auth, and not forcing refresh, don't check again
    if (!force && hasCheckedAuth && !isAuthenticated) {
      return false;
    }

    // If we're already loading, don't start another check
    if (get().isLoading) {
      return false;
    }

    setLoading(true);
    try {
      const response = await api.get('/users/me');
      const userData = response.data;

      // Transform the user data to match our interface
      const user: User = {
        id: userData._id || userData.id,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        avatar: userData.avatar || userData.profilePicture || "",
        email: userData.email || "",
        isVerified: userData.isVerified || false,
        hasCompletedProfile: userData.hasCompletedProfile || false,
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        zip: userData.zip || "",
      };

      setUser(user);
      return true;
    } catch (error: unknown) {
      // Handle different types of errors
      const axiosError = error as { response?: { status?: number }, code?: string, message?: string };

      // Don't log network errors or 401 errors (expected for unauthenticated users)
      if (axiosError.code === 'ERR_NETWORK' || axiosError.response?.status === 401) {
        // These are expected errors, don't log them
      } else {
        console.error('Authentication check failed:', error);
      }

      set({
        user: null,
        isAuthenticated: false,
        hasCheckedAuth: true,
      });
      return false;
    } finally {
      setLoading(false);
    }
  },

  refreshUser: async () => {
    const { setUser, setLoading } = get();

    setLoading(true);
    try {
      const response = await api.get('/users/me');
      const userData = response.data;

      // Transform the user data to match our interface
      const user: User = {
        id: userData._id || userData.id,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        avatar: userData.avatar || userData.profilePicture || "",
        email: userData.email || "",
        isVerified: userData.isVerified || false,
        hasCompletedProfile: userData.hasCompletedProfile || false,
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        zip: userData.zip || "",
      };

      setUser(user);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, user might be logged out
      get().clearAuth();
    } finally {
      setLoading(false);
    }
  },

  logout: async () => {
    try {
      // Call backend logout endpoint to clear cookies
      await api.post('/auth/logout');
    } catch (error) {
      // Log error but don't throw - we still want to clear frontend state
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of server response
      get().clearAuth();
    }
  },
}));