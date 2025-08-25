import DOMPurify from "dompurify";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Simple fallback sanitizer for server-side rendering
function fallbackSanitize(html: string): string {
  if (!html) return "";

  // Basic HTML tag stripping for server-side
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");
}

// Configure DOMPurify only in browser environment
const configureDOMPurify = () => {
  if (!isBrowser) return;

  try {
    DOMPurify.setConfig({
      ALLOWED_TAGS: [
        "b",
        "i",
        "em",
        "strong",
        "span",
        "small",
        "sup",
        "sub",
        "u",
        "s",
        "div",
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "img",
        "picture",
        "source",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "br",
        "hr",
      ],
      ALLOWED_ATTR: [
        "class",
        "id",
        "title",
        "alt",
        "href",
        "target",
        "rel",
        "src",
        "loading",
        "width",
        "height",
        "srcset",
        "type",
        "style",
      ],
      ALLOWED_URI_REGEXP: /^(https?|mailto|tel|callto):/i,
      FORBID_TAGS: [
        "script",
        "object",
        "embed",
        "form",
        "input",
        "textarea",
        "select",
        "button",
      ],
      FORBID_ATTR: [
        "onerror",
        "onload",
        "onclick",
        "onmouseover",
        "onfocus",
        "onblur",
      ],
      KEEP_CONTENT: true,
    });
  } catch (error) {
    console.warn("DOMPurify configuration failed:", error);
  }
};

// Initialize configuration only in browser
if (isBrowser) {
  configureDOMPurify();
}

/**
 * Standardized HTML sanitization using DOMPurify (browser) or fallback (server)
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  try {
    // Use DOMPurify in browser, fallback on server
    if (isBrowser && DOMPurify && typeof DOMPurify.sanitize === "function") {
      return DOMPurify.sanitize(html);
    } else {
      return fallbackSanitize(html);
    }
  } catch (error) {
    console.error("HTML sanitization error:", error);
    return fallbackSanitize(html);
  }
}

/**
 * Sanitize HTML and return React dangerouslySetInnerHTML payload
 * @param html - The HTML string to sanitize
 * @returns Object with __html property for React
 */
export function sanitizeToInnerHtml(html: string): { __html: string } {
  return { __html: sanitizeHtml(html) };
}

/**
 * Sanitize rich HTML content (ads, banners, etc.) with more permissive settings
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeRichHtml(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  try {
    if (isBrowser && DOMPurify && typeof DOMPurify.sanitize === "function") {
      // Use DOMPurify with rich content settings
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          "div",
          "p",
          "span",
          "a",
          "img",
          "picture",
          "source",
          "b",
          "strong",
          "em",
          "br",
          "ul",
          "ol",
          "li",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
        ],
        ALLOWED_ATTR: [
          "class",
          "id",
          "title",
          "alt",
          "style",
          "href",
          "target",
          "rel",
          "src",
          "loading",
          "width",
          "height",
          "srcset",
          "type",
        ],
        ALLOWED_URI_REGEXP: /^(https?|mailto|tel|callto):/i,
        FORBID_TAGS: [
          "script",
          "object",
          "embed",
          "form",
          "input",
          "textarea",
          "select",
          "button",
        ],
        FORBID_ATTR: [
          "onerror",
          "onload",
          "onclick",
          "onmouseover",
          "onfocus",
          "onblur",
        ],
        KEEP_CONTENT: true,
        ADD_URI_SAFE_ATTR: ["target"],
      });

      // Post-process to add security attributes to links (browser only)
      try {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = sanitized;
        const links = tempDiv.querySelectorAll('a[href^="http"]');
        links.forEach((link) => {
          link.setAttribute("rel", "noopener noreferrer");
          link.setAttribute("target", "_blank");
        });
        return tempDiv.innerHTML;
      } catch {
        return sanitized; // Return sanitized content if DOM manipulation fails
      }
    } else {
      // Server-side fallback
      return fallbackSanitize(html);
    }
  } catch (error) {
    console.error("Rich HTML sanitization error:", error);
    return fallbackSanitize(html);
  }
}

/**
 * Sanitize rich HTML and return React dangerouslySetInnerHTML payload
 * @param html - The HTML string to sanitize
 * @returns Object with __html property for React
 */
export function sanitizeRichHtmlToInnerHtml(html: string): { __html: string } {
  return { __html: sanitizeRichHtml(html) };
}

/**
 * Sanitize JSON data for structured data (SEO) - only allows safe JSON
 * @param data - The data to stringify and sanitize
 * @returns Sanitized JSON string
 */
export function sanitizeStructuredData(data: unknown): { __html: string } {
  try {
    const jsonString = JSON.stringify(data);
    // For structured data, we only allow safe JSON content
    return { __html: jsonString };
  } catch (error) {
    console.error("Structured data sanitization error:", error);
    return { __html: "{}" };
  }
}

/**
 * Validate if a string contains potentially dangerous content
 * @param html - The HTML string to validate
 * @returns true if potentially dangerous, false if safe
 */
export function isPotentiallyDangerous(html: string): boolean {
  if (!html || typeof html !== "string") {
    return false;
  }

  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(html));
}

/**
 * Get sanitization statistics for debugging
 * @param html - The HTML string to analyze
 * @returns Object with sanitization info
 */
export function getSanitizationStats(html: string): {
  originalLength: number;
  sanitizedLength: number;
  removedTags: string[];
  isDangerous: boolean;
} {
  if (!html || typeof html !== "string") {
    return {
      originalLength: 0,
      sanitizedLength: 0,
      removedTags: [],
      isDangerous: false,
    };
  }

  const originalLength = html.length;
  const isDangerous = isPotentiallyDangerous(html);
  const sanitized = sanitizeHtml(html);
  const sanitizedLength = sanitized.length;

  // Extract removed tags (simplified approach)
  const originalTags = (html.match(/<[^>]+>/g) ?? []) as string[];
  const sanitizedTags = (sanitized.match(/<[^>]+>/g) ?? []) as string[];
  const removedTags = originalTags.filter(
    (tag) => !sanitizedTags.includes(tag),
  );

  return {
    originalLength,
    sanitizedLength,
    removedTags,
    isDangerous,
  };
}
