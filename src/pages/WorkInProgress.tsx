import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layouts/AppLayout";

export default function WorkInProgress() {
  const { logout } = useAuth();
  const [response, setResponse] = useState<any>(null);
  const { loading, post } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await post("/test");
        setResponse(data);
      } catch (err) {
        console.error("Failed to load messages", err);
        setResponse("Failed to load messages");
      }
    };

    fetchData();
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Work in Progress</h1>

        <h2 className="text-3xl font-mono mb-4 mt-12">API Response Test</h2>
        <pre>
          {loading
            ? "Loading..."
            : typeof response === "string"
            ? response
            : JSON.stringify(response)}
        </pre>

        <button onClick={async () => await logout()}>Logout</button>
      </div>
    </AppLayout>
  );
}
