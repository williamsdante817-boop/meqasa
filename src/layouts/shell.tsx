import React from "react";
import { cn } from "@/lib/utils";

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function Shell({ children, className }: Readonly<ShellProps>) {
  return (
    <section
      className={cn(
        "w-full mx-auto px-4 md:max-w-[736px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]",
        className,
      )}
    >
      {children}
    </section>
  );
}
