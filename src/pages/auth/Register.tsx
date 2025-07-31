import AuthLayout from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../../store/authStore";
import { useState } from "react";
import axios from 'axios';
import { toast } from "sonner";
import api from "../../lib/axios";

export default function Register() {
  const [ loading, setLoading ] = useState(false);
  const { email, setEmail } = authStore();
  const navigate = useNavigate();

  const handleSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      setEmail(data.email);
      const response = await api.post("/auth/signup", {
        email: data.email,
      })
      if (response.status === 200) {
        navigate("/otp", { state: { type: "sign up" } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error: unknown) {
      console.error("Registration failed", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while registering");
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <AuthLayout title="Create your Account">
      <AuthForm
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Next"
        defaultValue={email || ""}
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
