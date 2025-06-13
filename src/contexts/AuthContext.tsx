import api from "@/lib/api";
import type { User } from "@/types";
import type { AxiosError } from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { startNavigationProgress, stopNavigationProgress } from "@/lib/nprogress";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  resendVerification: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    try {
      const response = await api.get("/user");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  console.log(user);

  const login = async (credentials: { email: string; password: string }) => {
    startNavigationProgress();
    try {
      const response = await api.post("/login", credentials);
      setUser(response.data.user);
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      stopNavigationProgress();
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    startNavigationProgress();
    try {
      const response = await api.post("/register", userData);
      console.log(response);
      setUser(response.data.user);
      navigate("/email-verification-notice", { replace: true });
    } catch (err) {
      const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
      const errorMessages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : ["Registration failed"];
      throw new Error(errorMessages.join(", "));
    } finally {
      stopNavigationProgress();
    }
  };

  const logout = async () => {
    startNavigationProgress();
    try {
      await api.post("/logout");
      setUser(null);
      navigate("/login", { state: { from: location }, replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      stopNavigationProgress();
    }
  };

  const resendVerification = async () => {
    try {
      await api.post("/email/resend", {email: user?.email});
    } catch (err) {
      throw new Error("Failed to resend verification email");
    }
  };

  const isAuthenticated = !!user;
  const isVerified = !!user?.email_verified_at;

  const value = {
    user,
    isAuthenticated,
    isVerified,
    isLoading,
    login,
    register,
    logout,
    resendVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
