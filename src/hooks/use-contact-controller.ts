"use client";

import { useRef, useEffect, useReducer, useCallback } from "react";
import { useContactState } from "@/hooks/use-contact-state";
import { getStoredNumbers, setStoredNumbers } from "@/lib/contact-cache";
import { viewNumber, sendMessage } from "@/lib/contact-api";

export interface ContactControllerOptions {
  contextKey: string;
  entityId: string | undefined;
}

export function useContactController({
  contextKey,
  entityId,
}: ContactControllerOptions) {
  const { phoneNumber, whatsappNumber, showNumber, setPhoneNumbers } =
    useContactState(contextKey);

  type ErrorMap = {
    phone?: string;
    name?: string;
    email?: string;
    message?: string;
  };

  type LocalState = {
    modalOpen: boolean;
    isWhatsAppModal: boolean;
    formSubmitted: boolean;
    showNumberLoading: boolean;
    whatsAppLoading: boolean;
    userName: string;
    userPhone: string;
    userEmail: string;
    userMessage: string;
    errors: ErrorMap;
  };

  type Action =
    | { type: "setField"; field: keyof LocalState; value: unknown }
    | { type: "setErrors"; errors: ErrorMap }
    | { type: "resetErrors" };

  const initialState: LocalState = {
    modalOpen: false,
    isWhatsAppModal: false,
    formSubmitted: false,
    showNumberLoading: false,
    whatsAppLoading: false,
    userName: "",
    userPhone: "",
    userEmail: "",
    userMessage: "",
    errors: {},
  };

  function reducer(state: LocalState, action: Action): LocalState {
    switch (action.type) {
      case "setField":
        return { ...state, [action.field]: action.value } as LocalState;
      case "setErrors":
        return { ...state, errors: action.errors };
      case "resetErrors":
        return { ...state, errors: {} };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  // Avoid repeat hydration
  const hydratedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!entityId || hydratedRef.current === contextKey) return;
    const cached = getStoredNumbers(contextKey);
    if (cached?.stph2 && cached?.stph3) {
      setPhoneNumbers(cached.stph2, cached.stph3);
      dispatch({ type: "setField", field: "formSubmitted", value: true });
    }
    hydratedRef.current = contextKey;
  }, [contextKey, entityId, setPhoneNumbers]);

  const isValidPhoneBasic = (raw: string): boolean =>
    raw.replace(/\D/g, "").length >= 6;

  const validateBasic = useCallback((): boolean => {
    const next: ErrorMap = {};
    if (!isValidPhoneBasic(state.userPhone))
      next.phone = "Valid phone number is required";
    if (!state.userName.trim()) next.name = "Name is required";
    dispatch({ type: "setErrors", errors: next });
    return Object.keys(next).length === 0;
  }, [state.userName, state.userPhone]);

  const submitInfo = useCallback(async () => {
    if (!entityId) return;
    if (!validateBasic()) return;

    if (state.isWhatsAppModal)
      dispatch({ type: "setField", field: "whatsAppLoading", value: true });
    else
      dispatch({ type: "setField", field: "showNumberLoading", value: true });
    try {
      const res = await viewNumber({
        name: state.userName,
        phone: state.userPhone,
        entityId,
      });
      if (state.isWhatsAppModal) {
        const whatsappDigits = res.whatsappNumber.replace(/\D/g, "");
        window.open(`https://wa.me/${whatsappDigits}`, "_blank");
        dispatch({ type: "setField", field: "isWhatsAppModal", value: false });
        dispatch({ type: "setField", field: "modalOpen", value: false });
      } else {
        setPhoneNumbers(res.displayNumber, res.whatsappNumber);
        dispatch({ type: "setField", field: "formSubmitted", value: true });
      }
      setStoredNumbers(contextKey, res.displayNumber, res.whatsappNumber);
    } finally {
      if (state.isWhatsAppModal)
        dispatch({
          type: "setField",
          field: "whatsAppLoading",
          value: false,
        });
      else
        dispatch({
          type: "setField",
          field: "showNumberLoading",
          value: false,
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contextKey,
    entityId,
    setPhoneNumbers,
    state.isWhatsAppModal,
    state.userName,
    state.userPhone,
  ]);

  const viewSavedNumber = useCallback(async () => {
    if (!entityId) return;
    const cached = getStoredNumbers(contextKey);
    if (cached?.stph2 && cached?.stph3) {
      setPhoneNumbers(cached.stph2, cached.stph3);
      dispatch({ type: "setField", field: "formSubmitted", value: true });
      return;
    }
    // fallback: fetch with saved info assumed in form state
    dispatch({ type: "setField", field: "showNumberLoading", value: true });
    try {
      const res = await viewNumber({
        name: state.userName,
        phone: state.userPhone,
        entityId,
      });
      setPhoneNumbers(res.displayNumber, res.whatsappNumber);
      setStoredNumbers(contextKey, res.displayNumber, res.whatsappNumber);
    } finally {
      dispatch({ type: "setField", field: "showNumberLoading", value: false });
    }
  }, [contextKey, entityId, setPhoneNumbers, state.userName, state.userPhone]);

  const openWhatsApp = useCallback(async () => {
    if (!entityId) return;
    const cached = getStoredNumbers(contextKey);
    if (cached?.stph3) {
      const whatsappDigits = cached.stph3.replace(/\D/g, "");
      window.open(`https://wa.me/${whatsappDigits}`, "_blank");
      return;
    }
    // no cache: require contact info
    dispatch({ type: "setField", field: "isWhatsAppModal", value: true });
    dispatch({ type: "setField", field: "modalOpen", value: true });
  }, [contextKey, entityId]);

  const submitEmail = useCallback(async () => {
    if (!entityId) return;
    const next: ErrorMap = {};
    if (!state.userEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.userEmail))
      next.email = "Valid email is required";
    if (!isValidPhoneBasic(state.userPhone))
      next.phone = "Valid phone number is required";
    if (!state.userName.trim()) next.name = "Name is required";
    if (!state.userMessage.trim()) next.message = "Message is required";
    dispatch({ type: "setErrors", errors: next });
    if (Object.keys(next).length > 0) return;

    await sendMessage({
      email: state.userEmail,
      message: state.userMessage,
      name: state.userName,
      phone: state.userPhone,
      entityId,
    });
  }, [
    entityId,
    state.userEmail,
    state.userMessage,
    state.userName,
    state.userPhone,
  ]);

  return {
    // shared numbers
    phoneNumber,
    whatsappNumber,
    showNumber,
    // grouped local state
    state,
    // actions
    submitInfo,
    viewSavedNumber,
    openWhatsApp,
    submitEmail,
  } as const;
}
