import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/axios";
import axios from "axios";
import { toast } from "sonner";

export default function Login() {
  const [ loading, setLoading ] = useState(false);
  const setEmail = useAuthStore((state) => state.setEmail);
  const navigate = useNavigate();

  const handleLogin = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/checkEmail', data);
      const result = response.data;
      console.log(result);
      toast(result.message);
      setEmail(data.email);
      navigate("/send-code", { state: { type: "sign in", email: data.email } });
    } catch (error: unknown) {
      console.error("Login failed", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while checking email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in your Account">
      <AuthForm
        onSubmit={handleLogin}
        loading={loading}
        submitText="Next"
      />
      <div className="mt-4 flex justify-between items-center w-full">
        <span className="text-sm text-muted-foreground">
          No Account?{" "}
          <Link to="/register" className="text-primary underline">
            Create One!
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
