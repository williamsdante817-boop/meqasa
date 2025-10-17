"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="border-t border-[#3b3b4d] bg-[#1c1c2d]">
      <div className="mx-auto flex max-w-6xl justify-center py-6">
        <Button
          type="button"
          variant="ghost"
          className="group gap-2 text-sm font-medium text-white hover:text-white"
          onClick={handleClick}
          aria-label="Scroll to top"
        >
          <ChevronUp className="transition-transform group-hover:-translate-y-1" />
          <span>Back to top</span>
        </Button>
      </div>
    </div>
  );
}
