import { type Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sign Up | MeQasa",
  description:
    "Create a free MeQasa account to save properties, list your properties, and connect with buyers and sellers.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile Header - Only visible on mobile */}
      <div className="from-brand-primary to-brand-primary-dark bg-gradient-to-r p-6 text-center text-white lg:hidden">
        <Link href="/" className="mb-4 inline-block">
          <Icons.logo className="size-8 text-white" />
        </Link>
        <h1 className="mb-2 text-xl font-bold">Join {siteConfig.name} today</h1>
        <p className="text-sm text-white/90">Create your free account</p>
      </div>

      {/* Left side - Brand/Hero Section - Hidden on mobile */}
      <div className="from-brand-primary to-brand-primary-dark relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br p-8 text-white lg:flex lg:w-1/2">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-md text-center">
          <Link href="/" className="mb-8 inline-block">
            <Icons.logo className="size-12 text-white" />
          </Link>
          <h1 className="mb-4 text-3xl font-bold">
            Join {siteConfig.name} today
          </h1>
          <p className="mb-6 text-lg text-white/90">
            Create your free account to save properties, list your own
            properties, and connect with Ghana&apos;s top real estate
            professionals.
          </p>
          <div className="grid grid-cols-1 gap-3 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Icons.logo className="size-4" />
              <span>Save your favorite properties</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.logo className="size-4" />
              <span>List properties for free</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.logo className="size-4" />
              <span>Connect with verified agents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="flex min-h-0 flex-1 flex-col justify-center bg-white p-4 sm:p-6 lg:w-1/2 lg:p-8">
        <div className="mx-auto w-full max-w-md overflow-y-auto">
          <div className="mb-4 lg:mb-6">
            <h2 className="text-brand-accent mb-2 text-xl font-bold lg:text-2xl">
              Create your account
            </h2>
            <p className="text-brand-muted text-sm lg:text-base">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-brand-primary hover:text-brand-primary-dark font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <SignUpForm />

          <div className="text-brand-muted mt-4 pb-4 text-center text-xs lg:mt-6 lg:text-sm">
            <p>
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-brand-primary hover:text-brand-primary-dark transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-brand-primary hover:text-brand-primary-dark transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
