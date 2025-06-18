import type { ReactNode } from "react";
import { AppSidebar } from "../features/AppSidebar";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen bg-zinc-950 flex">
      <AppSidebar />
      {children}
    </div>
  );
};
