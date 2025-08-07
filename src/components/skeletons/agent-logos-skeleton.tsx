import { Skeleton } from "@/components/ui/skeleton";

export function AgentLogosSkeleton() {
  return (
    <div
      className="mt-[180px] hidden lg:flex"
      role="complementary"
      aria-label="Partner logos loading"
    >
      <div className="flex gap-8 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-12 w-24 bg-gray-200 animate-pulse rounded"
          />
        ))}
      </div>
    </div>
  );
}
