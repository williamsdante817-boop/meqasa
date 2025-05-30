"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function FullscreenModal({
  isOpen,
  onClose,
  children,
  className,
}: FullscreenModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div
        className={cn("fixed inset-0 bg-white z-50 overflow-y-auto", className)}
      >
        <div className="relative min-h-full">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 rounded-full p-2 hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
