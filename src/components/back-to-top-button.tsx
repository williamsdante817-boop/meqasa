"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronUp } from "lucide-react";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="focus-visible:ring-primary fixed right-6 bottom-6 z-50 flex size-12 items-center justify-center rounded-full bg-[#f93a5d] p-0 text-white shadow-lg hover:bg-[#f93a5d]/80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label="Scroll to top"
    >
      <ChevronUp className="size-6" />
    </Button>
  );
}
