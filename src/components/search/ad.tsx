import Image from "next/image";

interface RealEstateAdProps {
  src: string;
  href: string;
  alt?: string;
}

const RealEstateAd = ({ src, href, alt = "Ad banner" }: RealEstateAdProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full group"
  >
    <div className="relative w-full rounded-lg border p-4 overflow-hidden">
      <div className="relative h-[450px] w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, 300px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        {/* Subtle gradient overlay for better visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  </a>
);

export default RealEstateAd;
