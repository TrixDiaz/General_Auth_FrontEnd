import type { ReactNode } from 'react';
import { Badge } from './ui/badge';
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface AuthCardProps {
  email?: string;
  children: ReactNode;
  showLogo?: boolean;
  showBadge?: boolean;
  showBackButton?: boolean;
  backTo?: string;
  className?: string;
}

export function AuthCard({
  email,
  children,
  showLogo = true,
  showBadge = true,
  showBackButton = false,
  backTo = "/",
  className = '',
}: AuthCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg px-10 py-8 w-full max-w-md mx-auto flex flex-col items-center relative ${className}`}
    >
      {showLogo && (
        <div className="flex items-center gap-2 mb-4">
          <img src="/vite.svg" alt="Logo" className="h-10" />
          <span className="text-3xl font-semibold">Fastlink</span>
        </div>
      )}
      {showBadge && email && (
        <div className="flex justify-center mb-2">
          <Badge>{email}</Badge>
        </div>
      )}
      {showBackButton && (
        <div className="absolute top-6 right-6">
          <Tooltip>
            <TooltipTrigger>
              <Link to={backTo}>
                <Button variant="ghost" size="icon" className="p-2">
                  <span style={{ fontSize: 24 }}>&larr;</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              Back
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      {children}
    </div>
  );
}