import { useState, useEffect } from "react";

interface ContactState {
  phoneNumber: string;
  whatsappNumber: string;
  showNumber: boolean;
  isLoading: boolean;
  contextKey: string | null; // Changed from listingId to contextKey
}

// Global state to share between components
let globalContactState: ContactState = {
  phoneNumber: "",
  whatsappNumber: "",
  showNumber: false,
  isLoading: false,
  contextKey: null,
};

// Listeners for state changes
const listeners = new Set<(state: ContactState) => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener(globalContactState));
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
  const [state, setState] = useState<ContactState>(globalContactState);

  useEffect(() => {
    const listener = (newState: ContactState) => {
      setState(newState);
    };

    listeners.add(listener);

    // Reset state if contextKey has changed (different page or different listing/project)
    if (globalContactState.contextKey !== contextKey) {
      console.log("🔄 [useContactState] Context changed, resetting state:", {
        oldContextKey: globalContactState.contextKey,
        newContextKey: contextKey,
      });

      // Reset global state for new context
      globalContactState = {
        phoneNumber: "",
        whatsappNumber: "",
        showNumber: false,
        isLoading: false,
        contextKey: contextKey,
      };

      // Update local state
      setState(globalContactState);

      // Notify all listeners of the reset
      notifyListeners();
    } else if (globalContactState.contextKey === contextKey) {
      // Initialize with current global state if it matches the context
      setState(globalContactState);
    }

    return () => {
      listeners.delete(listener);
    };
  }, [contextKey]);

  const updateContactState = (updates: Partial<ContactState>) => {
    const newState = { ...globalContactState, ...updates, contextKey };
    console.log("🔄 [useContactState] Updating state:", {
      oldState: globalContactState,
      updates,
      newState,
    });
    globalContactState = newState;
    notifyListeners();
  };

  const setPhoneNumbers = (phone: string, whatsapp: string) => {
    console.log("🔄 [useContactState] Setting phone numbers:", {
      phone,
      whatsapp,
      contextKey,
      currentGlobalContextKey: globalContactState.contextKey,
    });
    updateContactState({
      phoneNumber: phone,
      whatsappNumber: whatsapp,
      showNumber: true,
      isLoading: false,
    });
  };

  const setLoading = (loading: boolean) => {
    console.log("🔄 [useContactState] Setting loading:", {
      loading,
      contextKey,
    });
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
