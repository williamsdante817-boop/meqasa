import Image from "next/image";
import { Card } from "../ui/card";

interface HeroBannerProps {
  src: string;
  href: string;
  alt?: string;
}

export function HeroBanner({
  src,
  href,
  alt = "Hero banner",
}: HeroBannerProps) {
  return (
    <Card className="hidden lg:block max-h-[305px] rounded-none border-t-0 border-b h-[305px] relative">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full relative"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center"
          priority
          sizes="100vw"
        />
      </a>
    </Card>
  );
}
