"use client";

import { useState, useEffect, useCallback } from "react";
import type { LocationState, Coordinates } from "@/types/location";
import { locationData } from "@/data/locationData";

const initialState: LocationState = {
  data: null,
  loading: true,
  error: null,
  userLocation: null,
};

export const useLocations = () => {
  const [state, setState] = useState<LocationState>(initialState);

  const getUserLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: {
          code: "GEOLOCATION_NOT_SUPPORTED",
          message: "Geolocation is not supported by your browser",
        },
      }));
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        }
      );

      const userLocation: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setState((prev) => ({
        ...prev,
        userLocation,
      }));
    } catch (error) {
      const geolocationError = error as GeolocationPositionError;
      setState((prev) => ({
        ...prev,
        error: {
          code: geolocationError.code.toString(),
          message: geolocationError.message,
        },
      }));
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setState((prev) => ({
        ...prev,
        data: locationData,
        loading: false,
      }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: {
          code: "FETCH_ERROR",
          message: "Failed to fetch locations",
        },
      }));
    }
  }, []);

  useEffect(() => {
    void fetchLocations();
    void getUserLocation();
  }, [fetchLocations, getUserLocation]);

  const refreshLocations = useCallback(() => {
    void fetchLocations();
  }, [fetchLocations]);

  const refreshUserLocation = useCallback(() => {
    void getUserLocation();
  }, [getUserLocation]);

  return {
    ...state,
    refreshLocations,
    refreshUserLocation,
  };
};
