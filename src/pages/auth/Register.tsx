import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import {
  AtSign,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { z } from "zod";
import { AuthLayout } from "@/components/layouts/AuthLayout";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(32, "Username must be less than 20 characters"),
    tag: z
      .string()
      .min(5, "Tag must be at least 5 characters")
      .max(32, "Tag must be less than 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    try {
      await authRegister({
        name: data.username,
        tag: data.tag,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      });
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (errors.email) {
          setError("email", { message: errors.email[0] });
        }
        if (errors.username) {
          setError("username", { message: errors.username[0] });
        }
        if (errors.password) {
          setError("password", { message: errors.password[0] });
        }
      } else {
        setServerError(err.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <AuthLayout description="Create your account">
      <Card className="bg-zinc-900 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Sign Up</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your details to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-300">
                Username
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <UserIcon size={18} />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  className={`pl-10 bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500 ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Tag Field */}
            <div className="space-y-2">
              <Label htmlFor="tag" className="text-zinc-300">
                Tag
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <AtSign size={18} />
                </div>
                <Input
                  id="tag"
                  type="text"
                  placeholder="johndoe1234"
                  className={`pl-10 bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500 ${
                    errors.tag ? "border-red-500" : ""
                  }`}
                  {...register("tag")}
                />
              </div>
              {errors.tag && (
                <p className="text-red-500 text-sm">{errors.tag.message}</p>
              )}
            </div>

            {/* Email Field */}
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
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
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
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Password Confirmation Field */}
            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation" className="text-zinc-300">
                Confirm Password
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <LockIcon size={18} />
                </div>
                <Input
                  id="passwordConfirmation"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-rose-500 focus:ring-rose-500 ${
                    errors.passwordConfirmation ? "border-red-500" : ""
                  }`}
                  {...register("passwordConfirmation")}
                />
              </div>
              {errors.passwordConfirmation && (
                <p className="text-red-500 text-sm">
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-zinc-800 pt-4 -mt-4">
          <div className="text-sm text-zinc-400 text-center">
            Already have an account?{" "}
            <button
              onClick={() =>
                navigate("/login", {
                  state: { from: location.state?.from },
                })
              }
              className="text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default Register;
