import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import Password from "./pages/auth/Password.tsx";
import Otp from "./pages/auth/Otp.tsx";

const Login = lazy(() => import("./pages/auth/Login.tsx"));
const Register = lazy(() => import("./pages/auth/Register.tsx"));
const SendCode = lazy(() => import("./pages/auth/SendCode.tsx"));
const OtherWays = lazy(() => import("./pages/auth/OtherWays.tsx"));
const Pin = lazy(() => import("./pages/auth/Pin.tsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.tsx"));


function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><LoadingSpinner /></div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/send-code" element={<SendCode />} />
            <Route path="/other-ways" element={<OtherWays />} />
            <Route path="/pin" element={<Pin />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/password" element={<Password />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
