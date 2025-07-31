import { Button } from '../../components/ui/button';
import { AuthCard } from '../../components/AuthCard';
import { Link } from 'react-router-dom';

export default function OtherWays() {

    return (
        <div className="min-h-screen flex items-center justify-center">
            <AuthCard showBackButton >
                <h1 className="text-3xl font-semibold text-center mb-6">Sign in other ways</h1>
                <div className="flex flex-col gap-4 w-full">
                    <Link to="/pin">
                        <Button variant="outline" className="w-full">
                            Use your Security PIN
                        </Button>
                    </Link>

                    <Link to="/password">
                        <Button variant="outline" className="w-full">
                            Use your Password
                        </Button>
                    </Link>
                </div>
            </AuthCard>
        </div>
    );
}