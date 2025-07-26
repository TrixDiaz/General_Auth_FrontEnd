import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
        <div className="space-y-4">
          <div>
            <strong>User ID:</strong> {user?.id}
          </div>
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Verified:</strong> {user?.isVerified ? "Yes" : "No"}
          </div>
          <div>
            <strong>Profile Completed:</strong> {user?.hasCompletedProfile ? "Yes" : "No"}
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={handleLogout} className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
} 