# Image URL Construction Resilience Migration Guide

## Overview

This guide explains how to migrate from hardcoded image URLs to the new resilient image URL construction system that prevents image breaking and provides better fallback handling.

## What's New

### 1. Enhanced Image Utilities (`src/lib/image-utils.ts`)

The new system provides:

- **Multiple CDN Support**: Automatic fallback between CloudFront and meqasa.com
- **Type-Safe Image Types**: Different URL patterns for different image types
- **Environment-Based Configuration**: Different settings for dev/staging/production
- **Automatic Size Optimization**: WebP/AVIF conversion with size parameters
- **Robust Fallback Chain**: Multiple fallback options for broken images

### 2. Enhanced ImageWithFallback Component

The existing `ImageWithFallback` component now supports:

- Automatic URL building from image paths
- Image type specification for proper URL patterns
- Size optimization
- CDN preference settings

## Migration Steps

### Step 1: Replace Hardcoded URLs

**Before:**

```tsx
// Hardcoded CloudFront URL
const imageUrl = `https://dve7rykno93gs.cloudfront.net/uploads/imgs/${photo}`;

// Hardcoded meqasa.com URL
const logoUrl = `https://meqasa.com/uploads/imgs/${logo}`;
```

**After:**

```tsx
import {
  buildPropertyImageUrl,
  buildDeveloperLogoUrl,
} from "@/lib/image-utils";

// Resilient URL building
const imageUrl = buildPropertyImageUrl(photo, "large");
const logoUrl = buildDeveloperLogoUrl(logo, "medium");
```

### Step 2: Update ImageWithFallback Usage

**Before:**

```tsx
<ImageWithFallback
  src={imageUrl}
  alt="Property image"
  fallbackSrc="/placeholder-image.png"
/>
```

**After:**

```tsx
<ImageWithFallback
  src={photo} // Just the path, not full URL
  imageType="property"
  imageSize="large"
  alt="Property image"
  fallbackSrc="/placeholder-image.png"
/>
```

### Step 3: Use Type-Specific Functions

**Property Images:**

```tsx
import { buildPropertyImageUrl } from "@/lib/image-utils";

const imageUrl = buildPropertyImageUrl(property.photo, "large");
```

**Agent Logos:**

```tsx
import { buildAgentLogoUrl } from "@/lib/image-utils";

const logoUrl = buildAgentLogoUrl(agent.imbroker);
```

**Developer Logos:**

```tsx
import { buildDeveloperLogoUrl } from "@/lib/image-utils";

const logoUrl = buildDeveloperLogoUrl(developer.logo, "medium");
```

**Project Images:**

```tsx
import { buildProjectImageUrl } from "@/lib/image-utils";

const imageUrl = buildProjectImageUrl(project.photo, "original");
```

**Banner Images:**

```tsx
import { buildBannerImageUrl } from "@/lib/image-utils";

const bannerUrl = buildBannerImageUrl(banner.src, "large");
```

## Image Types Available

- `'property'` - Property/unit images
- `'agent-logo'` - Agent avatar/logo images
- `'developer-logo'` - Developer company logos
- `'project-photo'` - Project photos
- `'project-logo'` - Project logos
- `'banner'` - Banner/ad images
- `'ad'` - Advertisement images
- `'temp'` - Temporary upload images
- `'generic'` - Default fallback type

## Image Sizes Available

- `'thumbnail'` - 150x150px, optimized for small displays
- `'medium'` - 400x300px, good for cards
- `'large'` - 800x600px, good for hero images
- `'original'` - Full size with quality optimization

## Environment Configuration

The system automatically adapts based on environment:

**Development:**

- Uses localhost for faster debugging
- Disables WebP for easier troubleshooting
- Higher quality settings

**Production:**

- Uses CloudFront as primary CDN
- Enables WebP/AVIF optimization
- Optimized quality for performance

## Benefits

1. **Prevents Image Breaking**: Automatic fallback between CDNs
2. **Better Performance**: Optimized image sizes and formats
3. **Environment Flexibility**: Different settings per environment
4. **Type Safety**: Prevents incorrect URL patterns
5. **Centralized Configuration**: Easy to update CDN settings
6. **Backward Compatibility**: Existing code continues to work

## Example Migration

**Before (Property Card):**

```tsx
const imageUrl = photo
  ? `https://dve7rykno93gs.cloudfront.net/uploads/imgs/${photo}`
  : "/placeholder-image.png";

<ImageWithFallback src={imageUrl} alt="Property" />;
```

**After (Property Card):**

```tsx
<ImageWithFallback
  src={photo}
  imageType="property"
  imageSize="large"
  alt="Property"
/>
```

## Testing

To test the resilience:

1. **Network Issues**: Simulate network failures
2. **CDN Failures**: Test fallback between CDNs
3. **Invalid Paths**: Test with null/undefined paths
4. **Different Environments**: Test dev vs production behavior

## Configuration

Edit `src/config/images.ts` to customize:

- CDN URLs
- Fallback images
- Quality settings
- Size parameters
- Environment-specific behavior
