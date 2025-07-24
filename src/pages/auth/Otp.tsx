import { AuthForm } from "../../components/AuthForm";
import { AuthCard } from "../../components/AuthCard";

export default function Otp() {
    const handleSubmit = async (data: Record<string, string>) => {
        alert("Submitted OTP: " + data.otp);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AuthCard showBackButton backTo="/send-code">
                <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
                <AuthForm
                    onSubmit={handleSubmit}
                    submitText="Submit OTP"
                    label="OTP Code"
                    placeholder="Enter your OTP Code"
                    name="otp"
                />
            </AuthCard>
        </div>
    );
}
