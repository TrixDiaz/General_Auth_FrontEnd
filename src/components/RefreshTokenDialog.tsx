import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface RefreshTokenDialogProps {
  isOpen: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  isLoading?: boolean;
}

export const RefreshTokenDialog: React.FC<RefreshTokenDialogProps> = ({
  isOpen,
  onRefresh,
  onLogout,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>Session Expired</DialogTitle>
          </div>
          <DialogDescription>
            Your session has expired. Would you like to refresh your session or log out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onLogout}
            disabled={isLoading}
          >
            Log Out
          </Button>
          <Button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 