import { cn } from "@/lib/utils";

interface ErrorStateCardProps {
  title: string;
  description?: string;
  variant?: "error" | "info";
  className?: string;
  children?: React.ReactNode;
}

const VARIANT_STYLES: Record<
  NonNullable<ErrorStateCardProps["variant"]>,
  string
> = {
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-gray-200 bg-gray-50 text-gray-600",
};

export function ErrorStateCard({
  title,
  description,
  variant = "error",
  className,
  children,
}: ErrorStateCardProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-lg border p-5",
        VARIANT_STYLES[variant],
        className
      )}
    >
      <p className="font-semibold">{title}</p>
      {description ? (
        <p className="mt-1 text-sm leading-relaxed">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
