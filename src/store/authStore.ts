import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import api from "../lib/axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

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

interface PendingRequest {
    resolve: (value: AxiosResponse) => void;
    reject: (reason?: unknown) => void;
    config: AxiosRequestConfig;
}

interface AuthState {
    user: User | null;
    email: string | null;
    setUser: (user: User | null) => void;
    setEmail: (email: string | null) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    logout: () => Promise<void>;
    // Refresh token related state
    showRefreshDialog: boolean;
    setShowRefreshDialog: (show: boolean) => void;
    isRefreshing: boolean;
    setIsRefreshing: (isRefreshing: boolean) => void;
    refreshTokens: () => Promise<boolean>;
    // Pending request for token refresh
    pendingRequest: PendingRequest | null;
    setPendingRequest: (pendingRequest: PendingRequest | null) => void;
    retryPendingRequest: () => Promise<void>;
}

export const authStore = create<AuthState>()(persist((set, get) => ({
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
            set({ 
                user: null, 
                email: null, 
                isAuthenticated: false,
                showRefreshDialog: false,
                isRefreshing: false,
                pendingRequest: null
            });
        }
    },
    // Refresh token related state and methods
    showRefreshDialog: false,
    setShowRefreshDialog: (show: boolean) => set({ showRefreshDialog: show }),
    isRefreshing: false,
    setIsRefreshing: (isRefreshing: boolean) => set({ isRefreshing }),
    pendingRequest: null,
    setPendingRequest: (pendingRequest: PendingRequest | null) => set({ pendingRequest }),
    retryPendingRequest: async () => {
        const { pendingRequest, setPendingRequest } = get();
        
        if (pendingRequest) {
            try {
                const response = await api(pendingRequest.config);
                pendingRequest.resolve(response);
            } catch (error) {
                pendingRequest.reject(error);
            } finally {
                setPendingRequest(null);
            }
        }
    },
    refreshTokens: async () => {
        const { setIsRefreshing, setShowRefreshDialog, setUser, setEmail, setIsAuthenticated, retryPendingRequest } = get();
        
        setIsRefreshing(true);
        setShowRefreshDialog(false);
        
        try {
            const response = await api.post('/auth/refresh-token');
            const { user } = response.data;
            
            setUser(user);
            setEmail(user.email);
            setIsAuthenticated(true);
            setIsRefreshing(false);
            
            // Retry the pending request if there is one
            await retryPendingRequest();
            
            return true;
        } catch (error) {
            console.error('Failed to refresh tokens:', error);
            setIsRefreshing(false);
            
            // If refresh fails, logout the user
            const { logout } = get();
            await logout();
            
            return false;
        }
    },
}), {
    name: "auth-storage",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
        user: state.user,
        email: state.email,
        isAuthenticated: state.isAuthenticated,
    }),
}));

