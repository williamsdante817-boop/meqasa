"use client";

import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "",
    agreeToTerms: false,
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[\+]?[(]?[\+]?\d{3}\)?[-\s\.]?\d{3}[-\s\.]?\d{4,6}$/.test(
        formData.phone.replace(/\s/g, "")
      )
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.userType) {
      newErrors.userType = "Please select your account type";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
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
      // Handle successful sign up here
      console.log("Sign up submitted:", formData);
    }, 2000);
  }

  const handleSocialSignUp = (provider: string) => {
    setIsLoading(true);
    // Handle social sign up
    setTimeout(() => {
      setIsLoading(false);
      console.log(`${provider} sign up initiated`);
    }, 1000);
  };

  return (
    <div className={cn("grid gap-4 lg:gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-3 lg:gap-4">
          {/* Name fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label
                htmlFor="firstName"
                className="text-brand-accent text-sm font-medium"
              >
                First name
              </Label>
              <div className="relative">
                <User className="text-brand-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  disabled={isLoading}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={cn(
                    "border-brand-border focus:border-brand-primary focus:ring-brand-primary h-11 pl-10 text-base sm:h-12",
                    errors.firstName &&
                      "border-destructive focus:border-destructive focus:ring-destructive"
                  )}
                />
              </div>
              {errors.firstName && (
                <p className="text-destructive text-sm">{errors.firstName}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="lastName"
                className="text-brand-accent text-sm font-medium"
              >
                Last name
              </Label>
              <div className="relative">
                <User className="text-brand-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  disabled={isLoading}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={cn(
                    "border-brand-border focus:border-brand-primary focus:ring-brand-primary h-11 pl-10 text-base sm:h-12",
                    errors.lastName &&
                      "border-destructive focus:border-destructive focus:ring-destructive"
                  )}
                />
              </div>
              {errors.lastName && (
                <p className="text-destructive text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <Label
              htmlFor="email"
              className="text-brand-accent text-sm font-medium"
            >
              Email address
            </Label>
            <div className="relative">
              <Mail className="text-brand-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
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
                  "border-brand-border focus:border-brand-primary focus:ring-brand-primary h-11 pl-10 text-base sm:h-12",
                  errors.email &&
                    "border-destructive focus:border-destructive focus:ring-destructive"
                )}
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="grid gap-2">
            <Label
              htmlFor="phone"
              className="text-brand-accent text-sm font-medium"
            >
              Phone number
            </Label>
            <div className="relative">
              <Phone className="text-brand-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                type="tel"
                autoComplete="tel"
                disabled={isLoading}
                value={formData.phone}
                onChange={handleInputChange}
                className={cn(
                  "border-brand-border focus:border-brand-primary focus:ring-brand-primary h-11 pl-10 text-base sm:h-12",
                  errors.phone &&
                    "border-destructive focus:border-destructive focus:ring-destructive"
                )}
              />
            </div>
            {errors.phone && (
              <p className="text-destructive text-sm">{errors.phone}</p>
            )}
          </div>

          {/* User Type */}
          <div className="grid gap-2">
            <Label
              htmlFor="userType"
              className="text-brand-accent text-sm font-medium"
            >
              I am a
            </Label>
            <Select
              value={formData.userType}
              onValueChange={(value) => handleSelectChange("userType", value)}
              disabled={isLoading}
            >
              <SelectTrigger
                className={cn(
                  "border-brand-border focus:border-brand-primary focus:ring-brand-primary h-11 text-base sm:h-12",
                  errors.userType &&
                    "border-destructive focus:border-destructive focus:ring-destructive"
                )}
              >
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Property Buyer</SelectItem>
                <SelectItem value="seller">Property Seller</SelectItem>
                <SelectItem value="renter">Property Renter</SelectItem>
                <SelectItem value="landlord">Landlord</SelectItem>
                <SelectItem value="agent">Real Estate Agent</SelectItem>
                <SelectItem value="developer">Property Developer</SelectItem>
              </SelectContent>
            </Select>
            {errors.userType && (
              <p className="text-destructive text-sm">{errors.userType}</p>
            )}
          </div>

          {/* Password fields */}
          <div className="grid gap-2">
            <Label
              htmlFor="password"
              className="text-brand-accent text-sm font-medium"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="text-brand-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="password"
                name="password"
                placeholder="Create a strong password"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="new-password"
                disabled={isLoading}
                value={formData.password}
                onChange={handleInputChange}
                className={cn(
                  "border-brand-border focus:border-brand-primary focus:ring-brand-primary h-11 pr-10 pl-10 text-base sm:h-12",
                  errors.password &&
                    "border-destructive focus:border-destructive focus:ring-destructive"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-brand-muted hover:text-brand-accent absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="confirmPassword"
              className="text-brand-accent text-sm font-medium"
            >
              Confirm password
            </Label>
            <div className="relative">
              <Lock className="text-brand-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                type={showConfirmPassword ? "text" : "password"}
                autoCapitalize="none"
                autoComplete="new-password"
                disabled={isLoading}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={cn(
                  "border-brand-border focus:border-brand-primary focus:ring-brand-primary h-11 pr-10 pl-10 text-base sm:h-12",
                  errors.confirmPassword &&
                    "border-destructive focus:border-destructive focus:ring-destructive"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-brand-muted hover:text-brand-accent absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms agreement */}
          <div className="flex items-start space-x-2">
            <input
              id="agree-terms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="border-brand-border text-brand-primary focus:ring-brand-primary mt-1 h-4 w-4 rounded"
            />
            <Label
              htmlFor="agree-terms"
              className="text-brand-muted cursor-pointer text-sm leading-5"
            >
              I agree to the Terms of Service and Privacy Policy, and I consent
              to receive marketing communications from MeQasa.
            </Label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-destructive text-sm">{errors.agreeToTerms}</p>
          )}

          <Button
            disabled={isLoading}
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary-dark h-11 text-base font-medium text-white sm:h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="text-brand-muted bg-white px-2">
            Or sign up with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialSignUp("Google")}
          className="border-brand-border hover:bg-brand-gray h-11 text-sm sm:h-12 sm:text-base"
        >
          {isLoading ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin sm:mr-2" />
          ) : (
            <Icons.google className="mr-1 h-4 w-4 sm:mr-2" />
          )}
          <span className="hidden sm:inline">Google</span>
          <span className="sm:hidden">Google</span>
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleSocialSignUp("Facebook")}
          className="border-brand-border hover:bg-brand-gray h-11 text-sm sm:h-12 sm:text-base"
        >
          {isLoading ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin sm:mr-2" />
          ) : (
            <Icons.facebook className="mr-1 h-4 w-4 sm:mr-2" />
          )}
          <span className="hidden sm:inline">Facebook</span>
          <span className="sm:hidden">Facebook</span>
        </Button>
      </div>
    </div>
  );
}
