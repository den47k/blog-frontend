import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailIcon, LogOutIcon } from "lucide-react";
import ProtectedRoute from "@/components/features/ProtectedRoute";

const VerifyEmailNotice = () => {
  const { user, logout, resendVerification } = useAuth();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleResend = async () => {
    setIsSending(true);
    try {
      await resendVerification();
      setMessage("Verification email has been resent successfully!");
    } catch (err) {
      setMessage("Failed to resend verification email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={true} requireVerified={false} preventIfVerified={true}>
      <Card className="bg-zinc-900 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center justify-center space-x-2">
            <MailIcon className="text-rose-400" size={24} />
            <span>Verify Your Email</span>
          </CardTitle>
          <CardDescription className="text-zinc-400 text-center">
            Check your inbox to activate your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-zinc-300">
              A verification link has been sent to:
            </p>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
              <p className="font-semibold text-rose-400 break-all">
                {user?.email}
              </p>
            </div>
            <p className="text-zinc-400 text-sm">
              Please check your email and click on the verification link to
              activate your account.
            </p>
          </div>

          {message && (
            <div
              className={`text-center p-3 rounded-lg border ${
                message.includes("Failed")
                  ? "bg-red-950 border-red-800 text-red-300"
                  : "bg-green-950 border-green-800 text-green-300"
              }`}
            >
              {message}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleResend}
              disabled={isSending}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Resend Verification Email"}
            </Button>

            <Button
              onClick={async () => await logout()}
              variant="ghost"
              className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700"
            >
              <LogOutIcon size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </ProtectedRoute>
  );
};

export default VerifyEmailNotice;
