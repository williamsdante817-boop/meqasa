import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="mb-6">
        <Building2 className="h-16 w-16 text-gray-400 mx-auto" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Developer Not Found
      </h1>

      <p className="text-lg text-gray-600 mb-8 max-w-md">
        The developer profile you&apos;re looking for doesn&apos;t exist or may
        have been removed. This could be due to the developer no longer being
        active on our platform.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button
          asChild
          variant="default"
          size="lg"
          className="flex items-center gap-2"
        >
          <Link href="/developers">
            <Search className="h-4 w-4" />
            Browse Developers
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="text-sm text-gray-500">
        <p>Looking for a specific developer? Try searching our directory.</p>
      </div>
    </div>
  );
}
