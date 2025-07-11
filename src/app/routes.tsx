import { createBrowserRouter, Navigate } from "react-router";
import WorkInProgress from "@/pages/WorkInProgress";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyEmailNotice from "@/pages/auth/VerifyEmailNotice";
import { AppLayout } from "@/components/layouts/AppLayout";
import { RootLayout } from "@/components/layouts/RootLayout";
import ChatMain from "@/pages/Chat";
import { AuthLayout } from "@/components/layouts/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "email-verification-notice", element: <VerifyEmailNotice /> },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <WorkInProgress /> },
          { path: ":identifier", element: <ChatMain /> },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
