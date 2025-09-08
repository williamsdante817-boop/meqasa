import { z } from "zod";

// Zod schemas for runtime validation
export const ImageArraySchema = z
  .array(z.string().min(1))
  .min(1, "At least one image is required")
  .max(50, "Maximum 50 images allowed");

export const PropertyShowcasePropsSchema = z.object({
  images: ImageArraySchema,
  maxImages: z.number().min(1).max(20).optional(),
  enableModal: z.boolean().optional(),
  fallbackImage: z.string().url().optional(),
  priority: z.boolean().optional(),
  className: z.string().optional(),
  onImageClick: z.function().args(z.number()).returns(z.void()).optional(),
  onImageLoad: z.function().args(z.number()).returns(z.void()).optional(),
  onImageError: z
    .function()
    .args(z.number(), z.string())
    .returns(z.void())
    .optional(),
});

// TypeScript interfaces derived from schemas
export type ImageArray = z.infer<typeof ImageArraySchema>;

export interface PropertyShowcaseProps {
  /** Array of image paths or URLs */
  images: string[];
  /** Maximum number of images to display in the grid (default: 4) */
  maxImages?: number;
  /** Whether to enable the modal carousel (default: true) */
  enableModal?: boolean;
  /** Fallback image URL when images fail to load */
  fallbackImage?: string;
  /** Whether main image should be loaded with priority (default: false) */
  priority?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when an image is clicked */
  onImageClick?: (index: number) => void;
  /** Callback when an image loads successfully */
  onImageLoad?: (index: number) => void;
  /** Callback when an image fails to load */
  onImageError?: (index: number, imagePath: string) => void;
}

export interface ImageShowcaseState {
  imgErrors: Map<number, boolean>;
  isCarouselOpen: boolean;
  selectedImageIndex: number;
  isVisible: boolean;
}

export interface ImageComponentProps {
  src: string;
  alt: string;
  index: number;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export interface ImagePlaceholderProps {
  className?: string;
  message?: string;
  showIcon?: boolean;
}

export interface ImageMetrics {
  loadTime: number;
  imageSize: number;
  index: number;
  success: boolean;
  errorMessage?: string;
}

// Validation helper functions
export const validatePropertyShowcaseProps = (
  props: unknown
): PropertyShowcaseProps => {
  try {
    return PropertyShowcasePropsSchema.parse(props) as PropertyShowcaseProps;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new Error(`PropertyShowcase props validation failed: ${issues}`);
    }
    throw error;
  }
};

export const isValidImageArray = (images: unknown): images is string[] => {
  try {
    ImageArraySchema.parse(images);
    return true;
  } catch {
    return false;
  }
};

// Error types for better error handling
export class PropertyShowcaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "PropertyShowcaseError";
  }
}

export type PropertyShowcaseErrorCode =
  | "INVALID_PROPS"
  | "IMAGE_LOAD_FAILED"
  | "MODAL_ERROR"
  | "PRELOAD_FAILED"
  | "VALIDATION_ERROR";

export const createPropertyShowcaseError = (
  code: PropertyShowcaseErrorCode,
  message: string,
  context?: Record<string, unknown>
): PropertyShowcaseError => {
  return new PropertyShowcaseError(message, code, context);
};
