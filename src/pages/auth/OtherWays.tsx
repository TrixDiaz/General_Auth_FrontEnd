import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { AuthCard } from '../../components/AuthCard';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useEffect } from "react";

export default function OtherWays() {
    const email = useAuthStore((state) => state.email);
    const navigate = useNavigate();

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

    const handlePin = () => {
        navigate("/pin", { state: { type: "sign in", email } });
    }

    const handlePassword = () => {
        navigate("/password", { state: { type: "sign in", email } });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <AuthCard email={email} showBackButton backTo="/send-code">
                <h1 className="text-3xl font-semibold text-center mb-6">Sign in other ways</h1>
                <div className="flex flex-col gap-4 w-full">
                    <Button onClick={handlePin} variant="outline" className="w-full">Use your Security PIN</Button>
                    <Button onClick={handlePassword} variant="outline" className="w-full">Use your Password</Button>
                </div>
            </AuthCard>
        </div>
    );
}