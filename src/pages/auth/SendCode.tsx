import { Button } from '../../components/ui/button';
import { AuthCard } from '../../components/AuthCard';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '../../store/authStore';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../lib/axios';
import axios from 'axios';

export default function SendCode() {
    const [ loading, setLoading ] = useState(false);
    const { email } = authStore();
    const navigate = useNavigate();
    const location = useLocation();
    const type = location.state?.type || 'sign-in';

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }

    }, [ email, navigate ]);

    const handleSendCode = async () => {
        setLoading(true);
        try {
            const response = await api.post("/auth/signin-otp", {
                email: email,
            })
            if (response.status === 200) {
                navigate("/otp", { state: { type: "sign in" } });
            } else {
                toast.error(response.data.message);
            }
        } catch (error: unknown) {
            console.error("Send Code failed", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while sending code");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        toast.error("Email not found, Please sign up first.");
        navigate("/login");
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <AuthCard
                showBackButton
                backTo="/login"
                email={email}
            >
                <h1 className="text-3xl font-semibold text-center mb-2">Get a code to {type}</h1>
                <p className="text-center mb-6">
                    We'll send a code to <span className="font-medium">{email}</span>.
                </p>
                <form className='w-full' onSubmit={(e) => {
                    e.preventDefault();
                    handleSendCode();
                }}>
                    <Button onClick={handleSendCode} disabled={loading} type="submit" className="w-full mb-4" >
                        Send Code
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
