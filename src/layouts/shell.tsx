import React from "react";
import { cn } from "@/lib/utils";

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function Shell({ children, className }: Readonly<ShellProps>) {
  return (
    <section className={cn("w-full mx-auto px-4 max-w-[1120px]", className)}>
      {children}
    </section>
  );
}
