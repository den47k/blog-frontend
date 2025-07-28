import { useEchoNotifications } from "@/hooks/useEchoNotifications";
import { AppSidebar } from "../features/sidebar/AppSidebar";
import { Outlet } from "react-router";

export const AppLayout = () => {
  useEchoNotifications();

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 flex">
      <AppSidebar />
      <main className="flex-1 flex overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
