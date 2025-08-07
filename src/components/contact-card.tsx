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
import { parsePhoneNumber } from "libphonenumber-js";
import { Mail, MessageSquare, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface ContactCardProps {
  name: string;
  image: string;
  src?: boolean;
  listingId?: string;
  projectId?: string;
  pageType?: "listing" | "project";
}

// LocalStorage utility functions
const getStoredContactInfo = (): { name: string; phone: string } | null => {
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
      return parsed as { name: string; phone: string };
    }
    return null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

const setStoredContactInfo = (name: string, phone: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      "meqasa_contact_info",
      JSON.stringify({ name, phone }),
    );
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

// Helper function to format phone numbers using libphonenumber-js
const formatPhoneNumber = (phone: string): string => {
  console.log("🔍 [formatPhoneNumber] Input phone:", phone);

  if (!phone || phone.trim() === "") {
    return phone;
  }

  try {
    // Handle different phone number formats
    let phoneToParse = phone;

    // If it already starts with +, use as is
    if (phone.startsWith("+")) {
      phoneToParse = phone;
    }
    // If it starts with 00, replace with +
    else if (phone.startsWith("00")) {
      phoneToParse = "+" + phone.substring(2);
    }
    // If it starts with 233 (Ghana country code), add +
    else if (phone.startsWith("233")) {
      phoneToParse = "+" + phone;
    }
    // If it starts with 0 (local Ghana format), replace with +233
    else if (phone.startsWith("0")) {
      phoneToParse = "+233" + phone.substring(1);
    }
    // Otherwise, assume it's a Ghana number and add +233
    else {
      phoneToParse = "+233" + phone;
    }

    console.log("🔍 [formatPhoneNumber] Phone to parse:", phoneToParse);

    // Parse and format the phone number
    const parsedNumber = parsePhoneNumber(phoneToParse);
    console.log("🔍 [formatPhoneNumber] Parsed number:", parsedNumber);

    if (parsedNumber) {
      const formatted = parsedNumber.formatInternational();
      console.log("🔍 [formatPhoneNumber] Formatted result:", formatted);
      return formatted;
    } else {
      console.log("🔍 [formatPhoneNumber] Could not parse, returning original");
      return phone;
    }
  } catch (error) {
    console.error("❌ [formatPhoneNumber] Error formatting:", error);
    // Fallback: return as is if formatting fails
    return phone;
  }
};

export default function ContactCard({
  name,
  image,
  src,
  listingId,
  projectId,
  pageType = "listing",
}: ContactCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
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
  const [isWhatsAppModal, setIsWhatsAppModal] = useState(false);

  // Generate context key based on page type and ID
  const entityId = pageType === "listing" ? listingId : projectId;
  const contextKey = generateContextKey(pageType, entityId ?? "");

  // Use shared contact state
  const {
    phoneNumber,
    whatsappNumber,
    showNumber,
    isLoading,
    setPhoneNumbers,
    setLoading,
  } = useContactState(contextKey);

  // Load saved contact information on component mount
  useEffect(() => {
    const savedInfo = getStoredContactInfo();

    if (savedInfo) {
      console.log("🔍 [ContactCard] Found saved contact info:", savedInfo);
      setUserName(savedInfo.name);
      setUserPhone(savedInfo.phone);
      setFormSubmitted(true);
    }
  }, []);

  // Function to handle button clicks for viewing number
  const handleViewNumberClick = () => {
    const savedInfo = getStoredContactInfo();

    if (savedInfo) {
      // User has saved contact info, fetch number directly
      console.log(
        "🔍 [ContactCard] User has saved contact info, fetching number directly",
      );
      setUserName(savedInfo.name);
      setUserPhone(savedInfo.phone);
      setFormSubmitted(true);
      setLoading(true);
      void handleGetNumberWithSavedInfo();
    } else {
      // User needs to enter contact info, show modal
      console.log("🔍 [ContactCard] No saved contact info, showing modal");
      setModalOpen(true);
    }
  };

  // Function to handle WhatsApp button clicks
  const handleWhatsAppClick = () => {
    const savedInfo = getStoredContactInfo();

    if (savedInfo) {
      // Returning user: use stored data to get agent number and open WhatsApp
      console.log(
        "🔍 [ContactCard] Returning user, using stored data for WhatsApp",
      );
      void handleGetNumberForWhatsApp(savedInfo.name, savedInfo.phone);
    } else {
      // New user: show modal to collect contact info
      console.log("🔍 [ContactCard] New user, showing modal for WhatsApp");
      setIsWhatsAppModal(true);
      setModalOpen(true);
    }
  };

  // Function to handle getting number for WhatsApp
  const handleGetNumberForWhatsApp = async (name?: string, phone?: string) => {
    const userNameToUse = name ?? userName;
    const userPhoneToUse = phone ?? userPhone;

    if (!userNameToUse || !userPhoneToUse || !entityId) {
      console.error("❌ [ContactCard] No contact info or entity ID available");
      return;
    }

    console.log("🔍 [ContactCard] Getting number for WhatsApp");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rfifromph", userPhoneToUse);
      formData.append("nurfiname", userNameToUse);
      formData.append("rfilid", entityId);
      formData.append("rfisrc", "3");
      formData.append("reqid", "-1");
      formData.append("app", "vercel");

      const response = await fetch("/api/contact/view-number", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        stph2?: string;
        stph3?: string;
      };

      if (data.stph2 && data.stph3) {
        console.log("✅ [ContactCard] Success - opening WhatsApp chat");
        console.log("🔍 [ContactCard] Raw phone numbers from API:", {
          stph2: data.stph2,
          stph3: data.stph3,
        });

        // Open WhatsApp chat with the WhatsApp number (don't update phone display)
        const whatsappNumber = data.stph3.replace(/\D/g, ""); // Remove non-digits
        const whatsappUrl = `https://wa.me/${whatsappNumber}`;
        console.log("🔍 [ContactCard] Opening WhatsApp URL:", whatsappUrl);
        window.open(whatsappUrl, "_blank");
      } else {
        setPhoneError("Failed to get phone number. Please try again.");
      }
    } catch (error) {
      console.error("❌ [ContactCard] Error in fetch:", error);
      setPhoneError("Failed to get phone number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle getting number with saved contact info
  const handleGetNumberWithSavedInfo = async () => {
    if (!userName || !userPhone || !entityId) {
      console.error(
        "❌ [ContactCard] No saved contact info or entity ID available",
      );
      return;
    }

    console.log("🔍 [ContactCard] Getting number with saved contact info");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rfifromph", userPhone);
      formData.append("nurfiname", userName);
      formData.append("rfilid", entityId);
      formData.append("rfisrc", "3");
      formData.append("reqid", "-1");
      formData.append("app", "vercel");

      const response = await fetch("/api/contact/view-number", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        stph2?: string;
        stph3?: string;
      };

      if (data.stph2 && data.stph3) {
        setPhoneNumbers(data.stph2, data.stph3);
      } else {
        setPhoneError("Failed to get phone number. Please try again.");
      }
    } catch (error) {
      console.error("❌ [ContactCard] Error in fetch:", error);
      setPhoneError("Failed to get phone number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("�� [ContactCard] Form submission started");
    e.preventDefault();
    console.log("🔍 [ContactCard] Form prevented default");

    let valid = true;
    setPhoneError("");
    setNameError("");

    console.log("🔍 [ContactCard] Form data:", {
      userPhone,
      userName,
      listingId,
    });

    if (!userPhone || userPhone.length < 6) {
      console.log("❌ [ContactCard] Phone validation failed:", userPhone);
      setPhoneError("Valid phone number is required");
      valid = false;
    }
    if (!userName) {
      console.log("❌ [ContactCard] Name validation failed:", userName);
      setNameError("Name is required");
      valid = false;
    }

    console.log("🔍 [ContactCard] Validation result:", valid);

    if (valid && entityId) {
      console.log("🔍 [ContactCard] Starting API call");
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("rfifromph", userPhone);
        formData.append("nurfiname", userName);
        formData.append("rfilid", entityId);
        formData.append("rfisrc", "3");
        formData.append("reqid", "-1");
        formData.append("app", "vercel");

        console.log("🔍 [ContactCard] FormData created:", {
          rfifromph: userPhone,
          nurfiname: userName,
          rfilid: listingId,
          rfisrc: "3",
          reqid: "-1",
          app: "vercel",
        });

        console.log(
          "🔍 [ContactCard] Making fetch request to /api/contact/view-number",
        );

        const response = await fetch("/api/contact/view-number", {
          method: "POST",
          body: formData,
        });

        console.log("🔍 [ContactCard] Response received:", response);
        console.log("🔍 [ContactCard] Response status:", response.status);
        console.log("🔍 [ContactCard] Response ok:", response.ok);

        const data = (await response.json()) as {
          stph2?: string;
          stph3?: string;
        };

        console.log("🔍 [ContactCard] Response data:", data);

        if (data.stph2 && data.stph3) {
          console.log("✅ [ContactCard] Success - API call successful");
          console.log("🔍 [ContactCard] Raw phone numbers from API:", {
            stph2: data.stph2,
            stph3: data.stph3,
          });

          // Save contact information to localStorage for future use
          setStoredContactInfo(userName, userPhone);
          console.log("💾 [ContactCard] Saved contact info to localStorage");

          // If this was from WhatsApp modal, open WhatsApp chat and close modal
          if (isWhatsAppModal) {
            const whatsappNumber = data.stph3.replace(/\D/g, ""); // Remove non-digits
            const whatsappUrl = `https://wa.me/${whatsappNumber}`;
            console.log("🔍 [ContactCard] Opening WhatsApp URL:", whatsappUrl);
            window.open(whatsappUrl, "_blank");
            setIsWhatsAppModal(false);
            setModalOpen(false);
            // Don't update phone display or formSubmitted state for WhatsApp functionality
          } else {
            // Only update phone display for Show Number functionality
            console.log("✅ [ContactCard] Setting phone numbers for display");
            setPhoneNumbers(data.stph2, data.stph3);
            setFormSubmitted(true);
          }
        } else {
          console.log("❌ [ContactCard] No phone numbers in response");
          setPhoneError("Failed to get phone number. Please try again.");
        }
      } catch (error) {
        console.error("❌ [ContactCard] Error in fetch:", error);
        setPhoneError("Failed to get phone number. Please try again.");
      } finally {
        console.log("🔍 [ContactCard] Setting loading to false");
        setLoading(false);
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
    if (!userPhone || userPhone.length < 6) {
      setEmailPhoneError("Valid phone number is required");
      valid = false;
    }
    if (!userName) {
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
        formData.append("rfifromph", userPhone);
        formData.append("nurfiname", userName);
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
    <>
      <Card className="max-w-md mx-auto sticky top-36">
        <CardContent>
          <div className="flex flex-col items-center">
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

            <h2 className="text-xl font-bold text-brand-accent mb-2 text-center">
              {name}
            </h2>

            <div className="flex items-center gap-2 mb-6">
              {showNumber ? (
                <span className="text-brand-blue">
                  {phoneNumber ? formatPhoneNumber(phoneNumber) : ""}
                </span>
              ) : formSubmitted && isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : formSubmitted ? (
                // User has saved contact info, show button without modal
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-sm text-brand-blue border-brand-blue hover:text-blue-50"
                  onClick={handleViewNumberClick}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Show Number"}
                </Button>
              ) : (
                // User needs to enter contact info, show modal
                <>
                  <span className="text-brand-blue">{maskedNumber}</span>
                  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-sm text-brand-blue border-brand-blue hover:text-blue-50"
                        onClick={() => setModalOpen(true)}
                      >
                        Show Number
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Get Number</DialogTitle>
                        <DialogDescription>
                          To view number, first enter your contact info (Do this
                          once only). If you are unable to reach the
                          owner/broker, then they can reach you.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={handleFormSubmit}
                        className="space-y-4 mt-2"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Your Phone Number
                          </label>
                          <PhoneInput
                            country={"gh"}
                            value={userPhone}
                            onChange={(phone) => setUserPhone(phone)}
                            inputClass="w-full"
                            inputStyle={{ width: "100%" }}
                            containerStyle={{ width: "100%" }}
                            inputProps={{
                              name: "phone",
                              required: true,
                              autoFocus: true,
                            }}
                          />
                          {phoneError && (
                            <div className="text-red-500 text-xs mt-1">
                              {phoneError}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            className={`w-full px-2 py-2 border rounded outline-none ${nameError ? "border-red-400 bg-red-50" : ""}`}
                            placeholder="Your Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                          {nameError && (
                            <div className="text-red-500 text-xs mt-1">
                              {nameError}
                            </div>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-[#232335] text-white h-12 text-lg font-bold mt-2"
                          disabled={isLoading}
                        >
                          {isLoading ? "Getting Number..." : "Get Number"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>

            <div className="flex gap-4 w-full max-w-md px-4">
              {formSubmitted ? (
                // User has saved contact info, show button without modal
                <Button
                  className="flex-1 bg-brand-badge-completed hover:bg-green-700 text-white h-12 gap-2"
                  onClick={handleWhatsAppClick}
                  disabled={isLoading}
                >
                  <MessageSquare className="w-5 h-5" />
                  {isLoading ? "Loading..." : "WhatsApp"}
                </Button>
              ) : (
                // User needs to enter contact info, show modal
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="flex-1 bg-brand-badge-completed hover:bg-green-700 text-white h-12 gap-2"
                      onClick={() => setModalOpen(true)}
                    >
                      <MessageSquare className="w-5 h-5" />
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
                    {!formSubmitted ? (
                      <form
                        onSubmit={handleFormSubmit}
                        className="space-y-4 mt-2"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Your Phone Number
                          </label>
                          <PhoneInput
                            country={"gh"}
                            value={userPhone}
                            onChange={(phone) => setUserPhone(phone)}
                            inputClass="w-full"
                            inputStyle={{ width: "100%" }}
                            containerStyle={{ width: "100%" }}
                            inputProps={{
                              name: "phone",
                              required: true,
                              autoFocus: true,
                            }}
                          />
                          {phoneError && (
                            <div className="text-red-500 text-xs mt-1">
                              {phoneError}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            className={`w-full px-2 py-2 border rounded outline-none ${nameError ? "border-red-400 bg-red-50" : ""}`}
                            placeholder="Your Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                          {nameError && (
                            <div className="text-red-500 text-xs mt-1">
                              {nameError}
                            </div>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-[#232335] text-white h-12 text-lg font-bold mt-2"
                          disabled={isLoading}
                        >
                          {isLoading ? "Getting Number..." : "Get Number"}
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-lg font-semibold mb-2">
                          {phoneNumber ? formatPhoneNumber(phoneNumber) : ""}
                        </div>
                        {whatsappNumber && (
                          <div className="text-sm text-brand-muted mb-2">
                            WhatsApp: {formatPhoneNumber(whatsappNumber)}
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
                      Send a message to the property agent. They will get back
                      to you soon.
                    </DialogDescription>
                  </DialogHeader>
                  {!emailFormSubmitted ? (
                    <form
                      onSubmit={handleEmailFormSubmit}
                      className="space-y-4 mt-2"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Your Email Address*
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          className={`w-full px-2 py-2 border rounded outline-none ${emailError ? "border-red-400 bg-red-50" : ""}`}
                          placeholder="Your email address"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                        />
                        {emailError && (
                          <div className="text-red-500 text-xs mt-1">
                            {emailError}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Your Phone Number
                        </label>
                        <PhoneInput
                          country={"gh"}
                          value={userPhone}
                          onChange={(phone) => setUserPhone(phone)}
                          inputClass="w-full"
                          inputStyle={{ width: "100%" }}
                          containerStyle={{ width: "100%" }}
                          inputProps={{
                            name: "phone",
                            required: true,
                          }}
                        />
                        {emailPhoneError && (
                          <div className="text-red-500 text-xs mt-1">
                            {emailPhoneError}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          className={`w-full px-2 py-2 border rounded outline-none ${emailNameError ? "border-red-400 bg-red-50" : ""}`}
                          placeholder="Your Name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                        {emailNameError && (
                          <div className="text-red-500 text-xs mt-1">
                            {emailNameError}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Your Message
                        </label>
                        <textarea
                          name="message"
                          required
                          className={`w-full px-2 py-2 border rounded outline-none ${messageError ? "border-red-400 bg-red-50" : ""}`}
                          placeholder="Your Message"
                          value={userMessage}
                          onChange={(e) => setUserMessage(e.target.value)}
                          rows={3}
                        />
                        {messageError && (
                          <div className="text-red-500 text-xs mt-1">
                            {messageError}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={alertsChecked}
                          onChange={(e) => setAlertsChecked(e.target.checked)}
                          className="mr-2 accent-blue-600"
                          id="alertsCheckbox"
                        />
                        <label
                          htmlFor="alertsCheckbox"
                          className="text-sm select-none"
                        >
                          Send me alerts for offices for rent in East legon up
                          to $1,800/month
                        </label>
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

            <p className="text-sm text-brand-muted mt-4 max-w-md px-4">
              NB: First submit your contact info once. If you are unable to
              reach the developer, then they can reach you.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
