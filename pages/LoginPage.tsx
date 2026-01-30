import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Card } from "../components/UI";
import { UserRole } from "../types";
import AuthService, { LoginPayload } from "../services/AuthService";

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

interface LoginFormData extends LoginPayload {
  remember: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    try {
      const response = await AuthService.login({
        username: data.username,
        password: data.password,
      });
      const userData = response.data.data;

      // Store user data
      AuthService.setUser(userData);

      // Determine user role from response
      const userRole: UserRole = (userData.user?.role as UserRole) || "admin";

      onLogin(userRole);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Authentication failed. Please check your credentials.";

      if (error.response?.status === 401) {
        setServerError("Invalid username or password");
      } else if (error.response?.status === 422) {
        // Validation errors from server
        const serverErrors = error.response?.data?.errors || {};
        if (serverErrors.username) {
          setError("username", { message: serverErrors.username[0] });
        }
        if (serverErrors.password) {
          setError("password", { message: serverErrors.password[0] });
        }
        if (!serverErrors.username && !serverErrors.password) {
          setServerError(errorMessage);
        }
      } else if (error.response?.status === 429) {
        setServerError("Too many attempts. Please try again later.");
      } else {
        setServerError(errorMessage);
      }
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[180px] animate-pulse" />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[180px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ec1938 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md relative z-10 space-y-10 animate-fade-in">
        <div className="text-center">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8">
            <img
              src="/Hackgrid.svg"
              alt="Logo"
              className="tw-w-full tw-h-full tw-object-contain"
            />
          </div>
          <h1 className="text-6xl font-bold font-display tracking-tighter text-white">
            Hack<span className="text-primary">Grid</span>
          </h1>
          <p className="text-neutral-500 mt-4 font-bold uppercase tracking-[0.3em] text-[10px] opacity-70">
            For your protection, please verify your identity
          </p>
        </div>

        <Card className="p-10 border-neutral-800/50 bg-background-darker/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 rounded-3xl">
          {/* General Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-red-400">{serverError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Email/Username"
                placeholder="Email/Username"
                type="text"
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
                className={`font-mono text-sm ${
                  errors.username ? "border-red-500" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.username && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Password"
                placeholder="••••••••••••"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters",
                  },
                })}
                className={errors.password ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-5 text-xs font-bold tracking-[0.2em] uppercase transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  AUTHORIZING...
                </div>
              ) : (
                "LOGIN"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
