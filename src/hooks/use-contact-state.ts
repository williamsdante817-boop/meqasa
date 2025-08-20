"use client";

import { useState, useEffect } from "react";

interface ContactState {
  phoneNumber: string;
  whatsappNumber: string;
  showNumber: boolean;
  isLoading: boolean;
  contextKey: string;
}

// Per-context global state map so multiple contexts can coexist
const contactStateByContext: Record<string, ContactState> = {};

// Listeners for any state change
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const getOrCreateState = (contextKey: string): ContactState => {
  const existing = contactStateByContext[contextKey];
  if (existing) return existing;
  const initial: ContactState = {
    phoneNumber: "",
    whatsappNumber: "",
    showNumber: false,
    isLoading: false,
    contextKey,
  };
  contactStateByContext[contextKey] = initial;
  return initial;
};

/**
 * Helper function to generate context-aware keys for different page types
 * This ensures that listings and projects have separate states
 */
export const generateContextKey = (
  pageType: "listing" | "project",
  id: string,
): string => {
  return `${pageType}:${id}`;
};

/**
 * Shared contact state hook for managing phone numbers across ContactCard and ContactSection components.
 *
 * Key Features:
 * - Context-aware state: Each page type (listing/project) has its own independent state
 * - Auto-reset on navigation: State resets when user navigates to a different page
 * - Real-time sync: Both components update simultaneously when one fetches a number
 * - Persistent user info: User contact details are saved in localStorage for convenience
 *
 * This ensures that:
 * 1. Each agent/developer gets the user's contact info when they view their number
 * 2. Users must provide contact info for each new page they view
 * 3. Both contact components stay in sync on the same page
 * 4. Different page types (listings vs projects) have separate states
 */
export const useContactState = (contextKey: string) => {
  const [state, setState] = useState<ContactState>(() =>
    getOrCreateState(contextKey),
  );

  useEffect(() => {
    // Ensure this context has an initialized state
    getOrCreateState(contextKey);

    const listener = () => {
      // Update only from this context's state
      setState(getOrCreateState(contextKey));
    };

    listeners.add(listener);
    // Initialize local state
    setState(getOrCreateState(contextKey));

    return () => {
      listeners.delete(listener);
    };
  }, [contextKey]);

  const updateContactState = (updates: Partial<ContactState>) => {
    const prev = getOrCreateState(contextKey);
    const newState: ContactState = { ...prev, ...updates, contextKey };
    if (process.env.NODE_ENV !== "production") {
      console.log("🔄 [useContactState] Updating state:", {
        contextKey,
        oldState: prev,
        updates,
        newState,
      });
    }
    contactStateByContext[contextKey] = newState;
    notifyListeners();
  };

  const setPhoneNumbers = (phone: string, whatsapp: string) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("🔄 [useContactState] Setting phone numbers:", {
        phone,
        whatsapp,
        contextKey,
      });
    }
    updateContactState({
      phoneNumber: phone,
      whatsappNumber: whatsapp,
      showNumber: true,
      isLoading: false,
    });
  };

  const setLoading = (loading: boolean) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("🔄 [useContactState] Setting loading:", {
        loading,
        contextKey,
      });
    }
    updateContactState({ isLoading: loading });
  };

  const resetState = () => {
    updateContactState({
      phoneNumber: "",
      whatsappNumber: "",
      showNumber: false,
      isLoading: false,
    });
  };

  return {
    ...state,
    setPhoneNumbers,
    setLoading,
    resetState,
    updateContactState,
  };
};
