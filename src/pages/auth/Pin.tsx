import { AuthForm } from "../../components/AuthForm";
import { AuthCard } from "../../components/AuthCard";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from 'axios';
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Pin() {
    const [ loading, setLoading ] = useState(false);
    const { email, setUser, setIsAuthenticated, setEmail } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [ email, navigate ]);

    const handleSubmit = async (data: Record<string, string>) => {
        setLoading(true);
        try {
            const response = await api.post("/auth/signin-pin", {
                email: email,
                pin: data.pin,
            })
            if (response.status === 200) {
                setUser(response.data.user);
                setEmail(response.data.user.email);
                setIsAuthenticated(true);
                navigate("/dashboard", { state: { type: "sign in" } });
            } else {
                toast.error(response.data.message);
            }
        } catch (error: unknown) {
            console.error("Pin failed", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while submitting PIN");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AuthCard email={email || ""} showBadge={true} showBackButton backTo="/send-code">
                <h2 className="text-2xl font-bold mb-6 text-center">Enter your PIN</h2>
                <AuthForm
                    onSubmit={handleSubmit}
                    loading={loading}
                    submitText="Submit PIN"
                    label="PIN Code"
                    placeholder="Enter your PIN Code"
                    type="text"
                    name="pin"
                />
            </AuthCard>
        </div>
    );
}