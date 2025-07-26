import { useState } from "react";
import { AuthForm } from "../../components/AuthForm";
import { AuthCard } from "../../components/AuthCard";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";

export default function Otp() {
    const [ loading, setLoading ] = useState(false);
    const location = useLocation();
    const { type, email } = location.state || {};
    const navigate = useNavigate();
    const loginSuccess = useAuthStore((state) => state.loginSuccess);

    // Redirect if no email or type is provided
    if (!email || !type) {
        navigate("/forgot-password");
        return null;
    }

    const handleSubmit = async (data: Record<string, string>) => {
        setLoading(true);
        try {
            let response;

            if (type === "verify-otp-password") {
                response = await api.post('/auth/password-reset-verify-otp', {
                    email: email,
                    otp: data.otp,
                });
                const result = response.data;
                console.log(result);
                toast.success(result.message);

                // Navigate to password reset page after successful OTP verification
                navigate("/new-password", { state: { email: email } });
            } else {
                // Handle login OTP verification (default behavior)
                response = await api.post('/auth/verify-otp-signin', {
                    email: email,
                    otp: data.otp,
                });
                const result = response.data;
                console.log(result);
                toast.success(result.message);

                // Store user data in auth store
                if (result.user) {
                    loginSuccess(result.user);
                }

                navigate("/dashboard");
            }
        } catch (error: unknown) {
            console.error("OTP verification failed", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while verifying OTP");
            }
        } finally {
            setLoading(false);
        }
    };

    // Determine back button destination based on type
    let backTo;
    if (type === "verify-otp-password") {
        backTo = "/forgot-password";
    } else if (type === "sign up") {
        backTo = "/register";
    } else {
        backTo = "/send-code";
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AuthCard email={email} showBadge={true} showBackButton backTo={backTo}>
                <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
                <AuthForm
                    onSubmit={handleSubmit}
                    loading={loading}
                    submitText="Submit OTP"
                    label="OTP Code"
                    placeholder="Enter your OTP Code"
                    name="otp"
                    type="text"
                />
            </AuthCard>
        </div>
    );
}