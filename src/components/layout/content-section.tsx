import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
  href: string;
  linkText?: string;
  asChild?: boolean;
  border?: boolean;
  btnHidden?: boolean;
  sectionId?: string;
}

/**
 * Renders a content section with a title, description, and optional children.
 *
 * @param {string} title - The title of the content section.
 * @param {string} [description] - The optional description of the content section.
 * @param {React.ReactNode} children - The children elements to be rendered within the section.
 * @param {string} href - The link URL for the "See All" button.
 * @param {string} [linkText="See All"] - The text for the link/button.
 * @param {boolean} [asChild=false] - Whether to render the component as a child element.
 * @param {string} [className] - Additional class names for styling the section component.
 * @param {boolean} [border=false] - Whether to add a bottom border to the section.
 * @param {boolean} [btnHidden=false] - Whether to hide the "See All" button.
 * @param {string} [sectionId] - Unique identifier for the section (used for accessibility).
 * @param {object} props - Additional props to be passed to the section element.
 */

// Helper function to generate a stable ID from a string
function generateStableId(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ContentSection({
  title,
  description,
  children,
  href,
  linkText = "See All",
  asChild = false,
  className,
  border = false,
  btnHidden = false,
  sectionId,
  ...props
}: ContentSectionProps) {
  const Comp = asChild ? Slot : "div";
  // Use a stable ID based on the title or provided sectionId
  const uniqueId = sectionId ?? `content-section-${generateStableId(title)}`;

  return (
    <section
      className={cn("mx-auto w-full max-w-[1120px] space-y-6", className)}
      aria-labelledby={`${uniqueId}-title`}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-4",
          border && "border-b border-gray-200 pb-3"
        )}
      >
        <div className="flex max-w-[61.25rem] flex-1 flex-col gap-0.5">
          <h2
            id={`${uniqueId}-title`}
            className={cn(
              "text-brand-accent mb-1 text-2xl leading-tight font-bold tracking-tighter lg:text-3xl",
              !btnHidden && "lg:font-extrabold"
            )}
          >
            {title}
          </h2>
          {description && (
            <p
              id={`${uniqueId}-description`}
              className="text-brand-muted max-w-[46.875rem] text-sm leading-normal text-balance sm:text-base sm:leading-7"
            >
              {description}
            </p>
          )}
        </div>
        {!btnHidden && (
          <Button
            variant="ghost"
            className="text-brand-blue hover:text-brand-blue focus-visible:ring-brand-blue hidden text-base font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 lg:flex"
            asChild
          >
            <Link href={href} aria-label={`${linkText} for ${title}`}>
              {linkText}
            </Link>
          </Button>
        )}
      </div>
      <div className="space-y-8">
        <Comp>
          <>{children}</>
        </Comp>
      </div>
    </section>
  );
}
