import { createBrowserRouter, Navigate, Outlet, useNavigation } from "react-router";
import WorkInProgress from "@/pages/WorkInProgress";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyEmailNotice from "@/pages/auth/VerifyEmailNotice";
import ProtectedRoute from "@/components/features/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { startNavigationProgress, stopNavigationProgress } from "@/lib/nprogress";
import { useEffect } from "react";
import { AppLayout } from "@/components/layouts/AppLayout";

const NavigationProgress = () => {
  const navigation = useNavigation();
  
  useEffect(() => {
    if (navigation.state === "loading") {
      startNavigationProgress();
    } else {
      stopNavigationProgress();
    }
  }, [navigation.state]);

  return null;
};

export const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <NavigationProgress />
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: "/login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        ),
      },
      {
        path: "/email-verification-notice",
        element: (
          <ProtectedRoute requireAuth={true} requireVerified={false} preventIfVerified={true}>
            <VerifyEmailNotice />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoute requireAuth={true} requireVerified={true}>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <WorkInProgress />
          },
          {
            path: ":userTag",
            element: <WorkInProgress />
          },
        ]
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
