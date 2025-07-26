import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/axios";
import axios from "axios";
import { toast } from "sonner"

export default function Register() {
  const [ loading, setLoading ] = useState(false);
  const setEmail = useAuthStore((state) => state.setEmail);
  const navigate = useNavigate();

  const handleRegister = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', data);
      const result = response.data;

      // Show success message
      toast(result.message + " " + result.email);

      setEmail(data.email);
      navigate("/otp", { state: { type: "sign up", email: data.email } });
    } catch (error: unknown) {
      console.error("Registration failed", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred during registration");
      }
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
