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
    const setUser = useAuthStore((state) => state.setUser);

    const handleSubmit = async (data: Record<string, string>) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/verify-otp-signin', {
                email: email,
                otp: data.otp,
            });
            const result = response.data;
            console.log(result);
            toast.success(result.message);

            // Store user data in auth store
            if (result.user) {
                setUser(result.user);
            }

            navigate("/dashboard");
        } catch (error: unknown) {
            console.error("Login failed", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while verifying OTP");
            }
        } finally {
            setLoading(false);
        }
    };

    // If type is "sign up", back button goes to /login, else /send-code
    const backTo = type === "sign up" ? "/register" : "/send-code";

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