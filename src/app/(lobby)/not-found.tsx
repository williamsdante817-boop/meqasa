import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { PackageX } from "lucide-react";
import Link from "next/link";
import Shell from "@/layouts/shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Empty className="max-w-2xl mx-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageX />
            </EmptyMedia>
            <EmptyTitle>Product not found</EmptyTitle>
            <EmptyDescription>
              The product may have expired or you may have already updated your product.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">Go to Home</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </Shell>
  );
}
