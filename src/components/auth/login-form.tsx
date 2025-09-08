"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle successful login here
      console.log("Login submitted:", formData);
    }, 2000);
  }

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    // Handle social login
    setTimeout(() => {
      setIsLoading(false);
      console.log(`${provider} login initiated`);
    }, 1000);
  };

  return (
    <div className={cn("grid gap-4 lg:gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-3 lg:gap-4">
          <div className="grid gap-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-brand-accent"
            >
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
              <Input
                id="email"
                name="email"
                placeholder="Enter your email address"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={formData.email}
                onChange={handleInputChange}
                className={cn(
                  "pl-10 h-11 sm:h-12 text-base border-brand-border focus:border-brand-primary focus:ring-brand-primary",
                  errors.email &&
                    "border-destructive focus:border-destructive focus:ring-destructive"
                )}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-brand-accent"
              >
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-brand-primary hover:text-brand-primary-dark transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
              <Input
                id="password"
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="current-password"
                disabled={isLoading}
                value={formData.password}
                onChange={handleInputChange}
                className={cn(
                  "pl-10 pr-10 h-11 sm:h-12 text-base border-brand-border focus:border-brand-primary focus:ring-brand-primary",
                  errors.password &&
                    "border-destructive focus:border-destructive focus:ring-destructive"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-accent transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
            />
            <Label
              htmlFor="remember-me"
              className="text-sm text-brand-muted cursor-pointer"
            >
              Keep me signed in
            </Label>
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="h-11 sm:h-12 text-base bg-brand-primary hover:bg-brand-primary-dark text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-brand-muted">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialLogin("Google")}
          className="h-11 sm:h-12 text-sm sm:text-base border-brand-border hover:bg-brand-gray"
        >
          {isLoading ? (
            <Loader2 className="mr-1 sm:mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-1 sm:mr-2 h-4 w-4" />
          )}
          <span className="hidden sm:inline">Google</span>
          <span className="sm:hidden">Google</span>
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialLogin("Facebook")}
          className="h-11 sm:h-12 text-sm sm:text-base border-brand-border hover:bg-brand-gray"
        >
          {isLoading ? (
            <Loader2 className="mr-1 sm:mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.facebook className="mr-1 sm:mr-2 h-4 w-4" />
          )}
          <span className="hidden sm:inline">Facebook</span>
          <span className="sm:hidden">Facebook</span>
        </Button>
      </div>
    </div>
  );
}
