"use client";

import type { MainNavItem } from "@/types";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
    Building2,
    Heart,
    Home,
    MapPin,
    Phone,
    Search,
    Users,
} from "lucide-react";

interface MobileNavProps {
  items?: MainNavItem[];
}

export function MobileNav({ items: _ }: MobileNavProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const segment = useSelectedLayoutSegment();
  const [open, setOpen] = React.useState(false);

  if (isDesktop) return null;

  // Simplified mobile nav items - focus on primary actions
  const quickActions = [
    {
      title: "Search Properties",
      href: "/",
      icon: Search,
      description: "Find your dream home",
    },
    {
      title: "Saved Properties",
      href: "/favorites",
      icon: Heart,
      description: "View saved listings",
    },
    {
      title: "Agents",
      href: "/agents",
      icon: Users,
      description: "Browse real estate agents",
    },
    {
      title: "Developers",
      href: "/developers",
      icon: Building2,
      description: "View development projects",
    },
    {
      title: "All Projects",
      href: "/developers/projects",
      icon: Building2,
      description: "Explore all development projects",
    },
    {
      title: "Newly Built Units",
      href: "/newly-built-units",
      icon: MapPin,
      description: "Explore newly built units",
    },
    {
      title: "Contact",
      href: "/contact",
      icon: Phone,
      description: "Get in touch with us",
    },
    {
      title: "Work With Us",
      href: "/work-with-us",
      icon: Users,
      description: "Join our team",
    },
    {
      title: "Feedback",
      href: "/feedback",
      icon: Heart,
      description: "Share your thoughts",
    },
    {
      title: "Advertise with us",
      href: "/advertising-options-with-meqasa",
      icon: Building2,
      description: "Discover advertising opportunities",
    },
  ];

  // Primary navigation categories - simplified for mobile
  const primaryCategories = [
    {
      title: "For Rent",
      icon: Home,
      items: [
        { title: "Houses", href: "/search/rent?q=ghana&ftype=house" },
        { title: "Apartments", href: "/search/rent?q=ghana&ftype=apartment" },
        { title: "Office Spaces", href: "/search/rent?q=ghana&ftype=office" },
        {
          title: "Short Let",
          href: "/search/rent?q=ghana&frentperiod=shortrent",
        },
      ],
    },
    {
      title: "For Sale",
      icon: Building2,
      items: [
        { title: "Houses", href: "/search/sale?q=ghana&ftype=house" },
        { title: "Apartments", href: "/search/sale?q=ghana&ftype=apartment" },
        { title: "Office Spaces", href: "/search/sale?q=ghana&ftype=office" },
        {
          title: "Commercial Spaces",
          href: "/search/sale?q=ghana&ftype=commercial space",
        },
      ],
    },
    {
      title: "Land",
      icon: MapPin,
      items: [
        { title: "Residential Land", href: "/search/sale?q=ghana&ftype=land" },
        {
          title: "Commercial Land",
          href: "/search/sale?q=ghana&ftype=commercial space",
        },
        {
          title: "Industrial Land",
          href: "/search/sale?q=ghana&ftype=industrial",
        },
      ],
    },
  ];

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
        {/* Header */}
        <div className="from-brand-primary to-brand-primary-dark flex items-center justify-between border-b bg-gradient-to-r p-6">
          <h2 className="sr-only">Mobile Navigation Menu</h2>
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
            aria-label="Home"
          >
            <Icons.logo className="mr-2 size-6 text-white" aria-hidden="true" />
            <span className="text-lg font-bold text-white">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-88px)]">
          <div className="space-y-6 p-6">
            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.slice(0, 4).map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Link
                      key={action.title}
                      href={action.href}
                      onClick={() => setOpen(false)}
                      className="group flex flex-col items-center rounded-lg border bg-gray-50 p-4 transition-colors hover:bg-gray-100"
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
                Browse Properties
              </h3>
              <Accordion type="single" className="w-full space-y-3" collapsible>
                {primaryCategories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <AccordionItem
                      value={category.title}
                      key={index}
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
                          {category.items.map((subItem, subIndex) => (
                            <MobileLink
                              key={subIndex}
                              href={subItem.href}
                              segment={String(segment)}
                              setOpen={setOpen}
                              className="rounded-md p-3 transition-colors hover:bg-gray-50"
                            >
                              {subItem.title}
                            </MobileLink>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            {/* Additional Links */}
            <div className="space-y-3 border-t pt-3">
              <div className="space-y-2">
                {quickActions.slice(4).map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Link
                      key={action.title}
                      href={action.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  disabled?: boolean;
  segment: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileLink({
  children,
  href,
  disabled,
  segment,
  setOpen,
  className,
  ...props
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/70 hover:text-foreground transition-colors",
        href.includes(segment) && "text-foreground",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </Link>
  );
}
