import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import ProtectedRoute from "@/components/features/ProtectedRoute";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    try {
      await login(data);
    } catch (err: any) {
      setServerError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <Card className="bg-zinc-900 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Sign In</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <MailIcon size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`pl-10 bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <a
                  href="/forgot-password"
                  className="text-sm text-rose-400 hover:text-rose-300"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <LockIcon size={18} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="remember"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-zinc-600 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600"
                  />
                )}
              />
              <label
                htmlFor="remember"
                className="text-sm text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>

            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-rose-600 hover:bg-rose-700 text-white ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-zinc-800 pt-4 -mt-4">
          <div className="text-sm text-zinc-400 text-center">
            Don't have an account?{" "}
            <button
              onClick={() =>
                navigate("/register", {
                  state: { from: location.state?.from },
                })
              }
              className="text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
            >
              Create account
            </button>
          </div>
        </CardFooter>
      </Card>
    </ProtectedRoute>
  );
};

export default Login;
