import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthCard } from "../../components/AuthCard";
import { useLocation } from "react-router-dom";
import api from "../../lib/axios";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

interface PasswordFormData {
    password: string;
}

export default function Password() {
    const { state } = useLocation();
    const email = state?.email;
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(false);
    const loginSuccess = useAuthStore((state) => state.loginSuccess);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PasswordFormData>();

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

    const handleResetPassword = () => {
        navigate("/forgot-password", { state: { email: email } });
    };

    const handleFormSubmit = async (data: PasswordFormData) => {
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
                loginSuccess(result.user);
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
                <form className="w-full" onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="mb-6">
                        <Label htmlFor="password" className="mb-2">Password</Label>
                        <PasswordInput
                            id="password"
                            placeholder="Enter your Password"
                            autoComplete="current-password"
                            {...register("password", {
                                required: "Password is required"
                            })}
                            aria-invalid={!!errors.password}
                            disabled={loading}
                        />
                        {errors.password && (
                            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full flex items-center justify-center" disabled={loading}>
                        {loading ? <LoadingSpinner className="text-white" /> : "Submit Password"}
                    </Button>
                </form>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                    Forgot your password? 
                    <Button onClick={handleResetPassword} variant="link" className="text-primary">Reset it</Button>
                </p>
            </AuthCard>
        </div>
    );
}
