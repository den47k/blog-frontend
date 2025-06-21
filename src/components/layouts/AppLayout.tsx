import { AppSidebar } from "../features/sidebar/AppSidebar";
import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <div className="h-screen bg-zinc-950 flex">
      <AppSidebar />
      <main className="flex-1 flex">
        <Outlet />
      </main>
    </div>
  );
};
