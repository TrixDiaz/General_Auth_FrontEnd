import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
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

  return { isAuthenticated, isLoading };
};

export const useAuthRedirect = (redirectTo: string = '/dashboard') => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        navigate(redirectTo, { replace: true });
      }
    };

    verifyAuth();
  }, [checkAuth, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
}; 