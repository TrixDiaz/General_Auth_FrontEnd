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
}

interface AuthState {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isVerified: boolean;
  hasCompletedProfile?: boolean;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  setEmail: (email: string) => void;
  clearEmail: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<boolean>;
  loginSuccess: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  email: '',
  role: '',
  firstName: '',
  lastName: '',
  avatar: '',
  isVerified: false,
  hasCompletedProfile: false,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedAuth: false,
  setEmail: (email) => set({ email }),
  clearEmail: () => set({ email: '' }),
  setUser: (user) => set({
    user,
    isAuthenticated: true,
    hasCheckedAuth: true,
    // Sync individual fields with user data
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    avatar: user.avatar || "",
    isVerified: user.isVerified || false,
    hasCompletedProfile: user.hasCompletedProfile || false
  }),
  setLoading: (loading) => set({ isLoading: loading }),
  loginSuccess: (user) => set({
    user,
    isAuthenticated: true,
    isLoading: false,
    hasCheckedAuth: true,
    // Sync individual fields with user data
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    avatar: user.avatar || "",
    isVerified: user.isVerified || false,
    hasCompletedProfile: user.hasCompletedProfile || false
  }),
  checkAuth: async () => {
    const { setUser, setLoading, hasCheckedAuth, user, isAuthenticated } = get();

    // If we already have a user and are authenticated, don't check again
    if (hasCheckedAuth && user && isAuthenticated) {
      return true;
    }

    // If we've already checked and found no auth, don't check again
    if (hasCheckedAuth && !isAuthenticated) {
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
        avatar: userData.avatar || "",
        email: userData.email || "",
        isVerified: userData.isVerified || false,
        hasCompletedProfile: userData.hasCompletedProfile || false,
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
        // Clear individual fields
        firstName: '',
        lastName: '',
        email: '',
        avatar: '',
        isVerified: false,
        hasCompletedProfile: false
      });
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
      // Log error but don't throw - we still want to clear frontend state
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of server response
      set({
        user: null,
        isAuthenticated: false,
        email: '',
        hasCheckedAuth: true, // Keep this true to prevent re-checking auth
        isLoading: false, // Ensure loading is false
        // Clear individual fields
        firstName: '',
        lastName: '',
        avatar: '',
        isVerified: false,
        hasCompletedProfile: false
      });
    }
  },
}));