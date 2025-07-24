import { AuthForm } from "../../components/AuthForm";
import { AuthCard } from "../../components/AuthCard";

export default function Password() {
    const handleSubmit = async (data: Record<string, string>) => {
        alert("Submitted Password: " + data.password);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <AuthCard showBackButton backTo="/send-code">
                <h2 className="text-2xl font-bold mb-6 text-center">Enter your Password</h2>
                <AuthForm
                    onSubmit={handleSubmit}
                    submitText="Submit Password"
                    label="Password"
                    placeholder="Enter your Password"
                    type="password"
                    name="password"
                />
            </AuthCard>
        </div>
    );
}
