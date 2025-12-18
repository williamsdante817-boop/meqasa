import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Building2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <Empty className="max-w-2xl mx-auto">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>Developer Not Found</EmptyTitle>
          <EmptyDescription>
            The developer profile you&apos;re looking for doesn&apos;t exist or may
            have been removed. This could be due to the developer no longer being
            active on our platform.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center">
          <Button asChild size="lg">
            <Link href="/developers">Browse Developers</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
