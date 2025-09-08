/**
 * Centralized validation schemas and utilities
 * Export point for all Zod validation schemas
 */

// Property validations
export * from "./property";

// Common validation utilities
export { z } from "zod";
export type { ZodSchema, ZodType } from "zod";
