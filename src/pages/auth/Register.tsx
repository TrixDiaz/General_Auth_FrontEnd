// @ts-nocheck
import React, { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { Link } from "react-router-dom";

export default function Register() {
  const [ loading, setLoading ] = useState(false);

  const handleRegister = async (data: Record<string, string>) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Register success", data.email);
    }, 1000);
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
