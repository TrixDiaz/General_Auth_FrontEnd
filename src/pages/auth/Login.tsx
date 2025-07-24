// @ts-nocheck
import React, { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { Link } from "react-router-dom";

export default function Login() {
  const [ loading, setLoading ] = useState(false);

  const handleLogin = async (data: Record<string, string>) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Login success", data.email);
    }, 1000);
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
