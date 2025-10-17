"use client";

import { useCallback } from "react";
import { useResilientFetch } from "@/hooks/use-resilient-fetch";

interface ContactMessageResponse {
  mess?: string;
}

interface UseContactMessageResult {
  sendMessage: (formData: FormData) => Promise<ContactMessageResponse | null>;
  loading: boolean;
  error: Error | null;
}

export function useContactMessage(): UseContactMessageResult {
  const { loading, error, refetch } = useResilientFetch<ContactMessageResponse>({
    input: "/api/contact/send-message",
    enabled: false,
  });

  const sendMessage = useCallback(
    async (formData: FormData) => {
      return await refetch({
        init: {
          method: "POST",
          body: formData,
        },
      });
    },
    [refetch]
  );

  return {
    sendMessage,
    loading,
    error,
  };
}
