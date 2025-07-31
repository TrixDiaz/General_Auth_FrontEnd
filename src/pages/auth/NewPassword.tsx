import { AuthCard } from "../../components/AuthCard";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import api from "../../lib/axios";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

export default function NewPassword() {
    const [ loading, setLoading ] = useState(false);
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [ email, navigate ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error("Please fill in both fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/auth/password-reset", {
                email,
                password,
            });

            if (response.status === 200) {
                toast.success("Password reset successfully");
                navigate("/dashboard");
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error: unknown) {
            console.error("Password reset failed", error);
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
            <AuthCard email={email || ""} showBadge={true} showBackButton backTo="/otp">
                <h2 className="text-2xl font-bold mb-6 text-center">Enter your new password</h2>
                <form className="w-full" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="password" className="mb-2">Password</Label>
                        <PasswordInput
                            id="password"
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="confirmPassword" className="mb-2">Confirm Password</Label>
                        <PasswordInput
                            id="confirmPassword"
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                        {confirmPassword && confirmPassword !== password && <ErrorMessage message="Passwords do not match" />}
                    </div>

                    <Button type="submit" disabled={loading} className="w-full flex items-center justify-center">
                        {loading ? <LoadingSpinner /> : "Submit"}
                    </Button>
                </form>
            </AuthCard>
        </div>
    );
}
