import { ErrorCard } from "@/components/common/error-card";
import Shell from "@/layouts/shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="max-w-md">
        <ErrorCard
          title="Product not found"
          description="The product may have expired or you may have already updated your product"
          retryLink="/"
          retryLinkText="Go to Home"
        />
      </div>
    </Shell>
  );
}
