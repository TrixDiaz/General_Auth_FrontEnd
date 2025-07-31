import { AuthForm } from "../../components/AuthForm";
import { AuthCard } from "../../components/AuthCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from 'axios';
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

export default function Otp() {
    const [ loading, setLoading ] = useState(false);
    const { email, setUser, setIsAuthenticated, setEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const type = location.state?.type || 'sign in';


    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [ email, navigate ]);

    const handleSubmit = async (data: Record<string, string>) => {
        setLoading(true);
        try {
            if (type === "sign up") {
                const response = await api.post("/auth/verify-otp-signup", {
                    email: email,
                    otp: data.otp,
                })
                if (response.status === 200) {
                    setUser(response.data.user);
                    setEmail(response.data.user.email);
                    setIsAuthenticated(true);
                    navigate("/dashboard");
                } else {
                    toast.error(response.data.message);
                }
            } else if (type === "password reset") {
                const response = await api.post("/auth/password-reset-otp", {
                    email: email,
                    otp: data.otp,
                })
                if (response.status === 200) {
                    setUser(response.data.user);
                    setEmail(response.data.user.email);
                    setIsAuthenticated(true);
                    navigate("/new-password", { state: { email: email } });
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const response = await api.post("/auth/verify-otp-signin", {
                    email: email,
                    otp: data.otp,
                })
                if (response.status === 200) {
                    setUser(response.data.user);
                    setEmail(response.data.user.email);
                    setIsAuthenticated(true);
                    navigate("/dashboard");
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error: unknown) {
            console.error("OTP failed", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while submitting OTP");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AuthCard email={email || ""} showBadge={true} showBackButton backTo="/register">
                <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP to {type}</h2>
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