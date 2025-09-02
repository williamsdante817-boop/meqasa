import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const skeletonVariants = cva(
  "animate-pulse rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary/10",
        light: "bg-gray-100",
        card: "bg-gray-50",
        text: "bg-gray-200",
        image: "bg-gray-100",
        shimmer: "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer",
      },
      size: {
        sm: "h-3",
        default: "h-4", 
        md: "h-5",
        lg: "h-6",
        xl: "h-8",
        "2xl": "h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface SkeletonProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  "aria-label"?: string;
}

function Skeleton({
  className,
  variant,
  size,
  "aria-label": ariaLabel,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, size, className }))}
      role="status"
      aria-label={ariaLabel ?? "Loading content"}
      aria-live="polite"
      {...props}
    >
      <span className="sr-only">{ariaLabel ?? "Loading content, please wait..."}</span>
    </div>
  )
}

export { Skeleton, type SkeletonProps }
