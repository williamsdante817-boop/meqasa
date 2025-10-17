"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateContextKey, useContactState } from "@/hooks/use-contact-state";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { Mail, MessageSquare } from "lucide-react";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { useEffect, useRef, useState, useReducer } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getStoredNumbers, setStoredNumbers } from "@/lib/contact-cache";
import { viewNumber } from "@/lib/contact-api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AlertCard } from "@/components/common/alert-card";
import { useResilientFetch } from "@/hooks/use-resilient-fetch";

interface ContactCardProps {
  name: string;
  image: string;
  src?: boolean;
  listingId?: string;
  projectId?: string;
  pageType?: "listing" | "project";
}

// LocalStorage utility functions
const DEFAULT_REGION: CountryCode = "GH";

type StoredContactInfo = {
  name: string;
  phone: string;
  countryIso?: CountryCode;
};

const getStoredContactInfo = (): StoredContactInfo | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("meqasa_contact_info");
    if (!stored) return null;

    const parsed = JSON.parse(stored) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "name" in parsed &&
      "phone" in parsed
    ) {
      const obj = parsed as Record<string, unknown>;
      const iso = (obj.countryIso as string | undefined)?.toUpperCase();
      return {
        name: obj.name as string,
        phone: obj.phone as string,
        countryIso: (iso as CountryCode | undefined) ?? undefined,
      };
    }
    return null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

const setStoredContactInfo = (
  name: string,
  phone: string,
  countryIso?: CountryCode
): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "meqasa_contact_info",
      JSON.stringify({ name, phone, countryIso: countryIso?.toUpperCase() })
    );
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

const clearStoredContactInfo = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("meqasa_contact_info");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

// Display-friendly international format (E.164 with '+'), fallback to digits with '+'
const toInternationalDisplay = (phone: string, iso?: CountryCode): string => {
  if (!phone || phone.trim() === "") return phone;
  try {
    const parsed = phone.startsWith("+")
      ? parsePhoneNumber(phone)
      : iso
        ? parsePhoneNumber(phone, iso)
        : undefined;
    if (parsed) return parsed.number;
  } catch {
    // ignore
  }
  const digits = phone.replace(/\D/g, "");
  return digits ? `+${digits}` : digits;
};

type ErrorMap = {
  phone?: string;
  name?: string;
};

type LocalState = {
  modalOpen: boolean;
  activeModal: "number" | "whatsapp" | null;
  formSubmitted: boolean;
  showNumberLoading: boolean;
  whatsAppLoading: boolean;
  userName: string;
  userPhone: string;
  userCountryIso?: CountryCode;
  errors: ErrorMap;
};

type Action =
  | { type: "setField"; field: keyof LocalState; value: unknown }
  | { type: "setErrors"; errors: ErrorMap }
  | { type: "resetErrors" };

const initialState: LocalState = {
  modalOpen: false,
  activeModal: null,
  formSubmitted: false,
  showNumberLoading: false,
  whatsAppLoading: false,
  userName: "",
  userPhone: "",
  userCountryIso: undefined,
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

export default function ContactCard({
  name,
  image,
  src,
  listingId,
  projectId,
  pageType = "listing",
}: ContactCardProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailFormSubmitted, setEmailFormSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [emailNameError, setEmailNameError] = useState("");
  const [emailPhoneError, setEmailPhoneError] = useState("");
  const [alertsChecked, setAlertsChecked] = useState(true);
  const [bannerError, setBannerError] = useState("");
  const [emailBannerError, setEmailBannerError] = useState("");
  const [submitInit, setSubmitInit] = useState<RequestInit>(() => ({
    method: "POST",
  }));
  const submitRequestIdRef = useRef(0);
  const [activeSubmitId, setActiveSubmitId] = useState<number | null>(null);
  const { data: submitData, loading: submitLoading, error: submitError, refetch: submitRefetch } =
    useResilientFetch<{ mess?: string }>({
      input: "/api/contact/send-message",
      init: submitInit,
      enabled: false,
    });
  const lastSubmitDataRef = useRef<{ mess?: string } | null>(null);
  const maskedNumber = "+233 xx xxx xxxx";

  // reducer-managed: modalOpen, activeModal, formSubmitted, userName, userPhone,
  // userCountryIso, showNumberLoading, whatsAppLoading, errors

  // Generate context key based on page type and ID
  const entityId = pageType === "listing" ? listingId : projectId;
  const contextKey = generateContextKey(pageType, entityId ?? "");

  // Use shared contact state
  const { phoneNumber, whatsappNumber, showNumber, setPhoneNumbers } =
    useContactState(contextKey);

  // Load saved contact information on component mount
  const hydratedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (hydratedKeyRef.current === contextKey) return;

    const savedInfo = getStoredContactInfo();
    if (savedInfo) {
      dispatch({ type: "setField", field: "userName", value: savedInfo.name });
      dispatch({
        type: "setField",
        field: "userPhone",
        value: savedInfo.phone,
      });
      if (savedInfo.countryIso)
        dispatch({
          type: "setField",
          field: "userCountryIso",
          value: savedInfo.countryIso,
        });
      dispatch({ type: "setField", field: "formSubmitted", value: true });
    }

    if (entityId) {
      const cached = getStoredNumbers(contextKey);
      if (cached?.stph2 && cached?.stph3) {
        setPhoneNumbers(cached.stph2, cached.stph3);
      }
    }

    hydratedKeyRef.current = contextKey;
  }, [contextKey, entityId, setPhoneNumbers]);

  useEffect(() => {
    if (activeSubmitId === null) {
      return;
    }

    const run = async () => {
      await submitRefetch();
    };

    void run();
  }, [activeSubmitId, submitRefetch, submitInit]);

  useEffect(() => {
    if (activeSubmitId === null) {
      return;
    }

    if (submitLoading || !submitData) {
      return;
    }

    if (submitData === lastSubmitDataRef.current) {
      return;
    }

    lastSubmitDataRef.current = submitData;

    if (submitData.mess === "sent") {
      setEmailFormSubmitted(true);
      setEmailBannerError("");
      setMessageError("");
    } else {
      setEmailBannerError("Failed to send message. Please try again.");
      setMessageError("Failed to send message. Please try again.");
    }

    setActiveSubmitId(null);
  }, [
    activeSubmitId,
    submitData,
    submitLoading,
    setEmailFormSubmitted,
    setEmailBannerError,
    setMessageError,
  ]);

  useEffect(() => {
    if (activeSubmitId === null || !submitError) {
      return;
    }

    console.error("Error sending message:", submitError);
    setEmailBannerError("Failed to send message. Please try again.");
    setMessageError("Failed to send message. Please try again.");
    lastSubmitDataRef.current = null;
    setActiveSubmitId(null);
  }, [activeSubmitId, submitError]);

  // Function to handle button clicks for viewing number
  const handleViewNumberClick = () => {
    const savedInfo = getStoredContactInfo();

    if (savedInfo) {
      dispatch({ type: "setField", field: "userName", value: savedInfo.name });
      dispatch({
        type: "setField",
        field: "userPhone",
        value: savedInfo.phone,
      });
      dispatch({ type: "setField", field: "formSubmitted", value: true });
      dispatch({ type: "setField", field: "showNumberLoading", value: true });
      void handleGetNumberWithSavedInfo();
    } else {
      dispatch({ type: "setField", field: "activeModal", value: "number" });
      dispatch({ type: "setField", field: "modalOpen", value: true });
    }
  };

  // Function to handle WhatsApp button clicks
  const handleWhatsAppClick = () => {
    const savedInfo = getStoredContactInfo();

    if (savedInfo) {
      void handleGetNumberForWhatsApp(savedInfo.name, savedInfo.phone);
    } else {
      dispatch({ type: "setField", field: "activeModal", value: "whatsapp" });
      dispatch({ type: "setField", field: "modalOpen", value: true });
    }
  };

  // Function to handle getting number for WhatsApp
  const handleGetNumberForWhatsApp = async (name?: string, phone?: string) => {
    const userNameToUse = name ?? state.userName;
    const userPhoneToUse = phone ?? state.userPhone;

    if (!userNameToUse || !userPhoneToUse || !entityId) {
      console.error("❌ [ContactCard] No contact info or entity ID available");
      return;
    }

    setBannerError("");
    dispatch({ type: "setField", field: "whatsAppLoading", value: true });
    try {
      const res = await viewNumber({
        name: userNameToUse,
        phone: userPhoneToUse,
        entityId,
      });
      const whatsappDigits = res.whatsappNumber.replace(/\D/g, "");
      window.open(`https://wa.me/${whatsappDigits}`, "_blank");
      if (entityId)
        setStoredNumbers(contextKey, res.displayNumber, res.whatsappNumber);
    } catch {
      setBannerError("Failed to get phone number. Please try again.");
      dispatch({
        type: "setErrors",
        errors: {
          ...state.errors,
          phone: "Failed to get phone number. Please try again.",
        },
      });
    } finally {
      dispatch({ type: "setField", field: "whatsAppLoading", value: false });
    }
  };

  // Function to handle getting number with saved contact info
  const handleGetNumberWithSavedInfo = async () => {
    if (!state.userName || !state.userPhone || !entityId) {
      console.error(
        "❌ [ContactCard] No saved contact info or entity ID available"
      );
      return;
    }

    setBannerError("");
    dispatch({ type: "setField", field: "showNumberLoading", value: true });
    try {
      const res = await viewNumber({
        name: state.userName,
        phone: state.userPhone,
        entityId,
      });
      setPhoneNumbers(res.displayNumber, res.whatsappNumber);
      if (entityId)
        setStoredNumbers(contextKey, res.displayNumber, res.whatsappNumber);
    } catch {
      setBannerError("Failed to get phone number. Please try again.");
      dispatch({
        type: "setErrors",
        errors: {
          ...state.errors,
          phone: "Failed to get phone number. Please try again.",
        },
      });
    } finally {
      dispatch({ type: "setField", field: "showNumberLoading", value: false });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let valid = true;
    dispatch({ type: "resetErrors" });

    const defaultRegion = state.userCountryIso ?? DEFAULT_REGION;
    const validPhone = state.userPhone
      ? state.userPhone.startsWith("+")
        ? isValidPhoneNumber(state.userPhone)
        : isValidPhoneNumber(state.userPhone, defaultRegion)
      : false;
    if (!validPhone) {
      dispatch({
        type: "setErrors",
        errors: { ...state.errors, phone: "Valid phone number is required" },
      });
      valid = false;
    }
    if (!state.userName) {
      dispatch({
        type: "setErrors",
        errors: { ...state.errors, name: "Name is required" },
      });
      valid = false;
    }

    if (valid && entityId) {
      if (state.activeModal === "whatsapp") {
        dispatch({ type: "setField", field: "whatsAppLoading", value: true });
      } else {
        dispatch({ type: "setField", field: "showNumberLoading", value: true });
      }
      setBannerError("");
      try {
        const res = await viewNumber({
          name: state.userName,
          phone: state.userPhone,
          entityId,
        });
        // Save contact information to localStorage for future use
        setStoredContactInfo(
          state.userName,
          state.userPhone,
          state.userCountryIso
        );
        if (state.activeModal === "whatsapp") {
          const whatsappDigits = res.whatsappNumber.replace(/\D/g, "");
          window.open(`https://wa.me/${whatsappDigits}`, "_blank");
          dispatch({ type: "setField", field: "activeModal", value: null });
          dispatch({ type: "setField", field: "modalOpen", value: false });
        } else {
          setPhoneNumbers(res.displayNumber, res.whatsappNumber);
          dispatch({ type: "setField", field: "formSubmitted", value: true });
        }
        if (entityId)
          setStoredNumbers(contextKey, res.displayNumber, res.whatsappNumber);
      } catch {
        setBannerError("Failed to get phone number. Please try again.");
        dispatch({
          type: "setErrors",
          errors: {
            ...state.errors,
            phone: "Failed to get phone number. Please try again.",
          },
        });
      } finally {
        if (state.activeModal === "whatsapp") {
          dispatch({
            type: "setField",
            field: "whatsAppLoading",
            value: false,
          });
        } else {
          dispatch({
            type: "setField",
            field: "showNumberLoading",
            value: false,
          });
        }
      }
    }
  };

  const handleEmailFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;
    setEmailError("");
    setEmailNameError("");
    setEmailPhoneError("");
    setMessageError("");
    if (!userEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userEmail)) {
      setEmailError("Valid email is required");
      valid = false;
    }
    const emailPhoneValid = state.userPhone
      ? state.userPhone.startsWith("+")
        ? isValidPhoneNumber(state.userPhone)
        : isValidPhoneNumber(state.userPhone, state.userCountryIso)
      : false;
    if (!emailPhoneValid) {
      setEmailPhoneError("Valid phone number is required");
      valid = false;
    }
    if (!state.userName) {
      setEmailNameError("Name is required");
      valid = false;
    }
    if (!userMessage) {
      setMessageError("Message is required");
      valid = false;
    }
    if (valid && entityId) {
      if (submitLoading || activeSubmitId !== null) {
        return;
      }

      const formData = new FormData();
      formData.append("rfifrom", userEmail);
      formData.append("rfimessage", userMessage);
      formData.append("rfifromph", state.userPhone);
      formData.append("nurfiname", state.userName);
      formData.append("rfilid", entityId);
      formData.append("rfisrc", "3");
      formData.append("reqid", "-1");
      formData.append("app", "vercel");

      setEmailFormSubmitted(false);
      setEmailBannerError("");

      setSubmitInit({
        method: "POST",
        body: formData,
      });
      lastSubmitDataRef.current = null;
      submitRequestIdRef.current += 1;
      setActiveSubmitId(submitRequestIdRef.current);
    }
  };

  return (
    <>
      <Card className="sticky top-36 mx-auto max-w-md rounded-lg border-gray-200 py-6">
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border border-gray-200">
              <ImageWithFallback
                src={
                  image
                    ? src
                      ? `https://meqasa.com/uploads/imgs/${image}`
                      : `https://dve7rykno93gs.cloudfront.net${image}`
                    : "/placeholder-image.png"
                }
                alt={name}
                width={80}
                height={80}
                className="h-full w-full object-contain"
                fallbackAlt={name}
              />
            </div>

            <h2 className="text-brand-accent mb-2 text-center text-xl font-bold">
              {name}
            </h2>

            <div className="mb-6 flex items-center gap-2">
              {showNumber ? (
                <span className="text-brand-blue">
                  {phoneNumber
                    ? toInternationalDisplay(phoneNumber, state.userCountryIso)
                    : ""}
                </span>
              ) : state.formSubmitted && state.showNumberLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
                </div>
              ) : state.formSubmitted ? (
                // User has saved contact info, show button without modal
                <Button
                  variant="outline"
                  size="sm"
                  className="text-brand-blue border-brand-blue hover:text-brand-blue h-7 text-sm hover:bg-blue-50"
                  onClick={handleViewNumberClick}
                  disabled={state.showNumberLoading}
                >
                  {state.showNumberLoading ? "Loading..." : "Show Number"}
                </Button>
              ) : (
                // User needs to enter contact info, show modal
                <>
                  <span className="text-brand-blue">{maskedNumber}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-brand-blue border-brand-blue hover:text-brand-blue h-7 text-sm hover:bg-blue-50"
                    onClick={() => {
                      dispatch({
                        type: "setField",
                        field: "activeModal",
                        value: "number",
                      });
                      dispatch({
                        type: "setField",
                        field: "modalOpen",
                        value: true,
                      });
                    }}
                  >
                    Show Number
                  </Button>
                </>
              )}
            </div>

            <div className="flex w-full max-w-md gap-4 px-4">
              {state.formSubmitted ? (
                // User has saved contact info, show button without modal
                <Button
                  className="bg-brand-badge-completed h-12 flex-1 gap-2 text-white hover:bg-green-700"
                  onClick={handleWhatsAppClick}
                  disabled={state.whatsAppLoading}
                >
                  <MessageSquare className="h-5 w-5" />
                  {state.whatsAppLoading ? "Opening..." : "WhatsApp"}
                </Button>
              ) : (
                // User needs to enter contact info, show modal
                <Dialog
                  open={state.modalOpen}
                  onOpenChange={(open) =>
                    dispatch({
                      type: "setField",
                      field: "modalOpen",
                      value: open,
                    })
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      className="bg-brand-badge-completed h-12 flex-1 gap-2 text-white hover:bg-green-700"
                      onClick={() => {
                        dispatch({
                          type: "setField",
                          field: "activeModal",
                          value: "whatsapp",
                        });
                        dispatch({
                          type: "setField",
                          field: "modalOpen",
                          value: true,
                        });
                      }}
                    >
                      <MessageSquare className="h-5 w-5" />
                      WhatsApp
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Get Number</DialogTitle>
                      <DialogDescription>
                        To view number, first enter your contact info (Do this
                        once only). If you are unable to reach the owner/broker,
                        then they can reach you.
                      </DialogDescription>
                    </DialogHeader>
                    {bannerError && (
                      <AlertCard
                        title="Could not fetch number"
                        description={bannerError}
                        className="mb-2"
                      />
                    )}

                    {!state.formSubmitted ? (
                      <form
                        onSubmit={handleFormSubmit}
                        className="mt-2 space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">
                            Your Phone Number
                          </Label>
                          <PhoneInput
                            country={"gh"}
                            value={state.userPhone}
                            onChange={(phone: string, country: unknown) => {
                              dispatch({
                                type: "setField",
                                field: "userPhone",
                                value: phone,
                              });
                              let iso: CountryCode | undefined;
                              if (
                                country &&
                                typeof country === "object" &&
                                "countryCode" in country
                              ) {
                                const cc = (country as { countryCode?: string })
                                  .countryCode;
                                if (cc) iso = cc.toUpperCase() as CountryCode;
                              }
                              dispatch({
                                type: "setField",
                                field: "userCountryIso",
                                value: iso,
                              });
                              // Live validate phone number
                              const region = iso ?? DEFAULT_REGION;
                              const possible = phone
                                ? phone.startsWith("+")
                                  ? isValidPhoneNumber(phone)
                                  : isValidPhoneNumber(phone, region)
                                : false;
                              dispatch({
                                type: "setErrors",
                                errors: {
                                  ...state.errors,
                                  phone: possible
                                    ? undefined
                                    : "Valid phone number is required",
                                },
                              });
                            }}
                            containerStyle={{ width: "100%" }}
                            inputStyle={{ width: "100%" }}
                            inputClass={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${state.errors.phone ? "aria-[invalid]:ring-destructive/20 aria-[invalid]:border-destructive" : ""}`}
                            inputProps={{
                              id: "contact-phone",
                              name: "phone",
                              required: true,
                              autoFocus: true,
                              "aria-invalid": Boolean(state.errors.phone),
                            }}
                          />
                          {state.errors.phone && (
                            <p className="text-xs text-red-500">
                              {state.errors.phone}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Your Name</Label>
                          <Input
                            id="contact-name"
                            type="text"
                            name="name"
                            required
                            placeholder="Your Name"
                            value={state.userName}
                            aria-invalid={Boolean(state.errors.name)}
                            onChange={(e) =>
                              dispatch({
                                type: "setField",
                                field: "userName",
                                value: e.target.value,
                              })
                            }
                          />
                          {state.errors.name && (
                            <p className="text-xs text-red-500">
                              {state.errors.name}
                            </p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="mt-2 h-12 w-full bg-[#232335] text-lg font-bold text-white"
                          disabled={
                            state.activeModal === "whatsapp"
                              ? state.whatsAppLoading
                              : state.showNumberLoading
                          }
                        >
                          {state.activeModal === "whatsapp"
                            ? state.whatsAppLoading
                              ? "Opening..."
                              : "Get Number"
                            : state.showNumberLoading
                              ? "Getting Number..."
                              : "Get Number"}
                        </Button>
                      </form>
                    ) : !showNumber ? (
                      <div className="py-6 text-center">
                        <div className="mb-2 text-lg font-semibold">
                          Contact Info Saved
                        </div>
                        <div className="mb-4 text-sm text-gray-600">
                          We&apos;ll use your saved contact info:{" "}
                          {state.userName} ({state.userPhone})
                        </div>
                        <Button
                          onClick={handleGetNumberWithSavedInfo}
                          className="h-12 w-full bg-[#232335] text-lg font-bold text-white"
                          disabled={state.showNumberLoading}
                        >
                          {state.showNumberLoading
                            ? "Getting Number..."
                            : "Get Number"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            clearStoredContactInfo();
                            dispatch({
                              type: "setField",
                              field: "formSubmitted",
                              value: false,
                            });
                            dispatch({
                              type: "setField",
                              field: "userName",
                              value: "",
                            });
                            dispatch({
                              type: "setField",
                              field: "userPhone",
                              value: "",
                            });
                          }}
                          className="mt-2 w-full text-sm"
                        >
                          Use Different Info
                        </Button>
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <div className="mb-2 text-lg font-semibold">
                          {phoneNumber
                            ? toInternationalDisplay(
                                phoneNumber,
                                state.userCountryIso
                              )
                            : ""}
                        </div>
                        {whatsappNumber && (
                          <div className="text-brand-muted mb-2 text-sm">
                            WhatsApp:{" "}
                            {toInternationalDisplay(
                              whatsappNumber,
                              state.userCountryIso
                            )}
                          </div>
                        )}
                        <div className="text-green-600">
                          You can now contact the owner/broker.
                        </div>
                        <DialogClose asChild>
                          <Button className="mt-4 w-full">Close</Button>
                        </DialogClose>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}

              <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-brand-blue h-12 flex-1 gap-2 text-white hover:bg-blue-700"
                    onClick={() => setEmailModalOpen(true)}
                  >
                    <Mail className="h-5 w-5" />
                    Enquire now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Agent</DialogTitle>
                    <DialogDescription>
                      Send a message to the property agent. They will get back
                      to you soon.
                    </DialogDescription>
                  </DialogHeader>
                  {emailBannerError && (
                    <AlertCard
                      title="Could not send message"
                      description={emailBannerError}
                      className="mb-2"
                    />
                  )}
                  {!emailFormSubmitted ? (
                    <form
                      onSubmit={handleEmailFormSubmit}
                      className="mt-2 space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="email">Your Email Address*</Label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          required
                          placeholder="Your email address"
                          value={userEmail}
                          aria-invalid={Boolean(emailError)}
                          onChange={(e) => setUserEmail(e.target.value)}
                        />
                        {emailError && (
                          <p className="text-xs text-red-500">{emailError}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-phone">Your Phone Number</Label>
                        <PhoneInput
                          country={"gh"}
                          value={state.userPhone}
                          onChange={(phone: string, country: unknown) => {
                            dispatch({
                              type: "setField",
                              field: "userPhone",
                              value: phone,
                            });
                            let iso: CountryCode | undefined;
                            if (
                              country &&
                              typeof country === "object" &&
                              "countryCode" in country
                            ) {
                              const cc = (country as { countryCode?: string })
                                .countryCode;
                              if (cc) iso = cc.toUpperCase() as CountryCode;
                            }
                            dispatch({
                              type: "setField",
                              field: "userCountryIso",
                              value: iso,
                            });
                            // Live validate phone for email form
                            const region = iso ?? DEFAULT_REGION;
                            const possible = phone
                              ? phone.startsWith("+")
                                ? isValidPhoneNumber(phone)
                                : isValidPhoneNumber(phone, region)
                              : false;
                            setEmailPhoneError(
                              possible ? "" : "Valid phone number is required"
                            );
                          }}
                          containerStyle={{ width: "100%" }}
                          inputStyle={{ width: "100%" }}
                          inputClass={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${emailPhoneError ? "aria-[invalid]:ring-destructive/20 aria-[invalid]:border-destructive" : ""}`}
                          inputProps={{
                            id: "email-phone",
                            name: "phone",
                            required: true,
                            "aria-invalid": Boolean(emailPhoneError),
                          }}
                        />
                        {emailPhoneError && (
                          <p className="text-xs text-red-500">
                            {emailPhoneError}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-name">Your Name</Label>
                        <Input
                          id="email-name"
                          type="text"
                          name="name"
                          required
                          placeholder="Your Name"
                          value={state.userName}
                          aria-invalid={Boolean(emailNameError)}
                          onChange={(e) =>
                            dispatch({
                              type: "setField",
                              field: "userName",
                              value: e.target.value,
                            })
                          }
                        />
                        {emailNameError && (
                          <p className="text-xs text-red-500">
                            {emailNameError}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-message">Your Message</Label>
                        <Textarea
                          id="email-message"
                          name="message"
                          required
                          placeholder="Your Message"
                          value={userMessage}
                          aria-invalid={Boolean(messageError)}
                          onChange={(e) => setUserMessage(e.target.value)}
                          rows={3}
                        />
                        {messageError && (
                          <p className="text-xs text-red-500">{messageError}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="alertsCheckbox"
                          checked={alertsChecked}
                          onCheckedChange={(checked) =>
                            setAlertsChecked(Boolean(checked))
                          }
                        />
                        <Label
                          htmlFor="alertsCheckbox"
                          className="text-sm font-normal"
                        >
                          Send me alerts for offices for rent in East legon up
                          to $1,800/month
                        </Label>
                      </div>
                      <Button
                        type="submit"
                        className="mt-2 h-12 w-full bg-[#232335] text-lg font-bold text-white"
                        disabled={submitLoading}
                      >
                        {submitLoading ? "Sending..." : "Send"}
                      </Button>
                    </form>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="mb-2 text-lg font-semibold text-green-700">
                        Your enquiry has been sent!
                      </div>
                      <div className="text-brand-muted">
                        The agent will contact you soon.
                      </div>
                      <DialogClose asChild>
                        <Button className="mt-4 w-full">Close</Button>
                      </DialogClose>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <p className="text-brand-muted mt-4 max-w-md px-4 text-sm">
              NB: First submit your contact info once. If you are unable to
              reach the developer, then they can reach you.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
