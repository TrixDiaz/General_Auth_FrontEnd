import { useLocation, useNavigate } from "react-router-dom";
import { AuthCard } from "../../components/AuthCard";
import { useState } from "react";
import api from "../../lib/axios";
import { toast } from "sonner";
import axios from "axios";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

interface NewPasswordFormData {
    password: string;
    confirmPassword: string;
}

export default function NewPassword() {
    const { state } = useLocation();
    const { email } = state || {};
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<NewPasswordFormData>();

    const password = watch("password");

    // Redirect if no email is provided
    if (!email) {
        navigate("/forgot-password");
        return null;
    }

    const handleFormSubmit = async (data: NewPasswordFormData) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/password-reset', {
                email: email,
                password: data.password,
            });
            const result = response.data;
            console.log(result);
            toast.success(result.message);
            navigate("/dashboard");
        } catch (error: unknown) {
            console.error("New Password Failed", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while resetting password");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AuthCard email={email} showBadge={true} showBackButton backTo="/otp">
                <h2 className="text-2xl font-bold mb-6 text-center">Enter your new password</h2>
                <form className="w-full" onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="mb-4">
                        <Label htmlFor="password" className="mb-2">Password</Label>
                        <PasswordInput
                            id="password"
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })}
                            aria-invalid={!!errors.password}
                            disabled={loading}
                        />
                        {errors.password && (
                            <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="confirmPassword" className="mb-2">Confirm Password</Label>
                        <PasswordInput
                            id="confirmPassword"
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match"
                            })}
                            aria-invalid={!!errors.confirmPassword}
                            disabled={loading}
                        />
                        {errors.confirmPassword && (
                            <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full flex items-center justify-center" disabled={loading}>
                        {loading ? <LoadingSpinner className="text-white" /> : "Submit"}
                    </Button>
                </form>
            </AuthCard>
        </div>
    )
}
