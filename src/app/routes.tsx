import { createBrowserRouter, Navigate } from "react-router";
import WorkInProgress from "@/pages/WorkInProgress";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyEmailNotice from "@/pages/auth/VerifyEmailNotice";
import ProtectedRoute from "@/components/features/ProtectedRoute";
import { AppLayout } from "@/components/layouts/AppLayout";
import { RootLayout } from "@/components/layouts/RootLayout";
import ChatMain from "@/pages/Chat";


export const router = createBrowserRouter([
  {
    Component: RootLayout,
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
          { index: true, element: <WorkInProgress /> },
          {
            path: ":identifier",
            element: <ChatMain />
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
