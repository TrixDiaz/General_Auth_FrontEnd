import { useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';

export const useUser = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        refreshUser,
        updateUser
    } = useAuthStore();

    const {
        isUpdating,
        updateUserProfile,
        refreshUserData: refreshFromUserStore
    } = useUserStore();

    const refreshUserData = useCallback(async () => {
        if (isAuthenticated) {
            await refreshFromUserStore();
        }
    }, [isAuthenticated, refreshFromUserStore]);

    const updateUserData = useCallback(async (updates: Partial<NonNullable<typeof user>>) => {
        if (user) {
            await updateUserProfile(updates);
        }
    }, [user, updateUserProfile]);

    return {
        user,
        isAuthenticated,
        isLoading,
        isUpdating,
        refreshUserData,
        updateUserData,
    };
}; 