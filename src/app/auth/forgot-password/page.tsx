import { type Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Icons } from "@/components/icons";

export const metadata: Metadata = {
  title: "Reset Password | MeQasa",
  description: "Reset your MeQasa account password securely.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-brand-gray flex min-h-screen flex-col justify-center px-4 py-6 sm:px-6 sm:py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Icons.logo className="text-brand-primary size-10 sm:size-12" />
        </Link>
        <h2 className="text-brand-accent mt-4 text-center text-2xl font-bold sm:mt-6 sm:text-3xl">
          Reset your password
        </h2>
        <p className="text-brand-muted mt-2 px-4 text-center text-sm">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:mt-8 sm:w-full sm:max-w-md">
        <div className="shadow-elegant mx-4 bg-white px-4 py-6 sm:mx-0 sm:rounded-lg sm:px-10 sm:py-8">
          <ForgotPasswordForm />

          <div className="mt-4 text-center sm:mt-6">
            <Link
              href="/auth/login"
              className="text-brand-primary hover:text-brand-primary-dark text-sm transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>

        <div className="text-brand-muted mt-6 px-4 text-center text-sm sm:mt-8">
          <p>
            Don&apos;t have an account?{" "}
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
