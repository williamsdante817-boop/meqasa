import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Login | MeQasa",
  description: "Sign in to your MeQasa account to access your saved properties and manage your listings.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden bg-gradient-to-r from-brand-primary to-brand-primary-dark p-6 text-white text-center">
        <Link href="/" className="inline-block mb-4">
          <Icons.logo className="size-8 text-white" />
        </Link>
        <h1 className="text-xl font-bold mb-2">Welcome back to {siteConfig.name}</h1>
        <p className="text-sm text-white/90">
          Sign in to access your saved properties
        </p>
      </div>

      {/* Left side - Brand/Hero Section - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-primary to-brand-primary-dark flex-col justify-center items-center p-8 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center max-w-md">
          <Link href="/" className="inline-block mb-8">
            <Icons.logo className="size-12 text-white" />
          </Link>
          <h1 className="text-3xl font-bold mb-4">Welcome back to {siteConfig.name}</h1>
          <p className="text-lg text-white/90 mb-6">
            Sign in to access your saved properties, manage your listings, and connect with top real estate agents in Ghana.
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
      <div className="flex-1 lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-8 bg-white">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-brand-accent mb-2">Sign in to your account</h2>
            <p className="text-sm lg:text-base text-brand-muted">
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

          <div className="mt-6 lg:mt-8 text-center text-xs lg:text-sm text-brand-muted">
            <p>
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-brand-primary hover:text-brand-primary-dark transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand-primary hover:text-brand-primary-dark transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}