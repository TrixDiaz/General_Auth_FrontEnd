import { AuthForm } from "../../components/AuthForm";
import { AuthCard } from "../../components/AuthCard";


export default function Pin() {
    const handleSubmit = async (data: Record<string, string>) => {
        alert("Submitted PIN: " + data.pin);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AuthCard showBackButton backTo="/send-code">
                <h2 className="text-2xl font-bold mb-6 text-center">Enter your PIN</h2>
                <AuthForm
                    onSubmit={handleSubmit}
                    submitText="Submit PIN"
                    label="PIN Code"
                    placeholder="Enter your PIN Code"
                    type="password"
                    name="pin"
                />
            </AuthCard>
        </div>
    );
}