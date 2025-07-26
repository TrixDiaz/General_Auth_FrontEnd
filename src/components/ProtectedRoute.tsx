import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner className="text-black" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login via useAuth hook
  }

  return <>{children}</>;
}; 