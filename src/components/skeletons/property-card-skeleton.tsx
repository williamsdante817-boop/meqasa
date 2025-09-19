import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const propertyCardSkeletonVariants = cva(
  "size-full rounded-lg bg-transparent !p-0 relative gap-0 border-none shadow-none transition-shadow duration-200",
  {
    variants: {
      variant: {
        default: "",
        featured: "ring-2 ring-brand-primary/20 shadow-sm",
        compact: "max-w-sm",
      },
      hover: {
        subtle: "hover:shadow-sm",
        none: "",
        elevated: "hover:shadow-md hover:scale-[1.02]",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "none",
    },
  }
);

interface PropertyCardSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof propertyCardSkeletonVariants> {
  showFavorite?: boolean;
}

export function PropertyCardSkeleton({
  className,
  variant,
  hover,
  showFavorite = true,
  ...props
}: PropertyCardSkeletonProps) {
  return (
    <Card
      className={cn(
        propertyCardSkeletonVariants({ variant, hover, className })
      )}
      role="status"
      aria-label="Loading property information"
      {...props}
    >
      {/* Header with image - matches CardHeader structure */}
      <CardHeader className="gap-0 rounded-lg border-b border-b-gray-100 !p-0">
        <AspectRatio
          ratio={4 / 3}
          className="relative overflow-hidden rounded-lg"
        >
          {/* Main image skeleton - matches ImageWithFallback with fill */}
          <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-100" />

          {/* Contract type badge skeleton - matches Badge positioning */}
          <div className="absolute top-3 left-3 z-10">
            <Skeleton className="bg-brand-accent h-6 w-16 rounded-sm px-2 py-1 text-white" />
          </div>

          {/* Featured badge skeleton - matches exact positioning for featured properties */}
          {variant === "featured" && (
            <div className="absolute top-3 right-14 z-10">
              <Skeleton className="h-6 w-20 rounded-sm bg-amber-500 px-2 py-1 text-white" />
            </div>
          )}

          {/* Favorite button skeleton - matches AddFavoriteButton positioning */}
          {showFavorite && (
            <div className="absolute top-2 right-2 z-10">
              <Skeleton className="h-10 w-10 rounded-full bg-white/80 shadow-md" />
            </div>
          )}
        </AspectRatio>
      </CardHeader>

      {/* Content - matches CardContent structure exactly */}
      <CardContent className="space-y-1 px-0 pb-0">
        {/* Property title skeleton - matches CardTitle exact styling */}
        <div className="text-brand-primary mb-3 line-clamp-1 pt-2 text-sm leading-relaxed font-bold capitalize">
          <Skeleton
            variant="text"
            className="bg-brand-primary/20 h-4 w-3/4"
            aria-label="Loading property title"
          />
        </div>

        {/* Property details div - matches the wrapper structure */}
        <div>
          {/* Price section skeleton - matches exact pricing layout */}
          <div
            className="mt-[10px] mb-1.5 flex h-fit items-center gap-2"
            aria-label="Property pricing"
          >
            <Skeleton
              variant="text"
              className="bg-brand-accent/20 h-5 w-20"
              aria-label="Loading property price"
            />
            <Skeleton
              variant="light"
              className="h-4 w-12"
              aria-label="Loading price details"
            />
          </div>

          {/* Location skeleton - matches streetaddress exact styling */}
          <Skeleton
            variant="light"
            className="bg-brand-muted/20 mb-1 h-4 w-2/3"
            aria-label="Loading property location"
          />

          {/* Features skeleton - matches exact bed/bath/parking layout with Dot components */}
          <div
            className="text-brand-muted mt-1 flex flex-nowrap items-center overflow-hidden text-base"
            aria-label="Property features"
          >
            {/* Beds skeleton */}
            <Skeleton variant="light" className="h-4 w-12 truncate" />
            {/* Dot separator - matches Dot component h-[12px] w-[12px] */}
            <Skeleton
              variant="light"
              className="bg-brand-accent/20 mx-1 h-3 w-3 flex-shrink-0 rounded-full"
            />
            {/* Baths skeleton */}
            <Skeleton variant="light" className="h-4 w-14 truncate" />
            {/* Dot separator */}
            <Skeleton
              variant="light"
              className="bg-brand-accent/20 mx-1 h-3 w-3 flex-shrink-0 rounded-full"
            />
            {/* Parking skeleton */}
            <Skeleton variant="light" className="h-4 w-16 truncate" />
          </div>
        </div>
      </CardContent>

      <span className="sr-only">Loading property details, please wait...</span>
    </Card>
  );
}

export { propertyCardSkeletonVariants };
