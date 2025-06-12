import { createBrowserRouter, Navigate, Outlet } from "react-router";
import WorkInProgress from "@/pages/WorkInProgress";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import VerifyEmailNotice from "@/pages/auth/VerifyEmailNotice";
import ProtectedRoute from "@/components/features/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

export const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
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
        path: "/email/verify/:id/:hash",
        element: <VerifyEmail />,
      },
      {
        path: "/",
        element: (
          <ProtectedRoute requireAuth={true} requireVerified={true}>
            <WorkInProgress />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
