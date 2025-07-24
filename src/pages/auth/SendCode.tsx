import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { AuthCard } from '../../components/AuthCard';
import { Link } from 'react-router-dom';

export default function SendCode() {
    const email = useAuthStore((state) => state.email);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <AuthCard email={email} showBackButton backTo="/">
                <h1 className="text-3xl font-semibold text-center mb-2">Get a code to sign in</h1>
                <p className="text-center mb-6">
                    We'll send a code to <b>{email}</b> to sign you in.
                </p>
                <Button className="w-full mb-4">Send Code</Button>
                <Link to="/other-ways" className="w-full">
                    <Button variant="ghost" className='w-full'>
                        Other ways to sign in
                    </Button>
                </Link>
            </AuthCard>
        </div>
    );
}