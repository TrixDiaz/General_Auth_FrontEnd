import { ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo = '/dashboard' }: PublicRouteProps) => {
  const { isAuthenticated, isLoading, hasCheckedAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we've checked auth and user is authenticated
    if (hasCheckedAuth && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [hasCheckedAuth, isAuthenticated, navigate, redirectTo]);

  // Show loading spinner only if we're still checking authentication
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner className="text-black" />
      </div>
    );
  }

  // If authenticated, don't render children (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}; 