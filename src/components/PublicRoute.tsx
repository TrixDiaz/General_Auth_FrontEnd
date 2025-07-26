import { ReactNode } from 'react';
import { useAuthRedirect } from '../hooks/useAuth';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo = '/dashboard' }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthRedirect(redirectTo);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner className="text-black" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard via useAuthRedirect hook
  }

  return <>{children}</>;
}; 