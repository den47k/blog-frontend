import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const VerifyEmail = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const path = window.location.pathname;
        await api.get(path);
        await refreshUser();
        navigate('/');
      } catch (error) {
        console.error('Verification failed:', error);
      }
    };

    verifyEmail();
  }, [navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
        <p>Please wait while we confirm your email address.</p>
      </div>
    </div>
  );
};

export default VerifyEmail;