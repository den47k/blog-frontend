import api from "@/lib/api";
import type { User } from "@/types";
import type { AxiosError } from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import echo from "@/lib/echo";
import { mutate } from "swr";
import { useChatStore } from "@/stores/chat.store";
import { withProgress } from "@/hooks/useNavigationProgress";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  loading: boolean,
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
  updateUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user");
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      if (user) echo.leave(`user.${user.id}`);
    };
  }, []);

  useEffect(() => {
    if (user && !user.isEmailVerified) {
      const channel = echo.private(`user.${user.id}`);

      channel.listen(".EmailVerified", (e: any) => {
        setUser({ ...user, isEmailVerified: !!e.user?.email_verified_at });
      });

      return () => {
        channel.stopListening(".EmailVerified");
      };
    }
  }, [user]);

  const login = withProgress(async (credentials: { email: string; password: string }) => {
    try {
      // Clear store and cache
      useChatStore.getState().reset();
      await mutate(() => true, undefined, { revalidate: false });

      const response = await api.post("/login", credentials);
      setUser(response.data.user);

      mutate(
        key => Array.isArray(key) && key[0] === "/conversations",
        undefined,
        { revalidate: true }
      );

      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || "Login failed");
    }
  });

  const register = withProgress(async (userData: {
    name: string;
    email: string;
    tag: string;
    password: string;
    password_confirmation: string;
  }) => {
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
    }
  });

  const logout = withProgress(async () => {
    try {
      // Clear store and cache
      useChatStore.getState().reset();
      mutate(() => true, undefined, { revalidate: false });
      // mutate(key => true, undefined, { revalidate: false });

      setUser(null);
      await api.post("/logout");

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  });

  const resendVerification = withProgress(async () => {
    try {
      await api.post("/email/resend", { email: user?.email });
    } catch (err) {
      throw new Error("Failed to resend verification email");
    }
  });

  const updateUser = (userData: User | null) => {
    setUser(userData);
  };

  const isAuthenticated = !!user;
  const isVerified = !!user?.isEmailVerified;

  const value = {
    user,
    isAuthenticated,
    isVerified,
    loading,
    login,
    register,
    logout,
    resendVerification,
    updateUser,
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
