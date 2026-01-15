"use client";

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
      <NavigationMenu className="max-w-full justify-start">
        <NavigationMenuList className="text-brand-accent flex-wrap">
          {memoizedItems?.map((item) => (
            <NavigationMenuItem key={item.title}>
              {item.items.length > 0 ? (
                <>
                  <NavigationMenuTrigger
                    className="hover:text-brand-accent data-[state=open]:text-brand-accent text-base font-semibold"
                    aria-expanded="false"
                  >
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="col-span-2">
                        <div className="text-brand-accent mt-2 mb-2 text-sm font-semibold">
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
                      item.href ||
                      (item.title === "Land"
                        ? "/search/sale?q=ghana&ftype=land"
                        : `/${item.title.toLowerCase()}`)
                    }
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "hover:text-brand-accent data-[state=open]:text-brand-accent text-base font-semibold"
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
            "hover:bg-accent text-brand-accent focus:bg-accent focus:text-accent-foreground block cursor-pointer space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium text-inherit">
            {title}
          </div>
          {description && (
            <p className="text-brand-muted mt-1 line-clamp-2 text-sm">
              {description}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
