import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create an Account</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/login", { state: { from: location.state?.from } })}
          className="text-blue-600 hover:underline"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default Register;