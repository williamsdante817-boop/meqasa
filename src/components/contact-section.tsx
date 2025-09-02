"use client";

import { Button } from "@/components/ui/button";
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
import { Mail, MessageSquare, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useReducer } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getStoredNumbers, setStoredNumbers } from "@/lib/contact-cache";
import { viewNumber } from "@/lib/contact-api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface ContactSectionProps {
  name: string;
  image: string;
  src?: boolean;
  listingId?: string;
  projectId?: string;
  pageType?: "listing" | "project";
}

// LocalStorage utility functions
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
  countryIso?: CountryCode,
): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "meqasa_contact_info",
      JSON.stringify({ name, phone, countryIso: countryIso?.toUpperCase() }),
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

// (kept for reference if needed later) formatInternational wrapper was removed in favor of toInternationalDigits

// Convert to international for display (E.164 with '+') or fallback to digits
const toInternationalDisplay = (phone: string, iso?: CountryCode): string => {
  if (!phone || phone.trim() === "") return phone;
  try {
    const parsed = phone.startsWith("+")
      ? parsePhoneNumber(phone)
      : iso
        ? parsePhoneNumber(phone, iso)
        : undefined;
    if (parsed) return parsed.number; // includes leading '+'
  } catch {
    // fall through to digits-only
  }
  const digits = phone.replace(/\D/g, "");
  return digits ? `+${digits}` : digits;
};

//

export default function ContactSection({
  name,
  image,
  src,
  listingId,
  projectId,
  pageType = "listing",
}: ContactSectionProps) {
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
  const [emailLoading, setEmailLoading] = useState(false);
  const maskedNumber = "+233 xx xxx xxxx";
  const [imageError, setImageError] = useState(false);

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
      console.error(
        "❌ [ContactSection] No contact info or entity ID available",
      );
      return;
    }

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
        "❌ [ContactSection] No saved contact info or entity ID available",
      );
      return;
    }

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

    const validPhone = state.userPhone
      ? state.userPhone.startsWith("+")
        ? isValidPhoneNumber(state.userPhone)
        : isValidPhoneNumber(state.userPhone, state.userCountryIso)
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
      try {
        const res = await viewNumber({
          name: state.userName,
          phone: state.userPhone,
          entityId,
        });
        setStoredContactInfo(
          state.userName,
          state.userPhone,
          state.userCountryIso,
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
      setEmailLoading(true);
      try {
        const formData = new FormData();
        formData.append("rfifrom", userEmail);
        formData.append("rfimessage", userMessage);
        formData.append("rfifromph", state.userPhone);
        formData.append("nurfiname", state.userName);
        formData.append("rfilid", entityId);
        formData.append("rfisrc", "3");
        formData.append("reqid", "-1");
        formData.append("app", "vercel");

        const response = await fetch("/api/contact/send-message", {
          method: "POST",
          body: formData,
        });

        const data = (await response.json()) as { mess?: string };

        if (data.mess === "sent") {
          setEmailFormSubmitted(true);
        } else {
          setMessageError("Failed to send message. Please try again.");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessageError("Failed to send message. Please try again.");
      } finally {
        setEmailLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-50 border-t border-b border-gray-200 py-16 flex flex-col items-center mt-10">
      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 mb-4">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        ) : (
          <Image
            src={
              src
                ? `https://meqasa.com/uploads/imgs/${image}`
                : `https://dve7rykno93gs.cloudfront.net${image}`
            }
            alt={name}
            width={80}
            height={80}
            className="object-contain w-full h-full"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <h2 className="text-center text-xl font-bold text-brand-accent mb-2">
        {name}
      </h2>

      <div className="flex items-center gap-2 mb-6">
        {showNumber ? (
          <span className="text-brand-blue">
            {phoneNumber
              ? toInternationalDisplay(phoneNumber, state.userCountryIso)
              : ""}
          </span>
        ) : state.formSubmitted && state.showNumberLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : state.formSubmitted ? (
          // User has saved contact info, show button without modal
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-sm text-brand-blue border-brand-blue hover:text-brand-blue hover:bg-blue-50"
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
              className="h-7 text-sm text-brand-blue border-brand-blue hover:text-brand-blue hover:bg-blue-50"
              onClick={() => {
                dispatch({
                  type: "setField",
                  field: "activeModal",
                  value: "number",
                });
                dispatch({ type: "setField", field: "modalOpen", value: true });
              }}
            >
              Show Number
            </Button>
          </>
        )}
      </div>

      <div className="flex gap-4 w-full max-w-md px-4">
        {state.formSubmitted ? (
          // User has saved contact info, show button without modal
          <Button
            className="flex-1 bg-brand-badge-completed hover:bg-green-700 text-white h-12 gap-2"
            onClick={handleWhatsAppClick}
            disabled={state.whatsAppLoading}
          >
            <MessageSquare className="w-5 h-5" />
            {state.whatsAppLoading ? "Opening..." : "WhatsApp"}
          </Button>
        ) : (
          // User needs to enter contact info, show modal
          <Dialog
            open={state.modalOpen}
            onOpenChange={(open) =>
              dispatch({ type: "setField", field: "modalOpen", value: open })
            }
          >
            <DialogTrigger asChild>
              <Button
                className="flex-1 bg-brand-badge-completed hover:bg-green-700 text-white h-12 gap-2"
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
                <MessageSquare className="w-5 h-5" />
                WhatsApp
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Get Number</DialogTitle>
                <DialogDescription>
                  To view number, first enter your contact info (Do this once
                  only). If you are unable to reach the owner/broker, then they
                  can reach you.
                </DialogDescription>
              </DialogHeader>
              {!state.formSubmitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="cs-phone-1">Your Phone Number</Label>
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
                        const possible = phone
                          ? phone.startsWith("+")
                            ? isValidPhoneNumber(phone)
                            : isValidPhoneNumber(phone, iso)
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
                        id: "cs-phone-1",
                        name: "phone",
                        required: true,
                        autoFocus: true,
                        "aria-invalid": Boolean(state.errors.phone),
                      }}
                    />
                    {state.errors.phone && (
                      <p className="text-red-500 text-xs">
                        {state.errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cs-name-1">Your Name</Label>
                    <Input
                      id="cs-name-1"
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
                      <p className="text-red-500 text-xs">
                        {state.errors.name}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#232335] text-white h-12 text-lg font-bold mt-2"
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
                <div className="text-center py-6">
                  <div className="text-lg font-semibold mb-2">
                    Contact Info Saved
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    We&apos;ll use your saved contact info: {state.userName} (
                    {state.userPhone})
                  </div>
                  <Button
                    onClick={handleGetNumberWithSavedInfo}
                    className="w-full bg-[#232335] text-white h-12 text-lg font-bold"
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
                    className="w-full mt-2 text-sm"
                  >
                    Use Different Info
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-lg font-semibold mb-2">
                    {phoneNumber
                      ? toInternationalDisplay(
                          phoneNumber,
                          state.userCountryIso,
                        )
                      : ""}
                  </div>
                  {whatsappNumber && (
                    <div className="text-sm text-brand-muted mb-2">
                      WhatsApp:{" "}
                      {toInternationalDisplay(
                        whatsappNumber,
                        state.userCountryIso,
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
              className="flex-1 bg-brand-blue hover:bg-blue-700 text-white h-12 gap-2"
              onClick={() => setEmailModalOpen(true)}
            >
              <Mail className="w-5 h-5" />
              Enquire now
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Agent</DialogTitle>
              <DialogDescription>
                Send a message to the property agent. They will get back to you
                soon.
              </DialogDescription>
            </DialogHeader>
            {!emailFormSubmitted ? (
              <form onSubmit={handleEmailFormSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="cs-email">Your Email Address*</Label>
                  <Input
                    id="cs-email"
                    type="email"
                    name="email"
                    required
                    placeholder="Your email address"
                    value={userEmail}
                    aria-invalid={Boolean(emailError)}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs">{emailError}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cs-phone-2">Your Phone Number</Label>
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
                      const possible = phone
                        ? phone.startsWith("+")
                          ? isValidPhoneNumber(phone)
                          : isValidPhoneNumber(phone, iso)
                        : false;
                      if (!possible) {
                        // set local email phone error helper text
                        setEmailPhoneError("Valid phone number is required");
                      } else {
                        setEmailPhoneError("");
                      }
                    }}
                    containerStyle={{ width: "100%" }}
                    inputStyle={{ width: "100%" }}
                    inputClass={`file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${emailPhoneError ? "aria-[invalid]:ring-destructive/20 aria-[invalid]:border-destructive" : ""}`}
                    inputProps={{
                      id: "cs-phone-2",
                      name: "phone",
                      required: true,
                      "aria-invalid": Boolean(emailPhoneError),
                    }}
                  />
                  {emailPhoneError && (
                    <p className="text-red-500 text-xs">{emailPhoneError}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cs-name-2">Your Name</Label>
                  <Input
                    id="cs-name-2"
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
                    <p className="text-red-500 text-xs">{emailNameError}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cs-message">Your Message</Label>
                  <Textarea
                    id="cs-message"
                    name="message"
                    required
                    placeholder="Your Message"
                    value={userMessage}
                    aria-invalid={Boolean(messageError)}
                    onChange={(e) => setUserMessage(e.target.value)}
                    rows={3}
                  />
                  {messageError && (
                    <p className="text-red-500 text-xs">{messageError}</p>
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
                    Send me alerts for offices for rent in East legon up to
                    $1,800/month
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#232335] text-white h-12 text-lg font-bold mt-2"
                  disabled={emailLoading}
                >
                  {emailLoading ? "Sending..." : "Send"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="text-lg font-semibold mb-2 text-green-700">
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

      {/* Unified Phone/WhatsApp Modal */}
      <Dialog
        open={state.modalOpen}
        onOpenChange={(open) =>
          dispatch({ type: "setField", field: "modalOpen", value: open })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get Number</DialogTitle>
            <DialogDescription>
              To view number, first enter your contact info (Do this once only).
              If you are unable to reach the owner/broker, then they can reach
              you.
            </DialogDescription>
          </DialogHeader>
          {!state.formSubmitted ? (
            <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="cs-phone-3">Your Phone Number</Label>
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
                    // Live validate phone number for unified modal
                    const possible = phone
                      ? phone.startsWith("+")
                        ? isValidPhoneNumber(phone)
                        : isValidPhoneNumber(phone, iso)
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
                    id: "cs-phone-3",
                    name: "phone",
                    required: true,
                    autoFocus: true,
                    "aria-invalid": Boolean(state.errors.phone),
                  }}
                />
                {state.errors.phone && (
                  <p className="text-red-500 text-xs">{state.errors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cs-name-3">Your Name</Label>
                <Input
                  id="cs-name-3"
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
                  <p className="text-red-500 text-xs">{state.errors.name}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-[#232335] text-white h-12 text-lg font-bold mt-2"
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
          ) : !showNumber && state.activeModal !== "whatsapp" ? (
            <div className="text-center py-6">
              <div className="text-sm text-gray-600 mb-4">
                We&apos;ll use your saved contact info: {state.userName} (
                {state.userPhone})
              </div>
              <Button
                onClick={handleGetNumberWithSavedInfo}
                className="w-full bg-[#232335] text-white h-12 text-lg font-bold"
                disabled={state.showNumberLoading}
              >
                {state.showNumberLoading ? "Getting Number..." : "Get Number"}
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
                  dispatch({ type: "setField", field: "userName", value: "" });
                  dispatch({ type: "setField", field: "userPhone", value: "" });
                }}
                className="w-full mt-2 text-sm"
              >
                Use Different Info
              </Button>
            </div>
          ) : showNumber ? (
            <div className="text-center py-6">
              <div className="text-lg font-semibold mb-2">
                {phoneNumber
                  ? toInternationalDisplay(phoneNumber, state.userCountryIso)
                  : ""}
              </div>
              {whatsappNumber && (
                <div className="text-sm text-brand-muted mb-2">
                  WhatsApp:{" "}
                  {toInternationalDisplay(whatsappNumber, state.userCountryIso)}
                </div>
              )}
              <div className="text-green-600">
                You can now contact the owner/broker.
              </div>
              <DialogClose asChild>
                <Button className="mt-4 w-full">Close</Button>
              </DialogClose>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <p className="text-sm text-brand-muted mt-4 max-w-md px-4">
        NB: First submit your contact info once. If you are unable to reach the
        developer, then they can reach you.
      </p>
    </div>
  );
}
