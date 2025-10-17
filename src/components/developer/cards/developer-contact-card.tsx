"use client";

import { MessageSquare, Phone, Mail, CheckCircle, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { generateContextKey, useContactState } from "@/hooks/use-contact-state";
import { useContactMessage } from "@/hooks/use-contact-message";
import { viewNumber } from "@/lib/contact-api";
import { getStoredNumbers, setStoredNumbers } from "@/lib/contact-cache";

interface DeveloperContactCardProps {
  developerName: string;
  developerId: string;
  logoSrc: string;
  fallbackImage: string;
  onClose: () => void;
}

// Contact form state
interface ContactFormState {
  name: string;
  phone: string;
  countryIso: CountryCode;
  email: string;
  message: string;
  alertsChecked: boolean;
}

// Success state for showing agent information
interface AgentInfo {
  phoneNumber: string;
  whatsappNumber?: string;
  name: string;
  email?: string;
}

const DEFAULT_REGION: CountryCode = "GH";

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

export function DeveloperContactCard({
  developerName,
  developerId,
  logoSrc,
  fallbackImage,
  onClose,
}: DeveloperContactCardProps) {
  const [activeTab, setActiveTab] = useState("phone");
  const [contactForm, setContactForm] = useState<ContactFormState>({
    name: "",
    phone: "",
    countryIso: DEFAULT_REGION,
    email: "",
    message: "",
    alertsChecked: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormState>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [bannerError, setBannerError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  const { sendMessage, error: sendMessageError } = useContactMessage();

  // Generate context key for this developer
  const contextKey = generateContextKey("project", developerId);

  // Use shared contact state
  const { setPhoneNumbers } = useContactState(contextKey);

  // Load saved contact information and cached phone numbers on component mount
  useEffect(() => {
    // Load saved contact info from localStorage
    const savedInfo = getStoredContactInfo();
    if (savedInfo) {
      setContactForm((prev) => ({
        ...prev,
        name: savedInfo.name,
        phone: savedInfo.phone,
        countryIso: savedInfo.countryIso ?? DEFAULT_REGION,
      }));
      setFormSubmitted(true);
    }

    // Load cached phone numbers
    if (developerId) {
      const cached = getStoredNumbers(contextKey);
      if (cached?.stph2 && cached?.stph3) {
        setPhoneNumbers(cached.stph2, cached.stph3);
        // If we have cached numbers, show them directly
        const agentInfoData: AgentInfo = {
          phoneNumber: cached.stph2,
          whatsappNumber: cached.stph3,
          name: "Agent",
        };
        setAgentInfo(agentInfoData);
        setIsSuccess(true);
      }
    }

    // Cleanup function to prevent memory leaks
    return () => {
      // Clear any pending timeouts
      setCopiedNumber(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [developerId, contextKey]);

  const handleInputChange = (
    field: keyof ContactFormState,
    value: string | boolean
  ) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormState> = {};

    if (!contactForm.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!contactForm.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhoneNumber(contactForm.phone, contactForm.countryIso)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (activeTab === "email" && !contactForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      activeTab === "email" &&
      contactForm.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (activeTab === "email" && !contactForm.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (retryAttempt = 0) => {
    if (!validateForm()) return;

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Rate limiting - prevent submissions more frequent than every 2 seconds
    const now = Date.now();
    if (now - lastSubmissionTime < 2000) {
      setBannerError("Please wait a moment before trying again.");
      return;
    }

    // Limit retry attempts
    if (retryAttempt > 2) {
      setBannerError("Maximum retry attempts reached. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setBannerError("");
    setRetryCount(retryAttempt);
    setLastSubmissionTime(now);

    try {
      // If this is an email submission, send the email first
      if (activeTab === "email") {
        const formData = new FormData();
        formData.append("rfifrom", contactForm.email);
        formData.append("rfimessage", contactForm.message);
        formData.append("rfifromph", contactForm.phone);
        formData.append("nurfiname", contactForm.name);
        formData.append("rfilid", developerId);
        formData.append("rfisrc", "3");
        formData.append("reqid", "-1");
        formData.append("app", "vercel");

        const response = await sendMessage(formData);

        if (response?.mess === "sent") {
          setEmailSent(true);
          setIsLoading(false);
          return; // Don't proceed to get phone numbers for email submissions
        }

        throw new Error("Failed to send email");
      }

      // Call the viewNumber API to get agent contact information
      const res = await viewNumber({
        name: contactForm.name,
        phone: contactForm.phone,
        entityId: developerId,
      });

      // Save contact information to localStorage for future use
      setStoredContactInfo(
        contactForm.name,
        contactForm.phone,
        contactForm.countryIso
      );

      // Store the phone numbers in cache
      setStoredNumbers(contextKey, res.displayNumber, res.whatsappNumber);

      // Update the shared contact state
      setPhoneNumbers(res.displayNumber, res.whatsappNumber);

      // Create agent info object
      const agentInfoData: AgentInfo = {
        phoneNumber: res.displayNumber,
        whatsappNumber: res.whatsappNumber,
        name: "Agent", // You can get this from the API response if available
        email: contactForm.email || undefined,
      };

      setAgentInfo(agentInfoData);
      setIsSuccess(true);
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error contacting developer:", error);

      // Provide more specific error messages
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
        if (
          error.message.includes("fetch") ||
          error.message.includes("network")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (activeTab === "email") {
          errorMessage = "Failed to send email. Please try again.";
        } else {
          errorMessage = "Failed to get phone number. Please try again.";
        }
      }

      if (activeTab === "email" && sendMessageError) {
        errorMessage = sendMessageError.message || errorMessage;
      }

      setBannerError(errorMessage);

      // Auto-retry on network errors (but not on validation errors)
      if (
        retryAttempt < 2 &&
        error instanceof Error &&
        (error.message.includes("fetch") || error.message.includes("network"))
      ) {
        setTimeout(() => {
          void handleSubmit(retryAttempt + 1);
        }, 2000);
        return;
      }
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setBannerError("");

    try {
      // Call the viewNumber API to get agent contact information
      const res = await viewNumber({
        name: contactForm.name,
        phone: contactForm.phone,
        entityId: developerId,
      });

      // Save contact information to localStorage for future use
      setStoredContactInfo(
        contactForm.name,
        contactForm.phone,
        contactForm.countryIso
      );

      // Store the phone numbers in cache
      setStoredNumbers(contextKey, res.displayNumber, res.whatsappNumber);

      // Update the shared contact state
      setPhoneNumbers(res.displayNumber, res.whatsappNumber);

      // Open WhatsApp with the agent's number
      const whatsappDigits = res.whatsappNumber.replace(/\D/g, "");
      const message = `Hi, I'm interested in properties from ${developerName}. My name is ${contactForm.name} and my phone is ${contactForm.phone}.`;
      const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      // Close the dialog after opening WhatsApp
      onClose();
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      setBannerError("Failed to get phone number. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyNumber = async () => {
    if (agentInfo?.phoneNumber) {
      try {
        await navigator.clipboard.writeText(agentInfo.phoneNumber);
        setCopiedNumber(true);
        setTimeout(() => setCopiedNumber(false), 2000);
      } catch (error) {
        console.error("Failed to copy number:", error);
        setBannerError("Failed to copy number. Please try again.");
      }
    }
  };

  const handleCallAgent = () => {
    if (agentInfo?.phoneNumber) {
      window.open(`tel:${agentInfo.phoneNumber}`, "_self");
    }
  };

  const handleWhatsAppAgent = () => {
    if (agentInfo?.whatsappNumber) {
      const message = `Hi ${agentInfo.name}, I'm interested in properties from ${developerName}. My name is ${contactForm.name} and my phone is ${contactForm.phone}.`;
      const whatsappUrl = `https://wa.me/${agentInfo.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleEmailAgent = async () => {
    if (!contactForm.message.trim()) {
      setBannerError("Please enter a message before sending.");
      return;
    }

    setIsLoading(true);
    setBannerError("");

    try {
      const formData = new FormData();
      formData.append("rfifrom", contactForm.email);
      formData.append("rfimessage", contactForm.message);
      formData.append("rfifromph", contactForm.phone);
      formData.append("nurfiname", contactForm.name);
      formData.append("rfilid", developerId);
      formData.append("rfisrc", "3");
      formData.append("reqid", "-1");
      formData.append("app", "vercel");

      const data = await sendMessage(formData);

      if (data?.mess === "sent") {
        // Email sent successfully
        setEmailSent(true);
        // Reset the message field
        setContactForm((prev) => ({ ...prev, message: "" }));
      } else {
        setBannerError("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setBannerError(sendMessageError?.message ?? "Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDifferentInfo = () => {
    clearStoredContactInfo();
    setFormSubmitted(false);
    setEmailSent(false);
    setContactForm({
      name: "",
      phone: "",
      countryIso: DEFAULT_REGION,
      email: "",
      message: "",
      alertsChecked: true,
    });
    setErrors({});
    setBannerError("");
  };

  const handleShowCachedNumber = async () => {
    if (!developerId) return;

    setIsLoading(true);
    setBannerError("");

    try {
      // Use cached numbers if available, otherwise make API call
      const cached = getStoredNumbers(contextKey);
      if (cached?.stph2 && cached?.stph3) {
        // Show cached numbers directly
        const agentInfoData: AgentInfo = {
          phoneNumber: cached.stph2,
          whatsappNumber: cached.stph3,
          name: "Agent",
        };
        setAgentInfo(agentInfoData);
        setIsSuccess(true);
      } else {
        // Make API call to get fresh numbers
        const res = await viewNumber({
          name: contactForm.name,
          phone: contactForm.phone,
          entityId: developerId,
        });

        // Cache the new numbers
        setStoredNumbers(contextKey, res.displayNumber, res.whatsappNumber);
        setPhoneNumbers(res.displayNumber, res.whatsappNumber);

        const agentInfoData: AgentInfo = {
          phoneNumber: res.displayNumber,
          whatsappNumber: res.whatsappNumber,
          name: "Agent",
        };
        setAgentInfo(agentInfoData);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error getting phone number:", error);
      setBannerError("Failed to get phone number. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowCachedNumberForWhatsApp = async () => {
    if (!developerId) return;

    setIsLoading(true);
    setBannerError("");

    try {
      // Use cached numbers if available, otherwise make API call
      const cached = getStoredNumbers(contextKey);
      if (cached?.stph2 && cached?.stph3) {
        // Open WhatsApp directly with cached number
        const whatsappDigits = cached.stph3.replace(/\D/g, "");
        const message = `Hi, I'm interested in properties from ${developerName}. My name is ${contactForm.name} and my phone is ${contactForm.phone}.`;
        const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
        onClose(); // Close the dialog
      } else {
        // Make API call to get fresh numbers
        const res = await viewNumber({
          name: contactForm.name,
          phone: contactForm.phone,
          entityId: developerId,
        });

        // Cache the new numbers
        setStoredNumbers(contextKey, res.displayNumber, res.whatsappNumber);
        setPhoneNumbers(res.displayNumber, res.whatsappNumber);

        // Open WhatsApp with fresh number
        const whatsappDigits = res.whatsappNumber.replace(/\D/g, "");
        const message = `Hi, I'm interested in properties from ${developerName}. My name is ${contactForm.name} and my phone is ${contactForm.phone}.`;
        const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
        onClose(); // Close the dialog
      }
    } catch (error) {
      console.error("Error getting phone number:", error);
      setBannerError("Failed to get phone number. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show success state with agent information
  if (isSuccess && agentInfo) {
    return (
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-4 flex flex-col items-center sm:mb-6">
          <div className="mb-3 h-16 w-16 overflow-hidden rounded-full border border-gray-200 sm:mb-4 sm:h-20 sm:w-20">
            <ImageWithFallback
              src={logoSrc || fallbackImage}
              alt={`${developerName} logo`}
              width={80}
              height={80}
              className="h-full w-full object-contain"
            />
          </div>
          <h3 className="text-brand-accent text-center text-base font-semibold sm:text-lg">
            {developerName}
          </h3>
        </div>

        {/* Agent Information Card */}
        <div className="mb-4 rounded-lg bg-gray-50 p-4 sm:mb-6 sm:p-6">
          {/* Phone Number */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="text-brand-muted h-4 w-4" />
                <span className="text-brand-muted text-sm">Phone Number</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium">
                  {toInternationalDisplay(
                    agentInfo.phoneNumber,
                    contactForm.countryIso
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyNumber}
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* WhatsApp Number */}
            {agentInfo.whatsappNumber && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="text-brand-muted h-4 w-4" />
                  <span className="text-brand-muted text-sm">WhatsApp</span>
                </div>
                <span className="font-mono text-sm font-medium">
                  {toInternationalDisplay(
                    agentInfo.whatsappNumber,
                    contactForm.countryIso
                  )}
                </span>
              </div>
            )}

            {/* Email */}
            {agentInfo.email && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="text-brand-muted h-4 w-4" />
                  <span className="text-brand-muted text-sm">Email</span>
                </div>
                <span className="text-brand-blue text-sm font-medium">
                  {agentInfo.email}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Email Form Section - Only show if we have agent email */}
        {agentInfo.email && (
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 sm:mb-6 sm:p-6">
            <h5 className="text-brand-accent mb-3 font-semibold sm:mb-4">
              Send Email Message
            </h5>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="success-email-message">Your Message</Label>
                <Textarea
                  id="success-email-message"
                  value={contactForm.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Enter your message to the agent"
                  rows={4}
                  className="w-full text-base sm:text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="success-alerts"
                  checked={contactForm.alertsChecked}
                  onCheckedChange={(checked) =>
                    handleInputChange("alertsChecked", checked as boolean)
                  }
                />
                <Label htmlFor="success-alerts" className="text-sm">
                  I agree to receive updates and alerts about properties
                </Label>
              </div>

              <Button
                onClick={handleEmailAgent}
                disabled={isLoading}
                className="bg-brand-primary hover:bg-brand-primary-darken w-full text-white"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 sm:space-y-3">
          <Button
            onClick={handleCallAgent}
            className="bg-brand-primary hover:bg-brand-primary-darken w-full text-white"
          >
            <Phone className="mr-2 h-4 w-4" />
            Call Agent
          </Button>

          {agentInfo.whatsappNumber && (
            <Button
              onClick={handleWhatsAppAgent}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:text-green-600"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Open WhatsApp
            </Button>
          )}

          {agentInfo.email && (
            <Button
              onClick={handleEmailAgent}
              variant="outline"
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          )}
        </div>

        {/* Copy Success Message */}
        {copiedNumber && (
          <div
            className="mt-3 text-center sm:mt-4"
            role="status"
            aria-live="polite"
          >
            <p className="text-brand-badge-completed text-sm">
              Phone number copied to clipboard!
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-4 flex flex-col items-center sm:mb-6">
        <div className="mb-3 h-16 w-16 overflow-hidden rounded-full border border-gray-200 sm:mb-4 sm:h-20 sm:w-20">
          <ImageWithFallback
            src={logoSrc || fallbackImage}
            alt={`${developerName} logo`}
            width={80}
            height={80}
            className="h-full w-full object-contain"
          />
        </div>
        <h3 className="text-brand-accent text-center text-base font-semibold sm:text-lg">
          {developerName}
        </h3>
      </div>

      {/* Error Banner */}
      {bannerError && (
        <div
          className="mb-3 rounded-md border border-red-200 bg-red-50 p-2 sm:mb-4 sm:p-3"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-red-600 sm:text-sm">{bannerError}</p>
            {retryCount > 0 && retryCount < 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleSubmit(retryCount)}
                className="h-6 px-2 text-xs"
                aria-label="Retry submission"
              >
                Retry
              </Button>
            )}
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-1">
          <TabsTrigger
            value="phone"
            className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
          >
            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Phone</span>
            <span className="sm:hidden">Call</span>
          </TabsTrigger>
          <TabsTrigger
            value="whatsapp"
            className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
          >
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">Whatsapp</span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
          >
            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Email</span>
            <span className="sm:hidden">Mail</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab content container - responsive height for mobile */}
        <div className="scrollbar-hide mt-4 max-h-[70vh] overflow-y-auto sm:mt-6 sm:max-h-96">
          <TabsContent value="phone" className="space-y-3 sm:space-y-4">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="phone-name">Full Name *</Label>
                <Input
                  id="phone-name"
                  value={contactForm.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={`${errors.name ? "border-red-500" : ""} h-10 text-base sm:h-10 sm:text-sm`}
                  disabled={formSubmitted}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone-number">Phone Number *</Label>
                <PhoneInput
                  country={contactForm.countryIso.toLowerCase()}
                  value={contactForm.phone}
                  onChange={(phone, country) => {
                    handleInputChange("phone", phone);
                    if (
                      country &&
                      typeof country === "object" &&
                      "iso2" in country &&
                      country.iso2
                    ) {
                      handleInputChange(
                        "countryIso",
                        (country.iso2 as string).toUpperCase() as CountryCode
                      );
                    }
                  }}
                  inputClass="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
                  containerClass="w-full"
                  buttonClass="border border-gray-300 rounded-l-md"
                  buttonStyle={{
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem 0 0 0.375rem",
                  }}
                  dropdownClass="border border-gray-300 rounded-md shadow-lg"
                  disabled={formSubmitted}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="phone-alerts"
                  checked={contactForm.alertsChecked}
                  onCheckedChange={(checked) =>
                    handleInputChange("alertsChecked", checked as boolean)
                  }
                  disabled={formSubmitted}
                />
                <Label htmlFor="phone-alerts" className="text-sm">
                  I agree to receive updates and alerts about this property
                </Label>
              </div>

              {formSubmitted ? (
                <div className="py-4 text-center">
                  <Button
                    onClick={handleShowCachedNumber}
                    disabled={isLoading}
                    className="bg-brand-primary hover:bg-brand-primary-darken w-full text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Getting Number...
                      </>
                    ) : (
                      "Show Number"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleUseDifferentInfo}
                    className="mt-2 w-full text-sm"
                  >
                    Use Different Info
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => void handleSubmit()}
                  disabled={isLoading}
                  className="bg-brand-primary hover:bg-brand-primary-darken w-full text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      Getting Number...
                    </>
                  ) : (
                    "View Number"
                  )}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-3 sm:space-y-4">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="whatsapp-name">Full Name *</Label>
                <Input
                  id="whatsapp-name"
                  value={contactForm.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={`${errors.name ? "border-red-500" : ""} h-10 text-base sm:h-10 sm:text-sm`}
                  disabled={formSubmitted}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="whatsapp-phone">Phone Number *</Label>
                <PhoneInput
                  country={contactForm.countryIso.toLowerCase()}
                  value={contactForm.phone}
                  onChange={(phone, country) => {
                    handleInputChange("phone", phone);
                    if (
                      country &&
                      typeof country === "object" &&
                      "iso2" in country &&
                      country.iso2
                    ) {
                      handleInputChange(
                        "countryIso",
                        (country.iso2 as string).toUpperCase() as CountryCode
                      );
                    }
                  }}
                  inputClass="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
                  containerClass="w-full"
                  buttonClass="border border-gray-300 rounded-l-md"
                  buttonStyle={{
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem 0 0 0.375rem",
                  }}
                  dropdownClass="border border-gray-300 rounded-md shadow-lg"
                  disabled={formSubmitted}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsapp-alerts"
                  checked={contactForm.alertsChecked}
                  onCheckedChange={(checked) =>
                    handleInputChange("alertsChecked", checked as boolean)
                  }
                  disabled={formSubmitted}
                />
                <Label htmlFor="whatsapp-alerts" className="text-sm">
                  I agree to receive updates and alerts about this property
                </Label>
              </div>

              {formSubmitted ? (
                <div className="py-4 text-center">
                  <Button
                    onClick={handleShowCachedNumberForWhatsApp}
                    disabled={isLoading}
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Opening...
                      </>
                    ) : (
                      "Open WhatsApp"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleUseDifferentInfo}
                    className="mt-2 w-full text-sm"
                  >
                    Use Different Info
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleWhatsAppSubmit}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      Getting Number...
                    </>
                  ) : (
                    "Get WhatsApp Number"
                  )}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-3 sm:space-y-4">
            <div className="space-y-3 sm:space-y-4">
              {emailSent ? (
                <div className="py-4 text-center">
                  <div className="mb-4 flex justify-center">
                    <CheckCircle className="text-brand-badge-completed h-12 w-12" />
                  </div>
                  <h4 className="text-brand-badge-completed mb-2 text-lg font-semibold">
                    Email Sent Successfully!
                  </h4>
                  <p className="text-brand-muted mb-4">
                    Your message has been sent to the agent. They will get back
                    to you soon.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEmailSent(false);
                      setContactForm((prev) => ({ ...prev, message: "" }));
                    }}
                    className="w-full text-sm"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="email-name">Full Name *</Label>
                    <Input
                      id="email-name"
                      value={contactForm.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className={`${errors.name ? "border-red-500" : ""} h-10 text-base sm:h-10 sm:text-sm`}
                      disabled={formSubmitted}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email-phone">Phone Number *</Label>
                    <PhoneInput
                      country={contactForm.countryIso.toLowerCase()}
                      value={contactForm.phone}
                      onChange={(phone, country) => {
                        handleInputChange("phone", phone);
                        if (
                          country &&
                          typeof country === "object" &&
                          "iso2" in country &&
                          country.iso2
                        ) {
                          handleInputChange(
                            "countryIso",
                            (
                              country.iso2 as string
                            ).toUpperCase() as CountryCode
                          );
                        }
                      }}
                      inputClass="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm"
                      containerClass="w-full"
                      buttonClass="border border-gray-300 rounded-l-md"
                      buttonStyle={{
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem 0 0 0.375rem",
                      }}
                      dropdownClass="border border-gray-300 rounded-md shadow-lg"
                      disabled={formSubmitted}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email-address">Email Address *</Label>
                    <Input
                      id="email-address"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your email address"
                      className={`${errors.email ? "border-red-500" : ""} h-10 text-base sm:h-10 sm:text-sm`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Enter your message"
                      rows={4}
                      className={`${errors.message ? "border-red-500" : ""} text-base sm:text-sm`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-alerts"
                      checked={contactForm.alertsChecked}
                      onCheckedChange={(checked) =>
                        handleInputChange("alertsChecked", checked as boolean)
                      }
                    />
                    <Label htmlFor="email-alerts" className="text-sm">
                      I agree to receive updates and alerts about this property
                    </Label>
                  </div>

                  {formSubmitted ? (
                    <div className="py-4 text-center">
                      <Button
                        onClick={() => void handleSubmit()}
                        disabled={isLoading}
                        className="bg-brand-primary hover:bg-brand-primary-darken w-full text-white"
                      >
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleUseDifferentInfo}
                        className="mt-2 w-full text-sm"
                      >
                        Use Different Info
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => void handleSubmit()}
                      disabled={isLoading}
                      className="bg-brand-primary hover:bg-brand-primary-darken w-full text-white"
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Info Text */}
      <p className="text-brand-muted mt-3 px-2 text-center text-xs sm:mt-4 sm:text-sm">
        NB: First submit your contact info once. If you are unable to reach the
        developer, then they can reach you.
      </p>
    </div>
  );
}
