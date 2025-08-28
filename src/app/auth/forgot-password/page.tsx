import { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Reset Password | MeQasa",
  description: "Reset your MeQasa account password securely.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 bg-brand-gray">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Icons.logo className="size-10 sm:size-12 text-brand-primary" />
        </Link>
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-brand-accent">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-brand-muted px-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 shadow-elegant sm:rounded-lg sm:px-10 mx-4 sm:mx-0">
          <ForgotPasswordForm />
          
          <div className="mt-4 sm:mt-6 text-center">
            <Link 
              href="/auth/login" 
              className="text-sm text-brand-primary hover:text-brand-primary-dark transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 text-center text-sm text-brand-muted px-4">
          <p>
            Don't have an account?{" "}
            <Link 
              href="/auth/sign-up" 
              className="text-brand-primary hover:text-brand-primary-dark font-medium transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}