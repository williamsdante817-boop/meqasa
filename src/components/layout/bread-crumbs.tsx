import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";

interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<"nav"> {
  segments: {
    title: string;
    href: string;
    key?: string;
  }[];
  separator?: React.ComponentType<{ className?: string }>;
  mobileOnly?: boolean; // Option to enable truncation only on mobile
}

export function Breadcrumbs({
  segments,
  separator,
  mobileOnly = true,
  className,
  ...props
}: BreadcrumbsProps) {
  const SeparatorIcon = separator ?? ChevronRightIcon;

  // Responsive truncation classes:
  // - truncate: truncate on all screen sizes
  // - truncate sm:overflow-visible sm:text-clip sm:whitespace-normal: truncate only on mobile, full text on sm and up
  const getTextClasses = (base: string) => {
    if (mobileOnly) {
      return cn(
        base,
        "truncate sm:overflow-visible sm:text-clip sm:whitespace-normal"
      );
    }
    return cn(base, "truncate");
  };

  return (
    <nav
      aria-label="breadcrumbs"
      className={cn(
        "text-brand-muted flex w-full items-center overflow-auto text-sm font-semibold",
        className
      )}
      {...props}
    >
      {segments.map((segment, index) => {
        const isLastSegment = index === segments.length - 1;

        return (
          <React.Fragment key={segment.key ?? `${index}-${segment.href}`}>
            {isLastSegment ? (
              <span
                aria-current="page"
                className={getTextClasses("text-brand-accent")}
                title={segment.title} // Add title for accessibility on truncated text
              >
                {segment.title}
              </span>
            ) : (
              <Link
                href={segment.href}
                className={getTextClasses(
                  "hover:text-brand-accent text-brand-muted transition-colors"
                )}
                title={segment.title} // Add title for accessibility on truncated text
              >
                {segment.title}
              </Link>
            )}
            {!isLastSegment && (
              <SeparatorIcon className="mx-2 h-4 w-4" aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
