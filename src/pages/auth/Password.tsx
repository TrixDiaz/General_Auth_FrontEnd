import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthForm } from "../../components/AuthForm";
import { AuthCard } from "../../components/AuthCard";
import { useLocation } from "react-router-dom";
import api from "../../lib/axios";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";

export default function Password() {
    const { state } = useLocation();
    const email = state?.email;
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        if (!email) {
            toast.error("Please check your email first");
            navigate("/login");
        }
    }, [ email, navigate ]);

    // Don't render the component if there's no email
    if (!email) {
        return null;
    }

    const handleSubmit = async (data: Record<string, string>) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/signin-password', {
                email: email,
                password: data.password,
            });
            const result = response.data;
            console.log(response);
            toast(result.message);
            navigate("/dashboard");

            // Store user data in auth store
            if (result.user) {
                setUser(result.user);
            }
        } catch (error: unknown) {
            console.error("Login failed", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while verifying OTP");
            }
        } finally {
            setLoading(false)
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AuthCard email={email} showBadge={true} showBackButton backTo="/other-ways">
                <h2 className="text-2xl font-bold mb-6 text-center">Enter your Password</h2>
                <AuthForm
                    onSubmit={handleSubmit}
                    loading={loading}
                    submitText="Submit Password"
                    label="Password"
                    placeholder="Enter your Password"
                    type="password"
                    name="password"
                />
            </AuthCard>
        </div>
    );
}
