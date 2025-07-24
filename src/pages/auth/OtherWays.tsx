import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { AuthCard } from '../../components/AuthCard';

export default function OtherWays() {
    const email = useAuthStore((state) => state.email);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <AuthCard email={email} showBackButton backTo="/send-code">
                <h1 className="text-3xl font-semibold text-center mb-6">Sign in other ways</h1>
                <div className="flex flex-col gap-4 w-full">
                    <Button variant="outline" className="w-full">Use your Security PIN</Button>
                    <Button variant="outline" className="w-full">Use your Password</Button>
                </div>
            </AuthCard>
        </div>
    );
}