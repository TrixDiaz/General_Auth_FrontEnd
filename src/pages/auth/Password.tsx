import { AuthCard } from "../../components/AuthCard";
import { AuthForm } from "../../components/AuthForm";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from 'axios';
import api from "../../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Password() {
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
            const response = await api.post("/auth/signin-password", {
                email: email,
                password: data.password,
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
            console.error("Password failed", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while submitting password");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AuthCard email={email || ""} showBadge={true} showBackButton backTo="/other-ways">
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
                <p className="text-sm text-muted-foreground mt-4 text-center">
                    Forgot your password?
                    <Link to="/forgot-password" className="text-primary ml-1"> Reset it</Link>
                </p>
            </AuthCard>
        </div>
    );
}
