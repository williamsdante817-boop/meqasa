"use client";

import Link from "next/link";
import * as React from "react";
import { useMemo } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import type { MainNavItem } from "@/types";

interface MainNavProps {
  items?: MainNavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const memoizedItems = useMemo(() => items, [items]);

  return (
    <div
      className="hidden gap-6 lg:flex"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="hidden items-center space-x-2 lg:flex"
        aria-label="Home"
      >
        <Icons.logo className="size-7 text-[#f93a5d]" aria-hidden="true" />
        <span className="hidden text-lg font-bold lg:inline-block text-brand-accent">
          {siteConfig.name}
        </span>

        <span className="sr-only">Home</span>
      </Link>

      <NavigationMenu className="max-w-full justify-start">
        <NavigationMenuList className="flex-wrap text-brand-accent">
          {memoizedItems?.map((item) => (
            <NavigationMenuItem key={item.title}>
              {item.items.length > 0 ? (
                <>
                  <NavigationMenuTrigger
                    className="font-semibold hover:text-brand-accent data-[state=open]:text-brand-accent"
                    aria-expanded="false"
                  >
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="col-span-2">
                        <div className="mb-2 mt-2 text-sm font-semibold text-brand-accent">
                          {item.description}
                        </div>
                      </li>
                      {item.items.map((subItem) => (
                        <ListItem
                          key={subItem.title}
                          title={subItem.title}
                          href={subItem.href}
                          description={subItem.description}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <nav>
                  <NavigationMenuLink
                    href={
                      item.title === "Land"
                        ? "/search/sale?q=ghana&ftype=land"
                        : `/${item.title.toLowerCase()}`
                    }
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "font-semibold hover:text-brand-accent data-[state=open]:text-brand-accent",
                    )}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </nav>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    description?: string;
  }
>(({ className, title, description, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent text-brand-accent focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm text-inherit font-medium leading-none">
            {title}
          </div>
          {description && (
            <p className="line-clamp-2 mt-1 text-sm text-brand-muted">
              {description}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
