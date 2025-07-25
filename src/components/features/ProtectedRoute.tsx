import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Navigate, useLocation } from 'react-router';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerified?: boolean;
  redirectPath?: string;
  preventIfVerified?: boolean;
};

const ProtectedRoute = ({ 
  children, 
  requireAuth = false,
  requireVerified = false,
  preventIfVerified = false,
  redirectPath = "/login"
}: ProtectedRouteProps) => {
  const { loading, isAuthenticated, isVerified } = useAuth();
  const location = useLocation();

  if (loading) return null; // ToDo add loading user's data view

  // Block verified users from accessing this route (e.g. verification notice)
  if (preventIfVerified && isVerified) {
    return <Navigate to="/" replace />;
  }

  // Handle authentication requirements
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Handle verification requirements
  if (requireVerified && isAuthenticated && !isVerified) {
    return <Navigate to="/email-verification-notice" state={{ from: location }} replace />;
  }

  // Handle authenticated users accessing auth routes
  if (!requireAuth && isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || "/";
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;