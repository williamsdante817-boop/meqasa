"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ExpandableDescriptionProps {
  description: { __html: string };
  name?: string;
  href?: string;
}

export function ExpandableDescription({
  description,
  name,
  href,
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionText = description.__html;
  const isLongDescription = descriptionText.length > 300;

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const displayText =
    isExpanded || !isLongDescription
      ? descriptionText
      : descriptionText.substring(0, 300) + "...";

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 md:p-6">
        <p
          dangerouslySetInnerHTML={{ __html: displayText }}
          className={cn(
            "text-brand-muted leading-relaxed",
            !isExpanded && isLongDescription && "line-clamp-4"
          )}
        />

        {isLongDescription && (
          <button
            onClick={toggleExpanded}
            className="text-brand-primary hover:text-brand-primary/80 mt-3 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Read More
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <span className="text-sm text-gray-600">Listed by: </span>
          {href ? (
            <Link
              href={href}
              className="font-medium text-blue-600 underline-offset-2 transition-colors hover:text-blue-700 hover:underline"
            >
              {name}
            </Link>
          ) : (
            <span className="font-medium text-gray-700">{name}</span>
          )}
        </div>
      </div>
    </div>
  );
}
