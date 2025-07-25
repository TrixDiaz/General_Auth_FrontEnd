import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../lib/axios";
import axios from "axios";
import { toast } from "sonner";


export default function ForgotPassword() {
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/password-reset-otp', {
        email: data.email,
      });

      const result = response.data;
      console.log(result);
      toast.success(result.message);
      navigate("/otp", { state: { type: "verify-otp-password", email: data.email } });
    } catch (error: unknown) {
      console.error("Forgot Password Failed", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while sending OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <AuthForm
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Next"
        defaultValue={email} // Pass defaultValue to pre-fill email
      />
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
