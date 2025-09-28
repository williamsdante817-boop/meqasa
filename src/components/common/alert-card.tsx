import { File } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface AlertCardProps extends React.ComponentPropsWithoutRef<typeof Alert> {
  title?: string;
  description?: string;
  icon?: keyof typeof Icons;
  defaultTitle?: string;
  defaultDescription?: string;
  linkText?: string;
  linkHref?: string;
  role?: string;
  ariaLabel?: string;
}

export function AlertCard({
  title,
  description,
  icon,
  children,
  className,
  defaultTitle = "No similar listings found!",
  defaultDescription = "Try searching another property",
  linkText = "Browse available properties",
  linkHref = siteConfig.links.x,
  role = "alert",
  ariaLabel,
  ...props
}: AlertCardProps) {
  const Icon = icon ? Icons[icon] : File;

  return (
    <Alert
      role={role}
      aria-label={ariaLabel ?? title ?? defaultTitle}
      className={cn(
        "flex flex-col items-center justify-center space-y-4 p-4 sm:p-8 md:p-16",
        className
      )}
      {...props}
    >
      <div
        className="flex aspect-square size-fit items-center justify-center rounded-full border border-dashed border-rose-200 p-4"
        role="img"
        aria-label="Alert icon"
      >
        <Icon className="text-brand-primary size-5" aria-hidden="true" />
      </div>
      {children ?? (
        <div className="flex flex-col items-center space-y-2 text-center">
          <AlertTitle className="text-brand-accent text-lg">
            {title ?? defaultTitle}
          </AlertTitle>
          {description ? (
            <AlertDescription className="text-brand-muted">
              {description}
            </AlertDescription>
          ) : (
            <div className="text-brand-muted flex flex-col items-center gap-2 text-sm sm:flex-row">
              <AlertDescription>{defaultDescription}</AlertDescription>
              <Link
                href={linkHref}
                className="hover:text-brand-blue focus:ring-brand-blue rounded-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                aria-label={`${linkText} - Opens in new tab`}
              >
                {linkText}
              </Link>
            </div>
          )}
        </div>
      )}
    </Alert>
  );
}
