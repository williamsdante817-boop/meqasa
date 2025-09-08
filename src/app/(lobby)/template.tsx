"use client";

export default function Template({ children }: { children: React.ReactNode }) {
  // This runs on every navigation to any route in the (lobby) group
  if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }

  return <>{children}</>;
}
