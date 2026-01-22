"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Icons } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  mobileNavLabels,
  primaryCategories,
  quickActions,
  quickActionsConfig,
} from "@/config/mobile-nav-config";
import { siteConfig } from "@/config/site";
import { useMobileSearch } from "@/contexts/mobile-search-context";
import { logError } from "@/lib/logger";
import { cn } from "@/lib/utils";

// Error boundary for navigation failures
class NavigationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError("Navigation error boundary caught an error", error, {
      component: "NavigationErrorBoundary",
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-sm text-red-600">
          Navigation error occurred. Please refresh the page.
        </div>
      );
    }

    return this.props.children;
  }
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [navigationError, setNavigationError] = React.useState<string | null>(
    null
  );
  const { openSearch } = useMobileSearch();

  const handleQuickAction = (action: (typeof quickActions)[number]) => {
    try {
      if (action.triggerSearch) {
        openSearch();
        setOpen(false);
      }
    } catch (error) {
      logError("Navigation error in quick action", error, {
        component: "MobileNav",
        action: action.title,
      });
      setNavigationError("Failed to open search. Please try again.");
    }
  };

  const handleNavigation = React.useCallback(
    (href: string, event?: React.MouseEvent) => {
      try {
        setNavigationError(null);
        setOpen(false);
        // Let Next.js Link handle navigation, but catch any errors
        if (event) {
          // Prevent default only if there's an error
          const target = event.currentTarget as HTMLAnchorElement;
          if (!target.href || target.href === "javascript:void(0)") {
            throw new Error(`Invalid navigation href: ${href}`);
          }
        }
      } catch (error) {
        logError("Navigation error", error, {
          component: "MobileNav",
          href,
        });
        setNavigationError("Navigation failed. Please try again.");
        event?.preventDefault();
      }
    },
    []
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="text-brand-accent hover:text-brand-primary hover:bg-brand-primary/10 focus-visible:bg-brand-primary/10 focus-visible:ring-brand-primary shadow-none focus-visible:ring-2 focus-visible:ring-offset-0 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <Icons.menu aria-hidden="true" className="size-7" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] p-0"
        id="mobile-nav"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">
          {mobileNavLabels.sheetDescription}
        </SheetDescription>

        {/* Header */}
        <div className="from-brand-primary to-brand-primary-dark flex items-center justify-between border-b bg-gradient-to-r p-6">
          <Link
            href="/"
            className="flex items-center"
            onClick={(e) => handleNavigation("/", e)}
            aria-label="Home"
            scroll={false}
          >
            <Icons.logo className="mr-2 size-6 text-white" aria-hidden="true" />
            <span className="text-lg font-bold text-white">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <ScrollArea className="h-[calc(100dvh-88px)]">
          <NavigationErrorBoundary>
            <div className="space-y-6 p-6">
              {navigationError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {navigationError}
                  <button
                    onClick={() => setNavigationError(null)}
                    className="ml-2 underline"
                    aria-label="Dismiss error"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                  {mobileNavLabels.quickAccessTitle}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions
                    .slice(0, quickActionsConfig.gridDisplayCount)
                    .map((action) => {
                      const IconComponent = action.icon;

                      if (action.triggerSearch) {
                        return (
                          <button
                            key={action.title}
                            onClick={() => handleQuickAction(action)}
                            aria-label={action.title}
                            className="group flex cursor-pointer flex-col items-center rounded-lg border bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                          >
                            <IconComponent className="text-brand-primary mb-2 h-6 w-6 stroke-[1.5] transition-transform group-hover:scale-110" />
                            <span className="text-center text-xs font-medium text-gray-700">
                              {action.title.split(" ")[0]}
                            </span>
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={action.title}
                          href={action.href}
                          onClick={(e) => handleNavigation(action.href, e)}
                          aria-label={action.title}
                          className="group flex cursor-pointer flex-col items-center rounded-lg border bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                        >
                          <IconComponent className="text-brand-primary mb-2 h-6 w-6 stroke-[1.5] transition-transform group-hover:scale-110" />
                          <span className="text-center text-xs font-medium text-gray-700">
                            {action.title.split(" ")[0]}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              </div>

              {/* Primary Categories */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                  {mobileNavLabels.browsePropertiesTitle}
                </h3>
                <div className="space-y-3">
                  {primaryCategories.map((category, index) => {
                    try {
                      const IconComponent = category.icon;

                      // If category has direct href (no dropdown), render as link
                      if (category.href) {
                        return (
                          <Link
                            key={index}
                            href={category.href}
                            onClick={(e) => handleNavigation(category.href!, e)}
                            className="flex items-center gap-3 rounded-lg border bg-white p-4 transition-colors hover:bg-gray-50"
                          >
                            <IconComponent className="text-brand-primary h-5 w-5 stroke-[1.5]" />
                            <span className="font-medium text-gray-900">
                              {category.title}
                            </span>
                          </Link>
                        );
                      }

                      // Otherwise render as accordion
                      return (
                        <Accordion
                          key={index}
                          type="single"
                          className="w-full"
                          collapsible
                        >
                          <AccordionItem
                            value={category.title}
                            className="rounded-lg border bg-white shadow-none"
                          >
                            <AccordionTrigger
                              className="px-4 py-3 text-left hover:bg-gray-50 hover:no-underline"
                              aria-label={`${category.title} menu`}
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent className="text-brand-primary h-5 w-5 stroke-[1.5]" />
                                <span className="font-medium text-gray-900">
                                  {category.title}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <div className="grid gap-2">
                                {category.items?.map((subItem, subIndex) => (
                                  <MobileLink
                                    key={subIndex}
                                    href={subItem.href}
                                    pathname={pathname}
                                    setOpen={setOpen}
                                    className="cursor-pointer rounded-md p-3 transition-colors hover:bg-gray-50"
                                  >
                                    {subItem.title}
                                  </MobileLink>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      );
                    } catch (error) {
                      logError("Error rendering navigation category", error, {
                        component: "MobileNav",
                        category: category.title,
                        index,
                      });
                      return (
                        <div key={index} className="p-3 text-sm text-red-600">
                          Failed to load {category.title}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Additional Links */}
              <div className="space-y-3 border-t pt-3">
                <div className="space-y-2">
                  {quickActions
                    .slice(quickActionsConfig.gridDisplayCount)
                    .map((action) => {
                      const IconComponent = action.icon;
                      return (
                        <Link
                          key={action.title}
                          href={action.href}
                          onClick={(e) => handleNavigation(action.href, e)}
                          aria-label={action.title}
                          className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                        >
                          <IconComponent className="text-brand-primary h-5 w-5 stroke-[1.5]" />
                          <div>
                            <span className="font-medium text-gray-900">
                              {action.title}
                            </span>
                            <p className="text-xs text-gray-500">
                              {action.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          </NavigationErrorBoundary>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  disabled?: boolean;
  pathname: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileLink({
  children,
  href,
  disabled,
  pathname,
  setOpen,
  className,
  ...props
}: MobileLinkProps) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      try {
        if (disabled) {
          e.preventDefault();
          return;
        }

        if (!href || href === "#" || href === "javascript:void(0)") {
          logError(
            "Invalid navigation href",
            new Error(`Invalid href: ${href}`),
            {
              component: "MobileLink",
              href,
            }
          );
          e.preventDefault();
          return;
        }

        setOpen(false);
      } catch (error) {
        logError("Navigation error in MobileLink", error, {
          component: "MobileLink",
          href,
        });
        e.preventDefault();
      }
    },
    [disabled, href, setOpen]
  );

  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/70 hover:text-foreground cursor-pointer transition-colors",
        isActive && "text-foreground font-semibold",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
