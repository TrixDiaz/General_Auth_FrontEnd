import type { ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasCheckedAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we've checked auth and user is not authenticated
    if (hasCheckedAuth && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [hasCheckedAuth, isAuthenticated, navigate]);

  // Show loading spinner only if we're still checking authentication
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner className="text-black" />
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}; 