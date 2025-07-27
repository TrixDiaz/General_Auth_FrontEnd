import { Suspense, lazy, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { useAuthStore } from "./store/useAuthStore";
import NewPassword from "./pages/auth/NewPassword.tsx";

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

// Component to handle initial authentication check
function AuthInitializer() {
  const { checkAuth, hasCheckedAuth } = useAuthStore();
  const hasRun = useRef(false);

  useEffect(() => {
    // Only check authentication once on app initialization
    if (!hasCheckedAuth && !hasRun.current) {
      hasRun.current = true;
      checkAuth();
    }
  }, [checkAuth, hasCheckedAuth]);

  return null;
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthInitializer />
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><LoadingSpinner /></div>}>
          <Routes>
            {/* Public Routes - Redirect to Dashboard if authenticated */}
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
            
            {/* Protected Routes - Redirect to Login if not authenticated */}
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
      </ErrorBoundary>
    </Router>
  );
}

export default App;
