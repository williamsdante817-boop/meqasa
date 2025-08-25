# DOM Sanitization Migration Guide

## Overview

We've standardized the codebase to use [DOMPurify](https://github.com/cure53/DOMPurify) for all HTML sanitization needs. DOMPurify is a battle-tested, super-fast XSS sanitizer that provides better security and performance than the previous `sanitize-html` library.

## What Changed

### Before (Old System)

```typescript
import { sanitizeHtmlString, buildInnerHtml, buildRichInnerHtml } from "@/lib/utils";

// Basic sanitization
const safeHtml = sanitizeHtmlString(userInput);
dangerouslySetInnerHTML={{ __html: safeHtml }}

// Rich HTML sanitization
dangerouslySetInnerHTML={buildRichInnerHtml(bannerHtml)}
```

### After (New System)

```typescript
import {
  sanitizeHtml,
  sanitizeToInnerHtml,
  sanitizeRichHtml,
  sanitizeRichHtmlToInnerHtml
} from "@/lib/dom-sanitizer";

// Basic sanitization
const safeHtml = sanitizeHtml(userInput);
dangerouslySetInnerHTML={sanitizeToInnerHtml(userInput)}

// Rich HTML sanitization
dangerouslySetInnerHTML={sanitizeRichHtmlToInnerHtml(bannerHtml)}
```

## New Functions

### 1. `sanitizeHtml(html: string): string`

Basic HTML sanitization for simple content like descriptions, prices, etc.

**Allowed tags:** `b`, `i`, `em`, `strong`, `span`, `small`, `sup`, `sub`, `u`, `s`, `div`, `p`, `h1-h6`, `ul`, `ol`, `li`, `a`, `img`, `picture`, `source`, `table`, `thead`, `tbody`, `tr`, `th`, `td`, `br`, `hr`

**Allowed attributes:** `class`, `id`, `title`, `alt`, `href`, `target`, `rel`, `src`, `loading`, `width`, `height`, `srcset`, `type`, **`style`**

### 2. `sanitizeToInnerHtml(html: string): { __html: string }`

Returns React `dangerouslySetInnerHTML` payload with sanitized content.

### 3. `sanitizeRichHtml(html: string): string`

Rich HTML sanitization for ads, banners, and complex content.

**Additional features:**

- Automatically adds `rel="noopener noreferrer"` to external links
- Sets `target="_blank"` for external links
- More permissive tag allowance for rich content

### 4. `sanitizeRichHtmlToInnerHtml(html: string): { __html: string }`

Returns React `dangerouslySetInnerHTML` payload with rich sanitized content.

### 5. `sanitizeStructuredData(data: any): { __html: string }`

Safe JSON stringification for structured data (SEO).

### 6. `isPotentiallyDangerous(html: string): boolean`

Detects potentially dangerous content before sanitization.

### 7. `getSanitizationStats(html: string): object`

Provides sanitization statistics for debugging.

## Migration Examples

### Property Cards

```typescript
// Before
dangerouslySetInnerHTML={buildInnerHtml(result.pricepart1)}

// After
dangerouslySetInnerHTML={sanitizeToInnerHtml(result.pricepart1)}
```

### Banner Ads

```typescript
// Before
dangerouslySetInnerHTML={buildRichInnerHtml(bannerHtml)}

// After
dangerouslySetInnerHTML={sanitizeRichHtmlToInnerHtml(bannerHtml)}
```

### Structured Data

```typescript
// Before
dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}

// After
dangerouslySetInnerHTML={sanitizeStructuredData(structuredData)}
```

### Direct HTML (Critical Security Fix)

```typescript
// Before - UNSAFE!
dangerouslySetInnerHTML={{ __html: flexiBanner }}

// After - SAFE!
dangerouslySetInnerHTML={sanitizeRichHtmlToInnerHtml(flexiBanner)}
```

## Security Features

### 1. XSS Prevention

- Removes all `<script>` tags
- Strips event handlers (`onclick`, `onload`, etc.)
- Blocks `javascript:` URLs
- Prevents iframe injection
- Filters dangerous HTML5 elements

### 2. Link Security

- Automatically adds `rel="noopener noreferrer"` to external links
- Sets `target="_blank"` for external links
- Validates URL schemes

### 3. Style Attribute Support

- **Allows `style` attributes** as requested
- Maintains security while enabling styling flexibility

### 4. Fallback Protection

- Graceful error handling
- Falls back to tag stripping if sanitization fails
- Comprehensive logging for debugging

## Configuration

The DOMPurify configuration is centralized in `src/lib/dom-sanitizer.ts`:

```typescript
DOMPurify.setConfig({
  ALLOWED_TAGS: [...],
  ALLOWED_ATTR: [...],
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  // ... more configuration
});
```

## Testing

Run the test suite to verify sanitization works correctly:

```bash
npm test -- --testPathPattern=dom-sanitizer
```

## Best Practices

### 1. Always Sanitize External Content

```typescript
// ✅ Good
dangerouslySetInnerHTML={sanitizeToInnerHtml(externalHtml)}

// ❌ Bad
dangerouslySetInnerHTML={{ __html: externalHtml }}
```

### 2. Use Appropriate Sanitization Level

```typescript
// Simple text content
sanitizeToInnerHtml(description);

// Rich content (ads, banners)
sanitizeRichHtmlToInnerHtml(bannerHtml);

// Structured data
sanitizeStructuredData(seoData);
```

### 3. Validate Input Before Sanitization

```typescript
if (isPotentiallyDangerous(userInput)) {
  console.warn("Potentially dangerous content detected:", userInput);
  // Handle appropriately
}
```

### 4. Monitor Sanitization Statistics

```typescript
const stats = getSanitizationStats(userInput);
if (stats.removedTags.length > 0) {
  console.warn("Tags removed during sanitization:", stats.removedTags);
}
```

## Deprecation Timeline

- **Phase 1 (Current)**: Old functions show deprecation warnings
- **Phase 2 (Next Release)**: Old functions throw errors
- **Phase 3 (Future)**: Old functions removed

## Support

For questions about the new sanitization system:

1. Check this migration guide
2. Review the test files for examples
3. Consult the [DOMPurify documentation](https://github.com/cure53/DOMPurify)
4. Open an issue for complex cases

## Security Benefits

1. **Consistent Protection**: All HTML content is sanitized using the same, proven library
2. **Better Performance**: DOMPurify is significantly faster than sanitize-html
3. **Enhanced Security**: More comprehensive XSS protection
4. **Style Support**: Allows styling while maintaining security
5. **Automatic Link Security**: External links automatically get security attributes
6. **Comprehensive Testing**: Extensive test coverage for security scenarios
