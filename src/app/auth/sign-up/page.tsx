import { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sign Up | MeQasa",
  description: "Create a free MeQasa account to save properties, list your properties, and connect with buyers and sellers.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden bg-gradient-to-r from-brand-primary to-brand-primary-dark p-6 text-white text-center">
        <Link href="/" className="inline-block mb-4">
          <Icons.logo className="size-8 text-white" />
        </Link>
        <h1 className="text-xl font-bold mb-2">Join {siteConfig.name} today</h1>
        <p className="text-sm text-white/90">
          Create your free account
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
          <h1 className="text-3xl font-bold mb-4">Join {siteConfig.name} today</h1>
          <p className="text-lg text-white/90 mb-6">
            Create your free account to save properties, list your own properties, and connect with Ghana's top real estate professionals.
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
      <div className="flex-1 lg:w-1/2 flex flex-col justify-center p-4 sm:p-6 lg:p-8 bg-white min-h-0">
        <div className="max-w-md mx-auto w-full overflow-y-auto">
          <div className="mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-brand-accent mb-2">Create your account</h2>
            <p className="text-sm lg:text-base text-brand-muted">
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

          <div className="mt-4 lg:mt-6 text-center text-xs lg:text-sm text-brand-muted pb-4">
            <p>
              By creating an account, you agree to our{" "}
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