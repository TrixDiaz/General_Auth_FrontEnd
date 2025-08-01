import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import NewPassword from "./pages/auth/NewPassword.tsx";
import { RefreshTokenDialog } from "./components/RefreshTokenDialog";
import { useAuth } from "./hooks/useAuth";

const Password = lazy(() => import("./pages/auth/Password.tsx"));
const Pin = lazy(() => import("./pages/auth/Pin.tsx"));
const Otp = lazy(() => import("./pages/auth/Otp.tsx"));
const Login = lazy(() => import("./pages/auth/Login.tsx"));
const Register = lazy(() => import("./pages/auth/Register.tsx"));
const SendCode = lazy(() => import("./pages/auth/SendCode.tsx"));
const OtherWays = lazy(() => import("./pages/auth/OtherWays.tsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoutes.tsx"));
const PublicRoute = lazy(() => import("./components/PublicRoutes.tsx"));
import { useAuthInit } from "./hooks/useAuth";

function App() {
  useAuthInit();
  const { showRefreshDialog, setShowRefreshDialog, isRefreshing, refreshTokens, logout } = useAuth();

  const handleRefresh = async () => {
    await refreshTokens();
  };

  const handleLogout = async () => {
    setShowRefreshDialog(false);
    await logout();
  };

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><LoadingSpinner /></div>}>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/send-code" element={
              <PublicRoute>
                <SendCode />
              </PublicRoute>
            } />
            <Route path="/other-ways" element={
              <PublicRoute>
                <OtherWays />
              </PublicRoute>
            } />
            <Route path="/pin" element={
              <PublicRoute>
                <Pin />
              </PublicRoute>
            } />
            <Route path="/otp" element={
              <PublicRoute>
                <Otp />
              </PublicRoute>
            } />
            <Route path="/password" element={
              <PublicRoute>
                <Password />
              </PublicRoute>
            } />
            <Route path="/new-password" element={
              <PublicRoute>
                <NewPassword />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>

        {/* Refresh Token Dialog */}
        <RefreshTokenDialog
          isOpen={showRefreshDialog}
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          isLoading={isRefreshing}
        />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
