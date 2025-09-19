import { formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format a date/timestamp to relative time string (e.g., "10 days ago", "last month")
 * Matches MeQasa's live site formatting
 */
export function formatRecency(timestamp?: string | Date | null): string {
  if (!timestamp) return 'recently';

  let date: Date;

  // Handle different input types
  if (typeof timestamp === 'string') {
    // Try to parse ISO string first, then fallback to regular Date parsing
    date = timestamp.includes('T') ? parseISO(timestamp) : new Date(timestamp);
  } else {
    date = timestamp;
  }

  // Validate the date
  if (!isValid(date)) {
    return 'recently';
  }

  // Use date-fns to format relative time
  return formatDistanceToNow(date, {
    addSuffix: true,
    includeSeconds: false
  });
}

/**
 * Format a date for display (e.g., "December 15, 2024")
 */
export function formatDisplayDate(timestamp?: string | Date | null): string {
  if (!timestamp) return '';

  let date: Date;

  if (typeof timestamp === 'string') {
    date = timestamp.includes('T') ? parseISO(timestamp) : new Date(timestamp);
  } else {
    date = timestamp;
  }

  if (!isValid(date)) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a date for API usage (ISO string)
 */
export function formatApiDate(date: Date): string {
  return date.toISOString();
}

/**
 * Check if a date string is valid
 */
export function isValidDateString(timestamp?: string | null): boolean {
  if (!timestamp) return false;

  const date = typeof timestamp === 'string' && timestamp.includes('T')
    ? parseISO(timestamp)
    : new Date(timestamp);

  return isValid(date);
}