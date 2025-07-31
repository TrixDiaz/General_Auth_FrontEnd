import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User, Mail, Phone } from 'lucide-react';

export default function UserInfoDisplay() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No user data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Live User Data
        </CardTitle>
        <CardDescription>
          This component updates in real-time when user data changes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Name:</span>
          <span className="text-sm">{user.firstName} {user.lastName}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{user.email}</span>
        </div>

        {user?.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.phone}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <div className="flex gap-2">
            <Badge variant={user?.isVerified ? "default" : "secondary"}>
              {user?.isVerified ? "Verified" : "Unverified"}
            </Badge>
            {user?.hasCompletedProfile && (
              <Badge variant="outline">Profile Complete</Badge>
            )}
          </div>
        </div>

        {(user?.address || user?.city || user?.state || user?.zip) && (
          <div className="pt-2 border-t">
            <span className="text-sm font-medium">Address:</span>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.address && <span>{user?.address}<br /></span>}
              {[ user?.city, user?.state, user?.zip ].filter(Boolean).join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 