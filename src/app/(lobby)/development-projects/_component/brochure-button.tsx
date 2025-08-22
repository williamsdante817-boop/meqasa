"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface BrochureButtonProps {
  trigger?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  href?: string;
  onClick?: () => void;
}

export default function BrochureButton({
  trigger,
  className,
  showIcon = false,
  href,
  onClick,
}: BrochureButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.open(href, '_blank');
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={handleClick}>
          {trigger}
        </div>
      ) : (
        <Button 
          className={className} 
          variant="default"
          onClick={handleClick}
        >
          {showIcon && <FileText className="w-4 h-4 mr-2" />}
          Get Brochure
        </Button>
      )}
    </>
  );
}
