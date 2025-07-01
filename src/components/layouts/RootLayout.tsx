import { AuthProvider } from "@/contexts/AuthContext";
import { startLoading, stopLoading } from "@/lib/nprogress";
import { useEffect } from "react";
import { Outlet, useNavigation } from "react-router";

export const RootLayout = () => {
  return (
    <AuthProvider>
      <NavigationProgress />
      <Outlet />
    </AuthProvider>
  );
};

const NavigationProgress = () => {
  const navigation = useNavigation();
	const isNavigating = Boolean(navigation.location);

  useEffect(() => {
    if (isNavigating) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isNavigating]);

  return null;
};
