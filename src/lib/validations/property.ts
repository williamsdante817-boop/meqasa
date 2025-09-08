/**
 * Property validation schemas using Zod
 * Based on skateshop patterns for runtime type validation
 */

import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import {
  propertyTypes,
  contractTypes,
  propertyStatuses,
  currencies,
  propertyFeatures,
} from "@/config/property";

// Base schemas for property configuration enums
export const propertyTypeSchema = z.enum(propertyTypes);
export const contractTypeSchema = z.enum(contractTypes);
export const propertyStatusSchema = z.enum(propertyStatuses);
export const currencySchema = z.enum(currencies);
export const propertyFeatureSchema = z.enum(propertyFeatures);

// International phone number validation using libphonenumber-js
const internationalPhoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine(
    (phone) => {
      try {
        return isValidPhoneNumber(phone);
      } catch {
        return false;
      }
    },
    {
      message: "Please enter a valid international phone number",
    }
  );

// Location schema
export const locationSchema = z.object({
  area: z.string().min(1, "Area is required"),
  address: z.string().min(1, "Address is required"),
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});

// Property details schema
export const propertyDetailsSchema = z.object({
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  garages: z.number().int().min(0).max(10).optional(),
  floorArea: z.number().positive("Floor area must be positive"),
  landArea: z.number().positive().optional(),
  furnished: z.boolean(),
  negotiable: z.boolean(),
});

// Pricing schema
export const pricingSchema = z.object({
  amount: z.number().min(0, "Price must be non-negative"),
  currency: currencySchema,
  priceOnRequest: z.boolean(),
  rentPeriod: z.enum(["month", "week", "day"]).optional(),
});

// Media schema
export const mediaSchema = z.object({
  coverImage: z.string().url("Cover image must be a valid URL"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  tourVideo: z.string().url().optional(),
});

// Agent contact schema
export const agentContactSchema = z.object({
  phone: internationalPhoneSchema,
  email: z.string().email().optional(),
});

// Agent schema
export const agentSchema = z.object({
  id: z.string().min(1, "Agent ID is required"),
  name: z.string().min(1, "Agent name is required"),
  type: z.enum(["individual", "company"]),
  profileImage: z.string().url().optional(),
  logo: z.string().url().optional(),
  verified: z.boolean(),
  contact: agentContactSchema,
});

// Core property schema
export const propertySchema = z.object({
  id: z.string().min(1, "Property ID is required"),
  reference: z.string().min(1, "Property reference is required"),
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must be less than 2000 characters"),
  type: propertyTypeSchema,
  contract: contractTypeSchema,
  status: propertyStatusSchema,
  location: locationSchema,
  details: propertyDetailsSchema,
  pricing: pricingSchema,
  media: mediaSchema,
  features: z.array(propertyFeatureSchema),
  amenities: z.array(z.string()),
  agent: agentSchema,
  dates: z.object({
    listed: z.string().datetime(),
    updated: z.string().datetime(),
  }),
  seo: z.object({
    slug: z.string().min(1, "Slug is required"),
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
  }),
  metrics: z.object({
    views: z.number().int().min(0),
    contactClicks: z.number().int().min(0),
    featured: z.boolean(),
  }),
});

// Property listing schema (for search results)
export const propertyListingSchema = z.object({
  id: z.string().min(1),
  reference: z.string().min(1),
  title: z.string().min(1),
  type: propertyTypeSchema,
  contract: contractTypeSchema,
  status: propertyStatusSchema,
  location: z.string().min(1),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  floorArea: z.number().positive(),
  pricing: z.object({
    amount: z.number().min(0),
    currency: currencySchema,
    formatted: z.string(),
  }),
  coverImage: z.string().url(),
  featured: z.boolean(),
  dateAdded: z.string().datetime(),
  slug: z.string().min(1),
  agent: z.object({
    name: z.string().min(1),
    verified: z.boolean(),
  }),
});

// Property search params schema
export const propertySearchParamsSchema = z.object({
  type: z.union([propertyTypeSchema, z.array(propertyTypeSchema)]).optional(),
  contract: contractTypeSchema.optional(),
  location: z.string().optional(),
  bedrooms: z
    .object({
      min: z.number().int().min(0).optional(),
      max: z.number().int().max(20).optional(),
    })
    .optional(),
  bathrooms: z
    .object({
      min: z.number().int().min(0).optional(),
      max: z.number().int().max(20).optional(),
    })
    .optional(),
  price: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
      currency: currencySchema.optional(),
    })
    .optional(),
  features: z.array(propertyFeatureSchema).optional(),
  furnished: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z
    .enum(["date_desc", "date_asc", "price_asc", "price_desc", "relevance"])
    .default("date_desc"),
  q: z.string().optional(),
});

// Property contact form schema
export const propertyContactFormSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  propertyTitle: z.string().min(1, "Property title is required"),
  contactType: z.enum(["inquiry", "viewing", "callback"]),
  visitor: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name must contain only letters, spaces, hyphens, and apostrophes"
      ),
    email: z.string().email("Please enter a valid email address"),
    phone: internationalPhoneSchema,
  }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
  preferredContact: z.enum(["phone", "email", "whatsapp"]).optional(),
  preferredTime: z.string().optional(),
});

// Property unit schema (for projects)
export const propertyUnitSchema = z.object({
  id: z.string().min(1),
  unitNumber: z.string().optional(),
  type: propertyTypeSchema,
  title: z.string().min(1),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  floorArea: z.number().positive(),
  pricing: z.object({
    selling: z
      .object({
        amount: z.number().min(0),
        currency: currencySchema,
      })
      .optional(),
    renting: z
      .object({
        amount: z.number().min(0),
        currency: currencySchema,
        period: z.enum(["month", "week", "day"]),
      })
      .optional(),
  }),
  features: z.array(propertyFeatureSchema),
  available: z.boolean(),
  coverImage: z.string().url(),
  floorPlan: z
    .object({
      imageUrl: z.string().url(),
      sqft: z.number().positive(),
      sqm: z.number().positive(),
    })
    .optional(),
  project: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    developer: z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      logo: z.string().url().optional(),
    }),
  }),
});

// Property project schema
export const propertyProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  location: locationSchema,
  developer: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    logo: z.string().url().optional(),
    verified: z.boolean(),
    contact: agentContactSchema,
  }),
  media: mediaSchema,
  features: z.array(propertyFeatureSchema),
  amenities: z.array(z.string()),
  units: z.object({
    total: z.number().int().min(0),
    available: z.number().int().min(0),
    types: z.array(
      z.object({
        type: propertyTypeSchema,
        count: z.number().int().min(0),
        priceFrom: z.number().min(0),
      })
    ),
  }),
  completion: z.object({
    status: z.enum(["completed", "under_construction", "planned"]),
    date: z.string().datetime().optional(),
  }),
  dates: z.object({
    launched: z.string().datetime(),
    updated: z.string().datetime(),
  }),
  featured: z.boolean(),
});

// Form validation helpers
export const createPropertyFormSchema = propertySchema
  .omit({
    id: true,
    dates: true,
    metrics: true,
    seo: true,
  })
  .extend({
    seo: z
      .object({
        slug: z.string().optional(),
        metaTitle: z.string().max(60).optional(),
        metaDescription: z.string().max(160).optional(),
      })
      .optional(),
  });

export const updatePropertyFormSchema = createPropertyFormSchema.partial();

// Type exports for use in components
export type PropertyFormData = z.infer<typeof createPropertyFormSchema>;
export type UpdatePropertyFormData = z.infer<typeof updatePropertyFormSchema>;
export type PropertySearchParams = z.infer<typeof propertySearchParamsSchema>;
export type PropertyContactFormData = z.infer<typeof propertyContactFormSchema>;

// Validation helper functions
export function validateProperty(data: unknown) {
  return propertySchema.safeParse(data);
}

export function validatePropertyListing(data: unknown) {
  return propertyListingSchema.safeParse(data);
}

export function validatePropertySearchParams(data: unknown) {
  return propertySearchParamsSchema.safeParse(data);
}

export function validatePropertyContactForm(data: unknown) {
  return propertyContactFormSchema.safeParse(data);
}

export function validateInternationalPhone(
  phone: string,
  defaultCountry?: string
): boolean {
  try {
    // Only pass defaultCountry if it's a valid CountryCode string
    return defaultCountry
      ? isValidPhoneNumber(phone, defaultCountry as CountryCode)
      : isValidPhoneNumber(phone);
  } catch {
    return false;
  }
}
