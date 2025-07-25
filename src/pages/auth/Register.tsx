import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";
import { toast } from "sonner"

export default function Register() {
  const [ loading, setLoading ] = useState(false);
  const setEmail = useAuthStore((state) => state.setEmail);
  const navigate = useNavigate();
  const baseUrl = 'http://localhost:5000/api/v1/auth';

  const handleRegister = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/signup`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = response.data;

      // Show success message
      toast(result.message + " " + result.email);

      setEmail(data.email);
      navigate("/otp", { state: { type: "sign up", email: data.email } });
    } catch (error: unknown) {
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your Account">
      <AuthForm
        onSubmit={handleRegister}
        loading={loading}
        submitText="Next"
      />
      <div className="mt-4 flex justify-between items-center w-full">
        <span className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary underline">
            Sign in!
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
