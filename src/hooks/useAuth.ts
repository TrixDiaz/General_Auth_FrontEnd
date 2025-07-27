import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { 
    isAuthenticated, 
    isLoading, 
    hasCheckedAuth,
    checkAuth, 
    refreshUser,
    user 
  } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        navigate('/login', { replace: true });
      }
    };

    verifyAuth();
  }, [checkAuth, navigate]);

  const refreshUserData = useCallback(async () => {
    if (isAuthenticated) {
      await refreshUser();
    }
  }, [isAuthenticated, refreshUser]);

  return { 
    isAuthenticated, 
    isLoading, 
    hasCheckedAuth,
    user,
    refreshUserData 
  };
}; 