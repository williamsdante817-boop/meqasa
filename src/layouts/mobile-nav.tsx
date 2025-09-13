"use client";

import * as React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type { MainNavItem } from "@/types";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import {
  Home,
  Search,
  Heart,
  Phone,
  Users,
  Building2,
  MapPin,
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
      href: "/projects",
      icon: MapPin,
      description: "Explore all projects",
    },
    {
      title: "Contact",
      href: "/contact",
      icon: Phone,
      description: "Get in touch with us",
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
        { title: "Commercial Spaces", href: "/search/sale?q=ghana&ftype=commercial space" },
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
          className="text-brand-accent shadow-none hover:text-brand-primary hover:bg-brand-primary/10 focus-visible:bg-brand-primary/10 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0 lg:hidden"
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
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-brand-primary to-brand-primary-dark">
          <h2 className="sr-only">Mobile Navigation Menu</h2>
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
            aria-label="Home"
          >
            <Icons.logo className="mr-2 size-6 text-white" aria-hidden="true" />
            <span className="font-bold text-white text-lg">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-88px)]">
          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
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
                      className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors group"
                    >
                      <IconComponent className="h-6 w-6 text-brand-primary stroke-[1.5] mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-center text-gray-700">
                        {action.title.split(" ")[0]}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Primary Categories */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Browse Properties
              </h3>
              <Accordion type="single" className="w-full space-y-3" collapsible>
                {primaryCategories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <AccordionItem
                      value={category.title}
                      key={index}
                      className="border rounded-lg bg-white shadow-none"
                    >
                      <AccordionTrigger
                        className="px-4 py-3 text-left hover:no-underline
                         hover:bg-gray-50"
                        aria-label={`${category.title} menu`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-brand-primary stroke-[1.5]" />
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
                              className="p-3 rounded-md hover:bg-gray-50 transition-colors"
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
            <div className="space-y-3 pt-3 border-t">
              <div className="space-y-2">
                {quickActions.slice(4).map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Link
                      key={action.title}
                      href={action.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <IconComponent className="h-5 w-5 text-brand-primary stroke-[1.5]" />
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
        "text-foreground/70 transition-colors hover:text-foreground",
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
