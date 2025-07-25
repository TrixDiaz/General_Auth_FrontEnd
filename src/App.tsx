import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

const Password = lazy(() => import("./pages/auth/Password.tsx"));
const Pin = lazy(() => import("./pages/auth/Pin.tsx"));
const Otp = lazy(() => import("./pages/auth/Otp.tsx"));
const Login = lazy(() => import("./pages/auth/Login.tsx"));
const Register = lazy(() => import("./pages/auth/Register.tsx"));
const SendCode = lazy(() => import("./pages/auth/SendCode.tsx"));
const OtherWays = lazy(() => import("./pages/auth/OtherWays.tsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));


function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><LoadingSpinner className="text-black" /></div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/send-code" element={<SendCode />} />
            <Route path="/other-ways" element={<OtherWays />} />
            <Route path="/pin" element={<Pin />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/password" element={<Password />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
