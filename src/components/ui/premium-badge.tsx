"use client";

import { Crown, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeType = "premium-plus" | "premium" | "top-ad";

interface PremiumBadgeProps {
  type: BadgeType;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const badgeConfig = {
  "premium-plus": {
    label: "Premium Plus",
    icon: Crown,
    baseClasses:
      "bg-brand-badge-ongoing text-white shadow-sm border border-amber-300/30",
    hoverClasses:
      "hover:shadow-md",
    borderClasses: "",
    textClasses: "font-semibold text-xs uppercase tracking-wide",
  },
  premium: {
    label: "Premium",
    icon: Star,
    baseClasses:
      "bg-brand-primary text-white shadow-sm border border-rose-300/30",
    hoverClasses:
      "hover:shadow-md",
    borderClasses: "",
    textClasses: "font-semibold text-xs uppercase tracking-wide",
  },
  "top-ad": {
    label: "Top Ad",
    icon: Zap,
    baseClasses:
      "bg-orange-50 text-orange-500 shadow-sm border border-orange-300",
    hoverClasses:
      "hover:shadow-md", 
    borderClasses: "",
    textClasses: "font-semibold text-xs uppercase tracking-wide",
  },
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs rounded-sm",
  md: "px-3 py-1.5 text-sm rounded-md",
  lg: "px-4 py-2 text-base rounded-lg",
};

const iconSizes = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function PremiumBadge({
  type,
  className,
  size = "md",
}: PremiumBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 transition-all duration-200 ease-out",
        config.baseClasses,
        config.hoverClasses,
        config.textClasses,
        sizeClasses[size],
        className,
      )}
    >
      <Icon
        className={cn(
          iconSizes[size],
          "flex-shrink-0",
        )}
      />
      <span className="leading-none">
        {config.label}
      </span>
    </div>
  );
}

// Individual badge components for convenience
export function PremiumPlusBadge(
  props: Omit<PremiumBadgeProps, "type">,
) {
  return <PremiumBadge {...props} type="premium-plus" />;
}

export function PremiumBadgeComponent(
  props: Omit<PremiumBadgeProps, "type">,
) {
  return <PremiumBadge {...props} type="premium" />;
}

export function TopAdBadge(
  props: Omit<PremiumBadgeProps, "type">,
) {
  return <PremiumBadge {...props} type="top-ad" />;
}