import { AuthProvider } from "@/contexts/AuthContext";
import { Outlet } from "react-router";

export const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
