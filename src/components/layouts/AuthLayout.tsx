import { Outlet } from "react-router";

interface AuthLayoutProps {
  title?: string;
  description?: string;
}

export const AuthLayout = ({
  title = "DarkChat",
  description,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-zinc-400">{description}</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
