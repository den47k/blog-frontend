import api from "@/lib/api";
import type { User } from "@/types";
import type { AxiosError } from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import echo from "@/lib/echo";
import { mutate } from "swr";
import {
  startNavigationProgress,
  stopNavigationProgress,
} from "@/lib/nprogress";
import { useChatStore } from "@/stores/chat.store";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    tag: string;
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

    return () => {
      if (user) echo.leave(`user.${user.id}`);
    };
  }, []);

  useEffect(() => {
    if (user && !user.email_verified_at) {
      const channel = echo.private(`user.${user.id}`);

      channel.listen(".EmailVerified", (e: any) => {
        setUser({ ...user, email_verified_at: e.user.email_verified_at });
      });

      return () => {
        channel.stopListening(".EmailVerified");
      };
    }
  }, [user]);

  const login = async (credentials: { email: string; password: string }) => {
    startNavigationProgress();
    try {
      // Clear store and cache
      useChatStore.getState().reset();
      await mutate(() => true, undefined, { revalidate: false });

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
      // Clear store and cache
      useChatStore.getState().reset();
      mutate(() => true, undefined, { revalidate: false });

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
    startNavigationProgress();
    try {
      await api.post("/email/resend", { email: user?.email });
    } catch (err) {
      throw new Error("Failed to resend verification email");
    } finally {
      stopNavigationProgress();
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
