import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { AuthCard } from '../../components/AuthCard';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../lib/axios';
import axios from 'axios';

export default function SendCode() {
    const [ loading, setLoading ] = useState(false);
    const email = useAuthStore((state) => state.email);
    const location = useLocation();
    const type = location.state?.type || "sign in"; // default fallback
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

    const handleSendCode = async () => {
        setLoading(true);
        try {
            const response = await api.post('/auth/signin-otp', { email });
            const result = response.data;
            console.log(response);
            toast(result.message);
            navigate("/otp", { state: { type: "sign in", email } });
        } catch (error: unknown) {
            console.log("Send Code Failed", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while sending code");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <AuthCard email={email} showBackButton backTo="/">
                <h1 className="text-3xl font-semibold text-center mb-2">Get a code to {type}</h1>
                <p className="text-center mb-6">
                    We'll send a code to <b>{email}</b> to {type} you.
                </p>
                <form className='w-full' onSubmit={(e) => { e.preventDefault(); handleSendCode(); }}>
                    <Button type="submit" className="w-full mb-4" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Code'}
                    </Button>
                </form>
                <Link to="/other-ways" className="w-full">
                    <Button variant="ghost" className='w-full'>
                        Other ways to {type}
                    </Button>
                </Link>
            </AuthCard>
        </div>
    );
}
