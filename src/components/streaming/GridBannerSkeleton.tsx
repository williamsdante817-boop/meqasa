import { cn } from "@/lib/utils";

// Simple shell wrapper without external dependencies
function SimpleShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "w-full mx-auto px-4 md:max-w-[736px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]",
        className
      )}
    >
      {children}
    </section>
  );
}

// Grid Banner Loading Skeleton
export function GridBannerSkeleton() {
  return (
    <SimpleShell className="hidden md:block">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-60 w-full rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-60 grid-rows-4 w-full rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-60 grid-rows-4 w-full rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-60 grid-rows-4 w-full rounded-lg bg-gray-200 animate-pulse" />
      </div>
    </SimpleShell>
  );
}
