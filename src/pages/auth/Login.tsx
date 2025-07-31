import AuthLayout from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../../store/authStore";
import { toast } from "sonner";
import api from "../../lib/axios";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [ loading, setLoading ] = useState(false);
  const { email, setEmail } = authStore();
  const navigate = useNavigate();

  const handleSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      setEmail(data.email);
      const response = await api.post("/auth/check-email", {
        email: data.email,
      })
      if (response.status === 200) {
        navigate("/send-code", { state: { type: "sign in" } });
      } else {
        toast.error(response.data.message);
      }
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
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Next"
        defaultValue={email || ""}
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
