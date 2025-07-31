import AuthLayout from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../../store/authStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from 'axios';
import api from "../../lib/axios";


export default function ForgotPassword() {
  const [ loading, setLoading ] = useState(false);
  const { email } = authStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [ email, navigate ]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/password-reset-otp", {
        email: email,
      })
      if (response.status === 200) {
        navigate("/otp", { state: { type: "password reset" } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error: unknown) {
      console.error("Forgot Password failed", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while submitting forgot password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <AuthForm defaultValue={email || ""} loading={loading} onSubmit={handleSubmit} submitText="Next" />
      <div className="mt-4 flex justify-between items-center w-full">
        <span className="text-sm text-muted-foreground">
          Back to Login?{" "}
          <Link to="/login" className="text-primary underline">
            Login!
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
