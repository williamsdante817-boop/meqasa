import { type Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Login | MeQasa",
  description:
    "Sign in to your MeQasa account to access your saved properties and manage your listings.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile Header - Only visible on mobile */}
      <div className="from-brand-primary to-brand-primary-dark bg-gradient-to-r p-6 text-center text-white lg:hidden">
        <Link href="/" className="mb-4 inline-block">
          <Icons.logo className="size-8 text-white" />
        </Link>
        <h1 className="mb-2 text-xl font-bold">
          Welcome back to {siteConfig.name}
        </h1>
        <p className="text-sm text-white/90">
          Sign in to access your saved properties
        </p>
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
            Welcome back to {siteConfig.name}
          </h1>
          <p className="mb-6 text-lg text-white/90">
            Sign in to access your saved properties, manage your listings, and
            connect with top real estate agents in Ghana.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Icons.logo className="size-4" />
              <span>Trusted by 100k+ users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 flex-col justify-center bg-white p-4 sm:p-6 lg:w-1/2 lg:p-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-brand-accent mb-2 text-xl font-bold lg:text-2xl">
              Sign in to your account
            </h2>
            <p className="text-brand-muted text-sm lg:text-base">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-brand-primary hover:text-brand-primary-dark font-medium transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          <LoginForm />

          <div className="text-brand-muted mt-6 text-center text-xs lg:mt-8 lg:text-sm">
            <p>
              By signing in, you agree to our{" "}
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
