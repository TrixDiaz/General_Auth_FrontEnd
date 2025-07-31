import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "../lib/axios";

interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    username?: string;
    phone?: string;
    isVerified?: boolean;
    isLocked?: boolean;
    role?: string;
    permissions?: string[];
    profilePicture?: string;
    bio?: string;
    isDeleted?: boolean;
    deletedAt?: Date;
    isActive?: boolean;
    hasCompletedProfile?: boolean;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AuthState {
    user: User | null;
    email: string | null;
    setUser: (user: User | null) => void;
    setEmail: (email: string | null) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    logout: () => Promise<void>;
}

export const authStore = create<AuthState>()(persist((set) => ({
    user: null,
    email: null,
    setUser: (user: User | null) => set({ user }),
    setEmail: (email: string | null) => set({ email }),
    isAuthenticated: false,
    setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
    logout: async () => {
        try {
            // Call the logout API to clear cookies and server-side tokens
            await api.post('/auth/logout');
        } catch (error) {
            // Even if the API call fails, we still want to clear local state
            console.error('Logout API call failed:', error);
        } finally {
            // Clear localStorage auth storage
            localStorage.removeItem('auth-storage');
            // Reset auth state
            set({ user: null, email: null, isAuthenticated: false });
        }
    },
}), {
    name: "auth-storage",
    storage: createJSONStorage(() => localStorage),
}));

