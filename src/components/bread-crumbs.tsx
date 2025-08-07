import * as React from "react";
import Link from "next/link";

import { cn, truncate } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";

interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<"nav"> {
  segments: {
    title: string;
    href: string;
    key?: string;
  }[];
  separator?: React.ComponentType<{ className?: string }>;
  truncationLength?: number;
}

export function Breadcrumbs({
  segments,
  separator,
  truncationLength = 15,
  className,
  ...props
}: BreadcrumbsProps) {
  const SeparatorIcon = separator ?? ChevronRightIcon;

  return (
    <nav
      aria-label="breadcrumbs"
      className={cn(
        "flex w-full items-center overflow-auto text-sm font-semibold text-brand-muted",
        className,
      )}
      {...props}
    >
      {segments.map((segment, index) => {
        const isLastSegment = index === segments.length - 1;

        return (
          <React.Fragment key={segment.key ?? `${index}-${segment.href}`}>
            <Link
              aria-current={isLastSegment ? "page" : undefined}
              href={segment.href}
              className={cn(
                "truncate transition-colors hover:text-brand-accent",
                isLastSegment ? "text-brand-accent" : "text-brand-muted",
              )}
            >
              {truncationLength > 0 && segment.title
                ? truncate(segment.title, truncationLength)
                : segment.title}
            </Link>
            {!isLastSegment && (
              <SeparatorIcon className="mx-2 h-4 w-4" aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
