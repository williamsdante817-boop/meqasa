/**
 * Google Maps API integration service for finding nearby establishments
 * Handles geocoding and places search functionality
 */

import type { NearestEstablishment } from '@/components/nearest-establishments';

// Types for Google Maps API responses
interface GoogleMapsCoordinates {
  lat: number;
  lng: number;
}

interface GoogleGeocodeResult {
  geometry: {
    location: GoogleMapsCoordinates;
  };
  formatted_address: string;
  place_id: string;
}

interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: GoogleMapsCoordinates;
  };
  rating?: number;
  business_status?: string;
  opening_hours?: {
    open_now?: boolean;
  };
  types: string[];
  price_level?: number;
  formatted_phone_number?: string;
  website?: string;
}

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
  error_message?: string;
  next_page_token?: string;
}

interface GoogleGeocodeResponse {
  results: GoogleGeocodeResult[];
  status: string;
  error_message?: string;
}

// Establishment type mappings for Google Places API
const ESTABLISHMENT_TYPE_MAPPINGS = {
  schools: ['school', 'primary_school', 'secondary_school', 'university'],
  supermarkets: ['supermarket', 'grocery_or_supermarket', 'store'],
  banks: ['bank', 'atm', 'finance'],
  hospitals: ['hospital', 'doctor', 'health'],
  airports: ['airport']
} as const;

type EstablishmentType = keyof typeof ESTABLISHMENT_TYPE_MAPPINGS;

// Configuration
const GOOGLE_MAPS_CONFIG = {
  baseUrl: 'https://maps.googleapis.com/maps/api',
  defaultRadius: 5000, // 5km in meters
  maxResults: 10,
  language: 'en',
  region: 'gh' // Ghana
};

export interface GoogleMapsServiceOptions {
  apiKey: string;
  radius?: number;
  maxResults?: number;
}

export interface NearbySearchParams {
  location: string | GoogleMapsCoordinates;
  types: EstablishmentType[];
  radius?: number;
  maxResults?: number;
}

export class GoogleMapsService {
  private apiKey: string;
  private radius: number;
  private maxResults: number;

  constructor(options: GoogleMapsServiceOptions) {
    this.apiKey = options.apiKey;
    this.radius = options.radius || GOOGLE_MAPS_CONFIG.defaultRadius;
    this.maxResults = options.maxResults || GOOGLE_MAPS_CONFIG.maxResults;

    if (!this.apiKey) {
      throw new Error('Google Maps API key is required');
    }
  }

  /**
   * Convert location string to coordinates using Google Geocoding API
   */
  async geocodeLocation(locationString: string): Promise<GoogleMapsCoordinates> {
    try {
      const url = new URL(`${GOOGLE_MAPS_CONFIG.baseUrl}/geocode/json`);
      url.searchParams.set('address', locationString);
      url.searchParams.set('key', this.apiKey);
      url.searchParams.set('region', GOOGLE_MAPS_CONFIG.region);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Geocoding request failed: ${response.status}`);
      }

      const data: GoogleGeocodeResponse = await response.json();

      if (data.status !== 'OK' || !data.results.length) {
        throw new Error(`Geocoding failed: ${data.status} - ${data.error_message || 'No results found'}`);
      }

      const location = data.results[0]?.geometry.location;
      if (!location) {
        throw new Error('No location data found in geocoding response');
      }

      return location;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error(`Failed to geocode location: ${locationString}`);
    }
  }

  /**
   * Search for nearby places using Google Places API
   */
  async searchNearbyPlaces(
    coordinates: GoogleMapsCoordinates,
    placeType: string,
    radius: number = this.radius
  ): Promise<GooglePlaceResult[]> {
    try {
      const url = new URL(`${GOOGLE_MAPS_CONFIG.baseUrl}/place/nearbysearch/json`);
      url.searchParams.set('location', `${coordinates.lat},${coordinates.lng}`);
      url.searchParams.set('radius', radius.toString());
      url.searchParams.set('type', placeType);
      url.searchParams.set('key', this.apiKey);
      url.searchParams.set('language', GOOGLE_MAPS_CONFIG.language);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Places search request failed: ${response.status}`);
      }

      const data: GooglePlacesResponse = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Places search failed: ${data.status} - ${data.error_message || 'Unknown error'}`);
      }

      return data.results || [];
    } catch (error) {
      console.error('Places search error:', error);
      throw new Error('Failed to search nearby places');
    }
  }

  /**
   * Search for establishments by text query (alternative to nearby search)
   */
  async searchPlacesByText(
    query: string,
    location?: GoogleMapsCoordinates,
    radius: number = this.radius
  ): Promise<GooglePlaceResult[]> {
    try {
      const url = new URL(`${GOOGLE_MAPS_CONFIG.baseUrl}/place/textsearch/json`);
      url.searchParams.set('query', query);
      url.searchParams.set('key', this.apiKey);
      url.searchParams.set('language', GOOGLE_MAPS_CONFIG.language);

      if (location) {
        url.searchParams.set('location', `${location.lat},${location.lng}`);
        url.searchParams.set('radius', radius.toString());
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Text search request failed: ${response.status}`);
      }

      const data: GooglePlacesResponse = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Text search failed: ${data.status} - ${data.error_message || 'Unknown error'}`);
      }

      return data.results || [];
    } catch (error) {
      console.error('Text search error:', error);
      throw new Error('Failed to search places by text');
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert to meters
  }

  /**
   * Calculate estimated travel time
   */
  private calculateTravelTime(distanceInMeters: number): number {
    // Assume average city speed of 25 km/h
    const averageSpeedKmh = 25;
    const distanceKm = distanceInMeters / 1000;
    const timeHours = distanceKm / averageSpeedKmh;
    return Math.max(1, Math.round(timeHours * 60)); // Convert to minutes, minimum 1 minute
  }

  /**
   * Transform Google Place result to our NearestEstablishment format
   */
  private transformPlaceToEstablishment(
    place: GooglePlaceResult,
    propertyCoords: GoogleMapsCoordinates,
    establishmentType: EstablishmentType
  ): NearestEstablishment {
    const distance = this.calculateDistance(
      propertyCoords.lat,
      propertyCoords.lng,
      place.geometry.location.lat,
      place.geometry.location.lng
    );

    const travelTime = this.calculateTravelTime(distance);

    return {
      id: place.place_id,
      name: place.name,
      address: place.vicinity || '',
      distance: Math.round(distance),
      travelTime,
      type: establishmentType,
      rating: place.rating,
      openNow: place.opening_hours?.open_now,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      }
    };
  }

  /**
   * Find all nearby establishments for a location
   */
  async findNearbyEstablishments(params: NearbySearchParams): Promise<NearestEstablishment[]> {
    try {
      // Step 1: Get coordinates if location is a string
      let coordinates: GoogleMapsCoordinates;
      
      if (typeof params.location === 'string') {
        coordinates = await this.geocodeLocation(params.location);
      } else {
        coordinates = params.location;
      }

      const establishments: NearestEstablishment[] = [];
      const radius = params.radius || this.radius;
      const maxResults = params.maxResults || this.maxResults;

      // Step 2: Search for each establishment type
      for (const establishmentType of params.types) {
        const googleTypes = ESTABLISHMENT_TYPE_MAPPINGS[establishmentType];
        
        for (const googleType of googleTypes) {
          try {
            const places = await this.searchNearbyPlaces(coordinates, googleType, radius);
            
            // Transform places to establishments
            const typeEstablishments = places
              .slice(0, maxResults) // Limit results per type
              .map(place => this.transformPlaceToEstablishment(place, coordinates, establishmentType))
              .filter(est => est.distance <= radius); // Ensure within radius

            establishments.push(...typeEstablishments);
          } catch (error) {
            console.warn(`Failed to search for ${googleType}:`, error);
            // Continue with other types even if one fails
          }
        }
      }

      // Step 3: Sort by distance and remove duplicates
      const uniqueEstablishments = new Map<string, NearestEstablishment>();
      
      establishments
        .sort((a, b) => a.distance - b.distance)
        .forEach(est => {
          if (!uniqueEstablishments.has(est.id)) {
            uniqueEstablishments.set(est.id, est);
          }
        });

      return Array.from(uniqueEstablishments.values());

    } catch (error) {
      console.error('Find nearby establishments error:', error);
      throw new Error('Failed to find nearby establishments');
    }
  }

  /**
   * Alternative search using text queries (useful for specific location-based searches)
   */
  async searchEstablishmentsByText(
    locationString: string,
    establishmentTypes: EstablishmentType[]
  ): Promise<NearestEstablishment[]> {
    try {
      // Get location coordinates first
      const coordinates = await this.geocodeLocation(locationString);
      const establishments: NearestEstablishment[] = [];

      for (const establishmentType of establishmentTypes) {
        try {
          // Create search queries like "schools near East Legon", "banks near East Legon"
          const query = `${establishmentType} near ${locationString}`;
          const places = await this.searchPlacesByText(query, coordinates);

          // Transform and add to results
          const typeEstablishments = places
            .slice(0, this.maxResults)
            .map(place => this.transformPlaceToEstablishment(place, coordinates, establishmentType))
            .filter(est => est.distance <= this.radius);

          establishments.push(...typeEstablishments);
        } catch (error) {
          console.warn(`Failed to search for ${establishmentType} near ${locationString}:`, error);
        }
      }

      // Remove duplicates and sort by distance
      const uniqueEstablishments = new Map<string, NearestEstablishment>();
      
      establishments
        .sort((a, b) => a.distance - b.distance)
        .forEach(est => {
          if (!uniqueEstablishments.has(est.id)) {
            uniqueEstablishments.set(est.id, est);
          }
        });

      return Array.from(uniqueEstablishments.values());

    } catch (error) {
      console.error('Search establishments by text error:', error);
      throw new Error('Failed to search establishments by text');
    }
  }
}

// Create singleton instance
let googleMapsService: GoogleMapsService | null = null;

export function createGoogleMapsService(options: GoogleMapsServiceOptions): GoogleMapsService {
  if (
    !googleMapsService ||
    (googleMapsService as any).apiKey !== options.apiKey // workaround for private property
  ) {
    googleMapsService = new GoogleMapsService(options);
  }
  return googleMapsService;
}

export function getGoogleMapsService(): GoogleMapsService {
  if (!googleMapsService) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable is required');
    }
    googleMapsService = new GoogleMapsService({ apiKey });
  }
  return googleMapsService;
}

// Export establishment types for external use
export { ESTABLISHMENT_TYPE_MAPPINGS };