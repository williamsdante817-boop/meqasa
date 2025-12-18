/**
 * Input validation utilities for production-ready forms
 */

// Validate name - only letters, spaces, hyphens, and apostrophes
export const validateName = (name: string): boolean => {
  if (!name || name.trim().length === 0) return false;
  // Allow letters (including accented), spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  return nameRegex.test(name.trim());
};

// Sanitize name input - remove invalid characters
export const sanitizeName = (name: string): string => {
  return name.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "");
};

// Validate email
export const validateEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Sanitize email - remove spaces and invalid characters
export const sanitizeEmail = (email: string): string => {
  return email.replace(/[^\w@.-]/g, "").toLowerCase();
};

// Validate message - allow most characters but prevent script injection
export const validateMessage = (message: string): boolean => {
  if (!message || message.trim().length === 0) return false;
  // Prevent script tags and other dangerous patterns
  const dangerousPatterns = /<script|javascript:|onerror=|onclick=/i;
  return !dangerousPatterns.test(message);
};

// Sanitize message - remove dangerous patterns
export const sanitizeMessage = (message: string): string => {
  return message
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
};

// Get validation error message
export const getNameError = (name: string): string => {
  if (!name || name.trim().length === 0) return "Name is required";
  if (!validateName(name)) return "Name can only contain letters, spaces, hyphens, and apostrophes";
  return "";
};

export const getEmailError = (email: string): string => {
  if (!email || email.trim().length === 0) return "Email is required";
  if (!validateEmail(email)) return "Please enter a valid email address";
  return "";
};

export const getMessageError = (message: string): string => {
  if (!message || message.trim().length === 0) return "Message is required";
  if (!validateMessage(message)) return "Message contains invalid content";
  return "";
};
