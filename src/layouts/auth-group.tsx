"use client";

import Link from "next/link";
import * as React from "react";
// import type { User } from "@clerk/nextjs/server";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  Home,
} from "lucide-react";

// import { getStoreByUserId } from "@/lib/queries/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AuthDropdownProps
  extends React.ComponentPropsWithRef<typeof DropdownMenuTrigger>,
    ButtonProps {
  user: boolean;
}

export function AuthDropdown({
  user = false,
  className,
  ...props
}: AuthDropdownProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button size="default" variant="ghost">
          <Link href="/signin">
            Sign In
            <span className="sr-only">Sign In</span>
          </Link>
        </Button>

        <Button
          size="default"
          className="bg-[#f93a5d] hover:bg-[#f93a5d]/9- cursor-pointer"
        >
          <Link href="/dashboard">
            List Property
            <span className="sr-only">List Property</span>
          </Link>
        </Button>
      </div>
    );
  }

  // const initials = `${user.firstName?.charAt(0) ?? ""} ${
  //   user.lastName?.charAt(0) ?? ""
  // }`;
  // const email = getUserEmail(user);

  // const storePromise = getStoreByUserId({ userId: user.id });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn("size-8 rounded-full", className)}
          {...props}
        >
          <Avatar className="size-10">
            <AvatarImage src={"https://github.com/shadcn.png"} alt={"NK"} />
            <AvatarFallback>{"NK"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {"Clement"} {"Adjei"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {"test@gmail.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <React.Suspense
          fallback={
            <div className="flex flex-col space-y-1.5 p-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-sm" />
              ))}
            </div>
          }
        >
          <AuthDropdownGroup />
        </React.Suspense>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/signout">
            <LogOut className="mr-2 size-4" aria-hidden="true" />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// interface AuthDropdownGroupProps {
//   storePromise: ReturnType<typeof getStoreByUserId>;
// }

function AuthDropdownGroup() {
  return (
    <DropdownMenuGroup>
      <DropdownMenuItem asChild>
        <Link href={"/onboarding"}>
          <LayoutDashboard className="mr-2 size-4" aria-hidden="true" />
          Dashboard
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/dashboard/billing">
          {/* <Icons.home aria-hidden="true" /> */}
          <Home className="mr-2 size-4" aria-hidden="true" />
          List Property
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/dashboard/settings">
          <Settings className="mr-2 size-4" aria-hidden="true" />
          Settings
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}
