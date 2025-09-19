"use client";

import * as React from "react";
import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ForgotPasswordFormProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
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
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-10 w-10 text-green-500 sm:h-12 sm:w-12" />
        </div>
        <h3 className="text-brand-accent mb-2 text-base font-medium sm:text-lg">
          Check your email
        </h3>
        <p className="text-brand-muted mb-4 px-2 text-sm">
          We&apos;ve sent a password reset link to <strong>{email}</strong>
        </p>
        <p className="text-brand-muted px-2 text-xs">
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <button
            onClick={() => {
              setIsSuccess(false);
              setEmail("");
            }}
            className="text-brand-primary hover:text-brand-primary-dark underline transition-colors"
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
            <Label
              htmlFor="email"
              className="text-brand-accent text-sm font-medium"
            >
              Email address
            </Label>
            <div className="relative mt-1">
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={cn(
                  "border-brand-border focus:border-brand-primary focus:ring-brand-primary h-11 pl-10 text-base sm:h-12",
                  error &&
                    "border-destructive focus:border-destructive focus:ring-destructive"
                )}
              />
            </div>
            {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary-dark h-11 w-full text-base font-medium text-white sm:h-12"
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
