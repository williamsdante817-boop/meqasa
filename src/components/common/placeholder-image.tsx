import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

interface PlaceholderImageProps
  extends React.ComponentPropsWithoutRef<typeof AspectRatio> {
  isSkeleton?: boolean;
  asChild?: boolean;
  aspectRatio?: number;
}

export function PlaceholderImage({
  isSkeleton = false,
  asChild = false,
  aspectRatio = 4 / 3,
  className,
  ...props
}: PlaceholderImageProps) {
  const Comp = asChild ? Slot : AspectRatio;

  return (
    <Comp
      ratio={aspectRatio}
      {...props}
      className={cn("overflow-hidden rounded-lg", className)}
    >
      <Skeleton
        aria-label="Property image placeholder"
        role="img"
        aria-roledescription="placeholder"
        className={cn(
          "bg-muted flex size-full items-center justify-center",
          isSkeleton ? "animate-pulse" : "animate-none"
        )}
      >
        <Icons.placeholder
          className="text-muted-foreground size-9"
          aria-hidden="true"
        />
      </Skeleton>
    </Comp>
  );
}
