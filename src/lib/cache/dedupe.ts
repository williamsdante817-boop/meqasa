import { cache } from 'react';

// Import existing functions
import { getListingDetails as originalGetListingDetails } from '@/lib/get-listing-detail';
import { getFeaturedListings as originalGetFeaturedListings } from '@/lib/get-featured-listings';
import { getFeaturedProjects as originalGetFeaturedProjects } from '@/lib/get-featured-projects';
import { getLatestListings as originalGetLatestListings } from '@/lib/get-latest-listing';
import { getHeroBanner as originalGetHeroBanner } from '@/lib/get-hero-banner';
import { getBlogData as originalGetBlogData } from '@/lib/get-blog-data';
import { getFlexiBanner as originalGetFlexiBanner } from '@/lib/get-flexi-banner';

// Wrap with React cache for request-level deduplication
// Note: Cache is cleared after each request - every page load gets fresh data
export const getListingDetails = cache(originalGetListingDetails);
export const getFeaturedListings = cache(originalGetFeaturedListings);
export const getFeaturedProjects = cache(originalGetFeaturedProjects);
export const getLatestListings = cache(originalGetLatestListings);
export const getHeroBanner = cache(originalGetHeroBanner);
export const getBlogData = cache(originalGetBlogData);
export const getFlexiBanner = cache(originalGetFlexiBanner);
