import { Skeleton } from "@/components/ui/skeleton";

export function AgentLogosSkeleton() {
  return (
    <div
      className="mt-[180px] hidden lg:flex"
      role="status"
      aria-label="Loading partner logos"
    >
      <div className="flex gap-8 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="card"
            className="h-12 w-24 rounded"
            aria-label={`Loading partner logo ${i + 1}`}
          />
        ))}
      </div>
      <span className="sr-only">Loading partner company logos...</span>
    </div>
  );
}
