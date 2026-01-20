import dynamic from "next/dynamic";

// Lazy load Mortgage Calculator
export const MortgageCalculator = dynamic(
  () => import("@/components/mortgage-calculator")
);

// Lazy load Image Carousel Modal
export const ImageCarouselModal = dynamic(() =>
  import("@/components/image-carousel-modal").then((mod) => ({
    default: mod.ImageCarouselModal,
  }))
);
