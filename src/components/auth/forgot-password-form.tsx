"use client";

import * as React from "react";
import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Handle password reset request here
      console.log("Password reset requested for:", email);
    }, 2000);
  }

  if (isSuccess) {
    return (
      <div className={cn("text-center", className)} {...props}>
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-10 sm:h-12 w-10 sm:w-12 text-green-500" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-brand-accent mb-2">
          Check your email
        </h3>
        <p className="text-sm text-brand-muted mb-4 px-2">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <p className="text-xs text-brand-muted px-2">
          Didn't receive the email? Check your spam folder or{" "}
          <button 
            onClick={() => {
              setIsSuccess(false);
              setEmail("");
            }}
            className="text-brand-primary hover:text-brand-primary-dark transition-colors underline"
          >
            try a different email address
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-brand-accent">
              Email address
            </Label>
            <div className="mt-1 relative">
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={cn(
                  "pl-10 h-11 sm:h-12 text-base border-brand-border focus:border-brand-primary focus:ring-brand-primary",
                  error && "border-destructive focus:border-destructive focus:ring-destructive"
                )}
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full h-11 sm:h-12 text-base bg-brand-primary hover:bg-brand-primary-dark text-white font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}