import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

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
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4">Verify Your Email Address</h1>
      
      <div className="mb-6">
        <p className="mb-4">
          A verification link has been sent to your email address:
        </p>
        <p className="font-semibold text-lg">{user?.email}</p>
      </div>
      
      <p className="mb-6">
        Please check your email and click on the verification link to activate your account.
      </p>
      
      {message && (
        <div className={`mb-4 ${message.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
          {message}
        </div>
      )}
      
      <button
        onClick={handleResend}
        disabled={isSending}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSending ? "Sending..." : "Resend Verification Email"}
      </button>
      
      <div className="mt-6">
        <button
          onClick={async() => await logout()}
          className="text-blue-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;