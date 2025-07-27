import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
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

interface UserState {
    // User-specific state
    isUpdating: boolean;

    // Actions
    updateUserProfile: (updates: Partial<User>) => Promise<void>;
    refreshUserData: () => Promise<void>;
    getUser: () => User | null;
    isUserLoading: () => boolean;
    isUserAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>((set) => ({
    isUpdating: false,

    updateUserProfile: async (updates: Partial<User>) => {
        set({ isUpdating: true });

        try {
            const response = await api.patch('/users/me', updates);
            const updatedUser = response.data;

            // Update the auth store with new user data
            useAuthStore.getState().updateUser(updatedUser);
        } catch (error) {
            console.error('Failed to update user profile:', error);
            throw error;
        } finally {
            set({ isUpdating: false });
        }
    },

    refreshUserData: async () => {
        try {
            await useAuthStore.getState().refreshUser();
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            throw error;
        }
    },

    getUser: () => {
        return useAuthStore.getState().user;
    },

    isUserLoading: () => {
        return useAuthStore.getState().isLoading;
    },

    isUserAuthenticated: () => {
        return useAuthStore.getState().isAuthenticated;
    },
}));
