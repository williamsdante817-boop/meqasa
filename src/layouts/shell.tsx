import React from "react";
import { cn } from "@/lib/utils";

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function Shell({ children, className }: Readonly<ShellProps>) {
  return (
    <section className={cn("mx-auto w-full max-w-[1120px] px-4", className)}>
      {children}
    </section>
  );
}
